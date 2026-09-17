import { describe, expect, test } from "vitest";
import formatSize from "./formatSize";

describe("formatSize", () => {
	test.each([
		{ name: "keeps plain bytes whole", bytes: 512, expected: "512 B" },
		{
			name: "switches to kilobytes at the step",
			bytes: 1024,
			expected: "1.00 KB",
		},
		{
			name: "keeps two decimals above bytes",
			bytes: 1239,
			expected: "1.21 KB",
		},
		{
			name: "switches to megabytes",
			bytes: 5 * 1024 ** 2,
			expected: "5.00 MB",
		},
		{
			name: "moves up a unit when rounding reaches the next step",
			bytes: 1024 ** 2 - 1,
			expected: "1.00 MB",
		},
		{
			name: "stops at the largest unit",
			bytes: 1024 ** 5,
			expected: "1024.00 TB",
		},
		{ name: "formats an empty file", bytes: 0, expected: "0 B" },
		{ name: "formats a negative size", bytes: -1, expected: "0 B" },
		{
			name: "formats a size that is not a number",
			bytes: Number.NaN,
			expected: "0 B",
		},
		{
			name: "formats an infinite size",
			bytes: Number.POSITIVE_INFINITY,
			expected: "0 B",
		},
	])("$name", ({ bytes, expected }) => {
		expect(formatSize(bytes)).toBe(expected);
	});
});
