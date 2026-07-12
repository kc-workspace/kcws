import { definePlugin } from "@kcinternals/config-builder";
import { mergeConfig } from "tsdown";
import type { TsdownPlugin } from "../models";

const outputPlugin = (outDir: string): TsdownPlugin<"output"> =>
	definePlugin({
		name: "output",
		apply: (base) => {
			return mergeConfig(base, { outDir });
		},
	});
export default outputPlugin;
