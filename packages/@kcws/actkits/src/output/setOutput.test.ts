import { beforeEach, describe, expect, test, vi } from "vitest";

import { setOutput, setOutputs } from "./setOutput";

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

	test.for([
		{ name: "boolean", value: true, expected: "true" },
		{ name: "number", value: 42, expected: "42" },
		{ name: "string", value: "hello", expected: "hello" },
		{ name: "null", value: null, expected: "" },
		{ name: "undefined", value: undefined, expected: "" },
		{ name: "object", value: { a: 1 }, expected: '{"a":1}' },
		{ name: "bigint", value: BigInt(123), expected: "123" },
	])("should serialize $name value", ({ name, value, expected }) => {
		expect(setOutput(name, value)).toBe(expected);
	});

	test("should serialize output maps", async () => {
		const { setOutput: mockSetOutput } =
			await vi.importMock<typeof import("@actions/core")>("@actions/core");

		const result = setOutputs({ name: "demo", stable: false });

		expect(result).toEqual({ name: "demo", stable: "false" });
		expect(mockSetOutput).toHaveBeenCalledWith("name", "demo");
		expect(mockSetOutput).toHaveBeenCalledWith("stable", "false");
	});
});
