import { definePlugin } from "@kcinternals/config-builder";
import { type Format, mergeConfig, type ResolvedConfig } from "tsdown";
import type { TsdownPlugin } from "../models";

type MinimalFormat = Exclude<Format, "es" | "module" | "commonjs">;
type FormatValue = Partial<ResolvedConfig>;
export type MinimalFormatObject = Partial<
	Record<MinimalFormat, boolean | FormatValue>
>;

const getFormatValue = (
	value: WithUndefined<boolean | FormatValue>,
): WithUndefined<FormatValue> => {
	if (value === undefined) return undefined;
	if (value === true) return {};
	if (value === false) return undefined;
	return value;
};

const formatPlugin = (format: MinimalFormatObject): TsdownPlugin<"format"> =>
	definePlugin({
		name: "format",
		apply: (base) => {
			const output = {} as Record<MinimalFormat, FormatValue>;
			const cjs = getFormatValue(format.cjs);
			if (cjs) output.cjs = cjs;
			const esm = getFormatValue(format.esm);
			if (esm) output.esm = esm;
			const iife = getFormatValue(format.iife);
			if (iife) output.iife = iife;
			const umd = getFormatValue(format.umd);
			if (umd) output.umd = umd;

			return mergeConfig(base, {
				format: output,
			});
		},
	});
export default formatPlugin;
