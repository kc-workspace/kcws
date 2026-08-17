import { cwd } from "node:process";
import { vol } from "@kcconfigs/vitest/mocks";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { defineConfig, Severity } from ".";

describe("Main API", () => {
	afterEach(() => {
		vol.reset();
	});

	describe("exports", () => {
		test("should export Severity enum", () => {
			expect(Severity).toBeDefined();
			expect(Severity.Error).toBe(2);
			expect(Severity.Warning).toBe(1);
			expect(Severity.Disabled).toBe(0);
		});
	});

	describe(defineConfig.name, () => {
		beforeEach(() => {
			vi.mocked(cwd).mockReturnValue("/mock/workspace");
		});

		test("should return config with default parameters", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "test-workspace",
						workspaces: ["packages/*"],
					}),
					"./packages/pkg-a/package.json": JSON.stringify({
						name: "@scope/pkg-a",
					}),
				},
				cwd(),
			);

			const config = await defineConfig();

			expect(config).toBeDefined();
			expect(config.helpUrl).toBe("use 'pnpm commit' to create commit instead");

			expect(config.rules).toBeDefined();
			expect(config.prompt?.questions?.type).toBeDefined();
			expect(config.prompt?.questions?.scope).toBeDefined();
		});

		test("should configure type-enum rule with standard types", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "test-workspace",
					}),
				},
				cwd(),
			);

			const config = await defineConfig();

			expect(config.rules?.["type-enum"]).toBeDefined();
			const [severity, condition, types] = config.rules!["type-enum"] as [
				number,
				string,
				string[],
			];

			expect(severity).toBe(Severity.Error);
			expect(condition).toBe("always");
			expect(types.sort()).toEqual(
				[
					"feat",
					"perf",
					"fix",
					"docs",
					"test",
					"style",
					"build",
					"refactor",
					"ci",
					"chore",
					"revert",
				].sort(),
			);
		});

		test("should configure type-enum rule with minimal types", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "test-workspace",
					}),
				},
				cwd(),
			);

			const config = await defineConfig({ types: "minimal" });

			const [, , types] = config.rules!["type-enum"] as [
				number,
				string,
				string[],
			];

			expect(types.sort()).toEqual(["feat", "perf", "fix", "chore"].sort());
		});

		test("should configure type-enum rule with custom types array", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "test-workspace",
					}),
				},
				cwd(),
			);

			const config = await defineConfig({
				types: ["custom1", "custom2", "custom3"],
			});

			const [, , types] = config.rules!["type-enum"] as [
				number,
				string,
				string[],
			];

			expect(types.sort()).toEqual(["custom1", "custom2", "custom3"].sort());
		});

		test("should configure type-enum rule with custom types object", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "test-workspace",
					}),
				},
				cwd(),
			);

			const customTypes = {
				type1: { description: "Type 1", emoji: "🎨" },
				type2: { description: "Type 2" },
			};

			const config = await defineConfig({ types: customTypes });

			const [, , types] = config.rules!["type-enum"] as [
				number,
				string,
				string[],
			];

			expect(types.sort()).toEqual(["type1", "type2"].sort());
		});

		test("should configure scope-enum with auto-detected scopes", async () => {
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

			const config = await defineConfig();

			expect(config.rules?.["scope-enum"]).toBeDefined();

			// Test scope-enum rule function
			const scopeRule = config.rules!["scope-enum"] as () => [
				number,
				string,
				string[],
			];
			const [severity, condition, scopes] = scopeRule();

			expect(severity).toBe(Severity.Error);
			expect(condition).toBe("always");
			expect(scopes.sort()).toEqual(["scope/pkg-a", "scope/pkg-b"].sort());
		});

		test("should configure scope-enum with custom scopes", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "test-workspace",
					}),
				},
				cwd(),
			);

			const config = await defineConfig({
				autoScopes: false,
				scopes: ["custom1", "custom2"],
			});

			const scopeRule = config.rules!["scope-enum"] as () => [
				number,
				string,
				string[],
			];
			const [, , scopes] = scopeRule();

			expect(scopes.sort()).toEqual(["custom1", "custom2"].sort());
		});

		test("should merge auto-detected and custom scopes", async () => {
			vol.fromJSON(
				{
					"./pnpm-workspace.yaml": "packages:\n  - 'packages/*'",
					"./packages/pkg-a/package.json": JSON.stringify({
						name: "@scope/pkg-a",
					}),
				},
				cwd(),
			);

			const config = await defineConfig({
				autoScopes: true,
				scopes: ["custom1", "custom2"],
			});

			const scopeRule = config.rules!["scope-enum"] as () => [
				number,
				string,
				string[],
			];
			const [, , scopes] = scopeRule();

			expect(scopes.sort()).toEqual(
				["custom1", "custom2", "scope/pkg-a"].sort(),
			);
		});

		test("should use default scopes when autoScopes is false and no custom scopes", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "test-workspace",
					}),
				},
				cwd(),
			);

			const config = await defineConfig({ autoScopes: false });

			const scopeRule = config.rules!["scope-enum"] as () => [
				number,
				string,
				string[],
			];
			const [, , scopes] = scopeRule();

			expect(scopes.sort()).toEqual(
				["core", "config", "script", "deps", "deps-dev"].sort(),
			);
		});

		test("should configure subject-max-length rule", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "test-workspace",
					}),
				},
				cwd(),
			);

			const config = await defineConfig();

			expect(config.rules?.["subject-max-length"]).toEqual([
				Severity.Warning,
				"always",
				80,
			]);
		});

		test("should configure body-max-line-length rule", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "test-workspace",
					}),
				},
				cwd(),
			);

			const config = await defineConfig();

			expect(config.rules?.["body-max-line-length"]).toEqual([
				Severity.Warning,
				"always",
				300,
			]);
		});

		test("should configure prompt with type enum", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "test-workspace",
					}),
				},
				cwd(),
			);

			const config = await defineConfig();

			expect(config.prompt).toBeDefined();
			expect(config.prompt?.questions).toBeDefined();
			expect(config.prompt?.questions?.type).toBeDefined();
			expect(config.prompt?.questions?.type?.enum).toBeDefined();

			const typeEnum = config.prompt!.questions!.type!.enum;
			expect(typeEnum).toBeDefined();
			if (typeEnum) {
				expect(Object.keys(typeEnum).sort()).toEqual(
					[
						"feat",
						"perf",
						"fix",
						"docs",
						"test",
						"style",
						"build",
						"refactor",
						"ci",
						"chore",
						"revert",
					].sort(),
				);
			}
		});

		test("should configure prompt with scope enum", async () => {
			vol.fromJSON(
				{
					"./pnpm-workspace.yaml": "packages:\n  - 'packages/*'",
					"./packages/pkg-a/package.json": JSON.stringify({
						name: "@scope/pkg-a",
					}),
				},
				cwd(),
			);

			const config = await defineConfig();

			expect(config.prompt?.questions?.scope).toBeDefined();
			expect(config.prompt?.questions?.scope?.enum).toBeDefined();

			const scopeEnum = config.prompt!.questions!.scope!.enum;
			expect(scopeEnum).toBeDefined();
			if (scopeEnum) {
				expect(Object.keys(scopeEnum).sort()).toEqual(["scope/pkg-a"].sort());
			}
		});

		test("should disable multiple scopes in prompt settings", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "test-workspace",
					}),
				},
				cwd(),
			);

			const config = await defineConfig();

			expect(config.prompt?.settings).toBeDefined();
			expect(config.prompt?.settings?.enableMultipleScopes).toBe(false);
		});

		test("should define only package-specific rule overrides", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "test-workspace",
					}),
				},
				cwd(),
			);

			const config = await defineConfig();

			// This package intentionally defines only its own rule set.
			expect(config.rules).toBeDefined();
			expect(Object.keys(config.rules!)).toHaveLength(4);
		});

		test("should define only type and scope prompt questions", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "test-workspace",
					}),
				},
				cwd(),
			);

			const config = await defineConfig();

			expect(config.prompt?.questions).toBeDefined();
			expect(Object.keys(config.prompt!.questions!).length).toBe(2);
		});

		test("should work with empty workspace (npm detection)", async () => {
			vol.fromJSON(
				{
					"./package.json": JSON.stringify({
						name: "test-workspace",
					}),
				},
				cwd(),
			);

			const config = await defineConfig();

			expect(config).toBeDefined();
			expect(config.rules?.["type-enum"]).toBeDefined();
			expect(config.rules?.["scope-enum"]).toBeDefined();
		});

		test("should work with bun workspace", async () => {
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

			const config = await defineConfig();

			const scopeRule = config.rules!["scope-enum"] as () => [
				number,
				string,
				string[],
			];
			const [, , scopes] = scopeRule();

			expect(scopes).toContain("scope/pkg-a");
		});

		test("should handle all parameters together", async () => {
			vol.fromJSON(
				{
					"./pnpm-workspace.yaml": "packages:\n  - 'packages/*'",
					"./packages/pkg-a/package.json": JSON.stringify({
						name: "@scope/pkg-a",
					}),
				},
				cwd(),
			);

			const config = await defineConfig({
				types: "minimal",
				autoScopes: true,
				scopes: ["custom"],
			});

			// Check types
			const [, , types] = config.rules!["type-enum"] as [
				number,
				string,
				string[],
			];
			expect(types.sort()).toEqual(["feat", "perf", "fix", "chore"].sort());

			// Check scopes
			const scopeRule = config.rules!["scope-enum"] as () => [
				number,
				string,
				string[],
			];
			const [, , scopes] = scopeRule();
			expect(scopes.sort()).toEqual(["custom", "scope/pkg-a"].sort());
		});
	});
});
