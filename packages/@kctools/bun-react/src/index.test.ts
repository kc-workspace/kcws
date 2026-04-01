import type * as BunType from "bun";
import { Command } from "commander";
import { describe, expect, test, vi } from "vitest";

vi.mock("bun-plugin-tailwind", () => ({
	default: { name: "tailwind-mock" },
}));

import { Program, setup } from "./index";

const createMockBun = () => ({}) as unknown as typeof BunType;

describe("Program", () => {
	describe("constructor", () => {
		test("sets program name from bin key in package.json", () => {
			const program = new Program(createMockBun());
			// bin key is "bun-react" — the first key of the bin object
			expect((program as unknown as { program: Command }).program.name()).toBe(
				"bun-react",
			);
		});

		test("sets description from package.json", () => {
			const program = new Program(createMockBun());
			expect(
				(program as unknown as { program: Command }).program.description(),
			).toBe("Use bun to start dev or prod server for react website");
		});

		test("sets version from package.json", () => {
			const program = new Program(createMockBun());
			expect(
				(program as unknown as { program: Command }).program.version(),
			).toBe("0.0.0-beta.0");
		});
	});

	describe("add", () => {
		test("calls CommandFn with the inner Command and Bun", () => {
			const mockBun = createMockBun();
			const program = new Program(mockBun);
			const mockFn = vi.fn();

			program.add(mockFn);

			expect(mockFn).toHaveBeenCalledOnce();
			expect(mockFn).toHaveBeenCalledWith(expect.any(Command), mockBun);
		});

		test("returns this for method chaining", () => {
			const program = new Program(createMockBun());
			const result = program.add(vi.fn());
			expect(result).toBe(program);
		});

		test("supports chaining multiple adds", () => {
			const program = new Program(createMockBun());
			const fn1 = vi.fn();
			const fn2 = vi.fn();

			program.add(fn1).add(fn2);

			expect(fn1).toHaveBeenCalledOnce();
			expect(fn2).toHaveBeenCalledOnce();
		});
	});

	describe("parse", () => {
		test("delegates to commander parse with from:node option", () => {
			const program = new Program(createMockBun());
			const innerProgram = (program as unknown as { program: Command }).program;
			const parseSpy = vi
				.spyOn(innerProgram, "parse")
				.mockReturnValue(innerProgram);

			program.parse(["node", "script", "--version"]);

			expect(parseSpy).toHaveBeenCalledWith(["node", "script", "--version"], {
				from: "node",
			});
		});
	});
});

describe("setup", () => {
	test("returns a Program instance", () => {
		const mockBun = {} as unknown as typeof BunType;
		const result = setup(mockBun);
		expect(result).toBeInstanceOf(Program);
	});

	test("registers both dev and build subcommands", () => {
		const mockBun = {} as unknown as typeof BunType;
		const program = setup(mockBun);
		const innerProgram = (program as unknown as { program: Command }).program;
		const names = innerProgram.commands.map((c) => c.name());

		expect(names).toContain("dev");
		expect(names).toContain("build");
	});

	test("stores the provided Bun instance", () => {
		const mockBun = {} as unknown as typeof BunType;
		const program = setup(mockBun);
		expect((program as unknown as { Bun: typeof BunType }).Bun).toBe(mockBun);
	});
});
