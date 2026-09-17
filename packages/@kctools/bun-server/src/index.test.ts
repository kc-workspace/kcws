import type * as BunType from "bun";
import { describe, expect, test, vi } from "vitest";
import { Program } from "#core/program";
import { setup } from "./index";

const createMockBun = () => ({}) as unknown as typeof BunType;

describe("setup", () => {
	test("returns a Program instance", () => {
		expect(setup(createMockBun())).toBeInstanceOf(Program);
	});

	test("registers the dev, build and preview commands", () => {
		const add = vi.spyOn(Program.prototype, "add");

		setup(createMockBun());

		expect(add.mock.calls.map(([definition]) => definition.name)).toEqual([
			"dev",
			"build",
			"preview",
		]);

		add.mockRestore();
	});
});
