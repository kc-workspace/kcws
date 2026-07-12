import { definePlugin } from "@kcinternals/config-builder";
import { type DtsOptions, mergeConfig, type WithEnabled } from "tsdown";
import type { TsdownPlugin } from "../models";

const dtsPlugin = (config: WithEnabled<DtsOptions>): TsdownPlugin<"dts"> =>
	definePlugin({
		name: "dts",
		apply: (base) => {
			return mergeConfig(base, {
				dts: config,
			});
		},
	});
export default dtsPlugin;
