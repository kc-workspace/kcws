export interface TypeEnum {
	description?: string;
	title?: string;
	emoji?: string;
}

export type TypeObject = Record<string, TypeEnum>;

export type TypeMode = "standard" | "minimal" | string[] | TypeObject;

const STANDARD_TYPES = {
	feat: {
		description: "A new feature",
		title: "Features",
		emoji: "✨",
	},
	perf: {
		description: "A code change that improves performance",
		title: "Performance Improvements",
		emoji: "🚀",
	},
	fix: {
		description: "A bug fix",
		title: "Bugfixes",
		emoji: "🐛",
	},
	docs: {
		description: "Documentation only changes",
		title: "Documentation",
		emoji: "📚",
	},
	test: {
		description: "Adding missing tests or correcting existing tests",
		title: "Tests",
		emoji: "🚨",
	},
	style: {
		description:
			"Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
		title: "Styles",
		emoji: "💎",
	},
	build: {
		description:
			"Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)",
		title: "Builds",
		emoji: "🛠",
	},
	refactor: {
		description: "A code change that neither fixes a bug nor adds a feature",
		title: "Code Refactoring",
		emoji: "📦",
	},
	ci: {
		description:
			"Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)",
		title: "Continuous Integrations",
		emoji: "⚙️",
	},
	chore: {
		description: "Other changes that don't modify src or test files",
		title: "Miscellaneous Chores",
		emoji: "♻️",
	},
	revert: {
		description: "Reverts a previous commit",
		title: "Reverts",
		emoji: "🗑",
	},
} satisfies TypeObject;

/**
 * Retrieves commit types based on the specified mode.
 *
 * Returns a predefined list of commit types for standard or kc modes,
 * or a custom list if an array or object is provided.
 *
 * @param mode - The commit type mode: "standard", "kc", or a custom object
 * @returns Map of type object
 */
export const getTypes = (mode: TypeMode): TypeObject => {
	if (Array.isArray(mode)) {
		return mode.reduce((acc, type) => {
			acc[type] = {};
			return acc;
		}, {} as TypeObject);
	}
	if (typeof mode !== "string") {
		return mode;
	}

	switch (mode) {
		case "standard":
			return STANDARD_TYPES;
		case "minimal":
			return {
				feat: STANDARD_TYPES.feat,
				perf: STANDARD_TYPES.perf,
				fix: STANDARD_TYPES.fix,
				chore: STANDARD_TYPES.chore,
			};
	}
};
