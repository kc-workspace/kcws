import { error, warn } from "node:console";
import { resolve } from "node:path";
import type * as BunType from "bun";
import { describe, expect, test, vi } from "vitest";
import {
	copyStatics,
	duplicateTargets,
	listStatics,
	parseStatics,
	type StaticSpec,
	staticRoute,
} from "./statics";

const CWD = "/project";

/**
 * Bun stand in whose `file().exists()` answers true only for `files`, which is
 * how a bare source tells a document apart from a directory.
 */
const createMockBun = (files: string[] = []) =>
	({
		file: vi.fn().mockImplementation((path: string) => ({
			exists: async () => files.includes(path),
		})),
	}) as unknown as typeof BunType;

describe("parseStatics", () => {
	const parse = (spec: string, files: string[] = []) =>
		parseStatics(createMockBun(files), [spec], CWD);

	test("splits the source and the target on the last colon", async () => {
		expect(await parse("public:assets")).toEqual([
			{
				source: "public:assets",
				base: resolve(CWD, "public"),
				pattern: "**/*",
				target: "assets",
			},
		]);
	});

	test("defaults the target of a directory to the directory itself", async () => {
		expect((await parse("public"))?.[0]?.target).toBe("public");
	});

	test("maps a target of / to the output root", async () => {
		expect((await parse("public:/"))?.[0]?.target).toBe(".");
	});

	test("matches a bare document by its own name", async () => {
		const spec = (await parse("robots.txt", [resolve(CWD, "robots.txt")]))?.[0];

		expect(spec?.base).toBe(CWD);
		expect(spec?.pattern).toBe("robots.txt");
	});

	test("defaults the target of a document to its directory", async () => {
		const spec = (
			await parse("public/robots.txt", [resolve(CWD, "public/robots.txt")])
		)?.[0];

		expect(spec?.base).toBe(resolve(CWD, "public"));
		expect(spec?.target).toBe("public");
	});

	test("defaults the target of a top level document to the output root", async () => {
		expect(
			(await parse("robots.txt", [resolve(CWD, "robots.txt")]))?.[0]?.target,
		).toBe(".");
	});

	test("roots a glob at its last segment without magic characters", async () => {
		const spec = (await parse("assets/**/*.png:img"))?.[0];

		expect(spec?.base).toBe(resolve(CWD, "assets"));
		expect(spec?.pattern).toBe("**/*.png");
	});

	test("defaults the target of a glob to the directory it is rooted at", async () => {
		expect((await parse("assets/**/*.png"))?.[0]?.target).toBe("assets");
	});

	test("resolves a source starting with ./ against the working directory", async () => {
		expect((await parse("./public"))?.[0]?.base).toBe(resolve(CWD, "public"));
	});

	test("keeps an absolute source as it is", async () => {
		expect((await parse("/shared/icons:icons"))?.[0]?.base).toBe(
			"/shared/icons",
		);
	});

	test("reports an absolute source without a target", async () => {
		expect(await parse("/shared/icons")).toBeUndefined();
		expect(error).toHaveBeenCalledWith(
			"Static source /shared/icons needs an explicit target: /shared/icons:<target>",
		);
	});

	test("reports a target escaping the output directory", async () => {
		expect(await parse("public:../secrets")).toBeUndefined();
		expect(error).toHaveBeenCalledWith(
			"Static target ../secrets escapes the output directory",
		);
	});

	test("parses every given specification", async () => {
		const specs = await parseStatics(
			createMockBun(),
			["public:/", "assets/*.png:img"],
			CWD,
		);

		expect(specs?.map((spec) => spec.target)).toEqual([".", "img"]);
	});

	test("returns nothing to parse when no specification is given", async () => {
		expect(await parseStatics(createMockBun(), [], CWD)).toEqual([]);
	});
});

const PUBLIC = resolve(CWD, "public");

const spec = (overrides: Partial<StaticSpec> = {}): StaticSpec => ({
	source: "public",
	base: PUBLIC,
	pattern: "**/*",
	target: "public",
	...overrides,
});

/** Bun stand in whose glob answers with the files declared for a base. */
const createScanBun = (matches: Record<string, string[]>, failure?: unknown) =>
	({
		Glob: class {
			constructor(readonly pattern: string) {}
			scanSync(options: { cwd: string }): string[] {
				if (failure) throw failure;
				return matches[options.cwd] ?? [];
			}
		},
	}) as unknown as typeof BunType;

