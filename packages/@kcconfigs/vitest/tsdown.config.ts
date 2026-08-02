import { defineConfig, type TsdownConfig } from "@kcconfigs/tsdown";
import { entryPlugin, nodePlugin } from "@kcconfigs/tsdown/plugins";

const config: TsdownConfig = defineConfig(
	entryPlugin([
		"./src/index.ts",
		"./src/plugins/*.ts",
		"./src/mockHelpers/index.ts",
	]),
	nodePlugin(),
);
export default config;
