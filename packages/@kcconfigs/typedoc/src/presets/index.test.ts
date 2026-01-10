import { describe, expect, test } from "vitest";

describe("presets", () => {
	describe("base preset", () => {
		test("should export a config object", async () => {
			const base = await import("./base");
			const config = base.default;

			expect(config).toBeDefined();
			expect(typeof config).toBe("object");
		});
	});

	describe("package preset", () => {
		test("should export a config object", async () => {
			const packagePreset = await import("./package");
			const config = packagePreset.default;

			expect(config).toBeDefined();
			expect(typeof config).toBe("object");
		});

		test("should include highlight languages", async () => {
			const packagePreset = await import("./package");
			const config = packagePreset.default;

			expect(config.highlightLanguages).toBeDefined();
			expect(Array.isArray(config.highlightLanguages)).toBe(true);
		});
	});

	describe("root preset", () => {
		test("should export a config object", async () => {
			const root = await import("./root");
			const config = root.default;

			expect(config).toBeDefined();
			expect(typeof config).toBe("object");
		});
	});
});
