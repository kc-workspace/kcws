import type { Config } from "./config";
import type { DefineOption } from "./option";

export interface ConfigPlugin<N extends string, C> {
	readonly name: N;
	/** Apply the plugin to the base configuration */
	apply?: (base: Config<C>, option: DefineOption) => Config<C>;
	/** Normalize the config */
	normalize?: (config: Config<C>, option: DefineOption) => Config<C>;
}
export type ConfigPluginAny<C> = ConfigPlugin<string, C>;
