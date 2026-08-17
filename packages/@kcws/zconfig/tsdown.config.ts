import { defineConfig, type TsdownConfig } from "@kcconfigs/tsdown";
import {
	entryPlugin,
	nodePlugin,
	unusedPlugin,
} from "@kcconfigs/tsdown/plugins";

const config: TsdownConfig = defineConfig(
	nodePlugin(),
	entryPlugin([
		"./src/index.ts",
		"./src/adapters/index.ts",
		"./src/adapters/*/index.ts",
	]),
	unusedPlugin({
		ignore: ["dotenv", "json5", "jsonc-parser", "smol-toml", "yaml"],
	}),
);
export default config;
