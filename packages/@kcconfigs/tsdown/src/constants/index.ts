import type { TsdownConfig } from "../models";

export const baseConfig: TsdownConfig = {
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
	},
};
