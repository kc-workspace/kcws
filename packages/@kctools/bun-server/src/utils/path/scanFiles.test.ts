import { describe, expect, test, vi } from "vitest";
import type { BunType } from "#types";
import scanFiles from "./scanFiles";

interface MockGlobOption {
	files?: string[];
	error?: unknown;
}

const createMockBun = ({ files = [], error }: MockGlobOption) => {
	const scan = vi.fn(function* (): Generator<string> {
		if (error !== undefined) throw error;
		yield* files;
	});

	class Glob {
		constructor(public readonly pattern: string) {}
		scan = scan;
	}

	return { bun: { Glob } as unknown as BunType, scan };
};

const errorWithCode = (code: string): Error =>
	Object.assign(new Error(code), { code });

describe("scanFiles", () => {
	test("returns every scanned file", async () => {
		const { bun } = createMockBun({ files: ["/repo/a.html", "/repo/b.html"] });

		await expect(
			scanFiles(bun, "**/*.html", { cwd: "/repo" }),
		).resolves.toEqual(["/repo/a.html", "/repo/b.html"]);
	});

	test.each([
		{
			name: "scans absolute by default and keeps the given options",
			option: { cwd: "/repo", dot: true },
			expected: { absolute: true, cwd: "/repo", dot: true },
		},
		{
			name: "lets the given options override the defaults",
			option: { cwd: "/repo", absolute: false },
			expected: { absolute: false, cwd: "/repo" },
		},
	])("$name", async ({ option, expected }) => {
		const { bun, scan } = createMockBun({});

		await scanFiles(bun, "**/*.html", option);

		expect(scan).toHaveBeenCalledWith(expected);
	});

	test.each(["ENOENT", "ENOTDIR"])(
		"returns nothing when the directory is missing with %s",
		async (code) => {
			const { bun } = createMockBun({ error: errorWithCode(code) });

			await expect(
				scanFiles(bun, "**/*.html", { cwd: "/missing" }),
			).resolves.toEqual([]);
		},
	);

	test.each([
		{ name: "another code", error: errorWithCode("EACCES") },
		{ name: "no code", error: new Error("boom") },
	])("rethrows an error with $name", async ({ error }) => {
		const { bun } = createMockBun({ error });

		await expect(scanFiles(bun, "**/*.html", { cwd: "/repo" })).rejects.toBe(
			error,
		);
	});
});
