import {
	defineConfig as _defineConfig,
	type UserConfig as _UserConfig,
	type DtsOptions,
} from "tsdown";

/**
 * @public Custom User Config exported from defineConfig function
 */
export type UserConfig = _UserConfig[];

/**
 * @public Defines the configuration for tsdown.
 * @param configs UserConfig for tsdown
 * @returns The merged UserConfig
 */
export const defineConfig = (
	config?: _UserConfig,
	...configs: UserConfig
): UserConfig => {
	const { dts, ...rest } = config ?? ({} as _UserConfig);
	const baseConfig: _UserConfig = {
		entry: ["./src/index.ts"],
		platform: "neutral",
		fixedExtension: false,
		format: {
			esm: {
				sourcemap: true,
			},
			cjs: {
				sourcemap: true,
			},
		},
		dts:
			typeof dts === "boolean"
				? dts
				: {
						sourcemap: true,
						resolve: true,
						...(dts as DtsOptions),
					},
		outDir: "dist",
		clean: true,
		publint: true,
		...rest,
	};

	return _defineConfig([baseConfig].concat(...configs));
};
