import { definePlugin } from "@kcinternals/config-builder";
import { mergeConfig } from "vitest/config";
import { baseProjectConfig } from "../constants/config";
import type { ProjectConfig, VitestConfigPlugin } from "../models";

const projectPlugin = (): VitestConfigPlugin<"project", ProjectConfig> =>
	definePlugin("project", {
		configPriority: -1000,
		applyConfig: (base) => mergeConfig(base, baseProjectConfig),
	});
export default projectPlugin;
