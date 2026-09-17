import { describe, expect, test } from "vitest";
import readOptions from "./readOptions";

describe("readOptions", () => {
	test.each([
		{
			name: "reads the value of the key",
			options: { cwd: "/repo" },
			key: "cwd",
			expected: "/repo",
		},
		{
			name: "keeps the value type as it is",
			options: { statics: ["a", "b"] },
			key: "statics",
			expected: ["a", "b"],
		},
		{
			name: "returns undefined when the key is missing",
			options: {},
			key: "cwd",
			expected: undefined,
		},
	])("$name", ({ options, key, expected }) => {
		expect(readOptions(options, key)).toEqual(expected);
	});
});
