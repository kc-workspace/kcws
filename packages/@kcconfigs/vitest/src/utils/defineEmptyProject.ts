import { defineProject } from "vitest/config";
import type { ProjectConfig } from "../models";
import { mergeConfig } from "./mergeConfig";

export const defineEmptyProject = (
	...configs: Optional<ProjectConfig>[]
): ProjectConfig => {
	return defineProject(mergeConfig({}, ...configs));
};
