import { beforeEach, describe, expect, test, vi } from "vitest";

import { setOutput } from "./setOutput";

vi.mock("@actions/core", () => ({
	setOutput: vi.fn(),
}));

describe("output helpers", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("should serialize scalar outputs and call @actions/core", async () => {
		const { setOutput: mockSetOutput } =
			await vi.importMock<typeof import("@actions/core")>("@actions/core");

		const value = setOutput("published", true);

		expect(value).toBe("true");
		expect(mockSetOutput).toHaveBeenCalledWith("published", "true");
	});

	test("should return serialized strings for different value types", () => {
		expect(setOutput("boolean", true)).toBe("true");
		expect(setOutput("number", 42)).toBe("42");
		expect(setOutput("string", "hello")).toBe("hello");
		expect(setOutput("null", null)).toBe("");
		expect(setOutput("undefined", undefined)).toBe("");
		expect(setOutput("object", { a: 1 })).toBe('{"a":1}');
		expect(setOutput("bigint", BigInt(123))).toBe("123");
	});
});
