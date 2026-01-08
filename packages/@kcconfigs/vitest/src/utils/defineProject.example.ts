import { defineProject } from "./defineProject";

// Example with default configuration
defineProject();

// Example with user configuration overrides
defineProject({
	test: {
		dir: "packages",
	},
});
