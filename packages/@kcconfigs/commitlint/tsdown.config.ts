import { defineConfig, type TsdownConfig } from "@kcconfigs/tsdown";
import { depsPlugin, nodePlugin } from "@kcconfigs/tsdown/plugins";

const config: TsdownConfig = defineConfig(
	nodePlugin(),
	// inlineOnly incorrect identify the unused import, so we allow all instead of use whitelist mode
	// ["@commitlint/types", "@commitlint/config-conventional", "conventional-commits-parser"]
	depsPlugin({ onlyBundle: false, neverBundle: ["picocolors"] }),
);
export default config;
