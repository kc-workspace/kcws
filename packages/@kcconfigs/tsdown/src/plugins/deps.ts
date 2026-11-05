import type {TsdownConfigPlugin} from "../models"

import {definePluginSync} from "@kcinternals/config-builder"
import {type DepsConfig, mergeConfig} from "tsdown"

const depsPlugin = (config: DepsConfig): TsdownConfigPlugin<"deps"> =>
	definePluginSync("deps", {
		applyConfig: (base) => {
			return mergeConfig(base, {
				deps: config,
			})
		},
	})
export default depsPlugin
