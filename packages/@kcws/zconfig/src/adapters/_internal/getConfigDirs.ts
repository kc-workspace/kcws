import { homedir } from "node:os";
import { cwd } from "node:process";

/**
 * Returns the default directories to search for configuration files.
 * @returns An array of default directories
 */
const getConfigDirs = (): string[] => {
	return [cwd(), homedir()];
};
export default getConfigDirs;
