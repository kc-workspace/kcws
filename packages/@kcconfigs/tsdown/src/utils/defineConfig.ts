import type { TsdownConfig, TsdownConfigPlugin } from "../models"

import { defineConfigSync } from "@kcinternals/config-builder"

import { baseConfig } from "../constants"
import attwNormalize from "../internals/attwNormalize"
import dtsNormalize from "../internals/dtsNormalize"
import formatNormalize from "../internals/formatNormalize"
import publintNormalize from "../internals/publintNormalize"

const defineConfig = (...plugins: TsdownConfigPlugin<string>[]): TsdownConfig => {
	return defineConfigSync(
		baseConfig,
		...plugins,
		attwNormalize(),
		dtsNormalize(),
		formatNormalize(),
		publintNormalize(),
	)
}

export default defineConfig
