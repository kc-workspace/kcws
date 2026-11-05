import type {TsdownConfigPlugin} from "../models"

import {definePluginSync} from "@kcinternals/config-builder"
import {mergeConfig, type UnusedOptions, type WithEnabled} from "tsdown"

const unusedPlugin = (config: WithEnabled<UnusedOptions>): TsdownConfigPlugin<"unused"> =>
	definePluginSync("unused", {
		applyConfig: (base) => {
			return mergeConfig(base, {
				unused: config,
			})
		},
	})
export default unusedPlugin
