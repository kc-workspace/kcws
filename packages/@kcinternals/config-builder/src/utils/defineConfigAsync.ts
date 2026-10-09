import { format } from "node:util";
import type { AnyAsyncConfigPlugin } from "../types";
import defineBaseConfig from "./defineBaseConfig";
import { sortPlugins } from "./helpers";
import { debug, verbose } from "./logger";

/**
 * Apply plugins sequentially, completing all settings before configurations.
 * @param base The initial base configuration object.
 * @param plugins An array of synchronous or asynchronous configuration plugins to apply.
 * @returns The final configuration object after applying all plugins.
 */
const defineConfigAsync = async <C>(
	base: C,
	...plugins: AnyAsyncConfigPlugin<C>[]
): Promise<C> => {
	let { config, setting } = defineBaseConfig(base);

	for (const plugin of sortPlugins(plugins, "settingPriority")) {
		const name = plugin.name;
		const settingFn = plugin.applySetting;
		if (settingFn === undefined) continue;

		const beforeMsg = format(`[%s] before setting: %O`, name, setting);
		setting = (await settingFn(setting)) ?? setting;
		const afterMsg = format(`[%s] after setting: %O`, name, setting);

		debug(setting, `applying setting: ${name} (${plugin.settingPriority})`);
		verbose(setting, beforeMsg);
		verbose(setting, afterMsg);
	}

	for (const plugin of sortPlugins(plugins, "configPriority")) {
		const name = plugin.name;
		const configFn = plugin.applyConfig;
		if (configFn === undefined) continue;

		debug(setting, `applying config: ${name} (${plugin.configPriority})`);
		verbose(setting, format(`[%s] before config: %O`, name, config));
		config = (await configFn(config)) ?? config;
		verbose(setting, format(`[%s] after config: %O`, name, config));
	}

	debug(setting, format("all plugins applied: %O", config));
	return config;
};

export default defineConfigAsync;
