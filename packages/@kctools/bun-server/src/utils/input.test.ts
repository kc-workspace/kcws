import { error } from "node:console";
import { resolve } from "node:path";
import type * as BunType from "bun";
import { describe, expect, test, vi } from "vitest";
import {
	type CommandInput,
	collectStatics,
	resolveCommandInput,
} from "./input";
import type { StaticSpec } from "./statics";

const CWD = "/project";
const PAGE = "./public/index.html";

const createMockBun = (pages: string[] = []) =>
	({
		Glob: class {
			constructor(readonly pattern: string) {}
			scanSync(): string[] {
				return pages;
			}
		},
		file: vi.fn().mockReturnValue({ exists: async () => false }),
	}) as unknown as typeof BunType;

describe("resolveCommandInput", () => {
	test("returns the documents, their root, and the specifications", async () => {
		const resolved = await resolveCommandInput(
			createMockBun(),
			{ mode: "spa", statics: ["public:/"] },
			PAGE,
			CWD,
		);

		expect(resolved?.entries.map((entry) => entry.route)).toEqual(["/"]);
		expect(resolved?.root).toBe(resolve(CWD, "public"));
		expect(resolved?.statics.map((spec) => spec.target)).toEqual(["."]);
	});

	test("has no specification when none is given", async () => {
		const resolved = await resolveCommandInput(
			createMockBun(),
			{ mode: "spa", statics: [] },
			PAGE,
			CWD,
		);

		expect(resolved?.statics).toEqual([]);
	});

	test("returns nothing when the input matches no document", async () => {
		const resolved = await resolveCommandInput(
			createMockBun([]),
			{ mode: "mpa", statics: [] },
			"./src/routes",
			CWD,
		);

		expect(resolved).toBeUndefined();
		expect(error).toHaveBeenCalledWith("No HTML entry found in ./src/routes");
	});

	test("returns nothing when a specification is unusable", async () => {
		const resolved = await resolveCommandInput(
			createMockBun(),
			{ mode: "spa", statics: ["/shared/icons"] },
			PAGE,
			CWD,
		);

		expect(resolved).toBeUndefined();
		expect(error).toHaveBeenCalledWith(
			"Static source /shared/icons needs an explicit target: /shared/icons:<target>",
		);
	});

	test("leaves the specifications alone when the input is unusable", async () => {
		const bun = createMockBun([]);

		await resolveCommandInput(
			bun,
			{ mode: "mpa", statics: ["public:/"] },
			"./src/routes",
			CWD,
		);

		expect(bun.file).not.toHaveBeenCalled();
	});
});

const PUBLIC = resolve(CWD, "public");

/** Bun stand in whose glob answers with the files declared for a base. */
const createScanBun = (matches: Record<string, string[]>) =>
	({
		Glob: class {
			constructor(readonly pattern: string) {}
			scanSync(options: { cwd: string }): string[] {
				return matches[options.cwd] ?? [];
			}
		},
	}) as unknown as typeof BunType;

const commandInput = (
	statics: StaticSpec[],
	entries: string[] = [],
): CommandInput => ({
	entries: entries.map((path) => ({ path, route: "/", wildcard: "/*" })),
	root: PUBLIC,
	statics,
});

const spec = (): StaticSpec => ({
	source: "public:/",
	base: PUBLIC,
	pattern: "**/*",
	target: ".",
});

describe("collectStatics", () => {
	test("lists the files the specifications match", () => {
		const files = collectStatics(
			createScanBun({ [PUBLIC]: [resolve(PUBLIC, "favicon.ico")] }),
			commandInput([spec()]),
		);

		expect(files?.map((file) => file.to)).toEqual(["favicon.ico"]);
	});

	test("skips the documents the command builds itself", () => {
		const page = resolve(PUBLIC, "index.html");
		const files = collectStatics(
			createScanBun({ [PUBLIC]: [page, resolve(PUBLIC, "favicon.ico")] }),
			commandInput([spec()], [page]),
		);

		expect(files?.map((file) => file.to)).toEqual(["favicon.ico"]);
	});

	test("reports two files claiming one path and returns nothing", () => {
		const files = collectStatics(
			createScanBun({ [PUBLIC]: [resolve(PUBLIC, "favicon.ico")] }),
			commandInput([spec(), spec()]),
		);

		expect(files).toBeUndefined();
		expect(error).toHaveBeenCalledWith(
			"Multiple static files claim the same path: favicon.ico",
		);
	});
});
