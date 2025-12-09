import type { PackagePlugins } from "./types"

import { BinPlugin } from "./plugins/BinPlugin"
import { CommonJSPlugin } from "./plugins/CommonJSPlugin"
import { ModulePlugin } from "./plugins/ModulePlugin"

export const PLUGINS: PackagePlugins = {
	module: new ModulePlugin(),
	commonjs: new CommonJSPlugin(),
	bin: new BinPlugin(),
}

export const PLUGIN_TYPES = Object.keys(PLUGINS)

export const CONFIG_NAME = "@kcinternals/bun-build"
