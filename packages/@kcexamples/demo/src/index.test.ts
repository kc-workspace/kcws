import { describe, expect, test } from "vitest";
import { getName } from ".";

describe(getName.name, () => {
	test("with default name", () => {
		expect(getName()).toBe("@kcexamples/demo");
	});
	test("with custom name", () => {
		expect(getName("custom")).toBe("custom");
	});
});
