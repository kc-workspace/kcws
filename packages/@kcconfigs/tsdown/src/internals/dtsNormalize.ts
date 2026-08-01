import { definePlugin } from "@kcinternals/config-builder";
import type { CIOption } from "tsdown";
import { type DtsOptions, mergeConfig } from "tsdown";
import { normalizePriority } from "../constants";
import type { EnableOption, TsdownConfig, TsdownConfigPlugin } from "../models";

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
			enabled: dts as CIOption,
			...baseConfig,
		};

	return {
		enabled: true,
		...baseConfig,
		...dts,
	};
};

const dtsNormalize = (): TsdownConfigPlugin<"dts"> =>
	definePlugin("dts", {
		configPriority: normalizePriority,
		applyConfig: (config) => {
			const dts = normalize(config);
			return mergeConfig(config, {
				dts: dts.enabled ? dts : { enabled: false },
			});
		},
	});
export default dtsNormalize;
