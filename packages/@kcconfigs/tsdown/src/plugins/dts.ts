import { definePluginSync } from "@kcinternals/config-builder";
import { type DtsOptions, mergeConfig, type WithEnabled } from "tsdown";
import type { TsdownConfigPlugin } from "../models";

const dtsPlugin = (
	config: WithEnabled<DtsOptions>,
): TsdownConfigPlugin<"dts"> =>
	definePluginSync("dts", {
		applyConfig: (base) => {
			return mergeConfig(base, {
				dts: config,
			});
		},
	});
export default dtsPlugin;
