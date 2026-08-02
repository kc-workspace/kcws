import type { ViteUserConfig } from "vitest/config";

const config: ViteUserConfig = {
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
		coverage: {
			enabled: true,
			provider: "v8",
			reporter: [["text"], ["lcovonly"], ["html", { subdir: "html" }]],
			reportsDirectory: "reports/coverage",
			thresholds: {
				perFile: true,
			},
			include: ["src/**/*.{ts,tsx}"],
			exclude: [
				// Ignored test files
				"**/*{.,-}{test,spec}?(-d).?(c|m)[jt]s?(x)",
				// Ignored example files
				"**/*.example.?(c|m)[jt]s?(x)",
			],
		},
	},
};

export default config;
