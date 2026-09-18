import {
	RuleConfigSeverity as Severity,
	type UserConfig,
} from "@commitlint/types";
import type { PluginPriority } from "@kcinternals/config-builder";
import type { MinimalType, StandardType, TypeEnum } from "../types";

/** Setting priority used by the debug plugin so it runs before anything else. */
export const debugPriority: PluginPriority = Number.NEGATIVE_INFINITY;
/** Config priority used by the override plugin so it runs after built-in plugins. */
export const overridePriority: PluginPriority = 1000;

/** Conventional commit types with prompt metadata. */
export const STANDARD_TYPES: Record<StandardType, TypeEnum> = {
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
};

/** Subset of {@link STANDARD_TYPES} used by the `"minimal"` type mode. */
export const MINIMAL_TYPES: Record<MinimalType, TypeEnum> = {
	feat: STANDARD_TYPES.feat,
	perf: STANDARD_TYPES.perf,
	fix: STANDARD_TYPES.fix,
	chore: STANDARD_TYPES.chore,
};

/** Scopes used when neither auto-detection nor user scopes produce any value. */
export const DEFAULT_SCOPES: readonly string[] = [
	"core",
	"config",
	"script",
	"deps",
	"deps-dev",
];

/**
 * Base commitlint configuration every {@link defineConfig} call starts from.
 * Types and scopes are provided by plugins.
 *
 * @internal
 */
export const baseConfig: UserConfig = {
	helpUrl: "use 'pnpm commit' to create commit instead",
	parserPreset: "@commitlint/config-conventional",
	rules: {
		"subject-max-length": [Severity.Warning, "always", 80],
		"body-max-line-length": [Severity.Warning, "always", 300],
	},
	prompt: {
		settings: {
			enableMultipleScopes: false,
		},
	},
};
