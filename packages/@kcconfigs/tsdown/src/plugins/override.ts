import { definePluginSync } from "@kcinternals/config-builder";
import { mergeConfig } from "tsdown";
import type { TsdownConfig, TsdownConfigPlugin } from "../models";

const overridePlugin = (
	...overrides: TsdownConfig[]
): TsdownConfigPlugin<"override"> =>
	definePluginSync("override", {
		applyConfig: (base) => {
			return mergeConfig(base, ...overrides);
		},
	});
export default overridePlugin;
