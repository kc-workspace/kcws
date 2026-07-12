import { defineConfig, type TsdownConfig } from "@kcconfigs/tsdown";
import entryPlugin from "@kcconfigs/tsdown/plugins/entry";
import nodePlugin from "@kcconfigs/tsdown/plugins/node";

const config: TsdownConfig = defineConfig(
	entryPlugin(["./src/index.ts", "./src/mockHelpers/index.ts"]),
	nodePlugin(),
);
export default config;
