import { describe, expect, test } from "vitest";
import {
	dotenvAdapter,
	envAdapter,
	json5Adapter,
	jsonAdapter,
	staticAdapter,
	tomlAdapter,
	yamlAdapter,
} from ".";

describe("adapter barrel", () => {
	test("exports all adapters as named functions", () => {
		expect(typeof dotenvAdapter).toBe("function");
		expect(typeof envAdapter).toBe("function");
		expect(typeof jsonAdapter).toBe("function");
		expect(typeof json5Adapter).toBe("function");
		expect(typeof staticAdapter).toBe("function");
		expect(typeof yamlAdapter).toBe("function");
		expect(typeof tomlAdapter).toBe("function");
	});
});
