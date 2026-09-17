import { describe, expect, test } from "vitest";
import isInside from "./isInside";

describe("isInside", () => {
	test.each([
		{ name: "a direct child", child: "/repo/dist/index.html", expected: true },
		{
			name: "a nested child",
			child: "/repo/dist/assets/app.js",
			expected: true,
		},
		{ name: "the parent itself", child: "/repo/dist", expected: true },
		{
			name: "a sibling directory",
			child: "/repo/src/index.html",
			expected: false,
		},
		{
			name: "a path escaping through a traversal",
			child: "/repo/dist/../secret",
			expected: false,
		},
		{
			name: "a directory with the same prefix",
			child: "/repo/dist-other/index.html",
			expected: false,
		},
	])("returns $expected for $name", ({ child, expected }) => {
		expect(isInside("/repo/dist", child)).toBe(expected);
	});
});
