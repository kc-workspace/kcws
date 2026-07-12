import { definePlugin } from "@kcinternals/config-builder";
import { type Format, mergeConfig, type ResolvedConfig } from "tsdown";
import type { TsdownPlugin } from "../models";

type MinimalFormat = Exclude<Format, "es" | "module" | "commonjs">;
type FormatValue = Partial<ResolvedConfig>;
export type MinimalFormatObject = Partial<Record<MinimalFormat, FormatValue>>;

const formatPlugin = (
	format: MinimalFormat[] | MinimalFormatObject,
): TsdownPlugin<"format"> =>
	definePlugin({
		name: "format",
		apply: (base) => {
			return mergeConfig(base, {
				format,
			});
		},
	});
export default formatPlugin;
