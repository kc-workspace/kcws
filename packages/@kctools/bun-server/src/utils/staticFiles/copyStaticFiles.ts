import type { BunType } from "#types";
import type { ReportedFile } from "#utils/report";
import type { ResolvedStatic } from "./types";

const copyStaticFiles = async (
	Bun: BunType,
	statics: ResolvedStatic[],
): Promise<ReportedFile[]> => {
	const results = await Promise.all(
		statics.map(async (file) => ({
			path: file.target,
			bytes: await Bun.write(file.target, Bun.file(file.source)),
		})),
	);
	return results.map(({ path, bytes }) => ({
		path,
		size: bytes,
		kind: "static",
	}));
};

export default copyStaticFiles;
