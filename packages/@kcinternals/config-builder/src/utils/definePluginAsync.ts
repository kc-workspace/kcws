import type { AsyncConfigPlugin } from "../types";

/**
 * Create a plugin that supports synchronous and asynchronous actions.
 * @param name plugin name
 * @param plugin plugin configuration
 * @returns An asynchronous configuration plugin
 */
const definePluginAsync = <N extends string, C>(
	name: N,
	plugin: Partial<Omit<AsyncConfigPlugin<N, C>, "name">>,
): AsyncConfigPlugin<N, C> => {
	return {
		name,
		settingPriority: plugin.settingPriority ?? 0,
		applySetting: plugin.applySetting,
		configPriority: plugin.configPriority ?? 0,
		applyConfig: plugin.applyConfig,
	};
};

export default definePluginAsync;
