import { sep as OS_PATH_SEP, relative } from "node:path";
import type { BunType } from "#types";
import { scanFiles } from "#utils/path";
import { toWildcardRoute } from "#utils/url";
import { HTML_EXTENSION, HTML_INDEX, HTML_SEP, logger } from "./constants";
import type { ResolvedRoute, RouteSpec } from "./types";

const resolveRouteSpecs = async (
	Bun: BunType,
	specs: RouteSpec[],
): Promise<ResolvedRoute[]> => {
	const resolved: ResolvedRoute[] = [];
	for (const spec of specs) {
		logger.debug({ spec }, `resolving route spec`);
		const files = await scanFiles(Bun, spec.pattern, {
			cwd: spec.root,
			dot: false,
		});

		const routes = files.map((file) => toResolvedRoute(spec.root, file));
		logger.debug({ routes }, `resolved ${routes.length} routes for route spec`);
		resolved.push(...routes);
	}
	return resolved;
};

const toResolvedRoute = (cwd: string, file: string): ResolvedRoute => {
	const routeName = toRouteName(relative(cwd, file));
	const route: ResolvedRoute = {
		path: file,
		route: routeName,
		wildcard: toWildcardRoute(routeName),
	};
	return route;
};

const toRouteName = (file: string): string => {
	const segments = file
		.replace(HTML_EXTENSION, "")
		.split(OS_PATH_SEP)
		.filter((segment) => segment !== "");

	if (segments.at(-1) === HTML_INDEX) segments.pop();

	if (segments.length === 0) return HTML_SEP;
	else return `${HTML_SEP}${segments.join(HTML_SEP)}`;
};

export default resolveRouteSpecs;
