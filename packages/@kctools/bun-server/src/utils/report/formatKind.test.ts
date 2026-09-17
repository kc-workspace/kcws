import { describe, expect, test } from "vitest";
import formatKind from "./formatKind";

describe("formatKind", () => {
	test.each([
		{ kind: "entry-point", expected: "entry" },
		{ kind: "chunk", expected: "chunk" },
		{ kind: "asset", expected: "asset" },
		{ kind: "sourcemap", expected: "sourcemap" },
		{ kind: "bytecode", expected: "bytecode" },
		{ kind: "static", expected: "static" },
		{ kind: "something-else", expected: "something-else" },
	])("formats $kind as $expected", ({ kind, expected }) => {
		expect(formatKind(kind)).toBe(expected);
	});
});
