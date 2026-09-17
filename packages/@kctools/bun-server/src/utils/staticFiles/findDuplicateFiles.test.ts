import { describe, expect, test } from "vitest";
import findDuplicateFiles from "./findDuplicateFiles";
import type { ResolvedStatic } from "./types";

const file = (route: string, source: string): ResolvedStatic => ({
	route,
	source,
	target: `/repo/dist${route}`,
});

describe("findDuplicateFiles", () => {
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
		const resolved = routes.map((route, index) =>
			file(route, `/repo/${index}${route}`),
		);

		expect(findDuplicateFiles(resolved)).toEqual(expected);
	});
});
