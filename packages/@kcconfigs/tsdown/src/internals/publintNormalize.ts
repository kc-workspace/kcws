import { definePlugin } from "@kcinternals/config-builder";
import type { CIOption } from "tsdown";
import { mergeConfig, type PublintOptions } from "tsdown";
import { normalizePriority } from "../constants";
import type { EnableOption, TsdownConfig, TsdownConfigPlugin } from "../models";

const normalize = (config: TsdownConfig): EnableOption<PublintOptions> => {
	const publint = config.publint;
	const baseConfig = {
		level: "warning",
	} satisfies PublintOptions;

	if (publint === undefined || publint === null)
		return {
			enabled: true,
			...baseConfig,
		};
	if (typeof publint === "boolean")
		return {
			enabled: publint,
			...baseConfig,
		};
	if (typeof publint === "string")
		return {
			enabled: publint as CIOption,
			...baseConfig,
		};

	return {
		enabled: true,
		...baseConfig,
		...publint,
	};
};

const publintNormalize = (): TsdownConfigPlugin<"publint"> =>
	definePlugin("publint", {
		configPriority: normalizePriority,
		applyConfig: (config) => {
			const publint = normalize(config);
			return mergeConfig(config, {
				publint: publint.enabled ? publint : { enabled: false },
			});
		},
	});
export default publintNormalize;
