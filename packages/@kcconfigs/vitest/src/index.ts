import {
	defineConfig as _defineConfig,
	defineProject as _defineProject,
	mergeConfig,
	type UserWorkspaceConfig as ProjectConfig,
	type ViteUserConfig as UserConfig,
} from "vitest/config";

const baseConfig: UserConfig = {
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
};

export const defineRoot = (config?: UserConfig): UserConfig => {
	return mergeConfig(baseConfig, _defineConfig(config ?? {}));
};

export const defineProject = (config?: ProjectConfig): ProjectConfig => {
	return mergeConfig(baseConfig, _defineProject(config ?? {}));
};

export type { UserConfig, ProjectConfig };
