import { describe, expect, test } from "vitest";
import attwNormalize from "./attwNormalize";

describe("attwNormalize", () => {
	test("should have correct plugin name", () => {
		const plugin = attwNormalize();
		expect(plugin.name).toBe("attw");
	});

	test("should enable with esm-only profile when format is esm string", () => {
		const plugin = attwNormalize();
		const config = { attw: undefined, format: "esm" as const };
		const result = plugin.normalize?.(config, {});
		expect(result?.attw).toEqual({ enabled: true, profile: "esm-only" });
	});

	test("should enable with node16 profile when format is undefined", () => {
		const plugin = attwNormalize();
		const config = { attw: undefined, format: undefined };
		const result = plugin.normalize?.(config, {});
		expect(result?.attw).toEqual({ enabled: true, profile: "node16" });
	});

	test("should set enabled=false when attw is false", () => {
		const plugin = attwNormalize();
		const config = { attw: false, format: "esm" as const };
		const result = plugin.normalize?.(config, {});
		expect(result?.attw).toEqual({ enabled: false });
	});

	test("should use esm-only profile when format is 'es'", () => {
		const plugin = attwNormalize();
		const config = { attw: undefined, format: "es" as const };
		const result = plugin.normalize?.(config, {});
		expect(result?.attw).toEqual({ enabled: true, profile: "esm-only" });
	});

	test("should use esm-only profile when format is 'module'", () => {
		const plugin = attwNormalize();
		const config = { attw: undefined, format: "module" as const };
		const result = plugin.normalize?.(config, {});
		expect(result?.attw).toEqual({ enabled: true, profile: "esm-only" });
	});

	test("should use node16 profile when format is 'cjs'", () => {
		const plugin = attwNormalize();
		const config = { attw: undefined, format: "cjs" as const };
		const result = plugin.normalize?.(config, {});
		expect(result?.attw).toEqual({ enabled: true, profile: "node16" });
	});

	test("should use node16 profile when format is object", () => {
		const plugin = attwNormalize();
		const config = { attw: undefined, format: {} };
		const result = plugin.normalize?.(config, {});
		expect(result?.attw).toEqual({ enabled: true, profile: "node16" });
	});

	test("should merge user options with auto-detected profile", () => {
		const plugin = attwNormalize();
		const config = {
			attw: { enabled: true, summary: true },
			format: "esm" as const,
		};
		const result = plugin.normalize?.(config, {});
		expect(result?.attw).toEqual({
			enabled: true,
			profile: "esm-only",
			summary: true,
		});
	});

	test("should not override user-provided profile", () => {
		const plugin = attwNormalize();
		const config = {
			attw: { enabled: true, profile: "node16" as const },
			format: "esm" as const,
		};
		const result = plugin.normalize?.(config, {});
		expect(result?.attw).toEqual({ enabled: true, profile: "node16" });
	});

	test("should handle string CIOption attw", () => {
		const plugin = attwNormalize();
		const config = {
			attw: "ci-only" as const,
			format: "esm" as const,
		};
		const result = plugin.normalize?.(config, {});
		expect(result?.attw).toEqual({ enabled: "ci-only", profile: "esm-only" });
	});

	test("should preserve other config properties", () => {
		const plugin = attwNormalize();
		const config = {
			entry: ["./src/index.ts"],
			attw: undefined,
			format: "esm" as const,
		};
		const result = plugin.normalize?.(config, {});
		expect(result?.entry).toEqual(["./src/index.ts"]);
		expect(result?.attw).toEqual({ enabled: true, profile: "esm-only" });
	});
});
