import { describe, expect, test, vi } from "vitest";
import isDebug from "./isDebug";

describe("isDebug", () => {
	test.each([
		{ name: "DEBUG is enabled", debug: "true", expected: true },
		{ name: "DEBUG is disabled", debug: "false", expected: false },
		{ name: "DEBUG is unset", debug: undefined, expected: false },
		{ name: "DEBUG is not a boolean", debug: "maybe", expected: false },
	])("returns $expected when $name", ({ debug, expected }) => {
		vi.stubEnv("DEBUG", debug);

		expect(isDebug()).toBe(expected);
	});
});
