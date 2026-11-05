import type {ProjectConfig, VitestConfigPlugin} from "../types"

import {definePluginSync} from "@kcinternals/config-builder"

import {baseProjectConfig} from "../constants/config"
import mergeConfig from "../utils/mergeConfig"

const projectPlugin = (): VitestConfigPlugin<"project", ProjectConfig> =>
	definePluginSync("project", {
		configPriority: -1000,
		applyConfig: (base) => mergeConfig(base, baseProjectConfig),
	})
export default projectPlugin
