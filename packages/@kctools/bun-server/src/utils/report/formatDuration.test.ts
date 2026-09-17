import { describe, expect, test } from "vitest";
import formatDuration from "./formatDuration";

describe("formatDuration", () => {
	test.each([
		{ ms: 231, expected: "231ms" },
		{ ms: 231.6, expected: "232ms" },
		{ ms: 999, expected: "999ms" },
		{ ms: 1000, expected: "1.00s" },
		{ ms: 1543, expected: "1.54s" },
		{ ms: 0, expected: "0ms" },
		{ ms: -1, expected: "0ms" },
		{ ms: Number.NaN, expected: "0ms" },
		{ ms: Number.POSITIVE_INFINITY, expected: "0ms" },
	])("formats $ms as $expected", ({ ms, expected }) => {
		expect(formatDuration(ms)).toBe(expected);
	});
});
