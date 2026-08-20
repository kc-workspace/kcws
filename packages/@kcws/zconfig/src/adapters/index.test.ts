import { describe, expect, test } from "vitest";
import {
	envAdapter,
	json5Adapter,
	jsonAdapter,
	tomlAdapter,
	yamlAdapter,
} from ".";

describe("adapter barrel", () => {
	test("exports all adapters as named functions", () => {
		expect(typeof envAdapter).toBe("function");
		expect(typeof jsonAdapter).toBe("function");
		expect(typeof json5Adapter).toBe("function");
		expect(typeof yamlAdapter).toBe("function");
		expect(typeof tomlAdapter).toBe("function");
	});
});
