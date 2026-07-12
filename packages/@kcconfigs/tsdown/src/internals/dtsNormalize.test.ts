import { describe, expect, test } from "vitest";
import dtsNormalize from "../plugins/dtsNormalize";

describe("dtsNormalize", () => {
	test("should have correct plugin name", () => {
		const plugin = dtsNormalize();
		expect(plugin.name).toBe("dts");
	});

	test("should set default enabled=true with sourcemap when dts is undefined", () => {
		const plugin = dtsNormalize();
		const config = { dts: undefined };
		const result = plugin.normalize?.(config, {});
		expect(result?.dts).toEqual({ enabled: true, sourcemap: true });
	});

	test("should set default enabled=true with sourcemap when dts is null", () => {
		const plugin = dtsNormalize();
		const config = { dts: null };
		const result = plugin.normalize?.(config, {});
		expect(result?.dts).toEqual({ enabled: true, sourcemap: true });
	});

	test("should preserve sourcemap when dts is true", () => {
		const plugin = dtsNormalize();
		const config = { dts: true };
		const result = plugin.normalize?.(config, {});
		expect(result?.dts).toEqual({ enabled: true, sourcemap: true });
	});

	test("should set enabled=false when dts is false", () => {
		const plugin = dtsNormalize();
		const config = { dts: false };
		const result = plugin.normalize?.(config, {});
		expect(result?.dts).toEqual({ enabled: false });
	});

	test("should normalize string dts to enabled with sourcemap", () => {
		const plugin = dtsNormalize();
		const config = { dts: "ci-only" };
		const result = plugin.normalize?.(config, {});
		expect(result?.dts).toEqual({ enabled: "ci-only", sourcemap: true });
	});

	test("should merge user options with defaults", () => {
		const plugin = dtsNormalize();
		const config = {
			dts: { enabled: true, cjsReexport: true },
		};
		const result = plugin.normalize?.(config, {});
		expect(result?.dts).toEqual({
			enabled: true,
			sourcemap: true,
			cjsReexport: true,
		});
	});

	test("should allow overriding sourcemap", () => {
		const plugin = dtsNormalize();
		const config = {
			dts: { enabled: true, sourcemap: false },
		};
		const result = plugin.normalize?.(config, {});
		expect(result?.dts).toEqual({ enabled: true, sourcemap: false });
	});

	test("should preserve other config properties", () => {
		const plugin = dtsNormalize();
		const config = { entry: ["./src/index.ts"], dts: undefined };
		const result = plugin.normalize?.(config, {});
		expect(result?.entry).toEqual(["./src/index.ts"]);
		expect(result?.dts).toEqual({ enabled: true, sourcemap: true });
	});
});
