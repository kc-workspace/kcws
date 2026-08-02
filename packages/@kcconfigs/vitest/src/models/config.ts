import type {
	UserWorkspaceConfig as _ProjectConfig,
	ViteUserConfig as _UserConfig,
} from "vitest/config";

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
 * Project configuration is a subset of the root configuration,
 * allowing for project-specific overrides.
 *
 * @see https://vitest.dev/config/
 */
export type ProjectConfig = _ProjectConfig;

/**
 * Vite + Vitest configuration type that can be either a root or project configuration.
 */
export type AnyConfig = UserConfig | ProjectConfig;
