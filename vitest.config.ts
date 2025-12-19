import { defineRoot } from "@kcconfigs/vitest";

export default defineRoot({
	test: {
		projects: ["packages/**/vitest.config.ts", "!packages/**/.*.old/**"],
	},
});
