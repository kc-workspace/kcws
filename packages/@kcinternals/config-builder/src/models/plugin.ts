import type { BaseSetting } from "./setting";

/** Plugin priority */
export type Priority = number;

export type ConfigPluginAction<C> = (base: C) => C;

export interface ConfigPlugin<N extends string, C> {
	/** Plugin name for identification */
	readonly name: N;
	/** Priority of the plugin (default to 0) */
	readonly priority: Priority;

	/** Apply the plugin to the base setting */
	applySetting?: ConfigPluginAction<BaseSetting> | undefined;
	/** Apply the plugin to the base configuration */
	applyConfig?: ConfigPluginAction<C> | undefined;
}

export type AnyConfigPlugin<C> = ConfigPlugin<string, C>;
