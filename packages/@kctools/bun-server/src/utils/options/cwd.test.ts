import { resolve } from "node:path";
import { Command } from "commander";
import { describe, expect, test } from "vitest";
import { cwdOption } from "./cwd";

const parse = (args: string[]): string => {
	const command = new Command().addOption(cwdOption).action(() => {});
	command.parse(args, { from: "user" });
	return command.opts()["cwd"] as string;
};

describe("cwdOption", () => {
	test("declares both the short and the long flag", () => {
		expect(cwdOption.flags).toBe("-C, --cwd <directory>");
	});

	test.each([
		{
			name: "defaults to the process working directory",
			args: [],
			expected: process.cwd(),
		},
		{
			name: "resolves a relative directory against the process working directory",
			args: ["--cwd", "sub/dir"],
			expected: resolve("sub/dir"),
		},
		{
			name: "keeps an absolute directory as it is",
			args: ["-C", "/repo/website"],
			expected: "/repo/website",
		},
	])("$name", ({ args, expected }) => {
		expect(parse(args)).toBe(expected);
	});
});
