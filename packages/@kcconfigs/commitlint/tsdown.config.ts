import { defineConfig, type UserConfig } from "@kcconfigs/tsdown";

const config: UserConfig = defineConfig({
	platform: "node",
	// inlineOnly incorrect identify the unused import, so we allow all instead of use whitelist mode
	// ["@commitlint/types", "@commitlint/config-conventional", "conventional-commits-parser"]
	deps: { onlyBundle: false },
});
export default config;
