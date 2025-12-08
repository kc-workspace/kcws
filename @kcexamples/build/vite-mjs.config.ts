import { dts } from "rolldown-plugin-dts";
import { defineConfig, type UserConfig } from "vite";

const config: UserConfig = defineConfig({
	build: {
		outDir: "dist.vite",
		emptyOutDir: true,
		minify: true,
		sourcemap: true,
		lib: {
			entry: {
				index: "./src/index.ts",
			},
			formats: ["es"],
		},
		rolldownOptions: {
			external: [/^[^./]/],
			plugins: [dts({ sourcemap: true, emitDtsOnly: false })],
		},
	},
});

export default config;
