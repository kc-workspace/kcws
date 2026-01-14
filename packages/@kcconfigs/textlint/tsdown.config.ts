import { defineConfig, type UserConfig } from "@kcconfigs/tsdown";

const config: UserConfig = defineConfig({
	entry: ["./src/index.ts", "./src/presets/*.ts"],
	minify: false,
	unused: {
		ignore: ["textlint-filter-rule-comments", "textlint-filter-rule-allowlist"],
	},
});
export default config;
