import { definePluginSync } from "@kcinternals/config-builder";
import { mergeConfig } from "tsdown";
import type { TsdownConfigPlugin } from "../models";

const outputPlugin = (outDir: string): TsdownConfigPlugin<"output"> =>
	definePluginSync("output", {
		applyConfig: (base) => {
			return mergeConfig(base, { outDir });
		},
	});
export default outputPlugin;
