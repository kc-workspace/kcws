import type { TsdownConfigPlugin } from "../models"

import { definePluginSync } from "@kcinternals/config-builder"
import { mergeConfig } from "tsdown"

const browserPlugin = (): TsdownConfigPlugin<"browser"> =>
	definePluginSync("browser", {
		applyConfig: (base) => {
			return mergeConfig(base, { platform: "browser" })
		},
	})
export default browserPlugin
