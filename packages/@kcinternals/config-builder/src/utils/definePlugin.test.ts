import { describe, expect, test } from "vitest";
import definePlugin from "./definePlugin";

describe(definePlugin.name, () => {
	test("should return the same plugin object (identity)", () => {
		const plugin = {
			name: "test",
			apply: (config: Record<string, string>) => config,
		};

		const result = definePlugin(plugin);
		expect(result).toBe(plugin);
	});

	test("should preserve plugin name", () => {
		const plugin = {
			name: "myPlugin" as const,
			apply: (config: { value: number }) => ({
				...config,
				value: config.value + 1,
			}),
		};

		const result = definePlugin(plugin);
		expect(result.name).toBe("myPlugin");
	});

	test("should preserve apply function", () => {
		const apply = (config: { x: number }) => ({ x: config.x * 2 });
		const plugin = { name: "double", apply };

		const result = definePlugin(plugin);
		expect(result.apply).toBe(apply);
		expect(result.apply?.({ x: 5 }, {})).toEqual({ x: 10 });
	});

	test("should preserve normalize function", () => {
		const normalize = (config: { x: number }) => ({ x: Math.abs(config.x) });
		const plugin = { name: "abs", normalize };

		const result = definePlugin(plugin);
		expect(result.normalize).toBe(normalize);
		expect(result.normalize?.({ x: -5 }, {})).toEqual({ x: 5 });
	});

	test("should support plugin with only name (no apply or normalize)", () => {
		const plugin = { name: "noop" as const };

		const result = definePlugin(plugin);
		expect(result).toBe(plugin);
		expect(result.name).toBe("noop");
		expect(result.apply).toBeUndefined();
		expect(result.normalize).toBeUndefined();
	});

	test("should support plugin with both apply and normalize", () => {
		const plugin = {
			name: "full",
			apply: (config: string) => `${config}-applied`,
			normalize: (config: string) => config.toLowerCase(),
		};

		const result = definePlugin(plugin);
		expect(result.apply?.("BASE", {})).toBe("BASE-applied");
		expect(result.normalize?.("HELLO", {})).toBe("hello");
	});
});
