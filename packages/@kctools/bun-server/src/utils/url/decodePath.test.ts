import { describe, expect, test } from "vitest";
import decodePath from "./decodePath";

describe("decodePath", () => {
	test.each([
		{
			name: "the pathname of the url",
			url: "http://localhost:3000/about",
			expected: "/about",
		},
		{
			name: "the root pathname",
			url: "http://localhost:3000/",
			expected: "/",
		},
		{
			name: "the pathname without the query string and the hash",
			url: "http://localhost:3000/about?a=1#top",
			expected: "/about",
		},
		{
			name: "the decoded pathname",
			url: "http://localhost:3000/my%20file.html",
			expected: "/my file.html",
		},
		{
			name: "undefined when the path contains a null byte",
			url: "http://localhost:3000/a%00b",
			expected: undefined,
		},
		{
			name: "undefined on malformed percent encoding",
			url: "http://localhost:3000/%E0%A4%A",
			expected: undefined,
		},
		{
			name: "undefined when the url cannot be parsed",
			url: "not a url",
			expected: undefined,
		},
	])("returns $name", ({ url, expected }) => {
		expect(decodePath(url)).toBe(expected);
	});
});
