import { definePlugin } from "@kcinternals/config-builder";
import { baseRootConfig } from "../constants/config";
import type { UserConfig, VitestConfigPlugin } from "../models";
import mergeConfig from "../utils/mergeConfig";

const rootPlugin = (
	projects?: string[],
): VitestConfigPlugin<"root", UserConfig> =>
	definePlugin("root", {
		configPriority: -1000,
		applyConfig: (base) => {
			const overrideConfig = projects
				? ({ test: { projects } } satisfies UserConfig)
				: undefined;
			return mergeConfig(base, baseRootConfig, overrideConfig);
		},
	});
export default rootPlugin;
