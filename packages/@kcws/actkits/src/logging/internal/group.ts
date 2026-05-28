import { coreEndGroup, coreStartGroup } from "./core";
import type { Getter } from "./types";

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

export const groupSync = <T>(title: string, run: Getter<T>): T => {
	coreStartGroup(title);
	try {
		const result = run();
		return result;
	} finally {
		coreEndGroup();
	}
};
