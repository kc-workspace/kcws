import type { GlobScanOptions } from "bun";
import type { BunType } from "#types";
import { logger } from "./constants";

type ScanFileOption = GlobScanOptions;

/** Scan errors meaning the directory simply is not there. */
const MISSING = new Set(["ENOENT", "ENOTDIR"]);

const scanFiles = async (
	Bun: BunType,
	pattern: string,
	option: ScanFileOption,
): Promise<string[]> => {
	logger.debug(`scanFiles from pattern: "${pattern}"`);
	try {
		const glob = new Bun.Glob(pattern);
		const files = await Array.fromAsync(
			glob.scan({
				absolute: true,
				...option,
			}),
		);
		return files;
	} catch (e) {
		const code = (e as { code?: string }).code;
		if (code !== undefined && MISSING.has(code)) return [];
		throw e;
	}
};
export default scanFiles;
