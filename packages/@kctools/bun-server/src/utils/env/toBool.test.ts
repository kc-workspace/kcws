import { describe, expect, test } from "vitest";
import toBool from "./toBool";

describe("toBool", () => {
	test.each([
		{ value: "true", expected: true },
		{ value: "1", expected: true },
		{ value: "yes", expected: true },
		{ value: "on", expected: true },
		{ value: "false", expected: false },
		{ value: "0", expected: false },
		{ value: "no", expected: false },
		{ value: "off", expected: false },
		{ value: "TRUE", expected: true },
		{ value: "Yes", expected: true },
		{ value: "OFF", expected: false },
		{ value: undefined, expected: undefined },
		{ value: "", expected: undefined },
		{ value: "maybe", expected: undefined },
		{ value: "2", expected: undefined },
	])("reads $value as $expected", ({ value, expected }) => {
		expect(toBool(value)).toBe(expected);
	});
});
