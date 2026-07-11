import { debug } from "node:console";
import { describe, expect, test, vi } from "vitest";
import type { ConfigPlugin } from "../models";
import mergePlugin from "./mergePlugin";

describe(mergePlugin.name, () => {
	test("should return a plugin with the given name", () => {
		const result = mergePlugin("merged");
		expect(result.name).toBe("merged");
	});

	test("should chain apply functions in order", () => {
		const plugin1: ConfigPlugin<"p1", { value: number }> = {
			name: "p1",
			apply: (config) => ({ value: config.value + 1 }),
		};
		const plugin2: ConfigPlugin<"p2", { value: number }> = {
			name: "p2",
			apply: (config) => ({ value: config.value * 2 }),
		};

		const merged = mergePlugin("merged", plugin1, plugin2);
		const result = merged.apply?.({ value: 5 }, {});

		// p1 adds 1: 5 -> 6, then p2 multiplies by 2: 6 -> 12
		expect(result).toEqual({ value: 12 });
	});

	test("should chain normalize functions in order", () => {
		const plugin1: ConfigPlugin<"p1", string[]> = {
			name: "p1",
			normalize: (config) => config.filter((v) => v !== ""),
		};
		const plugin2: ConfigPlugin<"p2", string[]> = {
			name: "p2",
			normalize: (config) => config.map((v) => v.toLowerCase()),
		};

		const merged = mergePlugin("merged", plugin1, plugin2);
		const result = merged.normalize?.(["A", "", "B"], {});

		// p1 filters empty: ["A", "B"], then p2 lowercases: ["a", "b"]
		expect(result).toEqual(["a", "b"]);
	});

	test("should skip plugins without apply when chaining", () => {
		const plugin1: ConfigPlugin<"p1", { value: number }> = {
			name: "p1",
		};
		const plugin2: ConfigPlugin<"p2", { value: number }> = {
			name: "p2",
			apply: (config) => ({ value: config.value + 10 }),
		};

		const merged = mergePlugin("merged", plugin1, plugin2);
		const result = merged.apply?.({ value: 1 }, {});

		expect(result).toEqual({ value: 11 });
	});

	test("should skip plugins without normalize when chaining", () => {
		const plugin1: ConfigPlugin<"p1", number[]> = {
			name: "p1",
			normalize: (config) => config.map((v) => v * 2),
		};
		const plugin2: ConfigPlugin<"p2", number[]> = {
			name: "p2",
		};

		const merged = mergePlugin("merged", plugin1, plugin2);
		const result = merged.normalize?.([1, 2, 3], {});

		expect(result).toEqual([2, 4, 6]);
	});

	test("should return base unchanged when no plugins have apply", () => {
		const plugin1: ConfigPlugin<"p1", { x: number }> = {
			name: "p1",
			normalize: (config) => config,
		};
		const plugin2: ConfigPlugin<"p2", { x: number }> = {
			name: "p2",
		};

		const merged = mergePlugin("merged", plugin1, plugin2);
		const base = { x: 42 };
		const result = merged.apply?.(base, {});

		expect(result).toBe(base);
	});

	test("should return base unchanged when no plugins have normalize", () => {
		const plugin1: ConfigPlugin<"p1", { x: number }> = {
			name: "p1",
			apply: (config) => config,
		};

		const merged = mergePlugin("merged", plugin1);
		const config = { x: 42 };
		const result = merged.normalize?.(config, {});

		expect(result).toBe(config);
	});

	test("should handle empty plugins array", () => {
		const merged = mergePlugin("empty");
		const base = { key: "value" };

		expect(merged.apply?.(base, {})).toBe(base);
		expect(merged.normalize?.(base, {})).toBe(base);
	});

	test("should log debug when applying plugins", () => {
		const plugin1: ConfigPlugin<"double", { value: number }> = {
			name: "double",
			apply: (config) => ({ value: config.value * 2 }),
		};
		const plugin2: ConfigPlugin<"increment", { value: number }> = {
			name: "increment",
			apply: (config) => ({ value: config.value + 1 }),
		};

		const merged = mergePlugin("merged", plugin1, plugin2);
		merged.apply?.({ value: 5 }, { debug });

		expect(debug).toHaveBeenNthCalledWith(1, "  Applying plugin: double");
		expect(debug).toHaveBeenNthCalledWith(2, "  Applying plugin: increment");
	});

	test("should log debug when normalizing plugins", () => {
		const plugin1: ConfigPlugin<"lower", string> = {
			name: "lower",
			normalize: (config) => config.toLowerCase(),
		};
		const plugin2: ConfigPlugin<"trim", string> = {
			name: "trim",
			normalize: (config) => config.trim(),
		};

		const merged = mergePlugin("merged", plugin1, plugin2);
		merged.normalize?.("  HELLO  ", { debug });

		expect(debug).toHaveBeenNthCalledWith(1, "  Normalizing plugin: lower");
		expect(debug).toHaveBeenNthCalledWith(2, "  Normalizing plugin: trim");
	});

	test("should log unknown for plugin with empty name", () => {
		const plugin1: ConfigPlugin<"", { value: number }> = {
			name: "",
			apply: (config) => ({ value: config.value + 1 }),
		};

		const merged = mergePlugin("merged", plugin1);
		merged.apply?.({ value: 1 }, { debug });

		expect(debug).toHaveBeenCalledWith("  Applying plugin: unknown");
	});

	test("should only call debug for plugins that have the corresponding function", () => {
		const applyOnly: ConfigPlugin<"apply", { value: number }> = {
			name: "apply",
			apply: vi.fn((config) => config),
		};
		const normalizeOnly: ConfigPlugin<"normalize", { value: number }> = {
			name: "normalize",
			normalize: vi.fn((config) => config),
		};

		const merged = mergePlugin("merged", applyOnly, normalizeOnly);

		merged.apply?.({ value: 1 }, { debug });
		expect(applyOnly.apply).toHaveBeenCalledTimes(1);
		expect(normalizeOnly.normalize).not.toHaveBeenCalled();

		merged.normalize?.({ value: 1 }, { debug });
		expect(applyOnly.apply).toHaveBeenCalledTimes(1); // not called again
		expect(normalizeOnly.normalize).toHaveBeenCalledTimes(1);
	});

	test("should not call debug when option.debug is undefined", () => {
		const plugin: ConfigPlugin<"test", { value: number }> = {
			name: "test",
			apply: (config) => ({ value: config.value + 1 }),
			normalize: (config) => ({ value: config.value * 2 }),
		};

		const merged = mergePlugin("merged", plugin);

		// Should not throw
		expect(() => merged.apply?.({ value: 1 }, {})).not.toThrow();
		expect(() => merged.normalize?.({ value: 1 }, {})).not.toThrow();
		expect(() =>
			merged.apply?.({ value: 1 }, { debug: undefined }),
		).not.toThrow();
	});
});
