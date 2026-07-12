import { defineConfig, type TsdownConfig } from "@kcconfigs/tsdown";
import entryPlugin from "@kcconfigs/tsdown/plugins/entry";
import unusedPlugin from "@kcconfigs/tsdown/plugins/unused";

const config: TsdownConfig = defineConfig(
	{},
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
