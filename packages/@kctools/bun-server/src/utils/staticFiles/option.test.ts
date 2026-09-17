import { Command } from "commander";
import { describe, expect, test } from "vitest";
import { staticOption } from "./option";

const parse = (args: string[]): string[] => {
	const command = new Command().addOption(staticOption).action(() => {});
	command.parse(args, { from: "user" });
	return command.opts()["statics"] as string[];
};

describe("staticOption", () => {
	test("declares both the short and the long flag", () => {
		expect(staticOption.flags).toBe("-s, --statics <source[:target]>");
	});

	test.each([
		{ name: "defaults to no static file", args: [], expected: [] },
		{
			name: "collects a single value",
			args: ["--statics", "assets"],
			expected: ["assets"],
		},
		{
			name: "collects every repeated value in order",
			args: ["-s", "assets", "-s", "public/*.png:images"],
			expected: ["assets", "public/*.png:images"],
		},
	])("$name", ({ args, expected }) => {
		expect(parse(args)).toEqual(expected);
	});
});
