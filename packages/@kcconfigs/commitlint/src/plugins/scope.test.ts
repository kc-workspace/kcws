import { RuleConfigSeverity as Severity } from "@commitlint/types";
import { describe, expect, test } from "vitest";
import type { CommitlintConfig } from "../types";
import scopePlugin from "./scope";

const readScopes = (config: CommitlintConfig | undefined) => {
	const rule = config?.rules?.["scope-enum"] as () => [
		number,
		string,
		string[],
	];
	return rule();
};

describe("scopePlugin", () => {
	test("should have correct plugin name", () => {
		const plugin = scopePlugin(["api"]);
		expect(plugin.name).toBe("scope");
	});

	test("should configure scope-enum with the given scopes", () => {
		const plugin = scopePlugin(["api", "web"]);
		const [severity, condition, scopes] = readScopes(plugin.applyConfig?.({}));
		expect(severity).toBe(Severity.Error);
		expect(condition).toBe("always");
		expect(scopes).toEqual(["api", "web"]);
	});

	test("should expose scopes to the prompt", () => {
		const plugin = scopePlugin(["api", "web"]);
		const result = plugin.applyConfig?.({});
		expect(result?.prompt?.questions?.scope?.enum).toEqual({
			api: {},
			web: {},
		});
	});

	test("should fall back to default scopes when the list is empty", () => {
		const plugin = scopePlugin([]);
		const [, , scopes] = readScopes(plugin.applyConfig?.({}));
		expect(scopes.sort()).toEqual(
			["core", "config", "script", "deps", "deps-dev"].sort(),
		);
	});

	test("should replace scopes configured by an earlier plugin", () => {
		const first = scopePlugin(["old"]).applyConfig?.({}) ?? {};
		const result = scopePlugin(["new"]).applyConfig?.(first);
		const [, , scopes] = readScopes(result);
		expect(scopes).toEqual(["new"]);
		expect(result?.prompt?.questions?.scope?.enum).toEqual({ new: {} });
	});

	test("should preserve existing base config when applying", () => {
		const plugin = scopePlugin(["api"]);
		const result = plugin.applyConfig?.({
			helpUrl: "help",
			rules: { "type-enum": [Severity.Error, "always", ["feat"]] },
			prompt: {
				questions: { type: { enum: { feat: {} } } },
				settings: { enableMultipleScopes: false },
			},
		});
		expect(result?.helpUrl).toBe("help");
		expect(result?.rules?.["type-enum"]).toEqual([
			Severity.Error,
			"always",
			["feat"],
		]);
		expect(result?.prompt?.questions?.type?.enum).toEqual({ feat: {} });
		expect(result?.prompt?.settings?.enableMultipleScopes).toBe(false);
	});
});
