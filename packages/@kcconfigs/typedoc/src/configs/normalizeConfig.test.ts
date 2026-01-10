import { describe, expect, test } from "vitest";
import type { UserConfig } from "./model";
import { normalizeConfig } from "./normalizeConfig";

describe("normalizeConfig", () => {
	test("should return normalized config object", () => {
		const config: UserConfig = {};
		const result = normalizeConfig(config);

		expect(result).toBeDefined();
		expect(typeof result).toBe("object");
	});

	test("should remove duplicate plugins", () => {
		const config: UserConfig = { plugin: ["plugin-a", "plugin-b", "plugin-a"] };
		const result = normalizeConfig(config);

		expect(result.plugin).toBeDefined();
		expect(result.plugin?.length).toBe(2);
		expect(result.plugin).toContain("plugin-a");
		expect(result.plugin).toContain("plugin-b");
	});

	test("should normalize and append blockTags", () => {
		const config: UserConfig = { blockTags: ["@custom"] };
		const result = normalizeConfig(config);

		expect(result.blockTags).toBeDefined();
		expect(Array.isArray(result.blockTags)).toBe(true);
		if (Array.isArray(result.blockTags)) {
			expect(result.blockTags.length).toBeGreaterThan(0);
		}
	});

	test("should remove duplicate blockTags", () => {
		const config: UserConfig = { blockTags: ["@custom", "@custom"] };
		const result = normalizeConfig(config);

		expect(result.blockTags).toBeDefined();
		if (Array.isArray(result.blockTags)) {
			const customCount = result.blockTags.filter(
				(t) => t === "@custom",
			).length;
			expect(customCount).toBe(1);
		}
	});

	test("should normalize and append inlineTags", () => {
		const config: UserConfig = { inlineTags: ["@inline"] };
		const result = normalizeConfig(config);

		expect(result.inlineTags).toBeDefined();
		expect(Array.isArray(result.inlineTags)).toBe(true);
	});

	test("should remove duplicate inlineTags", () => {
		const config: UserConfig = { inlineTags: ["@inline", "@inline"] };
		const result = normalizeConfig(config);

		expect(result.inlineTags).toBeDefined();
		if (Array.isArray(result.inlineTags)) {
			const inlineCount = result.inlineTags.filter(
				(t) => t === "@inline",
			).length;
			expect(inlineCount).toBe(1);
		}
	});

	test("should normalize and append modifierTags", () => {
		const config: UserConfig = { modifierTags: ["@modifier"] };
		const result = normalizeConfig(config);

		expect(result.modifierTags).toBeDefined();
		expect(Array.isArray(result.modifierTags)).toBe(true);
	});

	test("should remove duplicate modifierTags", () => {
		const config: UserConfig = { modifierTags: ["@modifier", "@modifier"] };
		const result = normalizeConfig(config);

		expect(result.modifierTags).toBeDefined();
		if (Array.isArray(result.modifierTags)) {
			const modifierCount = result.modifierTags.filter(
				(t) => t === "@modifier",
			).length;
			expect(modifierCount).toBe(1);
		}
	});

	test("should normalize and append highlightLanguages", () => {
		const config: UserConfig = { highlightLanguages: ["custom-lang"] };
		const result = normalizeConfig(config);

		expect(result.highlightLanguages).toBeDefined();
		expect(Array.isArray(result.highlightLanguages)).toBe(true);
	});

	test("should remove duplicate highlightLanguages", () => {
		const config: UserConfig = {
			highlightLanguages: ["typescript", "typescript"],
		};
		const result = normalizeConfig(config);

		expect(result.highlightLanguages).toBeDefined();
		if (Array.isArray(result.highlightLanguages)) {
			const tsCount = result.highlightLanguages.filter(
				(l) => l === "typescript",
			).length;
			expect(tsCount).toBeLessThanOrEqual(1);
		}
	});

	test("should normalize and append kindSortOrder", () => {
		const config: UserConfig = { kindSortOrder: ["Class"] };
		const result = normalizeConfig(config);

		expect(result.kindSortOrder).toBeDefined();
		expect(Array.isArray(result.kindSortOrder)).toBe(true);
	});

	test("should remove duplicate kindSortOrder", () => {
		const config: UserConfig = { kindSortOrder: ["Class", "Class"] };
		const result = normalizeConfig(config);

		expect(result.kindSortOrder).toBeDefined();
		if (Array.isArray(result.kindSortOrder)) {
			const classCount = result.kindSortOrder.filter(
				(k) => k === "Class",
			).length;
			expect(classCount).toBeLessThanOrEqual(1);
		}
	});

	test("should normalize and append sort", () => {
		const config: UserConfig = { sort: ["alphabetical"] };
		const result = normalizeConfig(config);

		expect(result.sort).toBeDefined();
		expect(Array.isArray(result.sort)).toBe(true);
	});

	test("should remove duplicate sort values", () => {
		const config: UserConfig = { sort: ["alphabetical", "alphabetical"] };
		const result = normalizeConfig(config);

		expect(result.sort).toBeDefined();
		if (Array.isArray(result.sort)) {
			const alpCount = result.sort.filter((s) => s === "alphabetical").length;
			expect(alpCount).toBeLessThanOrEqual(1);
		}
	});

	test("should normalize and append requiredToBeDocumented", () => {
		const config: UserConfig = { requiredToBeDocumented: ["Class"] };
		const result = normalizeConfig(config);

		expect(result.requiredToBeDocumented).toBeDefined();
		expect(Array.isArray(result.requiredToBeDocumented)).toBe(true);
	});

	test("should remove duplicate requiredToBeDocumented", () => {
		const config: UserConfig = {
			requiredToBeDocumented: ["Class", "Class"],
		};
		const result = normalizeConfig(config);

		expect(result.requiredToBeDocumented).toBeDefined();
		if (Array.isArray(result.requiredToBeDocumented)) {
			const classCount = result.requiredToBeDocumented.filter(
				(r) => r === "Class",
			).length;
			expect(classCount).toBeLessThanOrEqual(1);
		}
	});

	test("should normalize packageOptions blockTags", () => {
		const config: UserConfig = {
			packageOptions: { blockTags: ["@custom"] },
		};
		const result = normalizeConfig(config);

		expect(result.packageOptions).toBeDefined();
		expect(result.packageOptions?.blockTags).toBeDefined();
		expect(Array.isArray(result.packageOptions?.blockTags)).toBe(true);
	});

	test("should normalize packageOptions inlineTags", () => {
		const config: UserConfig = {
			packageOptions: { inlineTags: ["@inline"] },
		};
		const result = normalizeConfig(config);

		expect(result.packageOptions).toBeDefined();
		expect(result.packageOptions?.inlineTags).toBeDefined();
		expect(Array.isArray(result.packageOptions?.inlineTags)).toBe(true);
	});

	test("should normalize packageOptions modifierTags", () => {
		const config: UserConfig = {
			packageOptions: { modifierTags: ["@modifier"] },
		};
		const result = normalizeConfig(config);

		expect(result.packageOptions).toBeDefined();
		expect(result.packageOptions?.modifierTags).toBeDefined();
		expect(Array.isArray(result.packageOptions?.modifierTags)).toBe(true);
	});

	test("should normalize packageOptions kindSortOrder", () => {
		const config: UserConfig = {
			packageOptions: { kindSortOrder: ["Class"] },
		};
		const result = normalizeConfig(config);

		expect(result.packageOptions).toBeDefined();
		expect(result.packageOptions?.kindSortOrder).toBeDefined();
		expect(Array.isArray(result.packageOptions?.kindSortOrder)).toBe(true);
	});

	test("should normalize packageOptions sort", () => {
		const config: UserConfig = {
			packageOptions: { sort: ["alphabetical"] },
		};
		const result = normalizeConfig(config);

		expect(result.packageOptions).toBeDefined();
		expect(result.packageOptions?.sort).toBeDefined();
		expect(Array.isArray(result.packageOptions?.sort)).toBe(true);
	});

	test("should normalize packageOptions requiredToBeDocumented", () => {
		const config: UserConfig = {
			packageOptions: { requiredToBeDocumented: ["Class"] },
		};
		const result = normalizeConfig(config);

		expect(result.packageOptions).toBeDefined();
		expect(result.packageOptions?.requiredToBeDocumented).toBeDefined();
		expect(Array.isArray(result.packageOptions?.requiredToBeDocumented)).toBe(
			true,
		);
	});

	test("should normalize complex config with multiple properties", () => {
		const config: UserConfig = {
			plugin: ["plugin-a", "plugin-b"],
			blockTags: ["@custom"],
			inlineTags: ["@inline"],
			modifierTags: ["@modifier"],
			highlightLanguages: ["typescript"],
			kindSortOrder: ["Class"],
			sort: ["alphabetical"],
			requiredToBeDocumented: ["Class"],
		};
		const result = normalizeConfig(config);

		expect(result).toBeDefined();
		expect(result.plugin).toBeDefined();
		expect(result.blockTags).toBeDefined();
		expect(result.inlineTags).toBeDefined();
		expect(result.modifierTags).toBeDefined();
		expect(result.highlightLanguages).toBeDefined();
		expect(result.kindSortOrder).toBeDefined();
		expect(result.sort).toBeDefined();
		expect(result.requiredToBeDocumented).toBeDefined();
	});

	test("should normalize complex packageOptions", () => {
		const config: UserConfig = {
			packageOptions: {
				blockTags: ["@custom"],
				inlineTags: ["@inline"],
				modifierTags: ["@modifier"],
				kindSortOrder: ["Class"],
				sort: ["alphabetical"],
				requiredToBeDocumented: ["Class"],
			},
		};
		const result = normalizeConfig(config);

		expect(result.packageOptions).toBeDefined();
		expect(result.packageOptions?.blockTags).toBeDefined();
		expect(result.packageOptions?.inlineTags).toBeDefined();
		expect(result.packageOptions?.modifierTags).toBeDefined();
		expect(result.packageOptions?.kindSortOrder).toBeDefined();
		expect(result.packageOptions?.sort).toBeDefined();
		expect(result.packageOptions?.requiredToBeDocumented).toBeDefined();
	});

	test("should handle mixed duplicate and unique values", () => {
		const config: UserConfig = {
			plugin: ["plugin-a", "plugin-b", "plugin-a", "plugin-c"],
		};
		const result = normalizeConfig(config);

		expect(result.plugin).toBeDefined();
		if (Array.isArray(result.plugin)) {
			expect(result.plugin.length).toBeLessThan(4);
			expect(new Set(result.plugin).size).toBe(result.plugin.length);
		}
	});

	test("should preserve config structure when normalizing empty arrays", () => {
		const config: UserConfig = {
			plugin: [],
			blockTags: [],
		};
		const result = normalizeConfig(config);

		expect(result).toBeDefined();
		expect(result.plugin).toBeDefined();
		expect(result.blockTags).toBeDefined();
	});
});
