import { defineConfig, type UserConfig } from "vite";
import { name } from "./package.json";

const config: UserConfig = defineConfig({
	build: {
		outDir: "dist",
		minify: true,
		sourcemap: true,
		lib: {
			entry: {
				index: "./src/index.ts",
			},
			name: name.split("/").pop(),
			formats: ["es", "cjs", "umd", "iife"],
		},
		rolldownOptions: {
			external: [/^[^./]/],
		},
	},
});

export default config;
