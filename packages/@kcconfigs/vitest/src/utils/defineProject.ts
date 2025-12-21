import { baseProjectConfig, baseRootConfig } from "../constants";
import type { ProjectConfig } from "../models";
import { defineEmptyProject } from "./defineEmptyProject";

/**
 * Defines the root Vitest configuration for the workspace.
 * Merges the base root configuration with any provided user configuration.
 *
 * @param config - Optional user-provided Vitest configuration overrides
 * @returns The merged root Vitest configuration
 *
 * @includeExample
 */
export const defineProject = (
	...config: Optional<ProjectConfig>[]
): ProjectConfig => {
	return defineEmptyProject(baseRootConfig, baseProjectConfig, ...config);
};
