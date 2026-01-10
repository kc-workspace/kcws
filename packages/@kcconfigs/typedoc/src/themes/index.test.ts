import { describe, expect, test } from "vitest";

describe("themes", () => {
	describe("github theme", () => {
		test("should export a theme config", async () => {
			const github = await import("./github");
			const config = github.default;

			expect(config).toBeDefined();
			expect(typeof config).toBe("object");
			expect(config.plugin).toBeDefined();
			expect(Array.isArray(config.plugin)).toBe(true);
		});

		test("should include github theme plugin", async () => {
			const github = await import("./github");
			const config = github.default;

			expect(config.plugin).toContain("typedoc-github-theme");
		});
	});

	describe("material theme", () => {
		test("should export a theme config", async () => {
			const material = await import("./material");
			const config = material.default;

			expect(config).toBeDefined();
			expect(typeof config).toBe("object");
		});
	});

	describe("oxide theme", () => {
		test("should export a theme config", async () => {
			const oxide = await import("./oxide");
			const config = oxide.default;

			expect(config).toBeDefined();
			expect(typeof config).toBe("object");
		});
	});

	describe("rhineai theme", () => {
		test("should export a theme config", async () => {
			const rhineai = await import("./rhineai");
			const config = rhineai.default;

			expect(config).toBeDefined();
			expect(typeof config).toBe("object");
		});
	});

	describe("varvara theme", () => {
		test("should export a theme config", async () => {
			const varvara = await import("./varvara");
			const config = varvara.default;

			expect(config).toBeDefined();
			expect(typeof config).toBe("object");
		});
	});
});
