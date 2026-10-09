import { definePluginSync } from "@kcinternals/config-builder";
import { mergeConfig } from "tsdown";
import type { TsdownConfigPlugin } from "../models";

const browserPlugin = (): TsdownConfigPlugin<"browser"> =>
	definePluginSync("browser", {
		applyConfig: (base) => {
			return mergeConfig(base, { platform: "browser" });
		},
	});
export default browserPlugin;
