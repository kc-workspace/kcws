import { describe, expect, test } from "vitest";
import defineConfigAsync from "./defineConfigAsync";
import definePluginAsync from "./definePluginAsync";

describe(defineConfigAsync.name, () => {
	test("awaits plugins in priority order, completing settings before configs", async () => {
		const calls: string[] = [];
		const base = { calls: [] as string[] };
		const plugins = [
			definePluginAsync<"later", typeof base>("later", {
				settingPriority: 10,
				configPriority: 10,
				applySetting: async (setting) => {
					calls.push("setting:later");
					return setting;
				},
				applyConfig: async (config) => ({ calls: [...config.calls, "later"] }),
			}),
			definePluginAsync<"earlier", typeof base>("earlier", {
				settingPriority: 0,
				configPriority: 0,
				applySetting: async (setting) => {
					calls.push("setting:earlier");
					return setting;
				},
				applyConfig: async (config) => ({
					calls: [...config.calls, "earlier"],
				}),
			}),
		];

		const result = await defineConfigAsync(base, ...plugins);

		expect(calls).toEqual(["setting:earlier", "setting:later"]);
		expect(result.calls).toEqual(["earlier", "later"]);
		expect(plugins.map((plugin) => plugin.name)).toEqual(["later", "earlier"]);
	});

	test("logs the config before and after applying a plugin", async () => {
		const messages: string[] = [];

		const result = await defineConfigAsync(
			{ value: 1 },
			definePluginAsync<"logger", { value: number }>("logger", {
				applySetting: () => ({ verbose: (message) => messages.push(message) }),
				applyConfig: async (config) => {
					config.value += 1;
					return config;
				},
			}),
		);

		expect(result).toEqual({ value: 2 });
		expect(messages).toContain("[logger] before config: { value: 1 }");
		expect(messages).toContain("[logger] after config: { value: 2 }");
	});

	test("keeps the base config when plugins omit apply hooks", async () => {
		const base = { value: 1 };
		const result = await defineConfigAsync(
			base,
			definePluginAsync<"noop", typeof base>("noop", {}),
		);

		expect(result).toBe(base);
	});

	test("falls back to the previous values when hooks return undefined", async () => {
		const base = { value: 1 };
		const result = await defineConfigAsync(
			base,
			definePluginAsync<"undefined", typeof base>("undefined", {
				applySetting: () => undefined,
				applyConfig: async () => undefined,
			}),
		);

		expect(result).toBe(base);
	});

	test("uses debug and verbose callbacks from plugin settings", async () => {
		const debugMessages: string[] = [];
		const verboseMessages: string[] = [];

		const result = await defineConfigAsync(
			{ value: 1 },
			definePluginAsync<"logger", { value: number }>("logger", {
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
