import { type AttwOptions, mergeConfig } from "tsdown";
import type { EnableOption, TsdownConfig, TsdownPlugin } from "../models";

const isEsm = (config: TsdownConfig): boolean => {
	if (typeof config.format === "string")
		return (
			config.format === "es" ||
			config.format === "esm" ||
			config.format === "module"
		);
	return false;
};

const normalize = (config: TsdownConfig): EnableOption<AttwOptions> => {
	const attw = config.attw;
	// We don't build package for node older than 10
	// https://github.com/arethetypeswrong/arethetypeswrong.github.io/blob/main/docs/problems/NoResolution.md#true-positive-node-10-doesnt-support-packagejson-exports
	const profile = isEsm(config) ? "esm-only" : "node16";
	const baseConfig = {
		profile,
	} satisfies AttwOptions;

	if (attw === undefined || attw === null)
		return {
			enabled: true,
			...baseConfig,
		};
	if (typeof attw === "boolean")
		return {
			enabled: attw,
			...baseConfig,
		};
	if (typeof attw === "string")
		return {
			enabled: attw,
			...baseConfig,
		};
	return {
		enabled: true,
		...baseConfig,
		...attw,
	};
};

const attwNormalize = (): TsdownPlugin<"attw"> => {
	return {
		name: "attw",
		normalize: (config) => {
			const attw = normalize(config);
			return mergeConfig(config, {
				attw: attw.enabled ? attw : { enabled: false },
			});
		},
	};
};
export default attwNormalize;
