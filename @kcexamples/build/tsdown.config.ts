import { defineConfig, type UserConfig } from "@kcconfigs/tsdown";

const config: UserConfig = defineConfig({
	platform: "node",
	outDir: "dist.tsdown",
});
export default config;
