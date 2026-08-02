import { describe, expect, test } from "vitest";
import { baseRootConfig } from "../constants/config";
import { overridePlugin } from "../plugins";
import defineRootConfig from "./defineRootConfig";

describe("defineRootConfig", () => {
	test("should return a config with base root settings applied", () => {
		const result = defineRootConfig([]);
		expect(result.test?.restoreMocks).toBe(true);
		expect(result.test?.mockReset).toBe(true);
		expect(result.test?.clearMocks).toBe(true);
		expect(result.test?.environment).toBe("node");
	});

	test("should include reporters from baseRootConfig", () => {
		const result = defineRootConfig([]);
		expect(result.test?.reporters).toEqual(baseRootConfig.test?.reporters);
	});

	test("should include coverage config from baseRootConfig", () => {
		const result = defineRootConfig([]);
		expect(result.test?.coverage).toMatchObject(
			baseRootConfig.test?.coverage ?? {},
		);
	});

	test("should apply additional plugins on top of root config", () => {
		const result = defineRootConfig(
			[],
			overridePlugin({ environment: "jsdom" }),
		);
		expect(result.test?.environment).toBe("jsdom");
		// root settings preserved
		expect(result.test?.restoreMocks).toBe(true);
	});
});
