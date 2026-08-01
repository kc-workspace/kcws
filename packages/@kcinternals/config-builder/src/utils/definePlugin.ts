import type { ConfigPlugin } from "../models";

/**
 * create a ConfigPlugin with the given name and plugin configuration
 * @param name plugin name
 * @param plugin plugin configuration
 * @returns ConfigPlugin
 */
const definePlugin = <N extends string, C>(
	name: N,
	plugin: Partial<Omit<ConfigPlugin<N, C>, "name">>,
): ConfigPlugin<N, C> => {
	return {
		name,
		priority: plugin.priority ?? 0,
		applySetting: plugin.applySetting,
		applyConfig: plugin.applyConfig,
	};
};

export default definePlugin;
