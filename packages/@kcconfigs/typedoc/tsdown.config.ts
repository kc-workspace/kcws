import { defineConfig, type TsdownConfig } from "@kcconfigs/tsdown";
import entryPlugin from "@kcconfigs/tsdown/plugins/entry";
import nodePlugin from "@kcconfigs/tsdown/plugins/node";

const config: TsdownConfig = defineConfig(
	{},
	nodePlugin(),
	entryPlugin([
		"./src/index.ts",
		"./src/presets/*.ts",
		"./src/plugins/*.ts",
		"./src/themes/*.ts",
	]),
);
export default config;
