import { defineConfig, type TsdownConfig } from "@kcconfigs/tsdown";
import { nodePlugin, outputPlugin } from "@kcconfigs/tsdown/plugins";

const config: TsdownConfig = defineConfig(
	nodePlugin(),
	outputPlugin("dist.tsdown"),
);
export default config;
