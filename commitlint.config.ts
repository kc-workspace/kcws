import { type CommitlintConfig, defineConfig } from "@kcconfigs/commitlint";
import { autoScopePlugin } from "@kcconfigs/commitlint/plugins";

const config: CommitlintConfig = await defineConfig(
	autoScopePlugin(["core", "config", "script", "deps", "deps-dev", "ai"]),
);

export default config;
