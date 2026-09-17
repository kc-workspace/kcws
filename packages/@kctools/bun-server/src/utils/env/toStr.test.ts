import { describe, expect, test } from "vitest";
import toStr from "./toStr";

describe("toStr", () => {
	test.each([{ value: "value" }, { value: "" }, { value: undefined }])(
		"returns $value as it is",
		({ value }) => {
			expect(toStr(value)).toBe(value);
		},
	);
});
