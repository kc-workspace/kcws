import { defineConfig, type TsdownConfig } from "@kcconfigs/tsdown";
import entryPlugin from "@kcconfigs/tsdown/plugins/entry";
import formatPlugin from "@kcconfigs/tsdown/plugins/format";
import nodePlugin from "@kcconfigs/tsdown/plugins/node";

const config: TsdownConfig = defineConfig(
	{},
	nodePlugin(),
	entryPlugin(["src/index.ts", "src/*/index.ts"]),
	formatPlugin(["esm"]),
);
export default config;
