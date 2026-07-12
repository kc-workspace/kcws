import { definePlugin } from "@kcinternals/config-builder";
import { mergeConfig } from "tsdown";
import type { TsdownPlugin } from "../models";

const browserPlugin = (): TsdownPlugin<"browser"> =>
	definePlugin({
		name: "browser",
		apply: (base) => {
			return mergeConfig(base, { platform: "browser" });
		},
	});
export default browserPlugin;