describe("listStatics", () => {
	test("keeps the layout below the base under the target", () => {
		const files = listStatics(
			createScanBun({
				[PUBLIC]: [
					resolve(PUBLIC, "favicon.ico"),
					resolve(PUBLIC, "img/logo.png"),
				],
			}),
			[spec()],
		);

		expect(files).toEqual([
			{ from: resolve(PUBLIC, "favicon.ico"), to: "public/favicon.ico" },
			{ from: resolve(PUBLIC, "img/logo.png"), to: "public/img/logo.png" },
		]);
	});

	test("writes into the output root when the target is the root", () => {
		const files = listStatics(
			createScanBun({ [PUBLIC]: [resolve(PUBLIC, "img/logo.png")] }),
			[spec({ target: "." })],
		);

		expect(files[0]?.to).toBe("img/logo.png");
	});

	test("scans the pattern from inside the base directory", () => {
		let pattern: string | undefined;
		let options: unknown;
		const bun = {
			Glob: class {
				constructor(value: string) {
					pattern = value;
				}
				scanSync(scanOptions: unknown): string[] {
					options = scanOptions;
					return [];
				}
			},
		} as unknown as typeof BunType;

		listStatics(bun, [spec({ pattern: "**/*.png" })]);

		expect(pattern).toBe("**/*.png");
		expect(options).toEqual({ cwd: PUBLIC, absolute: true, onlyFiles: true });
	});

	test("sorts the files by their output path", () => {
		const files = listStatics(
			createScanBun({
				[PUBLIC]: [
					resolve(PUBLIC, "img/logo.png"),
					resolve(PUBLIC, "favicon.ico"),
				],
			}),
			[spec()],
		);

		expect(files.map((file) => file.to)).toEqual([
			"public/favicon.ico",
			"public/img/logo.png",
		]);
	});

	test("collects the files of every specification", () => {
		const icons = resolve(CWD, "icons");
		const files = listStatics(
			createScanBun({
				[PUBLIC]: [resolve(PUBLIC, "favicon.ico")],
				[icons]: [resolve(icons, "logo.svg")],
			}),
			[spec({ target: "." }), spec({ base: icons, target: "icons" })],
		);

		expect(files.map((file) => file.to)).toEqual([
			"favicon.ico",
			"icons/logo.svg",
		]);
	});

	test("warns when a specification matches nothing", () => {
		expect(
			listStatics(createScanBun({}), [spec({ source: "public:/" })]),
		).toEqual([]);
		expect(warn).toHaveBeenCalledWith("No static file found in public:/");
	});

	test("treats a missing directory as a specification matching nothing", () => {
		const missing = Object.assign(new Error("ENOENT: no such file"), {
			code: "ENOENT",
		});

		expect(listStatics(createScanBun({}, missing), [spec()])).toEqual([]);
		expect(warn).toHaveBeenCalledWith("No static file found in public");
	});

	test("rethrows any other scan failure", () => {
		const failure = Object.assign(new Error("EACCES: denied"), {
			code: "EACCES",
		});

		expect(() => listStatics(createScanBun({}, failure), [spec()])).toThrow(
			failure,
		);
	});
});

describe("staticRoute", () => {
	test("serves a file from its output path", () => {
		expect(staticRoute({ from: "/a/favicon.ico", to: "favicon.ico" })).toBe(
			"/favicon.ico",
		);
	});

	test("keeps the directories of the output path", () => {
		expect(
			staticRoute({ from: "/a/logo.png", to: "public/img/logo.png" }),
		).toBe("/public/img/logo.png");
	});
});

describe("duplicateTargets", () => {
	test("returns nothing when every output path is unique", () => {
		expect(
			duplicateTargets([
				{ from: "/a/favicon.ico", to: "favicon.ico" },
				{ from: "/b/logo.png", to: "logo.png" },
			]),
		).toEqual([]);
	});

	test("returns each output path claimed by more than one file", () => {
		expect(
			duplicateTargets([
				{ from: "/a/favicon.ico", to: "favicon.ico" },
				{ from: "/b/favicon.ico", to: "favicon.ico" },
				{ from: "/b/favicon.ico", to: "favicon.ico" },
				{ from: "/b/logo.png", to: "logo.png" },
			]),
		).toEqual(["favicon.ico"]);
	});
});

describe("copyStatics", () => {
	test("writes every file to its output path", async () => {
		const source = { name: "favicon.ico" };
		const bun = {
			write: vi.fn(),
			file: vi.fn().mockReturnValue(source),
		} as unknown as typeof BunType;

		await copyStatics(
			bun,
			[{ from: resolve(PUBLIC, "favicon.ico"), to: "favicon.ico" }],
			"/project/dist",
		);

		expect(bun.file).toHaveBeenCalledWith(resolve(PUBLIC, "favicon.ico"));
		expect(bun.write).toHaveBeenCalledWith("/project/dist/favicon.ico", source);
	});

	test("writes nothing when there is no file", async () => {
		const bun = {
			write: vi.fn(),
			file: vi.fn(),
		} as unknown as typeof BunType;

		await copyStatics(bun, [], "/project/dist");

		expect(bun.write).not.toHaveBeenCalled();
	});
});
