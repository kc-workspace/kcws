import type { BaseSetting } from "./setting";

/** Base interface for all configuration plugins */
export interface BaseConfigPlugin<N extends string> {
	/** Plugin name for identification */
	readonly name: N;
	/** Priority of the plugin setting (default to 0) */
	readonly settingPriority: number;
	/** Priority of the plugin configuration (default to 0) */
	readonly configPriority: number;
}

type SyncConfigPluginApply<C> = WithUndefined<(c: C) => C | undefined>;

/** Synchronous configuration plugin interface */
export interface SyncConfigPlugin<N extends string, C>
	extends BaseConfigPlugin<N> {
	/** Apply the plugin to the base setting */
	applySetting?: SyncConfigPluginApply<BaseSetting>;
	/** Apply the plugin to the base configuration */
	applyConfig?: SyncConfigPluginApply<C>;
}

/** Any synchronous configuration plugin with any name */
export type AnySyncConfigPlugin<C> = SyncConfigPlugin<string, C>;

type AsyncConfigPluginApply<C> = WithUndefined<
	(c: C) => C | undefined | Promise<C | undefined>
>;

/** Asynchronous configuration plugin interface */
export interface AsyncConfigPlugin<N extends string, C>
	extends BaseConfigPlugin<N> {
	/** Apply the plugin to the base setting */
	applySetting?: AsyncConfigPluginApply<BaseSetting>;
	/** Apply the plugin to the base configuration */
	applyConfig?: AsyncConfigPluginApply<C>;
}

/** Any asynchronous configuration plugin with any name */
export type AnyAsyncConfigPlugin<C> = AsyncConfigPlugin<string, C>;
