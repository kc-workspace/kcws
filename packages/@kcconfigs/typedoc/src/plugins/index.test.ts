import { describe, expect, test } from "vitest";

describe("plugins", () => {
	describe("dtLinks plugin", () => {
		test("should export a plugin config", async () => {
			const dtLinks = await import("./dtLinks");
			const config = dtLinks.default;

			expect(config).toBeDefined();
			expect(typeof config).toBe("object");
			expect(config.plugin).toBeDefined();
			expect(Array.isArray(config.plugin)).toBe(true);
		});

		test("should include dt-links plugin", async () => {
			const dtLinks = await import("./dtLinks");
			const config = dtLinks.default;

			expect(config.plugin).toContain("typedoc-plugin-dt-links");
		});
	});

	describe("extras plugin", () => {
		test("should export a plugin config", async () => {
			const extras = await import("./extras");
			const config = extras.default;

			expect(config).toBeDefined();
			expect(typeof config).toBe("object");
		});
	});

	describe("includeExample plugin", () => {
		test("should export a plugin config", async () => {
			const includeExample = await import("./includeExample");
			const config = includeExample.default;

			expect(config).toBeDefined();
			expect(typeof config).toBe("object");
		});
	});

	describe("mdnLinks plugin", () => {
		test("should export a plugin config", async () => {
			const mdnLinks = await import("./mdnLinks");
			const config = mdnLinks.default;

			expect(config).toBeDefined();
			expect(typeof config).toBe("object");
		});
	});

	describe("missingExports plugin", () => {
		test("should export a plugin config", async () => {
			const missingExports = await import("./missingExports");
			const config = missingExports.default;

			expect(config).toBeDefined();
			expect(typeof config).toBe("object");
		});
	});

	describe("all plugins", () => {
		test("should export a combined plugin config", async () => {
			const all = await import("./all");
			const config = all.default;

			expect(config).toBeDefined();
			expect(typeof config).toBe("object");
			expect(config.plugin).toBeDefined();
			expect(Array.isArray(config.plugin)).toBe(true);
		});

		test("should include multiple plugins", async () => {
			const all = await import("./all");
			const config = all.default;

			if (config.plugin) {
				expect(config.plugin.length).toBeGreaterThan(0);
			}
		});
	});
});
