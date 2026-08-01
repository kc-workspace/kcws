import { describe, expect, test } from "vitest";
import type { BaseSetting, ConfigPluginAction } from "../models";
import definePlugin from "./definePlugin";

interface MockConfig {
	value: number;
}

describe(definePlugin.name, () => {
	test("should return a plugin with the given name", () => {
		const plugin = definePlugin("test", {});
		expect(plugin.name).toBe("test");
	});

	test("should default priority to 0", () => {
		const plugin = definePlugin("test", {});
		expect(plugin.settingPriority).toBe(0);
		expect(plugin.configPriority).toBe(0);
	});

	test("should use provided priorities", () => {
		const plugin = definePlugin("test", {
			settingPriority: 5,
			configPriority: 7,
		});
		expect(plugin.settingPriority).toBe(5);
		expect(plugin.configPriority).toBe(7);
	});

	test("should default configPriority when only settingPriority provided", () => {
		const plugin = definePlugin("test", { settingPriority: 5 });
		expect(plugin.settingPriority).toBe(5);
		expect(plugin.configPriority).toBe(0);
	});

	test("should default settingPriority when only configPriority provided", () => {
		const plugin = definePlugin("test", { configPriority: 7 });
		expect(plugin.settingPriority).toBe(0);
		expect(plugin.configPriority).toBe(7);
	});

	test("should default apply* to undefined", () => {
		const plugin = definePlugin<"test", MockConfig>("test", {});
		expect(plugin.applyConfig).toBeUndefined();
		expect(plugin.applySetting).toBeUndefined();
	});

	test("should use provided applyConfig function", () => {
		const input: MockConfig = { value: 5 };
		const plugin = definePlugin<"double", MockConfig>("double", {
			applyConfig: (config) => ({ value: config.value * 2 }),
		});
		const output = plugin.applyConfig?.(input);
		expect(output).toEqual({ value: 10 });
	});

	test("should return object matching ConfigPlugin shape with applyConfig", () => {
		const name = "myPlugin";
		const applyConfig: ConfigPluginAction<string> = (config) => config;
		const result = definePlugin(name, {
			settingPriority: 1,
			configPriority: 2,
			applyConfig,
		});

		expect(result).toEqual({
			name,
			settingPriority: 1,
			configPriority: 2,
			applyConfig,
			applySetting: undefined,
		});
	});

	test("should use provided applySetting function", () => {
		const plugin = definePlugin<"debug", MockConfig>("debug", {
			applySetting: (_) => ({ debug: true }),
		});
		const output = plugin.applySetting?.({});
		expect(output).toEqual({ debug: true });
	});

	test("should return object matching ConfigPlugin shape with applySetting", () => {
		const name = "myPlugin";
		const applySetting: ConfigPluginAction<BaseSetting> = (_) => ({
			debug: true,
		});
		const result = definePlugin(name, {
			settingPriority: Number.POSITIVE_INFINITY,
			applySetting,
		});

		expect(result).toEqual({
			name,
			settingPriority: Number.POSITIVE_INFINITY,
			configPriority: 0,
			applySetting,
			applyConfig: undefined,
		});
	});
});
