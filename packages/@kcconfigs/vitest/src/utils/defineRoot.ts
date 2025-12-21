import { baseRootConfig } from "../constants";
import type { UserConfig } from "../models";
import { defineEmptyRoot } from "./defineEmptyRoot";

/**
 * Defines the root Vitest configuration for the workspace.
 * Merges the base root configuration with any provided user configuration.
 *
 * @param config - Optional user-provided Vitest configuration overrides
 * @returns The merged root Vitest configuration
 *
 * @includeExample
 */
export const defineRoot = (...config: Optional<UserConfig>[]): UserConfig => {
	return defineEmptyRoot(baseRootConfig, ...config);
};
