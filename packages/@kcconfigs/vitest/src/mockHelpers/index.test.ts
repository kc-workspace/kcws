import { afterEach, describe, expect, test } from "vitest";
import {
	createMockFs,
	mockCwd,
	mockHome,
	mockTmp,
	resetVol,
	vol,
} from "./index";

describe("Mock Helpers", () => {
	afterEach(() => {
		resetVol();
	});

	describe("vol", () => {
		test("should expose memfs volume methods", () => {
			expect(typeof vol.fromJSON).toBe("function");
			expect(typeof vol.reset).toBe("function");
			expect(typeof vol.toJSON).toBe("function");
		});

		test("should resolve relative paths against mockCwd", () => {
			vol.fromJSON({ "config.json": "{}" });

			expect(vol.existsSync(`${mockCwd}/config.json`)).toBe(true);
			expect(vol.existsSync("/config.json")).toBe(false);
		});

		test("should create mock directories on load", () => {
			expect(vol.existsSync(mockCwd)).toBe(true);
			expect(vol.existsSync(mockHome)).toBe(true);
			expect(vol.existsSync(mockTmp)).toBe(true);
		});
	});

	describe(resetVol.name, () => {
		test("should remove files and recreate mock directories", () => {
			vol.fromJSON({ "config.json": "{}" }, mockTmp);

			resetVol();

			expect(vol.existsSync(`${mockTmp}/config.json`)).toBe(false);
			expect(vol.existsSync(mockCwd)).toBe(true);
			expect(vol.existsSync(mockHome)).toBe(true);
			expect(vol.existsSync(mockTmp)).toBe(true);
		});
	});

	describe(createMockFs.name, () => {
		test("should read files written to vol", () => {
			vol.fromJSON({ "config.json": '{"name":"kcws"}' });

			const fs = createMockFs();

			expect(fs.readFileSync("config.json", "utf8")).toBe('{"name":"kcws"}');
		});

		test("should return a fresh object on each call", () => {
			expect(createMockFs()).not.toBe(createMockFs());
		});

		test("should survive cloning by own property names", () => {
			const fs = createMockFs();
			const clone = Object.create(Object.getPrototypeOf(fs));
			for (const key of Object.getOwnPropertyNames(fs)) {
				Object.defineProperty(
					clone,
					key,
					Object.getOwnPropertyDescriptor(fs, key) as PropertyDescriptor,
				);
			}

			expect(typeof clone.ReadStream).toBe("function");
			expect(typeof clone.WriteStream).toBe("function");
		});
	});
});
