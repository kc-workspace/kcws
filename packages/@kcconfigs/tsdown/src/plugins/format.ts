import type {TsdownConfigPlugin} from "../models"

import {definePluginSync} from "@kcinternals/config-builder"
import {type Format, mergeConfig, type ResolvedConfig} from "tsdown"

type MinimalFormat = Exclude<Format, "es" | "module" | "commonjs">
type FormatValue = Partial<ResolvedConfig>
export type MinimalFormatObject = Partial<Record<MinimalFormat, FormatValue>>

const formatPlugin = (format: MinimalFormat[] | MinimalFormatObject): TsdownConfigPlugin<"format"> =>
	definePluginSync("format", {
		applyConfig: (base) => {
			return mergeConfig(base, {
				format,
			})
		},
	})
export default formatPlugin
