import { defineConfig, type ViteUserConfig } from "vitest/config";

const config: ViteUserConfig = defineConfig({
	test: {
		reporters: ["default", "json", "html", "junit"],
		outputFile: {
			json: "reports/test/index.json",
			html: "reports/test/index.html",
			junit: "reports/test/index.xml",
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
