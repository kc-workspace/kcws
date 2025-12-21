import { defineRoot } from "./defineRoot";

// Example usages of defineRoot
defineRoot();

// Example with user configuration overrides
defineRoot({
	test: {
		dir: "packages",
		coverage: {
			thresholds: {
				"100": true,
			},
		},
	},
});
