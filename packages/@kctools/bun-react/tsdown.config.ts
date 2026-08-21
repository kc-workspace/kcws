import { defineConfig, type TsdownConfig } from "@kcconfigs/tsdown";
import {
	formatPlugin,
	nodePlugin,
	unusedPlugin,
} from "@kcconfigs/tsdown/plugins";

const config: TsdownConfig = defineConfig(
	formatPlugin(["esm"]),
	nodePlugin(),
	unusedPlugin({ ignore: ["@types/bun"] }),
);
export default config;
