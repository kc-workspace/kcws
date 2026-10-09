import type { SyncConfigPlugin } from "../types";

/**
 * Create a plugin that supports synchronous actions.
 * @param name plugin name
 * @param plugin plugin configuration
 * @returns A synchronous configuration plugin
 */
const definePluginSync = <N extends string, C>(
	name: N,
	plugin: Partial<Omit<SyncConfigPlugin<N, C>, "name">>,
): SyncConfigPlugin<N, C> => {
	return {
		name,
		settingPriority: plugin.settingPriority ?? 0,
		applySetting: plugin.applySetting,
		configPriority: plugin.configPriority ?? 0,
		applyConfig: plugin.applyConfig,
	};
};

export default definePluginSync;
