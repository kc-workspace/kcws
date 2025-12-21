import { cwd } from "node:process";
import { vol } from "@kcconfigs/vitest/mocks";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { findBunPackages, findNpmPackages, findPnpmPackages } from "./projects";

describe("Project APIs", () => {
	afterEach(() => {
		vol.reset();
	});

	describe(findNpmPackages.name, () => {
		beforeEach(() => {
			vi.mocked(cwd).mockReturnValue("/mock/npm-workspace");
		});

		test("should find empty packages when no workspaces defined", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "npm-workspace",
					}),
				},
				cwd(),
			);

			const packages = await findNpmPackages(false);

			expect(cwd()).toEqual("/mock/npm-workspace");
			expect(packages).toEqual([]);
		});

		test("should return workspace packages without root", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "npm-workspace",
						workspaces: ["packages/*"],
					}),
					"./packages/pkg-a/package.json": JSON.stringify({
						name: "@scope/pkg-a",
					}),
					"./packages/pkg-b/package.json": JSON.stringify({
						name: "@scope/pkg-b",
					}),
				},
				cwd(),
			);

			const packages = await findNpmPackages(false);

			expect(cwd()).toEqual("/mock/npm-workspace");
			expect(packages.sort()).toEqual(["scope/pkg-a", "scope/pkg-b"].sort());
		});

		test("should return workspace packages with root", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "npm-workspace",
						workspaces: ["**"],
					}),
					"./packages/pkg-a/package.json": JSON.stringify({
						name: "@scope/pkg-a",
					}),
					"./packages/pkg-b/package.json": JSON.stringify({
						name: "@scope/pkg-b",
					}),
				},
				cwd(),
			);

			const packages = await findNpmPackages(true);

			expect(cwd()).toEqual("/mock/npm-workspace");
			expect(packages.sort()).toEqual(
				["npm-workspace", "scope/pkg-a", "scope/pkg-b"].sort(),
			);
		});

		test("should fallback to directory name when manifest name missing", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "npm-workspace",
						workspaces: ["packages/*"],
					}),
					"./packages/pkg-a/package.json": JSON.stringify({
						version: "1.0.0",
					}),
					"./packages/pkg-b/package.json": JSON.stringify({
						version: "1.0.0",
					}),
				},
				cwd(),
			);

			const packages = await findNpmPackages(false);

			expect(cwd()).toEqual("/mock/npm-workspace");
			expect(packages.sort()).toEqual(["pkg-a", "pkg-b"].sort());
		});

		test("should handle packages without scope prefix", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "npm-workspace",
						workspaces: ["packages/*"],
					}),
					"./packages/pkg-a/package.json": JSON.stringify({
						name: "pkg-a",
					}),
					"./packages/pkg-b/package.json": JSON.stringify({
						name: "pkg-b",
					}),
				},
				cwd(),
			);

			const packages = await findNpmPackages(false);

			expect(cwd()).toEqual("/mock/npm-workspace");
			expect(packages.sort()).toEqual(["pkg-a", "pkg-b"].sort());
		});
	});

	describe(findPnpmPackages.name, () => {
		beforeEach(() => {
			vi.mocked(cwd).mockReturnValue("/mock/pnpm-workspace");
		});

		test("should find empty packages when no packages defined", async () => {
			vol.fromJSON(
				{
					"./pnpm-workspace.yaml": "",
				},
				cwd(),
			);

			const packages = await findPnpmPackages(false);

			expect(cwd()).toEqual("/mock/pnpm-workspace");
			expect(packages).toEqual([]);
		});

		test("should return workspace packages without root", async () => {
			vol.fromJSON(
				{
					"./pnpm-workspace.yaml": "packages:\n  - 'packages/*'",
					"./packages/pkg-a/package.json": JSON.stringify({
						name: "@scope/pkg-a",
					}),
					"./packages/pkg-b/package.json": JSON.stringify({
						name: "@scope/pkg-b",
					}),
				},
				cwd(),
			);

			const packages = await findPnpmPackages(false);

			expect(cwd()).toEqual("/mock/pnpm-workspace");
			expect(packages.sort()).toEqual(["scope/pkg-a", "scope/pkg-b"].sort());
		});

		test("should return workspace packages with root", async () => {
			vol.fromJSON(
				{
					"./pnpm-workspace.yaml": "packages:\n  - '**'",
					"./package.json": JSON.stringify({
						name: "pnpm-workspace",
					}),
					"./packages/pkg-a/package.json": JSON.stringify({
						name: "@scope/pkg-a",
					}),
					"./packages/pkg-b/package.json": JSON.stringify({
						name: "@scope/pkg-b",
					}),
				},
				cwd(),
			);

			const packages = await findPnpmPackages(true);

			expect(cwd()).toEqual("/mock/pnpm-workspace");
			expect(packages.sort()).toEqual(
				["pnpm-workspace", "scope/pkg-a", "scope/pkg-b"].sort(),
			);
		});

		test("should fallback to directory name when manifest name missing", async () => {
			vol.fromJSON(
				{
					"./pnpm-workspace.yaml": "packages:\n  - 'packages/*'",
					"./packages/pkg-a/package.json": JSON.stringify({
						version: "1.0.0",
					}),
					"./packages/pkg-b/package.json": JSON.stringify({
						version: "1.0.0",
					}),
				},
				cwd(),
			);

			const packages = await findPnpmPackages(false);

			expect(cwd()).toEqual("/mock/pnpm-workspace");
			expect(packages.sort()).toEqual(["pkg-a", "pkg-b"].sort());
		});

		test("should handle multiple package patterns", async () => {
			vol.fromJSON(
				{
					"./pnpm-workspace.yaml": "packages:\n  - 'packages/*'\n  - 'apps/*'",
					"./packages/pkg-a/package.json": JSON.stringify({
						name: "@scope/pkg-a",
					}),
					"./apps/app-a/package.json": JSON.stringify({
						name: "@scope/app-a",
					}),
				},
				cwd(),
			);

			const packages = await findPnpmPackages(false);

			expect(cwd()).toEqual("/mock/pnpm-workspace");
			expect(packages.sort()).toEqual(["scope/pkg-a", "scope/app-a"].sort());
		});

		test("should default to false when includeRoot is undefined", async () => {
			vol.fromJSON(
				{
					"./pnpm-workspace.yaml": "packages:\n  - '**'",
					"./package.json": JSON.stringify({
						name: "pnpm-workspace",
					}),
					"./packages/pkg-a/package.json": JSON.stringify({
						name: "@scope/pkg-a",
					}),
				},
				cwd(),
			);

			const packages = await findPnpmPackages();

			expect(cwd()).toEqual("/mock/pnpm-workspace");
			expect(packages.sort()).toEqual(["scope/pkg-a"].sort());
		});
	});

	describe(findBunPackages.name, () => {
		beforeEach(() => {
			vi.mocked(cwd).mockReturnValue("/mock/bun-workspace");
		});

		test("should find empty packages when no workspaces defined", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "bun-workspace",
					}),
				},
				cwd(),
			);

			const packages = await findBunPackages(false);

			expect(cwd()).toEqual("/mock/bun-workspace");
			expect(packages).toEqual([]);
		});

		test("should return workspace packages without root", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "bun-workspace",
						workspaces: ["packages/*"],
					}),
					"./packages/pkg-a/package.json": JSON.stringify({
						name: "@scope/pkg-a",
					}),
					"./packages/pkg-b/package.json": JSON.stringify({
						name: "@scope/pkg-b",
					}),
				},
				cwd(),
			);

			const packages = await findBunPackages(false);

			expect(cwd()).toEqual("/mock/bun-workspace");
			expect(packages.sort()).toEqual(["scope/pkg-a", "scope/pkg-b"].sort());
		});

		test("should return workspace packages with root", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "bun-workspace",
						workspaces: ["**"],
					}),
					"./packages/pkg-a/package.json": JSON.stringify({
						name: "@scope/pkg-a",
					}),
					"./packages/pkg-b/package.json": JSON.stringify({
						name: "@scope/pkg-b",
					}),
				},
				cwd(),
			);

			const packages = await findBunPackages(true);

			expect(cwd()).toEqual("/mock/bun-workspace");
			expect(packages.sort()).toEqual(
				["bun-workspace", "scope/pkg-a", "scope/pkg-b"].sort(),
			);
		});

		test("should fallback to directory name when manifest name missing", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "bun-workspace",
						workspaces: ["packages/*"],
					}),
					"./packages/pkg-a/package.json": JSON.stringify({
						version: "1.0.0",
					}),
					"./packages/pkg-b/package.json": JSON.stringify({
						version: "1.0.0",
					}),
				},
				cwd(),
			);

			const packages = await findBunPackages(false);

			expect(cwd()).toEqual("/mock/bun-workspace");
			expect(packages.sort()).toEqual(["pkg-a", "pkg-b"].sort());
		});
	});
});
