import type * as BunType from "bun";
import { Command } from "commander";
import { describe, expect, test, vi } from "vitest";
import type { CommandAction, CommandFn } from "#types";
import { Program } from "./program";

const createMockBun = () => ({}) as unknown as typeof BunType;

const createCommandFn = (
	name: string,
	action: CommandAction = vi.fn(),
): CommandFn => ({
	name,
	description: `${name} description`,
	action,
});

describe("Program", () => {
	describe("add", () => {
		test("calls the command action with its Command and Bun", () => {
			const mockBun = createMockBun();
			const action = vi.fn();
			const program = new Program(mockBun);

			program.add(createCommandFn("dev", action));

			expect(action).toHaveBeenCalledOnce();
			expect(action).toHaveBeenCalledWith(expect.any(Command), mockBun);
		});

		test("names and describes the sub command from the definition", () => {
			const action = vi.fn();
			new Program(createMockBun()).add(createCommandFn("build", action));

			const command = action.mock.calls[0]?.[0] as Command;
			expect(command.name()).toBe("build");
			expect(command.description()).toBe("build description");
		});

		test("returns this for method chaining", () => {
			const program = new Program(createMockBun());
			expect(program.add(createCommandFn("dev"))).toBe(program);
		});

		test("supports chaining multiple adds", () => {
			const dev = vi.fn();
			const build = vi.fn();

			new Program(createMockBun())
				.add(createCommandFn("dev", dev))
				.add(createCommandFn("build", build));

			expect(dev).toHaveBeenCalledOnce();
			expect(build).toHaveBeenCalledOnce();
		});
	});

	describe("parse", () => {
		test("runs the sub command matching the arguments", () => {
			const handler = vi.fn();
			const program = new Program(createMockBun()).add(
				createCommandFn("dev", (command) => {
					command.action(handler);
				}),
			);

			program.parse(["node", "bun-server", "dev"]);

			expect(handler).toHaveBeenCalledOnce();
		});

		test("leaves other sub commands untouched", () => {
			const dev = vi.fn();
			const build = vi.fn();
			const program = new Program(createMockBun())
				.add(
					createCommandFn("dev", (command) => {
						command.action(dev);
					}),
				)
				.add(
					createCommandFn("build", (command) => {
						command.action(build);
					}),
				);

			program.parse(["node", "bun-server", "build"]);

			expect(dev).not.toHaveBeenCalled();
			expect(build).toHaveBeenCalledOnce();
		});
	});
});
