import { format } from "node:util";
import type { AnyConfigPlugin, BaseSetting } from "../models";
import defineBaseConfig from "./defineBaseConfig";
import { withEnabled } from "./enabled";

const defineConfig = <C>(base: C, ...plugins: AnyConfigPlugin<C>[]): C => {
	const config = defineBaseConfig(base);

	const debug = (setting: BaseSetting, msg: string) =>
		withEnabled(setting?.debug, console.debug.bind(console))?.(msg);
	const verbose = (setting: BaseSetting, msg: string) =>
		withEnabled(setting?.verbose, console.debug.bind(console))?.(msg);

	const sortedPlugins = plugins.sort((a, b) => a.priority - b.priority);

	const applied = sortedPlugins.reduce((acc, plugin) => {
		const name = plugin.name;

		const { config: beforeConfig, setting: beforeSetting } = acc;

		const afterSetting = plugin?.applySetting?.(beforeSetting);
		const setting = afterSetting ?? beforeSetting;

		debug(setting, `applying plugin: ${name} (${plugin.priority})`);
		verbose(setting, format(`[%s] before setting: %O`, name, beforeSetting));
		verbose(setting, format(`[%s] after setting: %O`, name, afterSetting));

		const afterConfig = plugin?.applyConfig?.(beforeConfig);
		const config = afterConfig ?? beforeConfig;
		verbose(setting, format(`[%s] before config: %O`, name, beforeConfig));
		verbose(setting, format(`[%s] after config: %O`, name, afterConfig));

		return {
			setting,
			config,
		};
	}, config);

	debug(applied.setting, format("all plugins applied: %O", applied));
	return applied.config;
};

export default defineConfig;
