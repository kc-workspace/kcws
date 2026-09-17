import { resolve } from "node:path";
import { describe, expect, test, vi } from "vitest";
import type { BunType } from "#types";
import createStaticSpecs from "./createStaticSpecs";

const createMockBun = (existing: string[] = []) =>
	({
		file: vi.fn((path: string) => ({
			exists: () => Promise.resolve(existing.includes(path)),
		})),
	}) as unknown as BunType;

const options = (statics: string[]) => ({
	cwd: "/repo",
	statics,
	out: "dist",
});

describe("createStaticSpecs", () => {
	test("creates nothing when there is no static item", async () => {
		await expect(
			createStaticSpecs(createMockBun(), options([])),
		).resolves.toEqual([]);
	});

	test.each([
		{
			name: "copies a directory into the output under its own name",
			item: "assets",
			expected: {
				source: "assets",
				root: "/repo/assets",
				pattern: "**/*",
				target: { base: "/repo/dist", dirname: "assets" },
			},
		},
		{
			name: "reads the target given after the separator",
			item: "public/*.png:images",
			expected: {
				source: "public/*.png",
				root: "/repo/public",
				pattern: "*.png",
				target: { base: "/repo/dist", dirname: "images" },
			},
		},
		{
			name: "splits at the last separator",
			item: "a:b:images",
			expected: {
				source: "a:b",
				root: "/repo/a:b",
				pattern: "**/*",
				target: { base: "/repo/dist", dirname: "images" },
			},
		},
	])("$name", async ({ item, expected }) => {
		await expect(
			createStaticSpecs(createMockBun(), options([item])),
		).resolves.toEqual([expected]);
	});

	test("copies into the working directory when there is no output", async () => {
		const specs = await createStaticSpecs(createMockBun(), {
			cwd: "/repo",
			statics: ["assets"],
			out: undefined,
		});

		expect(specs[0]?.target.base).toBe("/repo");
	});

	test("keeps an existing file as its own pattern", async () => {
		const bun = createMockBun([resolve("/repo", "public/favicon.ico")]);

		await expect(
			createStaticSpecs(bun, options(["public/favicon.ico:."])),
		).resolves.toMatchObject([
			{ root: "/repo/public", pattern: "favicon.ico" },
		]);
	});

	test("creates one spec per static item", async () => {
		const specs = await createStaticSpecs(
			createMockBun(),
			options(["assets", "public:."]),
		);

		expect(specs.map((spec) => spec.target.dirname)).toEqual(["assets", "."]);
	});

	test("accepts an absolute source with a target", async () => {
		await expect(
			createStaticSpecs(createMockBun(), options(["/etc/assets:assets"])),
		).resolves.toMatchObject([
			{ root: "/etc/assets", target: { dirname: "assets" } },
		]);
	});

	test.each([
		{
			name: "an absolute source has no target",
			item: "/etc/assets",
			message:
				"Static source /etc/assets needs an explicit target: /etc/assets:<target>",
		},
		{
			name: "the target escapes the output directory",
			item: "assets:../escape",
			message: "Static target ../escape escapes the output directory",
		},
		{
			name: "the target is the parent directory",
			item: "assets:..",
			message: "Static target .. escapes the output directory",
		},
		{
			name: "the target is absolute",
			item: "assets:/etc",
			message: "Static target /etc escapes the output directory",
		},
		{
			name: "the source alone escapes the output directory",
			item: "..",
			message: "Static target .. escapes the output directory",
		},
	])("throws when $name", async ({ item, message }) => {
		await expect(
			createStaticSpecs(createMockBun(), options([item])),
		).rejects.toThrow(message);
	});
});
