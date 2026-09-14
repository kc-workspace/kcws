import { error, info, log } from "node:console";
import { resolve } from "node:path";
import type * as BunType from "bun";
import { Command } from "commander";
import { describe, expect, test, vi } from "vitest";

vi.mock("bun-plugin-tailwind", () => ({
	default: { name: "tailwind-mock" },
}));

import { build } from "./build";

const createMockBun = (
	output?: Promise<BunType.BuildOutput>,
	globFiles: string[] = [],
) => {
	const buildFn = vi.fn();
	if (output) buildFn.mockReturnValueOnce(output);
	return {
		build: buildFn,
		Glob: class {
			constructor(readonly pattern: string) {}
			scanSync(): string[] {
				return globFiles;
			}
		},
	} as unknown as typeof BunType;
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

	test("accepts an optional input argument with no static default", () => {
		const program = new Command();
		build(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "build");
		const args = cmd?.registeredArguments ?? [];

		expect(args).toHaveLength(1);
		expect(args[0]?.name()).toBe("input");
		expect(args[0]?.required).toBe(false);
		expect(args[0]?.defaultValue).toBeUndefined();
	});

	test("has --mode option defaulting to 'spa'", () => {
		const program = new Command();
		build(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "build");
		expect(cmd?.opts()["mode"]).toBe("spa");
	});

	test("rejects a --mode value outside spa and mpa", async () => {
		const program = new Command().exitOverride();
		build(program, createMockBun());

		await expect(
			program.parseAsync(["build", "--mode", "ssr"], { from: "user" }),
		).rejects.toThrow(/Allowed choices are spa, mpa/);
	});

	test("minification is enabled by default (minify=true)", () => {
		const program = new Command();
		build(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "build");
		expect(cmd?.opts()["minify"]).toBe(true);
	});

	test("has --out option defaulting to 'dist'", () => {
		const program = new Command();
		build(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "build");
		expect(cmd?.opts()["out"]).toBe("dist");
	});
});

describe("build command action - spa mode", () => {
	test("calls Bun.build with the default html entrypoint resolved from cwd", async () => {
		const program = new Command();
		const mockBun = createMockBun(Promise.resolve(createMockOutput(true)));
		build(program, mockBun);

		await program.parseAsync(["build"], { from: "user" });

		expect(mockBun.build).toHaveBeenCalledWith(
			expect.objectContaining({
				entrypoints: [resolve(process.cwd(), "./public/index.html")],
				target: "browser",
				outdir: resolve(process.cwd(), "dist"),
				root: resolve(process.cwd(), "public"),
				minify: true,
				sourcemap: "linked",
			}),
		);
	});

	test("calls Bun.build with a custom html entrypoint", async () => {
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

	test("uses a custom output directory when --out is provided", async () => {
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
});

describe("build command action - mpa mode", () => {
	const routeFile = (relativePath: string) =>
		resolve(process.cwd(), relativePath);

	test("passes every matched page as an entrypoint", async () => {
		const program = new Command();
		const mockBun = createMockBun(Promise.resolve(createMockOutput(true)), [
			routeFile("src/routes/index.html"),
			routeFile("src/routes/about/index.html"),
		]);
		build(program, mockBun);

		await program.parseAsync(["build", "--mode", "mpa"], { from: "user" });

		expect(mockBun.build).toHaveBeenCalledWith(
			expect.objectContaining({
				entrypoints: [
					routeFile("src/routes/index.html"),
					routeFile("src/routes/about/index.html"),
				],
			}),
		);
	});

	test("roots the output at the given directory", async () => {
		const program = new Command();
		const mockBun = createMockBun(Promise.resolve(createMockOutput(true)), [
			routeFile("src/routes/about/index.html"),
		]);
		build(program, mockBun);

		await program.parseAsync(["build", "--mode", "mpa"], { from: "user" });

		expect(mockBun.build).toHaveBeenCalledWith(
			expect.objectContaining({ root: resolve(process.cwd(), "src/routes") }),
		);
	});

	test("roots the output at a custom directory", async () => {
		const program = new Command();
		const mockBun = createMockBun(Promise.resolve(createMockOutput(true)), [
			routeFile("src/pages/about.html"),
		]);
		build(program, mockBun);

		await program.parseAsync(["build", "--mode", "mpa", "./src/pages"], {
			from: "user",
		});

		expect(mockBun.build).toHaveBeenCalledWith(
			expect.objectContaining({ root: resolve(process.cwd(), "src/pages") }),
		);
	});

	test("errors and does not build when two documents claim the same route", async () => {
		const program = new Command();
		const mockBun = createMockBun(Promise.resolve(createMockOutput(true)), [
			routeFile("src/routes/about.html"),
			routeFile("src/routes/about/index.html"),
		]);
		build(program, mockBun);

		await program.parseAsync(["build", "--mode", "mpa"], { from: "user" });

		expect(error).toHaveBeenCalledWith(
			"Multiple HTML entries claim the same route: /about",
		);
		expect(mockBun.build).not.toHaveBeenCalled();
	});

	test("errors and does not build when no page matches", async () => {
		const program = new Command();
		const mockBun = createMockBun(undefined, []);
		build(program, mockBun);

		await program.parseAsync(["build", "--mode", "mpa"], { from: "user" });

		expect(error).toHaveBeenCalledWith("No HTML entry found in ./src/routes");
		expect(mockBun.build).not.toHaveBeenCalled();
	});
});

describe("build command action - output", () => {
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
