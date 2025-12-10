import { defineConfig, type UserConfig } from "@kcconfigs/commitlint";

const config: UserConfig = await defineConfig({
	scopes: ["core", "config", "script", "deps", "deps-dev"],
});

export default config;
