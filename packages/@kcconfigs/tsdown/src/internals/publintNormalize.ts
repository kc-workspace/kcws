import { definePlugin } from "@kcinternals/config-builder";
import { mergeConfig, type PublintOptions } from "tsdown";
import type { EnableOption, TsdownConfig, TsdownPlugin } from "../models";

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
			enabled: publint,
			...baseConfig,
		};

	return {
		enabled: true,
		...baseConfig,
		...publint,
	};
};

const publintNormalize = (): TsdownPlugin<"publint"> =>
	definePlugin({
		name: "publint",
		normalize: (config) => {
			const publint = normalize(config);
			return mergeConfig(config, {
				publint: publint.enabled ? publint : { enabled: false },
			});
		},
	});
export default publintNormalize;
