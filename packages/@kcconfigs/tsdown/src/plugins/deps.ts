import { definePlugin } from "@kcinternals/config-builder";
import { type DepsConfig, mergeConfig } from "tsdown";
import type { TsdownPlugin } from "../models";

const depsPlugin = (config: DepsConfig): TsdownPlugin<"deps"> =>
	definePlugin({
		name: "deps",
		apply: (base) => {
			return mergeConfig(base, {
				deps: config,
			});
		},
	});
export default depsPlugin;
