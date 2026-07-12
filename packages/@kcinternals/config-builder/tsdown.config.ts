import type { UserConfig } from "tsdown";

const config: UserConfig = {
	entry: [
		"./src/index.ts",
		"!./src/**/*.example.ts",
		"!./src/**/*.test.ts",
		"!./src/**/*.spec.ts",
		"!./src/**/*.test-d.ts",
		"!./src/**/*.spec-d.ts",
	],
	format: {
		cjs: {
			sourcemap: true,
		},
		esm: {
			sourcemap: true,
		},
	},
	platform: "node",
	fixedExtension: false,
	outDir: "dist",
	clean: true,
	minify: true,
	failOnWarn: true,
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
		profile: "node16",
	},
};
export default config;
