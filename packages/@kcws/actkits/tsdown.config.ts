import { defineConfig, type UserConfig } from "@kcconfigs/tsdown";

const config: UserConfig = defineConfig({
	platform: "node",
	entry: ["src/index.ts", "src/input/index.ts"],
});
export default config;
