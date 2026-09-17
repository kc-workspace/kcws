import { basename, dirname, sep as OS_PATH_SEP, resolve } from "node:path";
import type { BunType } from "#types";
import { logger, STATIC_GLOB_MAGIC } from "./constants";

interface SplitPathResult {
	root: string;
	pattern: string;
}

const createResult = (
	source: string,
	describe: string,
	result: SplitPathResult,
): SplitPathResult => {
	logger.debug({ source, result }, describe);
	return result;
};

/**
 * Split a source into the directory it is rooted at and the pattern below it.
 */
const splitPath = async (
	Bun: BunType,
	source: string,
	cwd: string,
	defaultPattern: string = "**/*",
): Promise<SplitPathResult> => {
	const segments = source.split(OS_PATH_SEP);
	const magic = segments.findIndex((segment) =>
		STATIC_GLOB_MAGIC.test(segment),
	);

	if (magic >= 0) {
		return createResult(source, "found regex from source", {
			root: segments.slice(0, magic).join(OS_PATH_SEP),
			pattern: segments.slice(magic).join(OS_PATH_SEP),
		});
	}

	const exist = await Bun.file(resolve(cwd, source)).exists();
	if (exist) {
		return createResult(source, "found source file, using it as is", {
			root: dirname(source),
			pattern: basename(source),
		});
	} else {
		return createResult(source, "use source as directory + default pattern", {
			root: source,
			pattern: defaultPattern,
		});
	}
};

export default splitPath;
