import { describe, expect, test } from "vitest";
import defineConfigSync from "./defineConfigSync";
import definePluginSync from "./definePluginSync";

describe(defineConfigSync.name, () => {
	test("applies settings and configs in priority order without reordering plugins", () => {
		const calls: string[] = [];
		const base = { calls: [] as string[] };
		const plugins = [
			definePluginSync<"later", typeof base>("later", {
				settingPriority: 10,
				configPriority: 10,
				applySetting: (setting) => {
					calls.push("setting:later");
					return setting;
				},
				applyConfig: (config) => ({ calls: [...config.calls, "later"] }),
			}),
			definePluginSync<"earlier", typeof base>("earlier", {
				settingPriority: 0,
				configPriority: 0,
				applySetting: (setting) => {
					calls.push("setting:earlier");
					return setting;
				},
				applyConfig: (config) => ({ calls: [...config.calls, "earlier"] }),
			}),
		];

		const result = defineConfigSync(base, ...plugins);

		expect(calls).toEqual(["setting:earlier", "setting:later"]);
		expect(result.calls).toEqual(["earlier", "later"]);
		expect(plugins.map((plugin) => plugin.name)).toEqual(["later", "earlier"]);
	});

	test("logs the config before and after an in-place plugin mutation", () => {
		const messages: string[] = [];

		const result = defineConfigSync(
			{ value: 1 },
			definePluginSync<"logger", { value: number }>("logger", {
				applySetting: () => ({ verbose: (message) => messages.push(message) }),
				applyConfig: (config) => {
					config.value += 1;
					return config;
				},
			}),
		);

		expect(result).toEqual({ value: 2 });
		expect(messages).toContain("[logger] before config: { value: 1 }");
		expect(messages).toContain("[logger] after config: { value: 2 }");
	});

	test("keeps the base config when plugins omit apply hooks", () => {
		const base = { value: 1 };
		const result = defineConfigSync(
			base,
			definePluginSync<"noop", typeof base>("noop", {}),
		);

		expect(result).toBe(base);
	});

	test("falls back to the previous values when hooks return undefined", () => {
		const base = { value: 1 };
		const result = defineConfigSync(
			base,
			definePluginSync<"undefined", typeof base>("undefined", {
				applySetting: () => undefined,
				applyConfig: () => undefined,
			}),
		);

		expect(result).toBe(base);
	});

	test("uses debug and verbose callbacks from plugin settings", () => {
		const debugMessages: string[] = [];
		const verboseMessages: string[] = [];

		const result = defineConfigSync(
			{ value: 1 },
			definePluginSync<"logger", { value: number }>("logger", {
				applySetting: () => ({
					debug: (message) => debugMessages.push(message),
					verbose: (message) => verboseMessages.push(message),
				}),
				applyConfig: (config) => ({ value: config.value + 1 }),
			}),
		);

		expect(result).toEqual({ value: 2 });
		expect(debugMessages).toEqual([
			"applying setting: logger (0)",
			"applying config: logger (0)",
			"all plugins applied: { value: 2 }",
		]);
		expect(verboseMessages).toEqual([
			"[logger] before setting: { debug: false, verbose: false }",
			"[logger] after setting: { debug: [Function: debug], verbose: [Function: verbose] }",
			"[logger] before config: { value: 1 }",
			"[logger] after config: { value: 2 }",
		]);
	});
});
