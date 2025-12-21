import { baseProjectConfig, baseRootConfig } from "../constants";
import type { ProjectConfig, UserConfig } from "../models";
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
export const defineProjectOrRoot = (
	...config: Optional<UserConfig>[]
): ProjectConfig => {
	return defineEmptyRoot(baseRootConfig, baseProjectConfig, ...config);
};
