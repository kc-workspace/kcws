import { defineConfig, type UserConfig } from "./src/index";

const config: UserConfig = defineConfig({
	platform: "node",
	unused: {
		ignore: ["publint", "@arethetypeswrong/core", "unplugin-unused", "unrun"],
	},
});
export default config;
