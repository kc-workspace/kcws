import { describe, expect, test } from "vitest";
import formatPath from "./formatPath";

describe("formatPath", () => {
	test.each([
		{
			name: "shortens a path inside the working directory",
			path: "/repo/dist/index.html",
			expected: "dist/index.html",
		},
		{
			name: "keeps the working directory itself",
			path: "/repo",
			expected: "/repo",
		},
		{
			name: "keeps a path outside the working directory",
			path: "/other/index.html",
			expected: "/other/index.html",
		},
	])("$name", ({ path, expected }) => {
		expect(formatPath(path, "/repo")).toBe(expected);
	});
});
