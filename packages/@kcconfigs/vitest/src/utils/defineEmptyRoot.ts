import { defineConfig } from "vitest/config";
import type { UserConfig } from "../models";
import { mergeConfig } from "./mergeConfig";

export const defineEmptyRoot = (
	...configs: Optional<UserConfig>[]
): UserConfig => {
	return defineConfig(mergeConfig({}, ...configs));
};
