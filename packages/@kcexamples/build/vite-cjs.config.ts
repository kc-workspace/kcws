import { defineConfig, type UserConfig } from "vite";
import { name } from "./package.json";

const config: UserConfig = defineConfig({
	build: {
		outDir: "dist.vite",
		emptyOutDir: false,
		minify: true,
		sourcemap: true,
		lib: {
			entry: {
				index: "./src/index.ts",
			},
			name: name.split("/").pop(),
			formats: ["cjs", "iife", "umd"],
		},
		rolldownOptions: {
			external: [/^[^./]/],
		},
	},
});

export default config;
