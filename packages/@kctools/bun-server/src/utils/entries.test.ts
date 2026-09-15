import { error } from "node:console";
import { resolve } from "node:path";
import type * as BunType from "bun";
import { describe, expect, test } from "vitest";
import {
	DEFAULT_ENTRY,
	DEFAULT_MODE,
	duplicateRoutes,
	entryRoot,
	listEntries,
	MODES,
	PAGE_GLOB,
	resolveInput,
} from "./entries";

const CWD = "/project";
const ROUTES = resolve(CWD, "src/routes");

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

describe("DEFAULT_MODE", () => {
	test("is spa", () => {
		expect(DEFAULT_MODE).toBe("spa");
	});
});

describe("DEFAULT_ENTRY", () => {
	test("spa defaults to the public index file", () => {
		expect(DEFAULT_ENTRY.spa).toBe("./public/index.html");
	});

	test("mpa defaults to the routes directory", () => {
		expect(DEFAULT_ENTRY.mpa).toBe("./src/routes");
	});
});

describe("PAGE_GLOB", () => {
	test("matches every html document below the directory", () => {
		expect(PAGE_GLOB).toBe("**/*.html");
	});
});

describe("entryRoot", () => {
	test("is the directory of the file in spa mode", () => {
		expect(entryRoot("spa", "./public/index.html", CWD)).toBe(
			resolve(CWD, "public"),
		);
	});

	test("is the directory itself in mpa mode", () => {
		expect(entryRoot("mpa", "./src/routes", CWD)).toBe(ROUTES);
	});

	test("follows a custom directory in mpa mode", () => {
		expect(entryRoot("mpa", "./src/pages", CWD)).toBe(
			resolve(CWD, "src/pages"),
		);
	});
});

