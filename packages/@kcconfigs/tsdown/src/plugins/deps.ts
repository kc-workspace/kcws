import { definePlugin } from "@kcinternals/config-builder";
import { type DepsConfig, mergeConfig } from "tsdown";
import type { TsdownConfigPlugin } from "../models";

const depsPlugin = (config: DepsConfig): TsdownConfigPlugin<"deps"> =>
	definePlugin("deps", {
		applyConfig: (base) => {
			return mergeConfig(base, {
				deps: config,
			});
		},
	});
export default depsPlugin;
