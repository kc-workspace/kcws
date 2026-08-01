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
		expect(plugin.priority).toBe(0);
	});

	test("should use provided priority", () => {
		const plugin = definePlugin("test", { priority: 5 });
		expect(plugin.priority).toBe(5);
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

	test("should return object matching ConfigPlugin shape", () => {
		const name = "myPlugin";
		const applyConfig: ConfigPluginAction<string> = (config) => config;
		const result = definePlugin(name, {
			priority: 1,
			applyConfig,
		});

		expect(result).toEqual({
			name,
			priority: 1,
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

	test("should return object matching ConfigPlugin shape", () => {
		const name = "myPlugin";
		const applySetting: ConfigPluginAction<BaseSetting> = (_) => ({
			debug: true,
		});
		const result = definePlugin(name, {
			priority: Number.POSITIVE_INFINITY,
			applySetting,
		});

		expect(result).toEqual({
			name,
			priority: Number.POSITIVE_INFINITY,
			applySetting,
			applyConfig: undefined,
		});
	});
});
