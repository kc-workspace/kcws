import { describe, expectTypeOf, test } from "vitest";
import pkg from ".";

describe("@kctypes/package_json", () => {
	test("should have correct types", () => {
		expectTypeOf(pkg).toExtend<{
			name: string;
			version: string;
			// example: boolean;
		}>();
	});
});
