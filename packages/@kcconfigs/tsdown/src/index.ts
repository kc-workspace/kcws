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
	config?: UserConfig,
	...configs: UserConfig[]
): UserConfig => {
	const { format: _format, dts: _dts, ...rest } = config ?? ({} as UserConfig);

	const baseConfig: _UserConfig = {
		entry: [
			"./src/index.ts",
			"!./src/**/*.example.ts",
			"!./src/**/*.test.ts",
			"!./src/**/*.spec.ts",
			"!./src/**/*.test-d.ts",
			"!./src/**/*.spec-d.ts",
		],
		platform: "neutral",
		fixedExtension: false,
		outDir: "dist",
		clean: true,
		minify: true,
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
	};

	const format = defineFormat(_format);
	if (format) baseConfig.format = format;

	const dts = defineDts(_dts);
	if (dts) baseConfig.dts = dts;

	return [rest, ...configs].reduce(
		(prev, curr) => _mergeConfig(prev, curr),
		baseConfig,
	);
};
