import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, test } from "vitest";
import { z } from "zod";

import { zJsonFile } from "./zJsonFile";

describe("zJsonFile", () => {
	test("should parse JSON file path to object", () => {
		const dir = mkdtempSync(join(tmpdir(), "zjsonfile-"));
		const file = join(dir, "config.json");
		writeFileSync(file, '{"key":"value","items":[1,2,3]}', "utf8");

		const schema = z.object({ config: zJsonFile });
		expect(schema.parse({ config: file })).toEqual({
			config: { key: "value", items: [1, 2, 3] },
		});

		rmSync(dir, { force: true, recursive: true });
	});

	test("should pass through actual object", () => {
		const schema = z.object({ config: zJsonFile });
		expect(schema.parse({ config: { key: "value" } })).toEqual({
			config: { key: "value" },
		});
	});

	test("should throw on missing file path", () => {
		const schema = z.object({ config: zJsonFile });
		expect(() =>
			schema.parse({ config: "./file-does-not-exist.json" }),
		).toThrow();
	});

	test("should throw on invalid JSON file content", () => {
		const dir = mkdtempSync(join(tmpdir(), "zjsonfile-"));
		const file = join(dir, "invalid.json");
		writeFileSync(file, "{key: value}", "utf8");

		const schema = z.object({ config: zJsonFile });
		expect(() => schema.parse({ config: file })).toThrow();

		rmSync(dir, { force: true, recursive: true });
	});

	test("should allow undefined with optional", () => {
		const schema = z.object({ config: zJsonFile.optional() });
		expect(schema.parse({ config: undefined })).toEqual({ config: undefined });
	});
});
