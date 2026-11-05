import type { ProjectConfig, UserConfig, VitestConfigPlugin } from "../types"

import { definePluginSync } from "@kcinternals/config-builder"

const debugPlugin = (): VitestConfigPlugin<"debug", UserConfig | ProjectConfig> =>
	definePluginSync("debug", {
		settingPriority: Number.NEGATIVE_INFINITY,
		applySetting: (base) => ({
			...base,
			debug: true,
		}),
	})
export default debugPlugin
