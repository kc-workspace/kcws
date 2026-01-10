import { defineConfig, type UserConfig } from "@kcconfigs/tsdown";

const config: UserConfig = defineConfig({
	platform: "node",
	entry: [
		"./src/index.ts",
		"./src/presets/*.ts",
		"./src/plugins/*.ts",
		"./src/themes/*.ts",
		"!./src/**/*.test.ts",
	],
});
export default config;
