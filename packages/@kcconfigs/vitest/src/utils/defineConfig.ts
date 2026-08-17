import { defineConfig as _defineConfig } from "@kcinternals/config-builder";
import type { AnyVitestConfigPlugin } from "../models";

/**
 * Creates a Vitest configuration by applying configuration plugins to an empty
 * base configuration.
 *
 * Plugins are applied according to their setting and configuration priorities.
 *
 * @typeParam C - Vitest configuration type produced by the plugins.
 * @param plugin - Primary plugin to apply.
 * @param plugins - Additional plugins to apply.
 * @returns The Vitest configuration produced by the plugins.
 */
const defineConfig = <C>(
	plugin: AnyVitestConfigPlugin<C>,
	...plugins: AnyVitestConfigPlugin<C>[]
): C => {
	return _defineConfig({} as C, plugin, ...plugins) as C;
};
export default defineConfig;
