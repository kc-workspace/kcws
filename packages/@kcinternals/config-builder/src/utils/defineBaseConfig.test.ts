import { describe, expect, test } from "vitest";
import defineBaseConfig from "./defineBaseConfig";

describe(defineBaseConfig.name, () => {
	test("should wrap config in BaseConfig shape", () => {
		const result = defineBaseConfig({ value: 1 });
		expect(result.config).toEqual({ value: 1 });
	});

	test("should default debug to false", () => {
		const result = defineBaseConfig({});
		expect(result.setting.debug).toBe(false);
	});

	test("should default verbose to false", () => {
		const result = defineBaseConfig({});
		expect(result.setting.verbose).toBe(false);
	});

	test("should use provided debug setting", () => {
		const result = defineBaseConfig({}, { debug: true });
		expect(result.setting.debug).toBe(true);
	});

	test("should use provided verbose setting", () => {
		const result = defineBaseConfig({}, { verbose: true });
		expect(result.setting.verbose).toBe(true);
	});

	test("should accept function as debug setting", () => {
		const fn = (msg: string) => msg;
		const result = defineBaseConfig({}, { debug: fn });
		expect(result.setting.debug).toBe(fn);
	});

	test("should accept function as verbose setting", () => {
		const fn = (msg: string) => msg;
		const result = defineBaseConfig({}, { verbose: fn });
		expect(result.setting.verbose).toBe(fn);
	});

	test("should not mutate the original config", () => {
		const base = { x: 1 };
		const result = defineBaseConfig(base);
		expect(result.config).toBe(base);
	});
});
