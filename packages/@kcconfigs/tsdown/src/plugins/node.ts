import type {TsdownConfigPlugin} from "../models"

import {definePluginSync} from "@kcinternals/config-builder"
import {mergeConfig} from "tsdown"

const nodePlugin = (): TsdownConfigPlugin<"node"> =>
	definePluginSync("node", {
		applyConfig: (base) => {
			return mergeConfig(base, {platform: "node"})
		},
	})
export default nodePlugin
