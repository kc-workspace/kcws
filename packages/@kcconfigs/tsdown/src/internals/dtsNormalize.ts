import { definePlugin } from "@kcinternals/config-builder";
import { type DtsOptions, mergeConfig } from "tsdown";
import type { EnableOption, TsdownConfig, TsdownPlugin } from "../models";

const normalize = (config: TsdownConfig): EnableOption<DtsOptions> => {
	const dts = config.dts;
	const baseConfig = {
		sourcemap: true,
	} satisfies DtsOptions;

	if (dts === undefined || dts === null)
		return {
			enabled: true,
			...baseConfig,
		};
	if (typeof dts === "boolean")
		return {
			enabled: dts,
			...baseConfig,
		};
	if (typeof dts === "string")
		return {
			enabled: dts,
			...baseConfig,
		};

	return {
		enabled: true,
		...baseConfig,
		...dts,
	};
};

const dtsNormalize = (): TsdownPlugin<"dts"> =>
	definePlugin({
		name: "dts",
		normalize: (config) => {
			const dts = normalize(config);
			return mergeConfig(config, {
				dts: dts.enabled ? dts : { enabled: false },
			});
		},
	});
export default dtsNormalize;
