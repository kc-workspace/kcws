import { describe, expect, test, vi } from "vitest";
import type { BunType } from "#types";
import parseStaticFiles from "./parseStaticFiles";

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

const options = (statics: string[]) => ({
	cwd: "/repo",
	statics,
	out: "dist",
});

describe("parseStaticFiles", () => {
	test("resolves the files of the given static items", async () => {
		const bun = createMockBun({ "/repo/assets": ["/repo/assets/logo.png"] });

		await expect(parseStaticFiles(bun, options(["assets"]))).resolves.toEqual([
			{
				route: "/assets/logo.png",
				wildcard: "/assets/logo.png/*",
				source: "/repo/assets/logo.png",
				target: "/repo/dist/assets/logo.png",
			},
		]);
	});

	test("resolves nothing when there is no static item", async () => {
		await expect(
			parseStaticFiles(createMockBun({}), options([])),
		).resolves.toEqual([]);
	});

	test("throws when two static items answer the same route", async () => {
		const bun = createMockBun({
			"/repo/one": ["/repo/one/logo.png"],
			"/repo/two": ["/repo/two/logo.png"],
		});

		await expect(
			parseStaticFiles(bun, options(["one:assets", "two:assets"])),
		).rejects.toThrow("Found duplicated static files: /assets/logo.png");
	});
});
