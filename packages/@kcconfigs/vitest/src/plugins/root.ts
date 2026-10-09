import { definePluginSync } from "@kcinternals/config-builder";
import { baseRootConfig } from "../constants/config";
import type { UserConfig, VitestConfigPlugin } from "../types";
import mergeConfig from "../utils/mergeConfig";

const rootPlugin = (
	projects?: string[],
): VitestConfigPlugin<"root", UserConfig> =>
	definePluginSync("root", {
		configPriority: -1000,
		applyConfig: (base) => {
			const overrideConfig = projects
				? ({ test: { projects } } satisfies UserConfig)
				: undefined;
			return mergeConfig(base, baseRootConfig, overrideConfig);
		},
	});
export default rootPlugin;
