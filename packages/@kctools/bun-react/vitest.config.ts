import { defineProject, setupMocks } from "@kcconfigs/vitest";

const config = defineProject({
	test: {
		setupFiles: setupMocks({
			console: true,
		}),
	},
});
export default config;
