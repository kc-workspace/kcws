import { describe, expect, test } from "vitest";
import unusedPlugin from "./unused";

describe("unusedPlugin", () => {
	test("should have correct plugin name", () => {
		const plugin = unusedPlugin(true);
		expect(plugin.name).toBe("unused");
	});

	test("should apply unused config when true", () => {
		const plugin = unusedPlugin(true);
		const base = { unused: undefined };
		const result = plugin.apply?.(base, {});
		expect(result?.unused).toBe(true);
	});

	test("should apply unused config when false", () => {
		const plugin = unusedPlugin(false);
		const base = { unused: undefined };
		const result = plugin.apply?.(base, {});
		expect(result?.unused).toBe(false);
	});

	test("should apply unused config with object options", () => {
		const unusedConfig = { level: "error" as const, depKinds: ["dependencies"] as const };
		const plugin = unusedPlugin(unusedConfig);
		const base = { unused: undefined };
		const result = plugin.apply?.(base, {});
		expect(result?.unused).toEqual(unusedConfig);
	});

	test("should preserve existing base config when applying", () => {
		const plugin = unusedPlugin(true);
		const base = { entry: ["./src/index.ts"], unused: undefined };
		const result = plugin.apply?.(base, {});
		expect(result?.entry).toEqual(["./src/index.ts"]);
		expect(result?.unused).toBe(true);
	});
});
