import { describe, expect, test } from "vitest";
import { z } from "zod";

import { zStringArray } from "./zStringArray";

describe("zStringArray", () => {
	const schema = z.object({ tags: zStringArray });

	test.for([
		{
			name: "comma-separated string",
			input: "a,b,c",
			expected: ["a", "b", "c"],
		},
		{
			name: "newline-separated string",
			input: "a\nb\nc",
			expected: ["a", "b", "c"],
		},
		{
			name: "items with surrounding whitespace",
			input: "  a  ,  b  ,  c  ",
			expected: ["a", "b", "c"],
		},
		{
			name: "string with empty items",
			input: "a,,b,  ,c",
			expected: ["a", "b", "c"],
		},
		{ name: "single item", input: "single", expected: ["single"] },
		{
			name: "actual array",
			input: ["a", "b", "c"],
			expected: ["a", "b", "c"],
		},
		{
			name: "newline separator first when both present",
			input: "a,b\nc,d",
			expected: ["a,b", "c,d"],
		},
	])("should parse $name", ({ input, expected }) => {
		expect(schema.parse({ tags: input })).toEqual({ tags: expected });
	});

	test.for([
		{ name: "empty string (required)", input: "" },
		{ name: "undefined (required)", input: undefined },
		{ name: "null (required)", input: null },
		{ name: "number input", input: 42 },
		{ name: "boolean input", input: true },
		{ name: "object input", input: {} },
	])("should throw on $name", ({ input }) => {
		expect(() => schema.parse({ tags: input })).toThrow();
	});

	test("should allow undefined with optional", () => {
		const optional = z.object({ tags: zStringArray.optional() });
		expect(optional.parse({ tags: undefined })).toEqual({ tags: undefined });
	});

	test("should allow missing field with optional", () => {
		const optional = z.object({ tags: zStringArray.optional() });
		expect(optional.parse({})).toEqual({});
	});
});
