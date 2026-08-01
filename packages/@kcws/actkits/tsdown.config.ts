import { defineConfig, type TsdownConfig } from "@kcconfigs/tsdown";
import {
	entryPlugin,
	formatPlugin,
	nodePlugin,
} from "@kcconfigs/tsdown/plugins";

const config: TsdownConfig = defineConfig(
	nodePlugin(),
	entryPlugin(["src/index.ts", "src/*/index.ts"]),
	formatPlugin(["esm"]),
);
export default config;
