import { defineConfig, type UserConfig } from "@kcconfigs/tsdown";

const config: UserConfig = defineConfig({
	entry: ["./src/index.ts", "./src/configs/*.ts", "./src/presets/*.ts"],
	minify: false,
	unused: {
		ignore: [
			"textlint",
			"textlint-filter-rule-comments",
			"textlint-filter-rule-allowlist",
		],
	},
});
export default config;