describe("listEntries - spa", () => {
	test("resolves the path to a single absolute entry", () => {
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

	test("keeps an already absolute path unchanged", () => {
		const entries = listEntries(
			createMockBun(),
			"spa",
			"/elsewhere/app.html",
			CWD,
		);

		expect(entries[0]?.path).toBe("/elsewhere/app.html");
	});

	test("does not scan the filesystem", () => {
		const bun = createMockBun([resolve(ROUTES, "index.html")]);
		const entries = listEntries(bun, "spa", "./public/index.html", CWD);

		expect(entries).toHaveLength(1);
	});
});

describe("listEntries - mpa", () => {
	const list = (files: string[], directory = "./src/routes") =>
		listEntries(createMockBun(files), "mpa", directory, CWD);

	test("maps the root index document to /", () => {
		expect(list([resolve(ROUTES, "index.html")])).toEqual([
			{ path: resolve(ROUTES, "index.html"), route: "/", wildcard: "/*" },
		]);
	});

	test("maps the index document of a sub directory to that directory", () => {
		expect(list([resolve(ROUTES, "about/index.html")])[0]).toEqual({
			path: resolve(ROUTES, "about/index.html"),
			route: "/about",
			wildcard: "/about/*",
		});
	});

	test("maps a named document to its own route", () => {
		expect(list([resolve(ROUTES, "about.html")])[0]).toEqual({
			path: resolve(ROUTES, "about.html"),
			route: "/about",
			wildcard: "/about/*",
		});
	});

	test("maps a named document inside a sub directory", () => {
		expect(list([resolve(ROUTES, "blog/post.html")])[0]?.route).toBe(
			"/blog/post",
		);
	});

	test("maps a deeply nested index document", () => {
		const entry = list([resolve(ROUTES, "blog/post/index.html")])[0];

		expect(entry?.route).toBe("/blog/post");
		expect(entry?.wildcard).toBe("/blog/post/*");
	});

	test("returns every matched document", () => {
		const entries = list([
			resolve(ROUTES, "index.html"),
			resolve(ROUTES, "about.html"),
			resolve(ROUTES, "blog/post/index.html"),
		]);

		expect(entries.map((e) => e.route)).toEqual(["/", "/about", "/blog/post"]);
	});

	test("sorts entries by route so output is deterministic", () => {
		const entries = list([
			resolve(ROUTES, "blog.html"),
			resolve(ROUTES, "index.html"),
			resolve(ROUTES, "about/index.html"),
		]);

		expect(entries.map((e) => e.route)).toEqual(["/", "/about", "/blog"]);
	});

	test("returns an empty list when nothing matches", () => {
		expect(list([])).toEqual([]);
	});

	test("scans the html glob from inside the given directory", () => {
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

		listEntries(bun, "mpa", "./src/routes", CWD);

		expect(pattern).toBe(PAGE_GLOB);
		expect(options).toEqual({
			cwd: ROUTES,
			absolute: true,
			onlyFiles: true,
			dot: false,
		});
	});

	test("scans a custom directory", () => {
		let options: unknown;
		const bun = {
			Glob: class {
				constructor(readonly pattern: string) {}
				scanSync(scanOptions: unknown): string[] {
					options = scanOptions;
					return [];
				}
			},
		} as unknown as typeof BunType;

		listEntries(bun, "mpa", "./src/pages", CWD);

		expect(options).toEqual({
			cwd: resolve(CWD, "src/pages"),
			absolute: true,
			onlyFiles: true,
			dot: false,
		});
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

	test("returns each route claimed by more than one document", () => {
		expect(
			duplicateRoutes([
				entry("/about", "/about.html"),
				entry("/about", "/about/index.html"),
				entry("/", "/index.html"),
			]),
		).toEqual(["/about"]);
	});

	test("reports a duplicated route once", () => {
		expect(
			duplicateRoutes([
				entry("/a", "/a.html"),
				entry("/a", "/a/index.html"),
				entry("/a", "/a/index.html"),
			]),
		).toEqual(["/a"]);
	});

	test("detects the named and index document collision from a real scan", () => {
		const entries = listEntries(
			createMockBun([
				resolve(ROUTES, "about.html"),
				resolve(ROUTES, "about/index.html"),
			]),
			"mpa",
			"./src/routes",
			CWD,
		);

		expect(duplicateRoutes(entries)).toEqual(["/about"]);
	});
});

describe("resolveInput", () => {
	const resolveFrom = (
		files: string[],
		directory: string | undefined = "./src/routes",
	) => resolveInput(createMockBun(files), "mpa", directory, CWD);

	test("returns the entries when the input resolves cleanly", () => {
		const resolved = resolveFrom([
			resolve(ROUTES, "index.html"),
			resolve(ROUTES, "about.html"),
		]);

		expect(resolved?.entries.map((e) => e.route)).toEqual(["/", "/about"]);
	});

	test("returns the root the entries are laid out from", () => {
		const resolved = resolveFrom([resolve(ROUTES, "index.html")]);

		expect(resolved?.root).toBe(ROUTES);
	});

	test("falls back to the default input of the mode", () => {
		let scanned: string | undefined;
		const bun = {
			Glob: class {
				constructor(readonly pattern: string) {}
				scanSync(options: { cwd: string }): string[] {
					scanned = options.cwd;
					return [resolve(ROUTES, "index.html")];
				}
			},
		} as unknown as typeof BunType;

		const resolved = resolveInput(bun, "mpa", undefined, CWD);

		expect(scanned).toBe(ROUTES);
		expect(resolved?.root).toBe(ROUTES);
	});

	test("reports an input matching nothing and returns undefined", () => {
		expect(resolveFrom([])).toBeUndefined();
		expect(error).toHaveBeenCalledWith("No HTML entry found in ./src/routes");
	});

	test("names the input that matched nothing", () => {
		resolveFrom([], "./src/pages");

		expect(error).toHaveBeenCalledWith("No HTML entry found in ./src/pages");
	});

	test("names the default input when none was given", () => {
		resolveInput(createMockBun([]), "mpa", undefined, CWD);

		expect(error).toHaveBeenCalledWith("No HTML entry found in ./src/routes");
	});

	test("reports colliding routes and returns undefined", () => {
		const resolved = resolveFrom([
			resolve(ROUTES, "about.html"),
			resolve(ROUTES, "about/index.html"),
		]);

		expect(resolved).toBeUndefined();
		expect(error).toHaveBeenCalledWith(
			"Multiple HTML entries claim the same route: /about",
		);
	});

	test("lists every colliding route", () => {
		resolveFrom([
			resolve(ROUTES, "about.html"),
			resolve(ROUTES, "about/index.html"),
			resolve(ROUTES, "blog.html"),
			resolve(ROUTES, "blog/index.html"),
		]);

		expect(error).toHaveBeenCalledWith(
			"Multiple HTML entries claim the same route: /about, /blog",
		);
	});

	test("resolves a spa input without scanning", () => {
		const resolved = resolveInput(
			createMockBun(),
			"spa",
			"./public/index.html",
			CWD,
		);

		expect(resolved?.entries).toEqual([
			{ path: resolve(CWD, "public/index.html"), route: "/", wildcard: "/*" },
		]);
		expect(resolved?.root).toBe(resolve(CWD, "public"));
	});
});

describe("listEntries - missing directory", () => {
	const throwingBun = (failure: unknown) =>
		({
			Glob: class {
				constructor(readonly pattern: string) {}
				scanSync(): string[] {
					throw failure;
				}
			},
		}) as unknown as typeof BunType;

	const withCode = (code: string) =>
		Object.assign(new Error(`${code}: scan failed`), { code });

	test("treats a missing directory as no documents", () => {
		expect(
			listEntries(throwingBun(withCode("ENOENT")), "mpa", "./nope", CWD),
		).toEqual([]);
	});

	test("treats a file given where a directory belongs as no documents", () => {
		expect(
			listEntries(throwingBun(withCode("ENOTDIR")), "mpa", "./a.html", CWD),
		).toEqual([]);
	});

	test("rethrows any other scan failure", () => {
		const failure = withCode("EACCES");

		expect(() =>
			listEntries(throwingBun(failure), "mpa", "./secret", CWD),
		).toThrow(failure);
	});

	test("reports a missing directory through resolveInput", () => {
		const resolved = resolveInput(
			throwingBun(withCode("ENOENT")),
			"mpa",
			"./nope",
			CWD,
		);

		expect(resolved).toBeUndefined();
		expect(error).toHaveBeenCalledWith("No HTML entry found in ./nope");
	});
});
