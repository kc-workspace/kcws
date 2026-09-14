import { error, info, log, warn } from "node:console";
import { resolve } from "node:path";
import type * as BunType from "bun";
import { Command } from "commander";
import { describe, expect, test, vi } from "vitest";
import { build } from "./build";

// Absolute path to the module bunfig.toml plugin names resolve to
const PLUGIN_FIXTURE_PATH = new URL("./__fixtures__/plugin.ts", import.meta.url)
	.pathname;

/** Size every mocked source file reports, so a copied file has one. */
const STATIC_SIZE = 1024;

const createMockBun = (
	output?: Promise<BunType.BuildOutput>,
	globFiles: string[] = [],
	declared?: string[],
) => {
	const buildFn = vi.fn();
	if (output) buildFn.mockReturnValueOnce(output);
	return {
		build: buildFn,
		write: vi.fn(),
		file: vi.fn().mockImplementation((path: string) => ({
			// only bunfig.toml is looked up by existence, a static source that is
			// not a document has to read as a directory
			exists: async () =>
				path.endsWith("bunfig.toml") && declared !== undefined,
			text: async () => "",
			size: STATIC_SIZE,
		})),
		TOML: {
			parse: vi
				.fn()
				.mockReturnValue({ serve: { static: { plugins: declared ?? [] } } }),
		},
		resolveSync: vi.fn().mockReturnValue(PLUGIN_FIXTURE_PATH),
		Glob: class {
			constructor(readonly pattern: string) {}
			scanSync(): string[] {
				return globFiles;
			}
		},
	} as unknown as typeof BunType;
};

const createMockArtifact = (
	path: string,
	size: number,
	kind: BunType.BuildArtifact["kind"],
): BunType.BuildArtifact =>
	({ path: resolve(process.cwd(), path), size, kind }) as BunType.BuildArtifact;

const createMockOutput = (
	success: boolean,
	outputs: BunType.BuildArtifact[] = [
		createMockArtifact("dist/index.html", 1024, "entry-point"),
	],
): BunType.BuildOutput => ({
	success,
	logs: [
		{
			level: "info",
			name: "BuildMessage",
			message: "processed",
			position: null,
		},
	],
	outputs,
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

	test("has --statics option defaulting to no specification", () => {
		const program = new Command();
		build(program, createMockBun());

		const cmd = program.commands.find((c) => c.name() === "build");
		expect(cmd?.opts()["statics"]).toEqual([]);
	});
});

