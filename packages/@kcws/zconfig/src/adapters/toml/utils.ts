import { getConfigFiles } from "../_internal";

export const getTomlFiles = (name?: string): string[] =>
	getConfigFiles(["toml"], name);
