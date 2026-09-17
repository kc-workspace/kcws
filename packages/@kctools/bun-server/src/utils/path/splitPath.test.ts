import { resolve } from "node:path";
import { describe, expect, test, vi } from "vitest";
import type { BunType } from "#types";
import splitPath from "./splitPath";

const createMockBun = (existing: string[] = []) =>
	({
		file: vi.fn((path: string) => ({
			exists: () => Promise.resolve(existing.includes(path)),
		})),
	}) as unknown as BunType;

describe("splitPath", () => {
	test.each([
		{
			name: "splits at the first segment holding a pattern",
			source: "src/images/*.png",
			expected: { root: "src/images", pattern: "*.png" },
		},
		{
			name: "keeps the whole source as pattern when it starts with one",
			source: "**/*.html",
			expected: { root: "", pattern: "**/*.html" },
		},
		{
			name: "uses the default pattern when the source is a directory",
			source: "assets",
			expected: { root: "assets", pattern: "**/*" },
		},
	])("$name", async ({ source, expected }) => {
		await expect(splitPath(createMockBun(), source, "/repo")).resolves.toEqual(
			expected,
		);
	});

	test.each(["*", "?", "[", "]", "{", "}", "!"])(
		"treats %s as a pattern character",
		async (magic) => {
			await expect(
				splitPath(createMockBun(), `src/a${magic}b`, "/repo"),
			).resolves.toEqual({ root: "src", pattern: `a${magic}b` });
		},
	);

	test("splits an existing file into its directory and name", async () => {
		const bun = createMockBun([resolve("/repo", "src/index.html")]);

		await expect(splitPath(bun, "src/index.html", "/repo")).resolves.toEqual({
			root: "src",
			pattern: "index.html",
		});
	});

	test("uses the given default pattern", async () => {
		await expect(
			splitPath(createMockBun(), "routes", "/repo", "**/*.html"),
		).resolves.toEqual({ root: "routes", pattern: "**/*.html" });
	});

	test("checks the source against the working directory", async () => {
		const bun = createMockBun();

		await splitPath(bun, "assets", "/repo");

		expect(bun.file).toHaveBeenCalledWith(resolve("/repo", "assets"));
	});
});
