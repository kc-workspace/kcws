import type { BuildPlugins } from "./types"

import { BinPlugin } from "./plugins/BinPlugin"
import { CommonJSPlugin } from "./plugins/CommonJSPlugin"
import { ModulePlugin } from "./plugins/ModulePlugin"

export const PLUGINS: BuildPlugins = {
	bin: new BinPlugin(),
	module: new ModulePlugin(),
	commonjs: new CommonJSPlugin(),
}
