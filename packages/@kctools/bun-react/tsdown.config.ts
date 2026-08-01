import { defineConfig, type TsdownConfig } from "@kcconfigs/tsdown";
import { nodePlugin, unusedPlugin } from "@kcconfigs/tsdown/plugins";

const config: TsdownConfig = defineConfig(
	nodePlugin(),
	unusedPlugin({ ignore: ["@types/bun"] }),
);
export default config;
