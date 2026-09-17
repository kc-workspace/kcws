import { describe, expect, test, vi } from "vitest";
import type { BunType } from "#types";
import parseRouteFiles from "./parseRouteFiles";

const createMockBun = (files: Record<string, string[]>) => {
	const scan = vi.fn(function* (option: { cwd: string }): Generator<string> {
		yield* files[option.cwd] ?? [];
	});

	class Glob {
		constructor(public readonly pattern: string) {}
		scan = scan;
	}

	return {
		Glob,
		file: vi.fn(() => ({ exists: () => Promise.resolve(false) })),
	} as unknown as BunType;
};

const option = { cwd: "/repo" };

describe("parseRouteFiles", () => {
	test("resolves the routes of the given inputs", async () => {
		const bun = createMockBun({
			"/repo/pages": ["/repo/pages/index.html", "/repo/pages/about.html"],
		});

		await expect(parseRouteFiles(bun, ["pages"], option)).resolves.toEqual([
			{ path: "/repo/pages/index.html", route: "/", wildcard: "/*" },
			{
				path: "/repo/pages/about.html",
				route: "/about",
				wildcard: "/about/*",
			},
		]);
	});

	test("falls back to the default route directory", async () => {
		const bun = createMockBun({
			"/repo/src/routes": ["/repo/src/routes/index.html"],
		});

		await expect(parseRouteFiles(bun, [], option)).resolves.toMatchObject([
			{ route: "/" },
		]);
	});

	test("resolves nothing when no file matches", async () => {
		await expect(
			parseRouteFiles(createMockBun({}), ["pages"], option),
		).resolves.toEqual([]);
	});

	test("throws when two inputs answer the same route", async () => {
		const bun = createMockBun({
			"/repo/pages": ["/repo/pages/about.html"],
			"/repo/docs": ["/repo/docs/about.html"],
		});

		await expect(
			parseRouteFiles(bun, ["pages", "docs"], option),
		).rejects.toThrow("Found duplicated routes: /about");
	});
});
