import { describe, expect, test } from "vitest";
import { z } from "zod";

import { zNumberArray } from "./zNumberArray";

describe("zNumberArray", () => {
	const schema = z.object({ ids: zNumberArray });

	test.for([
		{ name: "comma-separated string", input: "1,2,3", expected: [1, 2, 3] },
		{ name: "newline-separated string", input: "1\n2\n3", expected: [1, 2, 3] },
		{
			name: "items with surrounding whitespace",
			input: "  1  ,  2  ,  3  ",
			expected: [1, 2, 3],
		},
		{
			name: "string with empty items",
			input: "1,,2,  ,3",
			expected: [1, 2, 3],
		},
		{ name: "float numbers", input: "1.5,2.5,3.5", expected: [1.5, 2.5, 3.5] },
		{ name: "negative numbers", input: "-1,0,1", expected: [-1, 0, 1] },
		{ name: "single item", input: "42", expected: [42] },
		{ name: "single raw number", input: 42, expected: [42] },
		{ name: "actual array of numbers", input: [1, 2, 3], expected: [1, 2, 3] },
		{ name: "string array", input: ["1", "2", "3"], expected: [1, 2, 3] },
	])("should parse $name", ({ input, expected }) => {
		expect(schema.parse({ ids: input })).toEqual({ ids: expected });
	});

	test.for([
		{ name: "empty string (required)", input: "" },
		{ name: "undefined (required)", input: undefined },
		{ name: "null (required)", input: null },
		{ name: "invalid number in array", input: "1,abc,3" },
		{ name: "mixed newline and comma separators", input: "1,2\n3,4" },
		{ name: "object input", input: {} },
		{ name: "NaN input", input: Number.NaN },
	])("should throw on $name", ({ input }) => {
		expect(() => schema.parse({ ids: input })).toThrow();
	});

	test("should allow undefined with optional", () => {
		const optional = z.object({ ids: zNumberArray.optional() });
		expect(optional.parse({ ids: undefined })).toEqual({ ids: undefined });
	});

	test("should allow missing field with optional", () => {
		const optional = z.object({ ids: zNumberArray.optional() });
		expect(optional.parse({})).toEqual({});
	});
});
