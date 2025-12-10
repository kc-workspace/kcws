import { defineConfig, type ViteUserConfig } from "vitest/config";

const config: ViteUserConfig = defineConfig({
	test: {
		coverage: {
			enabled: true,
			provider: "v8",
		},
		typecheck: {
			enabled: true,
			only: true,
		},
	},
});

export default config;
