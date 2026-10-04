import { join } from "node:path";
import type { BunType } from "#types";
import { readOptions } from "#utils/options";
import { splitPath } from "#utils/path";
import { logger } from "./constants";
import type { RouteSpec } from "./types";

const createRouteSpecs = async (
	Bun: BunType,
	inputs: string[],
	option: AnyRecord,
): Promise<RouteSpec[]> => {
	logger.debug({ inputs }, "processing route inputs to specs");

	const cwd = readOptions<string>(option, "cwd");
	const specs: RouteSpec[] = [];
	if (inputs.length === 0) {
		specs.push(...useDefault(cwd));
	}
	const created = await Promise.all(
		inputs.map(async (input): Promise<RouteSpec> => {
			const { root, pattern } = await splitPath(Bun, input, cwd, "**/*.html");
			const spec: RouteSpec = {
				source: input,
				root: join(cwd, root),
				pattern,
			};
			logger.debug({ spec }, "created route spec");
			return spec;
		}),
	);
	specs.push(...created);
	logger.debug({ length: specs.length }, "created all route specs");
	return specs;
};

const useDefault = (cwd: string): RouteSpec[] => {
	return [
		{
			source: "<default>",
			root: join(cwd, "src", "routes"),
			pattern: "**/*.html",
		},
	];
};

export default createRouteSpecs;
