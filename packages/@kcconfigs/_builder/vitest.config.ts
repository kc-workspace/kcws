import { defineProject, setupMocks } from "@kcconfigs/vitest";

export default defineProject({
	test: {
		setupFiles: setupMocks({ console: true }),
	},
});
