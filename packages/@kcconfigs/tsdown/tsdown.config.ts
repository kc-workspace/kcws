import { defineConfig } from "./src/index";
import nodePlugin from "./src/plugins/node";
import unusedPlugin from "./src/plugins/unused";

const config = defineConfig(
	nodePlugin(),
	unusedPlugin({
		ignore: ["publint", "@arethetypeswrong/core", "unplugin-unused", "unrun"],
	}),
);
export default config;
