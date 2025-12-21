import { defineProject, setupMocks } from "@kcconfigs/vitest";

export default defineProject({
	test: {
		setupFiles: setupMocks({
			fs: true,
			fsPromises: true,
			process: true,
			os: true,
		}),
	},
});
