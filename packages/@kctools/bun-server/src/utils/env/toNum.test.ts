import { describe, expect, test } from "vitest";
import toNum from "./toNum";

describe("toNum", () => {
	test.each([
		{ name: "an integer", value: "3000", expected: 3000 },
		{ name: "a float", value: "1.5", expected: 1.5 },
		{ name: "a negative number", value: "-1", expected: -1 },
		{ name: "an empty string", value: "", expected: 0 },
		{ name: "an undefined value", value: undefined, expected: undefined },
		{ name: "a word", value: "abc", expected: undefined },
	])("reads $name as $expected", ({ value, expected }) => {
		expect(toNum(value)).toBe(expected);
	});
});
