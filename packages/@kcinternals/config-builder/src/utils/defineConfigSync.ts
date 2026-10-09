import { format } from "node:util";
import type { AnySyncConfigPlugin } from "../types";
import defineBaseConfig from "./defineBaseConfig";
import { sortPlugins } from "./helpers";
import { debug, verbose } from "./logger";

/**
 * Apply plugins sequentially, completing all settings before configurations.
 * @param base The initial base configuration object.
 * @param plugins An array of synchronous configuration plugins to apply.
 * @returns The final configuration object after applying all plugins.
 */
const defineConfigSync = <C>(
	base: C,
	...plugins: AnySyncConfigPlugin<C>[]
): C => {
	const { config: baseConfig, setting: baseSetting } = defineBaseConfig(base);

	const setting = sortPlugins(plugins, "settingPriority").reduce(
		(before, plugin) => {
			const name = plugin.name;
			const settingFn = plugin.applySetting;
			if (settingFn === undefined) return before;

			const beforeMsg = format(`[%s] before setting: %O`, name, before);
			const after = settingFn(before) ?? before;
			const afterMsg = format(`[%s] after setting: %O`, name, after);

			debug(after, `applying setting: ${name} (${plugin.settingPriority})`);
			verbose(after, beforeMsg);
			verbose(after, afterMsg);
			return after;
		},
		baseSetting,
	);

	const config = sortPlugins(plugins, "configPriority").reduce(
		(before, plugin) => {
			const name = plugin.name;
			const configFn = plugin.applyConfig;
			if (configFn === undefined) return before;

			debug(setting, `applying config: ${name} (${plugin.configPriority})`);
			verbose(setting, format(`[%s] before config: %O`, name, before));
			const after = configFn(before) ?? before;
			verbose(setting, format(`[%s] after config: %O`, name, after));

			return after;
		},
		baseConfig,
	);

	debug(setting, format("all plugins applied: %O", config));
	return config;
};

export default defineConfigSync;
