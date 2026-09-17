import { describe, expect, test, vi } from "vitest";
import type { BunType } from "#types";
import resolveStaticSpecs from "./resolveStaticSpecs";
import type { StaticSpec } from "./types";

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

const spec = (root: string, dirname: string, pattern = "**/*"): StaticSpec => ({
	source: root,
	root,
	pattern,
	target: { base: "/repo/dist", dirname },
});

describe("resolveStaticSpecs", () => {
	test.each([
		{
			name: "a file into its route and target",
			root: "/repo/assets",
			dirname: "assets",
			file: "/repo/assets/logo.png",
			route: "/assets/logo.png",
			target: "/repo/dist/assets/logo.png",
		},
		{
			name: "the directories below the root",
			root: "/repo/assets",
			dirname: "assets",
			file: "/repo/assets/img/logo.png",
			route: "/assets/img/logo.png",
			target: "/repo/dist/assets/img/logo.png",
		},
		{
			name: "a file served from the output root",
			root: "/repo/public",
			dirname: ".",
			file: "/repo/public/favicon.ico",
			route: "/favicon.ico",
			target: "/repo/dist/favicon.ico",
		},
	])("resolves $name", async ({ root, dirname, file, route, target }) => {
		const { bun } = createMockBun({ [root]: [file] });

		await expect(
			resolveStaticSpecs(bun, [spec(root, dirname)]),
		).resolves.toEqual([{ route, source: file, target }]);
	});

	test("scans hidden files too", async () => {
		const { bun, scan } = createMockBun({});

		await resolveStaticSpecs(bun, [spec("/repo/assets", "assets", "*.png")]);

		expect(scan).toHaveBeenCalledWith({
			absolute: true,
			cwd: "/repo/assets",
			dot: true,
		});
	});

	test("resolves every spec", async () => {
		const { bun } = createMockBun({
			"/repo/assets": ["/repo/assets/logo.png"],
			"/repo/public": ["/repo/public/favicon.ico"],
		});

		await expect(
			resolveStaticSpecs(bun, [
				spec("/repo/assets", "assets"),
				spec("/repo/public", "."),
			]),
		).resolves.toMatchObject([
			{ route: "/assets/logo.png" },
			{ route: "/favicon.ico" },
		]);
	});

	test("resolves nothing when no file matches", async () => {
		const { bun } = createMockBun({});

		await expect(
			resolveStaticSpecs(bun, [spec("/repo/assets", "assets")]),
		).resolves.toEqual([]);
	});
});
