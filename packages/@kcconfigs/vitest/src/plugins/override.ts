import { definePlugin } from "@kcinternals/config-builder";
import type {
	AnyConfig,
	AnyVitestConfigPlugin,
	ProjectConfig,
	UserConfig,
} from "../models";
import mergeConfig from "../utils/mergeConfig";

/**
 * Vitest specific configuration type that can be either a root or project configuration.
 */
export type OverrideConfig = UserConfig["test"] | ProjectConfig["test"];

const overridePlugin = (
	config: OverrideConfig,
): AnyVitestConfigPlugin<AnyConfig> =>
	definePlugin("override", {
		configPriority: 1000,
		applyConfig: (base) => mergeConfig(base, { test: config } as AnyConfig),
	});
export default overridePlugin;
