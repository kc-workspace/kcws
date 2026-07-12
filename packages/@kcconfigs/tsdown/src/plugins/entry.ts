import { definePlugin } from "@kcinternals/config-builder";
import { mergeConfig } from "tsdown";
import { defaultIgnoreEntry } from "../constants";
import type { TsdownPlugin } from "../models";

const entryPlugin = (
	entry: string[],
	useDefault = true,
): TsdownPlugin<"entry"> =>
	definePlugin({
		name: "entry",
		apply: (base) => {
			const defaultEntry = useDefault ? defaultIgnoreEntry : [];
			const _entry = [...entry, ...defaultEntry];
			return mergeConfig(base, {
				entry: _entry,
			});
		},
	});
export default entryPlugin;
