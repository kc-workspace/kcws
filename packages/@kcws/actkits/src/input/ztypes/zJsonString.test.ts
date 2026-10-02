import { describe, expect, test } from "vitest";
import { z } from "zod";

import { zJsonString } from "./zJsonString";

describe("zJsonString", () => {
	const schema = z.object({ config: zJsonString });

	test.for([
		{
			name: "JSON string",
			input: '{"key": "value"}',
			expected: { key: "value" },
		},
		{
			name: "nested JSON object",
			input: '{"nested": {"a": 1, "b": 2}}',
			expected: { nested: { a: 1, b: 2 } },
		},
		{
			name: "JSON with array values",
			input: '{"items": [1, 2, 3]}',
			expected: { items: [1, 2, 3] },
		},
		{
			name: "actual object",
			input: { key: "value" },
			expected: { key: "value" },
		},
	])("should parse $name", ({ input, expected }) => {
		expect(schema.parse({ config: input })).toEqual({ config: expected });
	});

	test.for([
		{ name: "empty string (required)", input: "" },
		{ name: "undefined (required)", input: undefined },
		{ name: "invalid JSON string", input: "not json" },
		{ name: "malformed JSON", input: "{key: value}" },
		{ name: "number input", input: 42 },
		{ name: "boolean input", input: true },
	])("should throw on $name", ({ input }) => {
		expect(() => schema.parse({ config: input })).toThrow();
	});

	test("should allow undefined with optional", () => {
		const optional = z.object({ config: zJsonString.optional() });
		expect(optional.parse({ config: undefined })).toEqual({
			config: undefined,
		});
	});

	test("should allow missing field with optional", () => {
		const optional = z.object({ config: zJsonString.optional() });
		expect(optional.parse({})).toEqual({});
	});
});
