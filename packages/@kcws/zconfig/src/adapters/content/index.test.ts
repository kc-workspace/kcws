import { describe, expect, test } from "vitest";
import { ZconfigAdapterError } from "#utils/errors";
import { contentAdapter } from ".";

describe("contentAdapter", () => {
	test.each([
		["yaml", "database:\n  port: 5432\n"],
		["json", '{ "database": { "port": 5432 } }'],
		["jsonc", '{ /* comment */ "database": { "port": 5432 } }'],
		["json5", "{ database: { port: 5432, }, }"],
		["toml", "[database]\nport = 5432\n"],
	] as const)("parses %s content", async (format, content) => {
		const adapter = contentAdapter({ format, content });

		const expected = { database: { port: 5432 } };
		expect(adapter.loadSync()).toEqual(expected);
		expect(await adapter.load()).toEqual(expected);
	});

	test("decodes dotenv keys with a prefix", () => {
		const adapter = contentAdapter({
			format: "dotenv",
			prefix: "APP",
			content: "APP_DATABASE__HOST_NAME=localhost\nOTHER=ignored\n",
		});

		expect(adapter.loadSync()).toEqual({
			database: { hostName: "localhost" },
		});
	});

	test("decodes byte content as UTF-8", () => {
		const adapter = contentAdapter({
			format: "json",
			content: Buffer.from('{ "name": "ไทย" }'),
		});

		expect(adapter.loadSync()).toEqual({ name: "ไทย" });
	});

	test("calls a content function on every load", () => {
		let count = 0;
		const adapter = contentAdapter({
			format: "json",
			content: () => `{ "count": ${++count} }`,
		});

		expect(adapter.loadSync()).toEqual({ count: 1 });
		expect(adapter.loadSync()).toEqual({ count: 2 });
	});

	test("uses a custom parser", async () => {
		const adapter = contentAdapter({
			name: "custom",
			content: "debug=true",
			parseSync: <T>(content: string): T =>
				({ debug: content === "debug=true" }) as T,
		});

		expect(adapter.name).toBe("custom");
		expect(await adapter.load()).toEqual({ debug: true });
	});

	test("returns an empty object for an empty document", () => {
		expect(contentAdapter({ format: "yaml", content: "" }).loadSync()).toEqual(
			{},
		);
	});

	test("applies a leaf transform", () => {
		const adapter = contentAdapter({
			format: "json",
			content: '{ "snake_key": "value" }',
			transform: ({ key, value }) => ({
				key: key.map((segment) =>
					segment === "snake_key" ? "snakeKey" : segment,
				),
				value,
			}),
		});

		expect(adapter.loadSync()).toEqual({ snakeKey: "value" });
	});

	test("throws a typed error for malformed content", async () => {
		const adapter = contentAdapter({ format: "json", content: "{" });

		expect(() => adapter.loadSync()).toThrow(ZconfigAdapterError);
		await expect(adapter.load()).rejects.toThrow(
			/\[content\] Failed to load config content/,
		);
	});
});
