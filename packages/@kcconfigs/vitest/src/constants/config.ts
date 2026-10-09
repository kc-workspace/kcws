import { defineConfig, defineProject } from "vitest/config";
import type { CoverageOptions } from "vitest/node";
import type { ProjectConfig, UserConfig } from "../models";

export const defaultCoverage: CoverageOptions = {
	enabled: true,
	provider: "v8",
	reporter: [["text"], ["lcovonly"], ["html"]],
	reportsDirectory: ".vitest/coverage",
	thresholds: {
		perFile: true,
	},
	include: ["src/**/*.{ts,tsx}"],
	exclude: [
		// Ignored test files
		"**/*{.,-}{test,spec}?(-d).?(c|m)[jt]s?(x)",
		"**/*.{bench,benchmark}.?(c|m)[jt]s?(x)",
		"**/__mocks__/**",
		// Ignored typescript definition files
		"**/*.d.{ts,cts,mts}",
		// Ignored example files
		"**/*.example.?(c|m)[jt]s?(x)",
		// Ignored schema files
		"**/*.schema.?(c|m)[jt]s?(x)",
	],
};

/** @internal */
export const baseRootConfig: UserConfig = defineConfig({
	test: {
		restoreMocks: true,
		mockReset: true,
		unstubGlobals: true,
		unstubEnvs: true,
		environment: "node",
		reporters: ["default", "html", "junit"],
		coverage: defaultCoverage,
	},
});

/** @internal */
export const baseProjectConfig: ProjectConfig = defineProject({});
