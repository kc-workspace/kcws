import type { Config, ConfigPluginAny, DefineOption } from "../models";

const defineConfig = <C>(
	base: Config<C>,
	plugins: ConfigPluginAny<C>[],
	option?: DefineOption,
): Config<C> => {
	const _option: DefineOption = {
		debug: option?.debug,
	};

	const applied = plugins.reduce((acc, plugin) => {
		if (!plugin.apply) return acc;
		_option.debug?.(`Applying plugin: ${plugin.name || "unknown"}`);
		return plugin.apply(acc, _option);
	}, base);
	const normalized = plugins.reduce((acc, plugin) => {
		if (!plugin.normalize) return acc;
		_option.debug?.(`Normalizing plugin: ${plugin.name || "unknown"}`);
		return plugin.normalize(acc, _option);
	}, applied);
	return normalized;
};

export default defineConfig;
