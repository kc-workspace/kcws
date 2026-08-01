import { defineConfig, type TsdownConfig } from "./src/index";
import { entryPlugin, nodePlugin, unusedPlugin } from "./src/plugins";

const config: TsdownConfig = defineConfig(
	entryPlugin(["./src/index.ts", "./src/plugins/*.ts"]),
	nodePlugin(),
	unusedPlugin({
		ignore: ["publint", "@arethetypeswrong/core", "unplugin-unused", "unrun"],
	}),
);
export default config;
