import { describe, expect, test, vi } from "vitest";
import type { BunType } from "#types";
import resolveRouteSpecs from "./resolveRouteSpecs";
import type { RouteSpec } from "./types";

const createMockBun = (files: Record<string, string[]>) => {
	const scan = vi.fn(function* (option: { cwd: string }): Generator<string> {
		yield* files[option.cwd] ?? [];
	});

	class Glob {
		constructor(public readonly pattern: string) {}
		scan = scan;
	}

	return { bun: { Glob } as unknown as BunType, scan };
};

const spec = (root: string, pattern = "**/*.html"): RouteSpec => ({
	source: root,
	root,
	pattern,
});

describe("resolveRouteSpecs", () => {
	test.each([
		{
			name: "an index file to the root route",
			file: "index.html",
			route: "/",
			wildcard: "/*",
		},
		{
			name: "a named file to its route",
			file: "about.html",
			route: "/about",
			wildcard: "/about/*",
		},
		{
			name: "a nested index file to its directory route",
			file: "blog/index.html",
			route: "/blog",
			wildcard: "/blog/*",
		},
		{
			name: "a nested named file to its nested route",
			file: "blog/first-post.html",
			route: "/blog/first-post",
			wildcard: "/blog/first-post/*",
		},
	])("maps $name", async ({ file, route, wildcard }) => {
		const path = `/repo/pages/${file}`;
		const { bun } = createMockBun({ "/repo/pages": [path] });

		await expect(
			resolveRouteSpecs(bun, [spec("/repo/pages")]),
		).resolves.toEqual([{ path, route, wildcard }]);
	});

	test("scans each spec with its own pattern and root", async () => {
		const { bun, scan } = createMockBun({});

		await resolveRouteSpecs(bun, [spec("/repo/pages", "*.html")]);

		expect(scan).toHaveBeenCalledWith({
			absolute: true,
			cwd: "/repo/pages",
			dot: false,
		});
	});

	test("resolves every spec", async () => {
		const { bun } = createMockBun({
			"/repo/pages": ["/repo/pages/index.html"],
			"/repo/docs": ["/repo/docs/guide.html"],
		});

		await expect(
			resolveRouteSpecs(bun, [spec("/repo/pages"), spec("/repo/docs")]),
		).resolves.toMatchObject([{ route: "/" }, { route: "/guide" }]);
	});

	test("resolves nothing when no file matches", async () => {
		const { bun } = createMockBun({});

		await expect(
			resolveRouteSpecs(bun, [spec("/repo/pages")]),
		).resolves.toEqual([]);
	});
});
