import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
	defineConfig as _defineConfig,
	type UserConfig as _UserConfig,
} from "tsdown";

type UserConfig = _UserConfig[];

type P = Package;
const a: Nullable<string> = "hello";

/**
 * Defines the configuration for tsdown.
 * @param configs UserConfig for tsdown
 * @returns The merged UserConfig
 */
const defineConfig = (
	config?: _UserConfig,
	...configs: UserConfig
): UserConfig => {
	const pkg = JSON.parse(
		readFileSync(join(process.cwd(), "package.json"), {
			encoding: "utf8",
		}),
	);

	console.log(pkg);

	const globalName = pkg.name.split("/").pop();
	const baseConfig: _UserConfig = {
		entry: ["./src/index.ts"],
		platform: "neutral",
		format: {
			esm: {
				sourcemap: true,
			},
			cjs: {
				sourcemap: true,
			},
			iife: {
				sourcemap: true,
				globalName,
			},
			umd: {
				sourcemap: true,
				globalName,
			},
		},
		dts: {
			sourcemap: true,
			resolve: true,
		},
		outDir: "dist",
		clean: true,
		publint: true,
		...config,
	};

	return _defineConfig([baseConfig].concat(...configs));
};

export { defineConfig };
export type { UserConfig };
