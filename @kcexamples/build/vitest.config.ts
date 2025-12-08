import { defineConfig, type ViteUserConfig } from "vitest/config";

const config: ViteUserConfig = defineConfig({
	test: {
		reporters: ["default", "json", "html", "junit"],
		outputFile: {
			json: "reports/test-results/index.json",
			html: "reports/test-results/index.html",
			junit: "reports/test-results/index.xml",
		},
		coverage: {
			enabled: true,
			provider: "v8",
			reporter: ["text", "lcov", "html", "clover", "json"],
			reportsDirectory: "reports/coverage",
		},
	},
});

export default config;
