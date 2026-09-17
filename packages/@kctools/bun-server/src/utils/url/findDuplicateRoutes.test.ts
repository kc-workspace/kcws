import { describe, expect, test } from "vitest";
import findDuplicateRoutes from "./findDuplicateRoutes";
import toWildcardRoute from "./toWildcardRoute";
import type { BasicRoute } from "./types";

const file = (route: string): BasicRoute => ({
	route,
	wildcard: toWildcardRoute(route),
});

describe("findDuplicateRoutes", () => {
	test.each([
		{
			name: "every route is unique",
			routes: ["/a.png", "/b.png"],
			expected: [],
		},
		{ name: "there is no file", routes: [], expected: [] },
		{
			name: "two sources write the same route",
			routes: ["/a.png", "/a.png"],
			expected: ["/a.png"],
		},
		{
			name: "several routes are duplicated",
			routes: ["/a.png", "/b.png", "/a.png", "/b.png"],
			expected: ["/a.png", "/b.png"],
		},
	])("finds $expected when $name", ({ routes, expected }) => {
		const resolved = routes.map((route) => file(route));
		expect(findDuplicateRoutes(resolved)).toEqual(expected);
	});
});
