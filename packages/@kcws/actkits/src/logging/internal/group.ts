import { coreEndGroup, coreStartGroup } from "./core";
import type { Getter } from "./types";

/**
 * Executes an async function within a log group and always closes the group.
 */
export const group = async <T>(
	title: string,
	run: Getter<Promise<T>>,
): Promise<T> => {
	coreStartGroup(title);
	try {
		const result = await run();
		return result;
	} finally {
		coreEndGroup();
	}
};

/**
 * Executes a sync function within a log group and always closes the group.
 */
export const groupSync = <T>(title: string, run: Getter<T>): T => {
	coreStartGroup(title);
	try {
		const result = run();
		return result;
	} finally {
		coreEndGroup();
	}
};
