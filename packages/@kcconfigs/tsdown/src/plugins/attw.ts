import type { TsdownConfigPlugin } from "../models"

import { definePluginSync } from "@kcinternals/config-builder"
import { type AttwOptions, mergeConfig, type WithEnabled } from "tsdown"

const attwPlugin = (config: WithEnabled<AttwOptions>): TsdownConfigPlugin<"attw"> =>
	definePluginSync("attw", {
		applyConfig: (base) => {
			return mergeConfig(base, {
				attw: config,
			})
		},
	})
export default attwPlugin
