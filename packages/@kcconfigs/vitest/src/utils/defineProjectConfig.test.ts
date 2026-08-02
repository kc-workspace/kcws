import { describe, expect, test } from "vitest";
import { baseRootConfig } from "../constants/config";
import { overridePlugin } from "../plugins";
import defineProjectConfig from "./defineProjectConfig";

describe("defineProjectConfig", () => {
	test("should return a config with base root settings applied", () => {
		const result = defineProjectConfig();
		expect(result.test?.restoreMocks).toBe(true);
		expect(result.test?.mockReset).toBe(true);
		expect(result.test?.clearMocks).toBe(true);
	});

	test("should include reporters from baseRootConfig", () => {
		const result = defineProjectConfig();
		expect(result.test?.reporters).toEqual(baseRootConfig.test?.reporters);
	});

	test("should apply additional plugins on top of base config", () => {
		const result = defineProjectConfig(
			overridePlugin({ environment: "jsdom" }),
		);
		expect(result.test?.environment).toBe("jsdom");
		// root settings preserved
		expect(result.test?.restoreMocks).toBe(true);
	});

	test("should apply multiple additional plugins", () => {
		const result = defineProjectConfig(
			overridePlugin({ environment: "jsdom" }),
			overridePlugin({ timeout: 10000 }),
		);
		expect(result.test?.environment).toBe("jsdom");
		expect(result.test?.timeout).toBe(10000);
	});
});
