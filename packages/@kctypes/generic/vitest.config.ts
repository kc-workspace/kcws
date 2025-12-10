import { defineConfig, type ViteUserConfig } from "vitest/config";

const config: ViteUserConfig = defineConfig({
	test: {
		typecheck: {
			enabled: true,
			only: true,
		},
	},
});

export default config;
