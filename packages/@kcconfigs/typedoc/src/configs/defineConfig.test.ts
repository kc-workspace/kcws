import { describe, expect, test } from "vitest";
import { defineConfig } from "./defineConfig";
import type { UserConfig } from "./model";

describe("defineConfig", () => {
	test("should return a config object", () => {
		const config = defineConfig();
		expect(config).toBeDefined();
		expect(typeof config).toBe("object");
	});

	test("should accept a single config object", () => {
		const customConfig: UserConfig = {};
		const config = defineConfig(customConfig);
		expect(config).toBeDefined();
		expect(typeof config).toBe("object");
	});

	test("should merge multiple config objects", () => {
		const config1: UserConfig = {};
		const config2: UserConfig = {};
		const config = defineConfig(config1, config2);

		expect(config).toBeDefined();
		expect(typeof config).toBe("object");
	});

	test("should apply overrides in correct order", () => {
		const config1: UserConfig = { sort: ["visibility"] };
		const config2: UserConfig = { sort: ["alphabetical"] };
		const config = defineConfig(config1, config2);

		expect(config.sort).toContain("alphabetical");
	});

	test("should handle undefined overrides", () => {
		const config1: UserConfig = {};
		const config = defineConfig(config1, undefined);

		expect(config).toBeDefined();
	});

	test("should normalize the final config", () => {
		const config = defineConfig({});
		expect(config).toBeDefined();
		expect(typeof config).toBe("object");
	});
});
