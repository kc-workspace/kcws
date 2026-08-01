import { definePlugin } from "@kcinternals/config-builder";
import { mergeConfig } from "tsdown";
import { defaultIgnoreEntry } from "../constants";
import type { TsdownConfigPlugin } from "../models";

const entryPlugin = (
	entry: string[],
	useDefault = true,
): TsdownConfigPlugin<"entry"> =>
	definePlugin("entry", {
		applyConfig: (base) => {
			const defaultEntry = useDefault ? defaultIgnoreEntry : [];
			const _entry = [...entry, ...defaultEntry];
			return mergeConfig(base, {
				entry: _entry,
			});
		},
	});
export default entryPlugin;
