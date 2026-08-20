import { getConfigFiles } from "../_internal";

export const getJson5Files = (name?: string): string[] =>
	getConfigFiles(["json5"], name);
