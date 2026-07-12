import { definePlugin } from "@kcinternals/config-builder";
import { type AttwOptions, mergeConfig } from "tsdown";
import type { EnableOption, TsdownConfig, TsdownPlugin } from "../models";

const isEsm = (format: TsdownConfig["format"]): boolean => {
	if (typeof format === "string")
		return format === "es" || format === "esm" || format === "module";
	if (Array.isArray(format)) return format.some((f) => isEsm(f));
	if (typeof format === "object" && format !== null) {
		const { es, esm, module } = format;
		return Boolean(es || esm || module);
	}
	return false;
};

const normalize = (config: TsdownConfig): EnableOption<AttwOptions> => {
	const attw = config.attw;
	// We don't build package for node older than 10
	// https://github.com/arethetypeswrong/arethetypeswrong.github.io/blob/main/docs/problems/NoResolution.md#true-positive-node-10-doesnt-support-packagejson-exports
	const profile = isEsm(config.format) ? "esm-only" : "node16";
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

const attwNormalize = (): TsdownPlugin<"attw"> =>
	definePlugin({
		name: "attw",
		normalize: (config) => {
			const attw = normalize(config);
			return mergeConfig(config, {
				attw: attw.enabled ? attw : { enabled: false },
			});
		},
	});
export default attwNormalize;
