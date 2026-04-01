import { defineConfig, type UserConfig } from "@kcconfigs/tsdown";

const config: UserConfig = defineConfig({
	platform: "node",
	unused: {
		ignore: ["@types/bun"],
	},
});

export default config;
