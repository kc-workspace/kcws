import { getConfigFiles } from "../_internal";

export const getYamlFiles = (name?: string): string[] =>
	getConfigFiles(["yaml", "yml"], name);
