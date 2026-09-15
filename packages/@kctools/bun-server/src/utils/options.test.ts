import { Command } from "commander";
import { describe, expect, test } from "vitest";
import { modeOption, staticsOption } from "./options";

const commandWithMode = () =>
	new Command().exitOverride().addOption(modeOption());

const commandWithStatics = () =>
	new Command().exitOverride().addOption(staticsOption());

describe("modeOption", () => {
	test("declares the short and long flags", () => {
		expect(modeOption().flags).toBe("-m, --mode <mode>");
	});

	test("describes itself", () => {
		expect(modeOption().description).toBe("Page layout of the website");
	});

	test("defaults to spa", () => {
		expect(commandWithMode().opts()["mode"]).toBe("spa");
	});

	test("accepts spa", () => {
		const command = commandWithMode();
		command.parse(["--mode", "spa"], { from: "user" });

		expect(command.opts()["mode"]).toBe("spa");
	});

	test("accepts mpa", () => {
		const command = commandWithMode();
		command.parse(["--mode", "mpa"], { from: "user" });

		expect(command.opts()["mode"]).toBe("mpa");
	});

	test("rejects any other layout", () => {
		expect(() =>
			commandWithMode().parse(["--mode", "ssr"], { from: "user" }),
		).toThrow(/Allowed choices are spa, mpa/);
	});
});

describe("staticsOption", () => {
	test("declares the short and long flags", () => {
		expect(staticsOption().flags).toBe("-s, --statics <source[:target]>");
	});

	test("defaults to no specification", () => {
		expect(commandWithStatics().opts()["statics"]).toEqual([]);
	});

	test("collects a single specification", () => {
		const command = commandWithStatics();
		command.parse(["--statics", "public:/"], { from: "user" });

		expect(command.opts()["statics"]).toEqual(["public:/"]);
	});

	test("collects every repeated specification in order", () => {
		const command = commandWithStatics();
		command.parse(["--statics", "public:/", "--statics", "icons"], {
			from: "user",
		});

		expect(command.opts()["statics"]).toEqual(["public:/", "icons"]);
	});
});
