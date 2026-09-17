import { describe, expect, test } from "vitest";
import toWildcardRoute from "./toWildcardRoute";

describe("toWildcardRoute", () => {
	test.each([
		{ name: "the root route", route: "/", expected: "/*" },
		{ name: "a named route", route: "/about", expected: "/about/*" },
		{
			name: "a nested route",
			route: "/blog/first-post",
			expected: "/blog/first-post/*",
		},
		{ name: "a file route", route: "/logo.png", expected: "/logo.png/*" },
	])("appends the wildcard to $name", ({ route, expected }) => {
		expect(toWildcardRoute(route)).toBe(expected);
	});
});
