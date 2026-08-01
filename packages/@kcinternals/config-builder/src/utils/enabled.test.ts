import { describe, expect, test } from "vitest";
import { withEnabled } from "./enabled";

describe(withEnabled.name, () => {
	test("should return ifTrue when value is true", () => {
		expect(withEnabled(true, "enabled")).toBe("enabled");
	});

	test("should return undefined when value is false", () => {
		expect(withEnabled(false, "enabled")).toBeUndefined();
	});

	test("should return provided value when value is not boolean", () => {
		expect(withEnabled("custom", "enabled")).toBe("custom");
	});

	test("should preserve falsy non-boolean values", () => {
		expect(withEnabled(0, 1)).toBe(0);
		expect(withEnabled("", "fallback")).toBe("");
		expect(withEnabled(null, "fallback")).toBeNull();
	});

	test("should return undefined when value is undefined", () => {
		expect(withEnabled(undefined, "enabled")).toBeUndefined();
	});
});
