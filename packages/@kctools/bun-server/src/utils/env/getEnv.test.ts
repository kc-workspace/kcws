import { describe, expect, test, vi } from "vitest";
import getEnv from "./getEnv";
import toBool from "./toBool";
import toNum from "./toNum";
import toStr from "./toStr";

describe("getEnv", () => {
	test("reads the variable and converts it", () => {
		vi.stubEnv("BUN_SERVER_TEST_PORT", "8080");

		expect(getEnv("BUN_SERVER_TEST_PORT", toNum)).toBe(8080);
	});

	test("passes the raw value to the converter", () => {
		vi.stubEnv("BUN_SERVER_TEST_RAW", "on");
		const convert = vi.fn(toBool);

		getEnv("BUN_SERVER_TEST_RAW", convert);

		expect(convert).toHaveBeenCalledWith("on");
	});

	test("passes undefined to the converter when the variable is missing", () => {
		vi.stubEnv("BUN_SERVER_TEST_MISSING", undefined);
		const convert = vi.fn(toStr);

		expect(getEnv("BUN_SERVER_TEST_MISSING", convert)).toBeUndefined();
		expect(convert).toHaveBeenCalledWith(undefined);
	});
});
