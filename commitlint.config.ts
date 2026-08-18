import { defineConfig, type UserConfig } from "@kcconfigs/commitlint";

const config: UserConfig = await defineConfig({
	scopes: ["core", "config", "script", "deps", "deps-dev", "ai"],
});

export default config;
