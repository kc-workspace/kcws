import type { ResolvedRoute } from "./types";

const findDuplicateRoutes = (routes: ResolvedRoute[]): string[] => {
	const seen = new Set<string>();
	const duplicates = new Set<string>();

	for (const route of routes) {
		if (seen.has(route.route)) duplicates.add(route.route);
		else seen.add(route.route);
	}
	return Array.from(duplicates);
};

export default findDuplicateRoutes;
