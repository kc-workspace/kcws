import { defineConfig, type TsdownConfig } from "@kcconfigs/tsdown";
import { entryPlugin, unusedPlugin } from "@kcconfigs/tsdown/plugins";

const config: TsdownConfig = defineConfig(
	entryPlugin(["./src/index.ts", "./src/configs/*.ts", "./src/presets/*.ts"]),
	unusedPlugin({
		ignore: [
			"textlint",
			"textlint-filter-rule-comments",
			"textlint-filter-rule-allowlist",
		],
	}),
);
export default config;
