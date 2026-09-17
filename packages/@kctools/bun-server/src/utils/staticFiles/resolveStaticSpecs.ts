import { join, sep as OS_PATH_SEP, relative, resolve } from "node:path";
import type { BunType } from "#types";
import { scanFiles } from "#utils/path";
import { logger } from "./constants";
import type { ResolvedStatic, StaticSpec } from "./types";

const resolveStaticSpec = async (
	Bun: BunType,
	specs: StaticSpec[],
): Promise<ResolvedStatic[]> => {
	const resolved: ResolvedStatic[] = [];
	for (const spec of specs) {
		logger.debug({ spec }, "resolving static spec");
		const files = await scanFiles(Bun, spec.pattern, {
			cwd: spec.root,
			dot: true,
		});

		const statics = files.map((file) => toResolvedStatic(file, spec));
		logger.debug(
			{ statics },
			`resolved ${statics.length} static files for static spec`,
		);
		resolved.push(...statics);
	}

	return resolved;
};

const toResolvedStatic = (file: string, spec: StaticSpec): ResolvedStatic => {
	const fileName = relative(spec.root, file);
	const segments = join(spec.target.dirname, fileName)
		.split(OS_PATH_SEP)
		.filter((segment) => segment !== "");
	const route = segments.length === 0 ? "/" : `/${segments.join("/")}`;
	return {
		route,
		source: file,
		target: resolve(spec.target.base, spec.target.dirname, fileName),
	};
};

export default resolveStaticSpec;
