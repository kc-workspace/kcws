import { describe, expect, test } from "vitest";
import { z } from "zod";

import { zJsonObject } from "./zJsonObject";

describe("zJsonObject", () => {
	test("should parse JSON string to object", () => {
		const schema = z.object({ config: zJsonObject });
		expect(schema.parse({ config: '{"key": "value"}' })).toEqual({
			config: { key: "value" },
		});
	});

	test("should parse nested JSON object", () => {
		const schema = z.object({ config: zJsonObject });
		expect(schema.parse({ config: '{"nested": {"a": 1, "b": 2}}' })).toEqual({
			config: { nested: { a: 1, b: 2 } },
		});
	});

	test("should parse JSON with array values", () => {
		const schema = z.object({ config: zJsonObject });
		expect(schema.parse({ config: '{"items": [1, 2, 3]}' })).toEqual({
			config: { items: [1, 2, 3] },
		});
	});

	test("should pass through actual object", () => {
		const schema = z.object({ config: zJsonObject });
		expect(schema.parse({ config: { key: "value" } })).toEqual({
			config: { key: "value" },
		});
	});

	test("should throw on empty string (required)", () => {
		const schema = z.object({ config: zJsonObject });
		expect(() => schema.parse({ config: "" })).toThrow();
	});

	test("should throw on undefined (required)", () => {
		const schema = z.object({ config: zJsonObject });
		expect(() => schema.parse({ config: undefined })).toThrow();
	});

	test("should throw on invalid JSON string", () => {
		const schema = z.object({ config: zJsonObject });
		expect(() => schema.parse({ config: "not json" })).toThrow();
	});

	test("should throw on malformed JSON", () => {
		const schema = z.object({ config: zJsonObject });
		expect(() => schema.parse({ config: "{key: value}" })).toThrow();
	});

	test("should allow undefined with optional", () => {
		const schema = z.object({ config: zJsonObject.optional() });
		expect(schema.parse({ config: undefined })).toEqual({ config: undefined });
	});

	test("should allow missing field with optional", () => {
		const schema = z.object({ config: zJsonObject.optional() });
		expect(schema.parse({})).toEqual({});
	});
});
