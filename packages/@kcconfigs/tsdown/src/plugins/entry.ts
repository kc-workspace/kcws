import type { TsdownConfigPlugin } from "../models"

import { definePluginSync } from "@kcinternals/config-builder"
import { mergeConfig } from "tsdown"

import { defaultIgnoreEntry } from "../constants"

const entryPlugin = (entry: string[], useDefault = true): TsdownConfigPlugin<"entry"> =>
	definePluginSync("entry", {
		applyConfig: (base) => {
			const defaultEntry = useDefault ? defaultIgnoreEntry : []
			const _entry = [...entry, ...defaultEntry]
			return mergeConfig(base, {
				entry: _entry,
			})
		},
	})
export default entryPlugin
