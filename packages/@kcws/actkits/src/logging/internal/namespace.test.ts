import { describe, expect, test } from "vitest";

import { createNamespace, NS_SEP } from "./namespace";

describe("namespace", () => {
	test("should expose colon separator", () => {
		expect(NS_SEP).toBe(":");
	});

	test.for([
		{
			name: "join parent and child segments",
			parent: "stm",
			segments: ["action-a", "http"],
			expected: "stm:action-a:http",
		},
		{
			name: "drop empty segments",
			parent: "stm",
			segments: ["", "action-a", "", "parser"],
			expected: "stm:action-a:parser",
		},
		{
			name: "drop empty parent when parent is empty string",
			parent: "",
			segments: ["stm", "http"],
			expected: "stm:http",
		},
		{
			name: "safely ignore undefined-like segment values at runtime",
			parent: "stm",
			segments: ["action-a", undefined, "parser"] as unknown as string[],
			expected: "stm:action-a:parser",
		},
	])("should $name", ({ parent, segments, expected }) => {
		expect(createNamespace(parent, segments)).toBe(expected);
	});
});
