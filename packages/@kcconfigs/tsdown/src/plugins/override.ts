import type { TsdownConfig, TsdownConfigPlugin } from "../models"

import { definePluginSync } from "@kcinternals/config-builder"
import { mergeConfig } from "tsdown"

const overridePlugin = (...overrides: TsdownConfig[]): TsdownConfigPlugin<"override"> =>
	definePluginSync("override", {
		applyConfig: (base) => {
			return mergeConfig(base, ...overrides)
		},
	})
export default overridePlugin
