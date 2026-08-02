import { definePlugin } from "@kcinternals/config-builder";
import { baseProjectConfig } from "../constants/config";
import type { ProjectConfig, VitestConfigPlugin } from "../models";
import mergeConfig from "../utils/mergeConfig";

const projectPlugin = (): VitestConfigPlugin<"project", ProjectConfig> =>
	definePlugin("project", {
		configPriority: -1000,
		applyConfig: (base) => mergeConfig(base, baseProjectConfig),
	});
export default projectPlugin;
