import { Command } from "commander";
import { describe, expect, test } from "vitest";
import { modeOption } from "./options";

const commandWithMode = () =>
	new Command().exitOverride().addOption(modeOption());

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
