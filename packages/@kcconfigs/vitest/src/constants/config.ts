import { defineConfig, defineProject } from "vitest/config";
import type { CoverageOptions } from "vitest/node";
import type { ProjectConfig, UserConfig } from "../models";

export const defaultCoverage: CoverageOptions = {
	enabled: true,
	provider: "v8",
	reporter: [["text"], ["lcovonly"], ["html", { subdir: "html" }]],
	reportsDirectory: "reports/coverage",
	thresholds: {
		perFile: true,
	},
	include: ["**/*.{ts,tsx}"],
	exclude: [
		// Ignored hidden files
		"**/[.]**",
		// Ignored test files
		"**/*{.,-}{test,spec}?(-d).?(c|m)[jt]s?(x)",
		"**/__mocks__/**",
		// Ignored dist files
		"**/dist/**",
		// Ignored typescript definition files
		"**/*.d.{ts,cts,mts}",
		// Ignored example files
		"**/*.example.?(c|m)[jt]s?(x)",
		// Ignored configuration files
		"**/*.config.?(c|m)[jt]s?(x)",
		// Ignored schema files
		"**/*.schema.?(c|m)[jt]s?(x)",
	],
};

/** @internal */
export const baseRootConfig: UserConfig = defineConfig({
	test: {
		restoreMocks: true,
		mockReset: true,
		clearMocks: true,
		unstubGlobals: true,
		unstubEnvs: true,
		environment: "node",
		reporters: ["default", "html", "junit"],
		outputFile: {
			html: "reports/test-results/index.html",
			junit: "reports/test-results/junit.xml",
		},
		coverage: defaultCoverage,
	},
});

/** @internal */
export const baseProjectConfig: ProjectConfig = defineProject({});
