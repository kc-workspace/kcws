import { definePlugin } from "@kcinternals/config-builder";
import { mergeConfig } from "vitest/config";
import { baseRootConfig } from "../constants/config";
import type { UserConfig, VitestConfigPlugin } from "../models";

const rootPlugin = (): VitestConfigPlugin<"root", UserConfig> =>
	definePlugin("root", {
		configPriority: -1000,
		applyConfig: (base) => mergeConfig(base, baseRootConfig),
	});
export default rootPlugin;
