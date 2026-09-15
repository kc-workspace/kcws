import type * as BunType from "bun";
import { Command } from "commander";
import { describe, expect, test, vi } from "vitest";
import { Program, setup } from "./index";

const createMockBun = () => ({}) as unknown as typeof BunType;

describe("Program", () => {
	describe("constructor", () => {
		test("sets program name from bin key in package.json", () => {
			const program = new Program(createMockBun());
			// bin key is "bun-server" — the first key of the bin object
			expect((program as unknown as { program: Command }).program.name()).toBe(
				"bun-server",
			);
		});

		test("sets description from package.json", () => {
			const program = new Program(createMockBun());
			expect(
				(program as unknown as { program: Command }).program.description(),
			).toBe("Use bun to start dev or prod server for simple website");
		});

		test("falls back to the package name when package.json declares no bin", async () => {
			vi.resetModules();
			vi.doMock("../package.json", () => ({
				bin: {},
				name: "@kctools/bun-server",
				description: "fallback description",
				version: "1.2.3",
			}));

			const { Program: Fallback } = await import("./index");
			const program = new Fallback(createMockBun());

			expect((program as unknown as { program: Command }).program.name()).toBe(
				"@kctools/bun-server",
			);

			vi.doUnmock("../package.json");
			vi.resetModules();
		});

		test("sets version from package.json", () => {
			const program = new Program(createMockBun());
			expect(
				(program as unknown as { program: Command }).program.version(),
			).toBeTypeOf("string");
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

	test("registers the dev, build and preview subcommands", () => {
		const mockBun = {} as unknown as typeof BunType;
		const program = setup(mockBun);
		const innerProgram = (program as unknown as { program: Command }).program;
		const names = innerProgram.commands.map((c) => c.name());

		expect(names).toEqual(["dev", "build", "preview"]);
	});

	test("stores the provided Bun instance", () => {
		const mockBun = {} as unknown as typeof BunType;
		const program = setup(mockBun);
		expect((program as unknown as { Bun: typeof BunType }).Bun).toBe(mockBun);
	});
});
