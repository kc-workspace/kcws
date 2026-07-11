import type { ConfigPlugin, ConfigPluginAny } from "../models";

const mergePlugin = <N extends string, C>(
	name: N,
	...plugins: ConfigPluginAny<C>[]
): ConfigPlugin<N, C> => {
	return {
		name,
		apply: (base, option) => {
			return plugins.reduce((acc, plugin) => {
				if (!plugin.apply) return acc;
				option.debug?.(`  Applying plugin: ${plugin.name || "unknown"}`);
				return plugin.apply(acc, option);
			}, base);
		},
		normalize: (config, option) => {
			return plugins.reduce((acc, plugin) => {
				if (!plugin.normalize) return acc;
				option.debug?.(`  Normalizing plugin: ${plugin.name || "unknown"}`);
				return plugin.normalize(acc, option);
			}, config);
		},
	};
};

export default mergePlugin;
