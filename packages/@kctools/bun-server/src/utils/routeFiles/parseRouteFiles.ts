import type { BunType } from "#types";
import { findDuplicateRoutes } from "#utils/url";
import createRouteSpecs from "./createRouteSpecs";
import resolveRouteSpecs from "./resolveRouteSpecs";
import type { ResolvedRoute } from "./types";

const parseRouteFiles = async (
	Bun: BunType,
	inputs: string[],
	option: AnyRecord,
): Promise<ResolvedRoute[]> => {
	const specs = await createRouteSpecs(Bun, inputs, option);
	const routes = await resolveRouteSpecs(Bun, specs);

	const duplicatedRoutes = findDuplicateRoutes(routes);
	if (duplicatedRoutes.length > 0) {
		throw new Error(`Found duplicated routes: ${duplicatedRoutes.join(", ")}`);
	}

	return routes;
};
export default parseRouteFiles;
