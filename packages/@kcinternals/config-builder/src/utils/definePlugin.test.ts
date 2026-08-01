import { describe, expect, test } from "vitest";
import type { ConfigPluginAction } from "../models";
import defineBaseConfig from "./defineBaseConfig";
import definePlugin from "./definePlugin";

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

	test("should default apply to identity function", () => {
		const input = { value: 42 };
		const plugin = definePlugin<"test", typeof input>("test", {});
		const { config: output } = plugin.apply(defineBaseConfig(input));
		expect(output).toBe(input);
	});

	test("should use provided apply function", () => {
		const input = { x: 5 };
		const plugin = definePlugin<"double", typeof input>("double", {
			apply: (base) => ({ ...base, config: { x: base.config.x * 2 } }),
		});
		const { config: output } = plugin.apply(defineBaseConfig(input));
		expect(output).toEqual({ x: 10 });
	});

	test("should return object matching ConfigPlugin shape", () => {
		const name = "myPlugin";
		const apply: ConfigPluginAction<string> = (config) => config;
		const result = definePlugin(name, {
			priority: 1,
			apply,
		});

		expect(result).toEqual({ name, priority: 1, apply });
	});
});
