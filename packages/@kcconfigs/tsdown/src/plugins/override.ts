import { definePlugin } from "@kcinternals/config-builder";
import { mergeConfig } from "tsdown";
import type { TsdownConfig, TsdownConfigPlugin } from "../models";

const overridePlugin = (
	...overrides: TsdownConfig[]
): TsdownConfigPlugin<"override"> =>
	definePlugin("override", {
		applyConfig: (base) => {
			return mergeConfig(base, ...overrides);
		},
	});
export default overridePlugin;