describe("build command action - statics", () => {
	const FAVICON = resolve(process.cwd(), "public/favicon.ico");

	const buildWith = async (args: string[], globFiles = [FAVICON]) => {
		const program = new Command();
		const mockBun = createMockBun(
			Promise.resolve(createMockOutput(true)),
			globFiles,
		);
		build(program, mockBun);

		await program.parseAsync(["build", ...args], { from: "user" });
		return mockBun;
	};

	test("copies a matched file into the output root", async () => {
		const mockBun = await buildWith(["--statics", "public:/"]);

		expect(mockBun.write).toHaveBeenCalledWith(
			resolve(process.cwd(), "dist/favicon.ico"),
			expect.anything(),
		);
	});

	test("keeps the source directory when no target is given", async () => {
		const mockBun = await buildWith(["--statics", "public"]);

		expect(mockBun.write).toHaveBeenCalledWith(
			resolve(process.cwd(), "dist/public/favicon.ico"),
			expect.anything(),
		);
	});

	test("copies into a custom output directory", async () => {
		const mockBun = await buildWith([
			"--out",
			"build",
			"--statics",
			"public:/",
		]);

		expect(mockBun.write).toHaveBeenCalledWith(
			resolve(process.cwd(), "build/favicon.ico"),
			expect.anything(),
		);
	});

	test("copies nothing when no specification is given", async () => {
		const mockBun = await buildWith([]);

		expect(mockBun.write).not.toHaveBeenCalled();
	});

	test("reports a copied file on its own kind", async () => {
		await buildWith(["--statics", "public:/"]);

		expect(log).toHaveBeenCalledWith(
			expect.stringMatching(/dist\/favicon\.ico\s+1\.00 KB\s+static/),
		);
	});

	test("counts the copied files in the summary", async () => {
		await buildWith(["--statics", "public:/"]);

		expect(info).toHaveBeenCalledWith(
			expect.stringMatching(/^\n {2}2 files, 2\.00 KB in \d/),
		);
	});

	test("warns when a specification matches nothing", async () => {
		const mockBun = await buildWith(["--statics", "public:/"], []);

		expect(warn).toHaveBeenCalledWith("No static file found in public:/");
		expect(mockBun.write).not.toHaveBeenCalled();
	});

	test("does not build when a specification is unusable", async () => {
		const mockBun = await buildWith(["--statics", "/shared/icons"]);

		expect(error).toHaveBeenCalledWith(
			"Static source /shared/icons needs an explicit target: /shared/icons:<target>",
		);
		expect(mockBun.build).not.toHaveBeenCalled();
	});

	test("errors and copies nothing when two files claim the same path", async () => {
		const mockBun = await buildWith([
			"--statics",
			"public:/",
			"--statics",
			"public:/",
		]);

		expect(error).toHaveBeenCalledWith(
			"Multiple static files claim the same path: favicon.ico",
		);
		expect(mockBun.write).not.toHaveBeenCalled();
	});

	test("errors and copies nothing when a file overwrites a bundled one", async () => {
		const program = new Command();
		const page = resolve(process.cwd(), "public/index.html");
		const mockBun = createMockBun(Promise.resolve(createMockOutput(true)), [
			page,
		]);
		build(program, mockBun);

		await program.parseAsync(["build", "--statics", "public:/"], {
			from: "user",
		});

		expect(error).toHaveBeenCalledWith(
			"Static files overwrite a bundled file: index.html",
		);
		expect(mockBun.write).not.toHaveBeenCalled();
	});

	test("copies nothing when the build itself failed", async () => {
		const program = new Command();
		const mockBun = createMockBun(Promise.resolve(createMockOutput(false)), [
			FAVICON,
		]);
		build(program, mockBun);

		await program.parseAsync(["build", "--statics", "public:/"], {
			from: "user",
		});

		expect(mockBun.write).not.toHaveBeenCalled();
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

	test("builds without plugins when there is no bunfig.toml", async () => {
		const program = new Command();
		const mockBun = createMockBun(Promise.resolve(createMockOutput(true)));
		build(program, mockBun);

		await program.parseAsync(["build"], { from: "user" });

		expect(mockBun.build).toHaveBeenCalledWith(
			expect.objectContaining({ plugins: [] }),
		);
	});

	test("loads the plugins bunfig.toml declares for the dev server", async () => {
		const program = new Command();
		const mockBun = createMockBun(
			Promise.resolve(createMockOutput(true)),
			[],
			["bun-plugin-tailwind"],
		);
		build(program, mockBun);

		await program.parseAsync(["build"], { from: "user" });

		expect(mockBun.build).toHaveBeenCalledWith(
			expect.objectContaining({ plugins: [{ name: "fixture-plugin" }] }),
		);
	});

	test("reports the plugins it loaded", async () => {
		const program = new Command();
		const mockBun = createMockBun(
			Promise.resolve(createMockOutput(true)),
			[],
			["bun-plugin-tailwind"],
		);
		build(program, mockBun);

		await program.parseAsync(["build"], { from: "user" });

		expect(info).toHaveBeenCalledWith(
			"Plugins from bunfig.toml: bun-plugin-tailwind",
		);
	});

	test("stays silent about plugins when none are declared", async () => {
		const program = new Command();
		const mockBun = createMockBun(Promise.resolve(createMockOutput(true)));
		build(program, mockBun);

		await program.parseAsync(["build"], { from: "user" });

		expect(info).not.toHaveBeenCalledWith(
			expect.stringContaining("Plugins from"),
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
	test("logs 'Build output:' header", async () => {
		const program = new Command();
		const mockBun = createMockBun(Promise.resolve(createMockOutput(true)));
		build(program, mockBun);

		await program.parseAsync(["build"], { from: "user" });
		expect(log).toHaveBeenCalledWith("\nBuild output:");
	});

	test("logs each build log entry with level, name, and message", async () => {
		const program = new Command();
		const mockBun = createMockBun(Promise.resolve(createMockOutput(true)));
		build(program, mockBun);

		await program.parseAsync(["build"], { from: "user" });
		expect(log).toHaveBeenCalledWith("info: BuildMessage - processed");
	});

	test("routes an error level log entry to console.error", async () => {
		const program = new Command();
		const output = createMockOutput(true);
		output.logs = [
			{
				level: "error",
				name: "BuildMessage",
				message: "broken",
				position: null,
			},
		];
		const mockBun = createMockBun(Promise.resolve(output));
		build(program, mockBun);

		await program.parseAsync(["build"], { from: "user" });
		expect(error).toHaveBeenCalledWith("error: BuildMessage - broken");
	});

	test("routes a warning level log entry to console.warn", async () => {
		const program = new Command();
		const output = createMockOutput(true);
		output.logs = [
			{
				level: "warning",
				name: "BuildMessage",
				message: "suspicious",
				position: null,
			},
		];
		const mockBun = createMockBun(Promise.resolve(output));
		build(program, mockBun);

		await program.parseAsync(["build"], { from: "user" });
		expect(warn).toHaveBeenCalledWith("warning: BuildMessage - suspicious");
	});

	test("logs one padded line per artifact with its size and kind", async () => {
		const program = new Command();
		const mockBun = createMockBun(
			Promise.resolve(
				createMockOutput(true, [
					createMockArtifact("dist/index.html", 1024, "entry-point"),
					createMockArtifact("dist/app.js", 2048, "chunk"),
				]),
			),
		);
		build(program, mockBun);

		await program.parseAsync(["build"], { from: "user" });

		expect(log).toHaveBeenCalledWith("  dist/index.html  1.00 KB  entry");
		expect(log).toHaveBeenCalledWith("  dist/app.js      2.00 KB  chunk");
	});

	test("summarizes file count, total size, and duration when build succeeds", async () => {
		const program = new Command();
		const mockBun = createMockBun(
			Promise.resolve(
				createMockOutput(true, [
					createMockArtifact("dist/index.html", 1024, "entry-point"),
					createMockArtifact("dist/app.js", 2048, "chunk"),
				]),
			),
		);
		build(program, mockBun);

		await program.parseAsync(["build"], { from: "user" });

		expect(info).toHaveBeenCalledWith(
			expect.stringMatching(/^\n {2}2 files, 3\.00 KB in \d/),
		);
	});

	test("logs error message and no artifacts when build fails", async () => {
		const program = new Command();
		const mockBun = createMockBun(Promise.resolve(createMockOutput(false)));
		build(program, mockBun);

		await program.parseAsync(["build"], { from: "user" });
		expect(error).toHaveBeenCalledWith("\nBuild failed!");
		expect(log).not.toHaveBeenCalledWith("\nBuild output:");
	});
});
