import { defineConfig, type UserConfig } from "@kcconfigs/tsdown";

const config: UserConfig = defineConfig({
	platform: "node",
	entry: ["src/index.ts", "src/*/index.ts"],
	format: ["esm"],
});
export default config;
