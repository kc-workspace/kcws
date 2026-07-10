import { describe, expect, test } from "vitest";
import { z } from "zod";

import { zYamlObject } from "./zYamlObject";

describe("zYamlObject", () => {
	test("should parse simple YAML string to object", () => {
		const schema = z.object({ config: zYamlObject });
		expect(schema.parse({ config: "key: value" })).toEqual({
			config: { key: "value" },
		});
	});

	test("should parse multi-line YAML", () => {
		const schema = z.object({ config: zYamlObject });
		const yaml = `
name: test
version: 1.0.0
`.trim();
		expect(schema.parse({ config: yaml })).toEqual({
			config: { name: "test", version: "1.0.0" },
		});
	});

	test("should parse nested YAML object", () => {
		const schema = z.object({ config: zYamlObject });
		const yaml = `
nested:
  a: 1
  b: 2
`.trim();
		expect(schema.parse({ config: yaml })).toEqual({
			config: { nested: { a: 1, b: 2 } },
		});
	});

	test("should parse YAML with array values", () => {
		const schema = z.object({ config: zYamlObject });
		const yaml = `
items:
  - 1
  - 2
  - 3
`.trim();
		expect(schema.parse({ config: yaml })).toEqual({
			config: { items: [1, 2, 3] },
		});
	});

	test("should pass through actual object", () => {
		const schema = z.object({ config: zYamlObject });
		expect(schema.parse({ config: { key: "value" } })).toEqual({
			config: { key: "value" },
		});
	});

	test("should throw on empty string (required)", () => {
		const schema = z.object({ config: zYamlObject });
		expect(() => schema.parse({ config: "" })).toThrow();
	});

	test("should throw on undefined (required)", () => {
		const schema = z.object({ config: zYamlObject });
		expect(() => schema.parse({ config: undefined })).toThrow();
	});

	test("should allow undefined with optional", () => {
		const schema = z.object({ config: zYamlObject.optional() });
		expect(schema.parse({ config: undefined })).toEqual({ config: undefined });
	});

	test("should allow missing field with optional", () => {
		const schema = z.object({ config: zYamlObject.optional() });
		expect(schema.parse({})).toEqual({});
	});

	test("should throw on non-object non-string input (number)", () => {
		const schema = z.object({ config: zYamlObject });
		expect(() => schema.parse({ config: 42 })).toThrow();
	});

	test("should throw on non-object non-string input (boolean)", () => {
		const schema = z.object({ config: zYamlObject });
		expect(() => schema.parse({ config: true })).toThrow();
	});
});
