import type { BunType } from "#types";
import createStaticSpecs from "./createStaticSpecs";
import findDuplicateFiles from "./findDuplicateFiles";
import resolveStaticSpec from "./resolveStaticSpecs";
import type { ResolvedStatic } from "./types";

const parseStaticFiles = async (
	Bun: BunType,
	options: AnyRecord,
): Promise<ResolvedStatic[]> => {
	const specs = await createStaticSpecs(Bun, options);
	const files = await resolveStaticSpec(Bun, specs);

	const duplicatedFiles = findDuplicateFiles(files);
	if (duplicatedFiles.length > 0) {
		throw new Error(
			`Found duplicated static files: ${duplicatedFiles.join(", ")}`,
		);
	}

	return files;
};

export default parseStaticFiles;
