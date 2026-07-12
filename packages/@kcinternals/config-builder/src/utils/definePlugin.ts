import type { ConfigPlugin } from "../models";

const definePlugin = <N extends string, C>(
	plugin: ConfigPlugin<N, C>,
): ConfigPlugin<N, C> => {
	return plugin;
};

export default definePlugin;
