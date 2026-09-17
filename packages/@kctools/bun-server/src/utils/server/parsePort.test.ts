import { describe, expect, test } from "vitest";
import parsePort from "./parsePort";

describe("parsePort", () => {
	test.each([
		{ port: "3000", expected: 3000 },
		{ port: "1001", expected: 1024 },
	])("parses the port $port given as string", ({ port, expected }) => {
		expect(parsePort(port)).toBe(expected);
	});

	test.each([
		{ port: 0, expected: 0 },
		{ port: 1, expected: 80 },
		{ port: 80, expected: 80 },
		{ port: 81, expected: 81 },
		{ port: 99, expected: 81 },
		{ port: 100, expected: 443 },
		{ port: 443, expected: 443 },
		{ port: 444, expected: 444 },
		{ port: 999, expected: 444 },
		{ port: 1000, expected: 1000 },
		{ port: 1001, expected: 1024 },
		{ port: 1024, expected: 1024 },
		{ port: 1025, expected: 1025 },
		{ port: 1999, expected: 1025 },
		{ port: 2000, expected: 2000 },
		{ port: 65535, expected: 65535 },
		{ port: -1, expected: 0 },
		{ port: 65536, expected: 0 },
	])("normalizes $port to $expected", ({ port, expected }) => {
		expect(parsePort(port)).toBe(expected);
	});

	test.each([
		{ name: "a word", port: "abc" },
		{ name: "an empty string", port: "" },
		{ name: "an infinite number", port: Number.POSITIVE_INFINITY },
		{ name: "a value that is not a number", port: Number.NaN },
	])("throws on $name", ({ port }) => {
		expect(() => parsePort(port)).toThrow(`Invalid port: ${port}`);
	});
});
