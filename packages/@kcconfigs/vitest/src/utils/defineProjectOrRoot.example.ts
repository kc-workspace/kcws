import { defineProjectOrRoot } from "./defineProjectOrRoot";

// Example with default configuration
defineProjectOrRoot();

// Example with user configuration overrides
defineProjectOrRoot({
	test: {
		dir: "packages",
	},
});

// Example with multiple user configuration overrides
defineProjectOrRoot(
	{
		test: {
			dir: "packages",
			coverage: {
				thresholds: {
					"100": true,
				},
			},
		},
	},
	{
		test: {
			dir: "libs",
		},
	},
);
