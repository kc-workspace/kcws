import { defineConfig, type TsdownConfig } from "@kcconfigs/tsdown";
import nodePlugin from "@kcconfigs/tsdown/plugins/node";
import unusedPlugin from "@kcconfigs/tsdown/plugins/unused";

const config: TsdownConfig = defineConfig(
	{},
	nodePlugin(),
	unusedPlugin({ ignore: ["@types/bun"] }),
);
export default config;
