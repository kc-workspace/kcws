import { getConfigFiles } from "../_internal";

export const getAutoFiles = (name?: string): string[] =>
	getConfigFiles(["yaml", "yml", "json5", "jsonc", "json", "toml"], name);
