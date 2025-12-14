import {
	defineConfig as _defineConfig,
	defineProject as _defineProject,
	mergeConfig,
	type UserWorkspaceConfig as ProjectConfig,
	type ViteUserConfig as UserConfig,
} from "vitest/config";

const baseConfig: UserConfig = {
	test: {
		reporters: ["default", "html", "junit"],
		outputFile: {
			html: "reports/test-results/index.html",
			junit: "reports/test-results/junit.xml",
		},
		coverage: {
			enabled: true,
			provider: "v8",
			reporter: ["text", "lcov", "html"],
			reportsDirectory: "reports/coverage",
			include: ["src/**/*.{ts,tsx}"],
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
