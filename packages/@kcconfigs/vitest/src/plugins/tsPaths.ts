import { definePlugin } from "@kcinternals/config-builder";
import type { AnyConfig, VitestConfigPlugin } from "../models";
import mergeConfig from "../utils/mergeConfig";

/**
 * When your tsconfig contains compilerOptions.paths, Vitest will not be able to resolve the paths correctly.
 * This plugin will help you to resolve the paths correctly by using the tsconfig.json file.
 */
const tsPathsPlugin = (): VitestConfigPlugin<"tsPaths", AnyConfig> =>
	definePlugin("tsPaths", {
		applyConfig: (base) =>
			mergeConfig(base, { resolve: { tsconfigPaths: true } }),
	});
export default tsPathsPlugin;
