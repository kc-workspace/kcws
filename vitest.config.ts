import { defineRoot } from "@kcconfigs/vitest";

export default defineRoot({
	test: {
		projects: [
			"packages/**/vitest.config.ts",
			"packages/@kcexamples/*/vitest.config.ts",
			"packages/@kcinternals/*/vitest.config.ts",
			"packages/@kctools/*/vitest.config.ts",
			"packages/@kctypes/*/vitest.config.ts",
			"packages/@kcutils/*/vitest.config.ts",
			"packages/@kcws/*/vitest.config.ts",
			"!packages/**/.*.old/**",
		],
	},
});
