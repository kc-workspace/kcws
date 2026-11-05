import type { TsdownConfigPlugin } from "../models"

import { definePluginSync } from "@kcinternals/config-builder"
import { mergeConfig, type PublintOptions, type WithEnabled } from "tsdown"

const publintPlugin = (config: WithEnabled<PublintOptions>): TsdownConfigPlugin<"publint"> =>
	definePluginSync("publint", {
		applyConfig: (base) => {
			return mergeConfig(base, {
				publint: config,
			})
		},
	})
export default publintPlugin
