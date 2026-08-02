import { format } from "node:util";
import type { AnyConfigPlugin, BaseConfig } from "../models";
import defineBaseConfig from "./defineBaseConfig";
import { debug, verbose } from "./logger";

const applyPlugins = <C>(
	base: BaseConfig<C>,
	plugins: AnyConfigPlugin<C>[],
	apply: (base: BaseConfig<C>, plugin: AnyConfigPlugin<C>) => BaseConfig<C>,
): BaseConfig<C> => {
	return plugins.reduce((acc, plugin) => {
		return apply(acc, plugin);
	}, base);
};

const defineConfig = <C>(base: C, ...plugins: AnyConfigPlugin<C>[]): C => {
	const baseConfig = defineBaseConfig(base);

	const appliedSettingConfig = applyPlugins(
		baseConfig,
		plugins.sort((a, b) => a.settingPriority - b.settingPriority),
		(base, plugin) => {
			const name = plugin.name;
			const beforeSetting = base.setting;

			const settingFn = plugin?.applySetting;
			if (settingFn === undefined) return base;

			const afterSetting = settingFn(beforeSetting);
			const setting = afterSetting ?? beforeSetting;

			debug(setting, `applying setting: ${name} (${plugin.settingPriority})`);
			verbose(setting, format(`[%s] before setting: %O`, name, beforeSetting));
			verbose(setting, format(`[%s] after setting: %O`, name, afterSetting));
			return Object.assign(base, { setting });
		},
	);

	const appliedConfig = applyPlugins(
		appliedSettingConfig,
		plugins.sort((a, b) => a.configPriority - b.configPriority),
		(base, plugin) => {
			const name = plugin.name;
			const setting = base.setting;
			const beforeConfig = base.config;

			const configFn = plugin?.applyConfig;
			if (configFn === undefined) return base;

			const afterConfig = configFn(beforeConfig);

			debug(setting, `applying config: ${name} (${plugin.configPriority})`);
			verbose(setting, format(`[%s] before config: %O`, name, beforeConfig));
			verbose(setting, format(`[%s] after config: %O`, name, afterConfig));
			return Object.assign(base, { config: afterConfig ?? beforeConfig });
		},
	);

	const { setting, config } = appliedConfig;

	debug(setting, format("all plugins applied: %O", config));
	return config;
};

export default defineConfig;
