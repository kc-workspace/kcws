import { Readable } from "node:stream";
import { describe, expect, test } from "vitest";
import { z } from "zod";
import { loadConfig, loadConfigSync } from "#core";
import { ZconfigAdapterError } from "#utils/errors";
import { staticAdapter } from "../static";
import { streamAdapter } from ".";

describe("streamAdapter", () => {
	test("reads a Node.js readable stream", async () => {
		const adapter = streamAdapter({
			format: "yaml",
			stream: Readable.from(["database:\n", "  port: 5432\n"]),
		});

		expect(adapter.name).toBe("stream");
		expect(await adapter.load()).toEqual({ database: { port: 5432 } });
	});

	test("reads a web readable stream", async () => {
		const body = new Response('{ "debug": true }').body;
		if (body === null) throw new Error("fixture should have a body");

		const adapter = streamAdapter({ format: "json", stream: body });

		expect(await adapter.load()).toEqual({ debug: true });
	});

	test("decodes multi-byte characters split across chunks", async () => {
		const bytes = Buffer.from('{ "name": "ไทย" }');
		const adapter = streamAdapter({
			format: "json",
			stream: Readable.from([bytes.subarray(0, 12), bytes.subarray(12)]),
		});

		expect(await adapter.load()).toEqual({ name: "ไทย" });
	});

	test("accepts an async function returning content", async () => {
		const adapter = streamAdapter({
			format: "toml",
			stream: () => Promise.resolve("debug = true\n"),
		});

		expect(await adapter.load()).toEqual({ debug: true });
	});

	test("calls a stream function on every load", async () => {
		const adapter = streamAdapter({
			format: "json",
			stream: () => Readable.from(['{ "debug": true }']),
		});

		expect(await adapter.load()).toEqual({ debug: true });
		expect(await adapter.load()).toEqual({ debug: true });
	});

	test("rejects reading a stream value twice", async () => {
		const adapter = streamAdapter({
			format: "json",
			stream: Readable.from(['{ "debug": true }']),
		});

		await adapter.load();
		await expect(adapter.load()).rejects.toThrow(/already been consumed/);
	});

	test("throws on synchronous loading", () => {
		const adapter = streamAdapter({
			format: "json",
			stream: () => "{}",
		});

		expect(() => adapter.loadSync()).toThrow(ZconfigAdapterError);
		expect(() => adapter.loadSync()).toThrow(/use loadConfig instead/);
	});

	test("throws a typed error for malformed content", async () => {
		const adapter = streamAdapter({
			name: "consul",
			format: "json",
			stream: () => "{",
		});

		await expect(adapter.load()).rejects.toThrow(
			/\[consul\] Failed to load config stream/,
		);
	});

	test("merges with other adapters in loadConfig", async () => {
		const schema = z.object({ host: z.string(), port: z.number() });

		const config = await loadConfig(schema, [
			streamAdapter({
				format: "json",
				stream: () => '{ "host": "remote", "port": 5432 }',
			}),
			staticAdapter({ host: "local" }),
		]);

		expect(config).toEqual({ host: "local", port: 5432 });
		expect(() =>
			loadConfigSync(schema, [
				streamAdapter({ format: "json", stream: () => "{}" }),
			]),
		).toThrow(ZconfigAdapterError);
	});
});
