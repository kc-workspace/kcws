import { defineConfig, type TsdownConfig } from "./src/index";
import entryPlugin from "./src/plugins/entry";
import nodePlugin from "./src/plugins/node";
import unusedPlugin from "./src/plugins/unused";

const config: TsdownConfig = defineConfig(
	entryPlugin(["./src/index.ts", "./src/plugins/*.ts"]),
	nodePlugin(),
	unusedPlugin({
		ignore: ["publint", "@arethetypeswrong/core", "unplugin-unused", "unrun"],
	}),
);
export default config;
