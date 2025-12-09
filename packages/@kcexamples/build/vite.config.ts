import { defineConfig, type UserConfig } from "vite";

import pkg from "./package.json" with { type: "json" };

const globalName = pkg.name.split("/").pop();

const config: UserConfig = defineConfig({
	build: {
		outDir: "dist.vite",
		minify: true,
		sourcemap: true,
		lib: {
			entry: {
				index: "./src/index.ts",
			},
			name: globalName,
			formats: ["es", "cjs", "iife", "umd"],
		},
		rolldownOptions: {
			external: [/^[^./]/],
		},
	},
});

export default config;
