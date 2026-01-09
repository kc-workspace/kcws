import {
	mergeConfig as _mergeConfig,
	type UserConfig as _UserConfig,
} from "tsdown";
import { defineDts } from "./utils/defineDts";
import { defineFormat } from "./utils/defineFormat";

/**
 * @public Custom User Config exported from defineConfig function
 */
export type UserConfig = _UserConfig;

/**
 * @public Defines the configuration for tsdown.
 * @param configs UserConfig for tsdown
 * @returns The merged UserConfig
 */
export const defineConfig = (
	config?: _UserConfig,
	...configs: UserConfig[]
): UserConfig => {
	const { format, dts, ...rest } = config ?? ({} as _UserConfig);

	const baseConfig: _UserConfig = {
		entry: ["./src/index.ts"],
		platform: "neutral",
		fixedExtension: false,
		outDir: "dist",
		clean: true,
		publint: {
			enabled: true,
			level: "warning",
		},
		unused: {
			enabled: true,
			level: "warning",
			depKinds: ["dependencies", "peerDependencies"],
		},
		attw: {
			enabled: true,
			level: "error",
			// We don't build package for node older than 10
			// https://github.com/arethetypeswrong/arethetypeswrong.github.io/blob/main/docs/problems/NoResolution.md#true-positive-node-10-doesnt-support-packagejson-exports
			profile: "node16",
		},
		format: defineFormat(format),
		dts: defineDts(dts),
	};

	return [rest, ...configs].reduce(_mergeConfig, baseConfig);
};
