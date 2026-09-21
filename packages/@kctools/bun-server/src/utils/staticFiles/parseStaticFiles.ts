import type { BunType } from "#types";
import { findDuplicateRoutes } from "#utils/url";
import { logger } from "./constants";
import createStaticSpecs from "./createStaticSpecs";
import resolveStaticSpec from "./resolveStaticSpecs";
import type { ResolvedStatic } from "./types";

const parseStaticFiles = async (
	Bun: BunType,
	options: AnyRecord,
): Promise<ResolvedStatic[]> => {
	const specs = await createStaticSpecs(Bun, options);
	const files = await resolveStaticSpec(Bun, specs);

	const duplicatedRoutes = findDuplicateRoutes(files);
	if (duplicatedRoutes.length > 0) {
		throw new Error(
			`Found duplicated static files: ${duplicatedRoutes.join(", ")}`,
		);
	}

	logger.debug({ length: files.length }, `found ${files.length} static files`);
	return files;
};

export default parseStaticFiles;
