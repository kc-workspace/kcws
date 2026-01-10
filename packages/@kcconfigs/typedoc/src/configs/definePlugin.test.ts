import { describe, expect, test } from "vitest";
import { definePlugin } from "./definePlugin";
import { defineTheme } from "./defineTheme";
import type { UserConfig } from "./model";

describe("definePlugin", () => {
	test("should return plugin config", () => {
		const config: UserConfig = { plugin: [] };
		const result = definePlugin(config);

		expect(result).toBeDefined();
		expect(typeof result).toBe("object");
	});

	test("should preserve config properties", () => {
		const config: UserConfig = { plugin: ["test-plugin"] };
		const result = definePlugin(config);

		expect(result.plugin).toEqual(["test-plugin"]);
	});

	test("should handle empty config", () => {
		const config: UserConfig = {};
		const result = definePlugin(config);

		expect(result).toEqual({});
	});
});

describe("defineTheme", () => {
	test("should return theme config", () => {
		const config: UserConfig = { theme: "default" };
		const result = defineTheme(config);

		expect(result).toBeDefined();
		expect(typeof result).toBe("object");
	});

	test("should preserve theme configuration", () => {
		const config: UserConfig = { theme: "custom" };
		const result = defineTheme(config);

		expect(result.theme).toBe("custom");
	});

	test("should handle empty config", () => {
		const config: UserConfig = {};
		const result = defineTheme(config);

		expect(result).toEqual({});
	});
});
