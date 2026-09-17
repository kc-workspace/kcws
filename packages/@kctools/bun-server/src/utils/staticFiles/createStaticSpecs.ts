import { isAbsolute, normalize, sep as OS_PATH_SEP, resolve } from "node:path";
import type { BunType } from "#types";
import { readOptions } from "#utils/options";
import { splitPath } from "#utils/path";
import { logger, STATIC_SEPARATOR } from "./constants";
import type { StaticSpec } from "./types";

const createStaticSpecs = async (
	Bun: BunType,
	options: AnyRecord,
): Promise<StaticSpec[]> => {
	const specs: StaticSpec[] = [];
	const cwd = readOptions<string>(options, "cwd");
	const statics = readOptions<string[]>(options, "statics");
	const out = readOptions<string | undefined>(options, "out");

	logger.debug({ statics }, "processing static items to spec");
	for (const item of statics) {
		const separator = item.lastIndexOf(STATIC_SEPARATOR);
		const source = separator === -1 ? item : item.slice(0, separator);
		const written = separator === -1 ? undefined : item.slice(separator + 1);

		const { root, pattern } = await splitPath(Bun, source, cwd);
		if (written === undefined && isAbsolute(root)) {
			throw new Error(
				`Static source ${source} needs an explicit target: ${source}:<target>`,
			);
		}

		const target = normalize(written ?? root);
		if (escapeDir(target)) {
			throw new Error(
				`Static target ${written ?? target} escapes the output directory`,
			);
		}

		const targets = [cwd, out].filter((s) => typeof s === "string");
		const spec: StaticSpec = {
			source,
			root: resolve(cwd, root),
			pattern,
			target: {
				base: resolve(...targets),
				dirname: target,
			},
		};
		logger.debug({ spec }, "created static spec");
		specs.push(spec);
	}

	if (specs.length > 0) {
		logger.debug({ length: specs.length }, "created all static specs");
	} else {
		logger.debug("no static specs were created");
	}

	return specs;
};

/** Whether a normalized target reaches outside the output directory. */
const escapeDir = (target: string): boolean =>
	target === ".." ||
	target.startsWith(`..${OS_PATH_SEP}`) ||
	isAbsolute(target);

export default createStaticSpecs;
