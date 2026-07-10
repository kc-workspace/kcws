import { describe, expect, test } from "vitest";
import { z } from "zod";

import { zNumberArray } from "./zNumberArray";

describe("zNumberArray", () => {
	test("should parse comma-separated string to number array", () => {
		const schema = z.object({ ids: zNumberArray });
		expect(schema.parse({ ids: "1,2,3" })).toEqual({ ids: [1, 2, 3] });
	});

	test("should parse newline-separated string to number array", () => {
		const schema = z.object({ ids: zNumberArray });
		expect(schema.parse({ ids: "1\n2\n3" })).toEqual({ ids: [1, 2, 3] });
	});

	test("should trim whitespace from each item", () => {
		const schema = z.object({ ids: zNumberArray });
		expect(schema.parse({ ids: "  1  ,  2  ,  3  " })).toEqual({
			ids: [1, 2, 3],
		});
	});

	test("should filter out empty items", () => {
		const schema = z.object({ ids: zNumberArray });
		expect(schema.parse({ ids: "1,,2,  ,3" })).toEqual({ ids: [1, 2, 3] });
	});

	test("should handle float numbers", () => {
		const schema = z.object({ ids: zNumberArray });
		expect(schema.parse({ ids: "1.5,2.5,3.5" })).toEqual({
			ids: [1.5, 2.5, 3.5],
		});
	});

	test("should handle negative numbers", () => {
		const schema = z.object({ ids: zNumberArray });
		expect(schema.parse({ ids: "-1,0,1" })).toEqual({ ids: [-1, 0, 1] });
	});

	test("should handle single item", () => {
		const schema = z.object({ ids: zNumberArray });
		expect(schema.parse({ ids: "42" })).toEqual({ ids: [42] });
	});

	test("should handle single raw number input", () => {
		const schema = z.object({ ids: zNumberArray });
		expect(schema.parse({ ids: 42 })).toEqual({ ids: [42] });
	});

	test("should pass through actual array of numbers", () => {
		const schema = z.object({ ids: zNumberArray });
		expect(schema.parse({ ids: [1, 2, 3] })).toEqual({ ids: [1, 2, 3] });
	});

	test("should convert string array to number array", () => {
		const schema = z.object({ ids: zNumberArray });
		expect(schema.parse({ ids: ["1", "2", "3"] })).toEqual({ ids: [1, 2, 3] });
	});

	test("should throw on empty string (required)", () => {
		const schema = z.object({ ids: zNumberArray });
		expect(() => schema.parse({ ids: "" })).toThrow();
	});

	test("should throw on undefined (required)", () => {
		const schema = z.object({ ids: zNumberArray });
		expect(() => schema.parse({ ids: undefined })).toThrow();
	});

	test("should throw on invalid number in array", () => {
		const schema = z.object({ ids: zNumberArray });
		expect(() => schema.parse({ ids: "1,abc,3" })).toThrow();
	});

	test("should allow undefined with optional", () => {
		const schema = z.object({ ids: zNumberArray.optional() });
		expect(schema.parse({ ids: undefined })).toEqual({ ids: undefined });
	});

	test("should allow missing field with optional", () => {
		const schema = z.object({ ids: zNumberArray.optional() });
		expect(schema.parse({})).toEqual({});
	});

	test("should throw when newline separator produces non-numeric values", () => {
		const schema = z.object({ ids: zNumberArray });
		expect(() => schema.parse({ ids: "1,2\n3,4" })).toThrow();
	});

	test("should handle NaN input from invalid parse", () => {
		const schema = z.object({ ids: zNumberArray });
		// When a non-array, non-number value is provided, it fails.
		// Number({}) = NaN, Number.isFinite(NaN) = false → returns undefined
		expect(() => schema.parse({ ids: {} })).toThrow();
		// NaN itself also fails
		expect(() => schema.parse({ ids: NaN })).toThrow();
	});

	test("should throw on null in required field", () => {
		const schema = z.object({ ids: zNumberArray });
		expect(() => schema.parse({ ids: null })).toThrow();
	});
});
