import type { AnyObject, PluginConfig } from "./model";

export const definePlugin = <C extends AnyObject>(
	config: PluginConfig<C>,
): PluginConfig<C> => {
	return config;
};
