import type { BaseConfig } from "./config";

/** Plugin priority */
export type Priority = number;

export type ConfigPluginAction<C> = (base: BaseConfig<C>) => BaseConfig<C>;

export interface ConfigPlugin<N extends string, C> {
	/** Plugin name for identification */
	readonly name: N;
	/** Priority of the plugin (default to 0) */
	readonly priority: Priority;
	/** Apply the plugin to the base configuration */
	apply: ConfigPluginAction<C>;
}

export type AnyConfigPlugin<C> = ConfigPlugin<string, C>;
