import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, test } from "vitest";
import { z } from "zod";

import { zYamlFile } from "./zYamlFile";

describe("zYamlFile", () => {
	test("should parse YAML file path to object", () => {
		const dir = mkdtempSync(join(tmpdir(), "zyamlfile-"));
		const file = join(dir, "config.yaml");
		writeFileSync(file, "key: value\nitems:\n  - 1\n  - 2\n", "utf8");

		const schema = z.object({ config: zYamlFile });
		expect(schema.parse({ config: file })).toEqual({
			config: { key: "value", items: [1, 2] },
		});

		rmSync(dir, { force: true, recursive: true });
	});

	test("should pass through actual object", () => {
		const schema = z.object({ config: zYamlFile });
		expect(schema.parse({ config: { key: "value" } })).toEqual({
			config: { key: "value" },
		});
	});

	test("should throw on missing file path", () => {
		const schema = z.object({ config: zYamlFile });
		expect(() =>
			schema.parse({ config: "./file-does-not-exist.yaml" }),
		).toThrow();
	});

	test("should throw on invalid YAML file content", () => {
		const dir = mkdtempSync(join(tmpdir(), "zyamlfile-"));
		const file = join(dir, "invalid.yaml");
		writeFileSync(file, "key: [value", "utf8");

		const schema = z.object({ config: zYamlFile });
		expect(() => schema.parse({ config: file })).toThrow();

		rmSync(dir, { force: true, recursive: true });
	});

	test("should allow undefined with optional", () => {
		const schema = z.object({ config: zYamlFile.optional() });
		expect(schema.parse({ config: undefined })).toEqual({ config: undefined });
	});
});
