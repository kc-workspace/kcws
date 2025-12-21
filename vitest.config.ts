import { defineRoot } from "@kcconfigs/vitest";

export default defineRoot({
	test: {
		projects: ["packages/**/vitest.config.ts", "!packages/**/.*.old/**"],
		coverage: {
			thresholds: {
				branches: 0,
				functions: 0,
				lines: 0,
				statements: 0,
			},
		},
	},
});
