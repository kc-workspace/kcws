import { describe, expectTypeOf, test } from "vitest";
import type ImportedPackage from "./index.d.ts";

describe("@kctypes/package_json", () => {
	test("should have correct types", () => {
		expectTypeOf<typeof ImportedPackage>().toExtend<{
			name: string;
			version: string;
			// example: boolean;
		}>();
	});
});
