import { describe, expect, test } from "vitest";
import { z } from "zod";

import { zStringArray } from "./zStringArray";

describe("zStringArray", () => {
	test("should parse comma-separated string to array", () => {
		const schema = z.object({ tags: zStringArray });
		expect(schema.parse({ tags: "a,b,c" })).toEqual({ tags: ["a", "b", "c"] });
	});

	test("should parse newline-separated string to array", () => {
		const schema = z.object({ tags: zStringArray });
		expect(schema.parse({ tags: "a\nb\nc" })).toEqual({
			tags: ["a", "b", "c"],
		});
	});

	test("should trim whitespace from each item", () => {
		const schema = z.object({ tags: zStringArray });
		expect(schema.parse({ tags: "  a  ,  b  ,  c  " })).toEqual({
			tags: ["a", "b", "c"],
		});
	});

	test("should filter out empty items", () => {
		const schema = z.object({ tags: zStringArray });
		expect(schema.parse({ tags: "a,,b,  ,c" })).toEqual({
			tags: ["a", "b", "c"],
		});
	});

	test("should handle single item", () => {
		const schema = z.object({ tags: zStringArray });
		expect(schema.parse({ tags: "single" })).toEqual({ tags: ["single"] });
	});

	test("should pass through actual array", () => {
		const schema = z.object({ tags: zStringArray });
		expect(schema.parse({ tags: ["a", "b", "c"] })).toEqual({
			tags: ["a", "b", "c"],
		});
	});

	test("should throw on empty string (required)", () => {
		const schema = z.object({ tags: zStringArray });
		expect(() => schema.parse({ tags: "" })).toThrow();
	});

	test("should throw on undefined (required)", () => {
		const schema = z.object({ tags: zStringArray });
		expect(() => schema.parse({ tags: undefined })).toThrow();
	});

	test("should allow undefined with optional", () => {
		const schema = z.object({ tags: zStringArray.optional() });
		expect(schema.parse({ tags: undefined })).toEqual({ tags: undefined });
	});

	test("should allow missing field with optional", () => {
		const schema = z.object({ tags: zStringArray.optional() });
		expect(schema.parse({})).toEqual({});
	});

	test("should prefer newline separator when both present", () => {
		const schema = z.object({ tags: zStringArray });
		expect(schema.parse({ tags: "a,b\nc,d" })).toEqual({
			tags: ["a,b", "c,d"],
		});
	});

	test("should throw on null (required)", () => {
		const schema = z.object({ tags: zStringArray });
		expect(() => schema.parse({ tags: null })).toThrow();
	});

	test("should throw on non-string non-array input", () => {
		const schema = z.object({ tags: zStringArray });
		// Non-array, non-string input triggers "return undefined"
		// which causes zod to report "Required"
		expect(() => schema.parse({ tags: 42 })).toThrow();
		expect(() => schema.parse({ tags: true })).toThrow();
		expect(() => schema.parse({ tags: {} })).toThrow();
	});
});
