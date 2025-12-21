import { cwd } from "node:process";
import { vol } from "@kcconfigs/vitest/mocks";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { getScopes } from "./scopes";

describe("Scopes APIs", () => {
	afterEach(() => {
		vol.reset();
	});

	describe(getScopes.name, () => {
		beforeEach(() => {
			vi.mocked(cwd).mockReturnValue("/mock/workspace");
		});

		test("should return default scopes when auto is false and no scopes provided", async () => {
			const scopes = await getScopes(false);

			expect(scopes).toEqual(["core", "config", "script", "deps", "deps-dev"]);
		});

		test("should return user-provided scopes when auto is false", async () => {
			const scopes = await getScopes(false, ["custom1", "custom2"]);

			expect(scopes.sort()).toEqual(["custom1", "custom2"].sort());
		});

		test("should detect pnpm workspace and return package scopes", async () => {
			vol.fromJSON(
				{
					"./pnpm-workspace.yaml": "packages:\n  - 'packages/*'",
					"./packages/pkg-a/package.json": JSON.stringify({
						name: "@scope/pkg-a",
					}),
				},
				cwd(),
			);

			const scopes = await getScopes(true);

			expect(scopes.sort()).toEqual(["scope/pkg-a"].sort());
		});

		test("should detect bun workspace with bun.lock", async () => {
			vol.fromJSON(
				{
					"./bun.lock": "",
					"./package.json": JSON.stringify({
						name: "bun-workspace",
						workspaces: ["packages/*"],
					}),
					"./packages/pkg-a/package.json": JSON.stringify({
						name: "@scope/pkg-a",
					}),
				},
				cwd(),
			);

			const scopes = await getScopes(true);

			expect(scopes.sort()).toEqual(["scope/pkg-a"].sort());
		});

		test("should detect bun workspace with bun.lockb", async () => {
			vol.fromJSON(
				{
					"./bun.lockb": "",
					"./package.json": JSON.stringify({
						name: "bun-workspace",
						workspaces: ["packages/*"],
					}),
					"./packages/pkg-a/package.json": JSON.stringify({
						name: "@scope/pkg-a",
					}),
				},
				cwd(),
			);

			const scopes = await getScopes(true);

			expect(scopes.sort()).toEqual(["scope/pkg-a"].sort());
		});

		test("should fallback to npm when no specific workspace file found", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "npm-workspace",
						workspaces: ["packages/*"],
					}),
					"./packages/pkg-a/package.json": JSON.stringify({
						name: "@scope/pkg-a",
					}),
				},
				cwd(),
			);

			const scopes = await getScopes(true);

			expect(scopes.sort()).toEqual(["scope/pkg-a"].sort());
		});

		test("should merge user scopes with auto-detected scopes", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "npm-workspace",
						workspaces: ["packages/*"],
					}),
					"./packages/pkg-a/package.json": JSON.stringify({
						name: "@scope/pkg-a",
					}),
				},
				cwd(),
			);

			const scopes = await getScopes(true, ["custom1", "custom2"]);

			expect(scopes.sort()).toEqual(
				["custom1", "custom2", "scope/pkg-a"].sort(),
			);
		});
	});
});
