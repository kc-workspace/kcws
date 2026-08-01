import { defineConfig, type TsdownConfig } from "@kcconfigs/tsdown";
import { entryPlugin, nodePlugin } from "@kcconfigs/tsdown/plugins";

const config: TsdownConfig = defineConfig(
	nodePlugin(),
	entryPlugin([
		"./src/index.ts",
		"./src/presets/*.ts",
		"./src/plugins/*.ts",
		"./src/themes/*.ts",
	]),
);
export default config;
