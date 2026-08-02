import { defineRootConfig } from "@kcconfigs/vitest";
import { coveragePlugin } from "@kcconfigs/vitest/plugins";

export default defineRootConfig(
	["packages/**/vitest.config.ts", "!packages/**/.*.old/**"],
	coveragePlugin({
		thresholds: {
			branches: 0,
			functions: 0,
			lines: 0,
			statements: 0,
		},
	}),
);
