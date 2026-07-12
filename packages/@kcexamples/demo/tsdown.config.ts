import { defineConfig, type TsdownConfig } from "@kcconfigs/tsdown";
import nodePlugin from "@kcconfigs/tsdown/plugins/node";
import outputPlugin from "@kcconfigs/tsdown/plugins/output";

const config: TsdownConfig = defineConfig(
	{},
	nodePlugin(),
	outputPlugin("dist.tsdown"),
);
export default config;
