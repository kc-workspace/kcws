import type {
	UserWorkspaceConfig as _ProjectConfig,
	ViteUserConfig as _UserConfig,
} from "vitest/config";

/**
 * Generic configuration type allowing any string keys and values.
 * Used as a flexible type for configuration merging operations.
 */
// biome-ignore lint/suspicious/noExplicitAny: Necessary for generic config type
export type AnyConfig = Record<string, any>;

/**
 * Vitest user configuration type for root workspace setup.
 * Extends Vite's user configuration with Vitest-specific test settings.
 *
 * @see https://vitest.dev/config/
 */
export type UserConfig = _UserConfig;

/**
 * Vitest project configuration type for workspace projects.
 * Extends Vite's workspace config with project-specific test settings.
 *
 * @see https://vitest.dev/config/
 */
export type ProjectConfig = _ProjectConfig;
