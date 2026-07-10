import { error, info, log } from "node:console";
import { resolve } from "node:path";
import type * as BunType from "bun";
import { Command } from "commander";
import { describe, expect, test, vi } from "vitest";

vi.mock("bun-plugin-tailwind", () => ({
	default: { name: "tailwind-mock" },
}));

import { build } from "./build";

const createMockBun = (output?: Promise<BunType.BuildOutput>) => {
	const build = vi.fn();
	if (output) build.mockReturnValueOnce(output);
	return { build } as unknown as typeof BunType;
};

const createMockOutput = (success: boolean): BunType.BuildOutput => ({
	success,
	logs: [
		{
			level: "info",
			name: "BuildMessage",
			message: "processed",
			position: null,
		},
	],
	outputs: [],
});

describe("build command registration", () => {
	test("registers a build subcommand", () => {
		const program = new Command();
		build(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "build");
		expect(cmd).toBeDefined();
	});

	test("sets the correct description", () => {
		const program = new Command();
		build(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "build");
		expect(cmd?.description()).toBe("Build the project");
	});

	test("accepts an optional html argument defaulting to ./public/index.html", () => {
		const program = new Command();
		build(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "build");
		const args = cmd?.registeredArguments ?? [];

		expect(args).toHaveLength(1);
		expect(args[0].name()).toBe("html");
		expect(args[0].defaultValue).toBe("./public/index.html");
		expect(args[0].required).toBe(false);
	});

	test("minification is enabled by default (minify=true)", () => {
		const program = new Command();
		build(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "build");
		expect(cmd?.opts().minify).toBe(true);
	});

	test("has --out option defaulting to 'dist'", () => {
		const program = new Command();
		build(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "build");
		expect(cmd?.opts().out).toBe("dist");
	});
});

describe("build command action", () => {
	test("calls Bun.build with default html entrypoint resolved from cwd", async () => {
		const program = new Command();
		const mockBun = createMockBun(Promise.resolve(createMockOutput(true)));
		build(program, mockBun);

		await program.parseAsync(["build"], { from: "user" });

		expect(mockBun.build).toHaveBeenCalledWith(
			expect.objectContaining({
				entrypoints: [resolve(process.cwd(), "./public/index.html")],
				target: "browser",
				outdir: resolve(process.cwd(), "dist"),
				minify: true,
				sourcemap: "linked",
			}),
		);
	});

	test("calls Bun.build with custom html entrypoint", async () => {
		const program = new Command();
		const mockBun = createMockBun(Promise.resolve(createMockOutput(true)));
		build(program, mockBun);

		await program.parseAsync(["build", "./src/app.html"], { from: "user" });

		expect(mockBun.build).toHaveBeenCalledWith(
			expect.objectContaining({
				entrypoints: [resolve(process.cwd(), "./src/app.html")],
			}),
		);
	});

	test("disables minification when --no-minify is passed", async () => {
		const program = new Command();
		const mockBun = createMockBun(Promise.resolve(createMockOutput(true)));
		build(program, mockBun);

		await program.parseAsync(["build", "--no-minify"], { from: "user" });

		expect(mockBun.build).toHaveBeenCalledWith(
			expect.objectContaining({ minify: false }),
		);
	});

	test("uses custom output directory when --out is provided", async () => {
		const program = new Command();
		const mockBun = createMockBun(Promise.resolve(createMockOutput(true)));
		build(program, mockBun);

		await program.parseAsync(["build", "--out", "public"], { from: "user" });

		expect(mockBun.build).toHaveBeenCalledWith(
			expect.objectContaining({
				outdir: resolve(process.cwd(), "public"),
			}),
		);
	});

	test("includes plugins array in build options", async () => {
		const program = new Command();
		const mockBun = createMockBun(Promise.resolve(createMockOutput(true)));
		build(program, mockBun);

		await program.parseAsync(["build"], { from: "user" });

		expect(mockBun.build).toHaveBeenCalledWith(
			expect.objectContaining({
				plugins: expect.arrayContaining([expect.any(Object)]),
			}),
		);
	});

	test("logs 'Build output:' header before log entries", async () => {
		const program = new Command();
		const mockBun = createMockBun(Promise.resolve(createMockOutput(true)));
		build(program, mockBun);

		await program.parseAsync(["build"], { from: "user" });
		expect(log).toHaveBeenCalledWith("Build output:");
	});

	test("logs each build log entry with level, name, and message", async () => {
		const program = new Command();
		const mockBun = createMockBun(Promise.resolve(createMockOutput(true)));
		build(program, mockBun);

		await program.parseAsync(["build"], { from: "user" });
		expect(log).toHaveBeenCalledWith("info: BuildMessage - processed");
	});

	test("logs success message when build succeeds", async () => {
		const program = new Command();
		const mockBun = createMockBun(Promise.resolve(createMockOutput(true)));
		build(program, mockBun);

		await program.parseAsync(["build"], { from: "user" });
		expect(info).toHaveBeenCalledWith("\nBuild succeeded");
	});

	test("logs error message when build fails", async () => {
		const program = new Command();
		const mockBun = createMockBun(Promise.resolve(createMockOutput(false)));
		build(program, mockBun);

		await program.parseAsync(["build"], { from: "user" });
		expect(error).toHaveBeenCalledWith("\nBuild failed!");
	});
});
