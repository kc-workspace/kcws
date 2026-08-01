import type { PluginPriority } from "@kcinternals/config-builder";
import type { TsdownConfig } from "../models";

export const debugPriority: PluginPriority = Number.NEGATIVE_INFINITY;
export const normalizePriority: PluginPriority = Number.POSITIVE_INFINITY;

export const defaultIgnoreEntry = [
	"!./src/**/*.example.ts",
	"!./src/**/*.test.ts",
	"!./src/**/*.spec.ts",
	"!./src/**/*.test-d.ts",
	"!./src/**/*.spec-d.ts",
] as const;

export const baseConfig: TsdownConfig = {
	entry: ["./src/index.ts", ...defaultIgnoreEntry],
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
