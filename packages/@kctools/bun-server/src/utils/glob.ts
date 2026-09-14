import type * as Bun from "bun";

/** Scan errors meaning the directory simply is not there. */
const MISSING = new Set(["ENOENT", "ENOTDIR"]);

/**
 * List the files matching a pattern below `root`, treating a missing directory
 * as empty.
 *
 * A directory that is not there is a normal outcome for both the pages and the
 * static files a command is pointed at, and the caller reports it in its own
 * words. Any other failure is a real problem and stays a failure.
 *
 * @param bun - Bun runtime namespace
 * @param root - absolute path of the directory to scan
 * @param pattern - glob pattern matched below `root`
 * @returns absolute paths of the matched files
 */
export const scanFiles = (
	bun: typeof Bun,
	root: string,
	pattern: string,
): string[] => {
	try {
		return [
			...new bun.Glob(pattern).scanSync({
				cwd: root,
				absolute: true,
				onlyFiles: true,
			}),
		];
	} catch (e) {
		const code = (e as { code?: string }).code;
		if (code !== undefined && MISSING.has(code)) return [];
		throw e;
	}
};
