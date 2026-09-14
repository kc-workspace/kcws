import { resolve } from "node:path";
import type * as BunType from "bun";
import { describe, expect, test } from "vitest";
import {
	DEFAULT_ENTRY,
	DEFAULT_MODE,
	duplicateRoutes,
	entryRoot,
	globBase,
	listEntries,
	MODES,
} from "./entries";

const CWD = "/project";

const createMockBun = (files: string[] = []) =>
	({
		Glob: class {
			constructor(readonly pattern: string) {}
			scanSync(): string[] {
				return files;
			}
		},
	}) as unknown as typeof BunType;

describe("MODES", () => {
	test("contains spa and mpa", () => {
		expect(MODES).toEqual(["spa", "mpa"]);
	});
});

describe("DEFAULT_ENTRY", () => {
	test("spa defaults to ./public/index.html", () => {
		expect(DEFAULT_ENTRY.spa).toBe("./public/index.html");
	});

	test("mpa defaults to ./src/routes/**/index.html", () => {
		expect(DEFAULT_ENTRY.mpa).toBe("./src/routes/**/index.html");
	});
});

describe("globBase", () => {
	test("returns the segments before the first wildcard", () => {
		expect(globBase("./src/routes/**/index.html")).toBe("./src/routes");
	});

	test("stops at a wildcard inside a segment", () => {
		expect(globBase("src/pages/*.html")).toBe("src/pages");
	});

	test("returns the whole dirname when there is no wildcard", () => {
		expect(globBase("public/index.html")).toBe("public");
	});

	test("returns '.' when the pattern has no directory", () => {
		expect(globBase("*.html")).toBe(".");
	});

	test("stops at a brace expansion", () => {
		expect(globBase("./src/routes/{about,blog}/index.html")).toBe(
			"./src/routes",
		);
	});

	test("stops at a character class", () => {
		expect(globBase("./src/routes/[ab]*/index.html")).toBe("./src/routes");
	});

	test("stops at a single character wildcard", () => {
		expect(globBase("./src/routes/page?/index.html")).toBe("./src/routes");
	});
});

describe("DEFAULT_MODE", () => {
	test("is spa", () => {
		expect(DEFAULT_MODE).toBe("spa");
	});
});

describe("entryRoot", () => {
	test("is the directory of the file in spa mode", () => {
		expect(entryRoot("spa", "./public/index.html", CWD)).toBe(
			resolve(CWD, "public"),
		);
	});

	test("is the static prefix of the glob in mpa mode", () => {
		expect(entryRoot("mpa", "./src/routes/**/index.html", CWD)).toBe(
			resolve(CWD, "src/routes"),
		);
	});

	test("follows a custom glob in mpa mode", () => {
		expect(entryRoot("mpa", "./src/pages/**/index.html", CWD)).toBe(
			resolve(CWD, "src/pages"),
		);
	});
});

describe("duplicateRoutes", () => {
	const entry = (route: string, path: string) => ({
		path,
		route,
		wildcard: route === "/" ? "/*" : `${route}/*`,
	});

	test("returns nothing when every route is unique", () => {
		expect(
			duplicateRoutes([entry("/", "/a/index.html"), entry("/b", "/b.html")]),
		).toEqual([]);
	});

	test("returns each route claimed by more than one file", () => {
		expect(
			duplicateRoutes([
				entry("/about", "/about/index.html"),
				entry("/about", "/about/contact.html"),
				entry("/", "/index.html"),
			]),
		).toEqual(["/about"]);
	});

	test("reports a duplicated route once", () => {
		expect(
			duplicateRoutes([
				entry("/a", "/a/one.html"),
				entry("/a", "/a/two.html"),
				entry("/a", "/a/three.html"),
			]),
		).toEqual(["/a"]);
	});
});

describe("listEntries - spa", () => {
	test("resolves the pattern to a single absolute entry", () => {
		const entries = listEntries(
			createMockBun(),
			"spa",
			"./public/index.html",
			CWD,
		);

		expect(entries).toEqual([
			{
				path: resolve(CWD, "./public/index.html"),
				route: "/",
				wildcard: "/*",
			},
		]);
	});

	test("keeps an already absolute pattern unchanged", () => {
		const entries = listEntries(
			createMockBun(),
			"spa",
			"/elsewhere/app.html",
			CWD,
		);

		expect(entries[0]?.path).toBe("/elsewhere/app.html");
	});

	test("does not scan the filesystem", () => {
		const bun = createMockBun(["/project/src/routes/index.html"]);
		const entries = listEntries(bun, "spa", "./public/index.html", CWD);

		expect(entries).toHaveLength(1);
	});
});

describe("listEntries - mpa", () => {
	test("maps the root index.html to /", () => {
		const bun = createMockBun([resolve(CWD, "src/routes/index.html")]);
		const entries = listEntries(bun, "mpa", "./src/routes/**/index.html", CWD);

		expect(entries).toEqual([
			{
				path: resolve(CWD, "src/routes/index.html"),
				route: "/",
				wildcard: "/*",
			},
		]);
	});

	test("maps a nested directory to its url path", () => {
		const bun = createMockBun([resolve(CWD, "src/routes/about/index.html")]);
		const entries = listEntries(bun, "mpa", "./src/routes/**/index.html", CWD);

		expect(entries[0]).toEqual({
			path: resolve(CWD, "src/routes/about/index.html"),
			route: "/about",
			wildcard: "/about/*",
		});
	});

	test("maps a deeply nested directory to a multi segment url path", () => {
		const bun = createMockBun([
			resolve(CWD, "src/routes/blog/post/index.html"),
		]);
		const entries = listEntries(bun, "mpa", "./src/routes/**/index.html", CWD);

		expect(entries[0]?.route).toBe("/blog/post");
		expect(entries[0]?.wildcard).toBe("/blog/post/*");
	});

	test("returns every matched entry", () => {
		const bun = createMockBun([
			resolve(CWD, "src/routes/index.html"),
			resolve(CWD, "src/routes/about/index.html"),
			resolve(CWD, "src/routes/blog/index.html"),
		]);
		const entries = listEntries(bun, "mpa", "./src/routes/**/index.html", CWD);

		expect(entries.map((e) => e.route)).toEqual(["/", "/about", "/blog"]);
	});

	test("sorts entries by route so output is deterministic", () => {
		const bun = createMockBun([
			resolve(CWD, "src/routes/blog/index.html"),
			resolve(CWD, "src/routes/index.html"),
			resolve(CWD, "src/routes/about/index.html"),
		]);
		const entries = listEntries(bun, "mpa", "./src/routes/**/index.html", CWD);

		expect(entries.map((e) => e.route)).toEqual(["/", "/about", "/blog"]);
	});

	test("returns an empty list when nothing matches", () => {
		const entries = listEntries(
			createMockBun([]),
			"mpa",
			"./src/routes/**/index.html",
			CWD,
		);

		expect(entries).toEqual([]);
	});

	test("scans with the pattern relative to cwd and absolute results", () => {
		let seen: unknown;
		const bun = {
			Glob: class {
				constructor(readonly pattern: string) {}
				scanSync(options: unknown): string[] {
					seen = options;
					return [];
				}
			},
		} as unknown as typeof BunType;

		listEntries(bun, "mpa", "./src/routes/**/index.html", CWD);

		expect(seen).toEqual({ cwd: CWD, absolute: true, onlyFiles: true });
	});
});
