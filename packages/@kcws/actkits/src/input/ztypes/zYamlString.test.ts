import { describe, expect, test } from "vitest";
import { z } from "zod";

import { zYamlString } from "./zYamlString";

describe("zYamlString", () => {
	const schema = z.object({ config: zYamlString });

	test.for([
		{
			name: "simple YAML string",
			input: "key: value",
			expected: { key: "value" },
		},
		{
			name: "multi-line YAML",
			input: "name: test\nversion: 1.0.0",
			expected: { name: "test", version: "1.0.0" },
		},
		{
			name: "nested YAML object",
			input: "nested:\n  a: 1\n  b: 2",
			expected: { nested: { a: 1, b: 2 } },
		},
		{
			name: "YAML with array values",
			input: "items:\n  - 1\n  - 2\n  - 3",
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
		{ name: "number input", input: 42 },
		{ name: "boolean input", input: true },
	])("should throw on $name", ({ input }) => {
		expect(() => schema.parse({ config: input })).toThrow();
	});

	test("should allow undefined with optional", () => {
		const optional = z.object({ config: zYamlString.optional() });
		expect(optional.parse({ config: undefined })).toEqual({
			config: undefined,
		});
	});

	test("should allow missing field with optional", () => {
		const optional = z.object({ config: zYamlString.optional() });
		expect(optional.parse({})).toEqual({});
	});
});
