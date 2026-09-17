import { resolve } from "node:path";
import { describe, expect, test, vi } from "vitest";
import type { BunType } from "#types";
import createRouteSpecs from "./createRouteSpecs";
import type { RouteSpec } from "./types";

const createMockBun = (existing: string[] = []) =>
	({
		file: vi.fn((path: string) => ({
			exists: () => Promise.resolve(existing.includes(path)),
		})),
	}) as unknown as BunType;

const option = { cwd: "/repo" };

interface SpecCase {
	name: string;
	inputs: string[];
	/** Files existing below the working directory. */
	existing?: string[];
	expected: RouteSpec[];
}

describe("createRouteSpecs", () => {
	test.each<SpecCase>([
		{
			name: "uses the default route directory when there is no input",
			inputs: [],
			expected: [
				{
					source: "<default>",
					root: "/repo/src/routes",
					pattern: "**/*.html",
				},
			],
		},
		{
			name: "roots a directory input at the working directory",
			inputs: ["pages"],
			expected: [
				{ source: "pages", root: "/repo/pages", pattern: "**/*.html" },
			],
		},
		{
			name: "splits an input holding a pattern",
			inputs: ["pages/**/*.html"],
			expected: [
				{
					source: "pages/**/*.html",
					root: "/repo/pages",
					pattern: "**/*.html",
				},
			],
		},
		{
			name: "splits an input pointing at an existing file",
			inputs: ["pages/about.html"],
			existing: [resolve("/repo", "pages/about.html")],
			expected: [
				{
					source: "pages/about.html",
					root: "/repo/pages",
					pattern: "about.html",
				},
			],
		},
	])("$name", async ({ inputs, existing, expected }) => {
		await expect(
			createRouteSpecs(createMockBun(existing), inputs, option),
		).resolves.toEqual(expected);
	});

	test("creates one spec per input", async () => {
		const specs = await createRouteSpecs(
			createMockBun(),
			["pages", "docs"],
			option,
		);

		expect(specs.map((spec) => spec.root)).toEqual([
			"/repo/pages",
			"/repo/docs",
		]);
	});
});
