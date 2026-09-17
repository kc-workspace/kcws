import { describe, expect, test } from "vitest";
import findDuplicateRoutes from "./findDuplicateRoutes";
import type { ResolvedRoute } from "./types";

const route = (route: string, path = `/repo${route}.html`): ResolvedRoute => ({
	path,
	route,
	wildcard: `${route}/*`,
});

describe("findDuplicateRoutes", () => {
	test.each([
		{ name: "every route is unique", routes: ["/a", "/b"], expected: [] },
		{ name: "there is no route", routes: [], expected: [] },
		{
			name: "two files answer the same route",
			routes: ["/a", "/a"],
			expected: ["/a"],
		},
		{
			name: "a route is repeated three times",
			routes: ["/a", "/a", "/a"],
			expected: ["/a"],
		},
		{
			name: "several routes are duplicated",
			routes: ["/a", "/b", "/a", "/b"],
			expected: ["/a", "/b"],
		},
	])("finds $expected when $name", ({ routes, expected }) => {
		const resolved = routes.map((name, index) =>
			route(name, `/repo/${index}.html`),
		);

		expect(findDuplicateRoutes(resolved)).toEqual(expected);
	});
});
