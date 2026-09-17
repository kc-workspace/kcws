import { describe, expect, test } from "vitest";
import getNextPort from "./getNextPort";

describe("getNextPort", () => {
	test.each([
		{ name: "moves to the next port", port: 3000, expected: 3001 },
		{ name: "normalizes the next port", port: 1000, expected: 1024 },
		{ name: "reaches the highest port", port: 65534, expected: 65535 },
		{ name: "wraps around at the highest port", port: 65535, expected: 80 },
	])("$name", ({ port, expected }) => {
		expect(getNextPort(port)).toBe(expected);
	});
});
