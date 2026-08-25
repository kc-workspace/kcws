import { describe, expect, test } from "vitest";
import useGenericAdapters from "./useGenericAdapters";

describe("useGenericAdapters", () => {
	test("returns the generic adapter collection", () => {
		expect(useGenericAdapters().map(({ name }) => name)).toEqual([
			"auto",
			"dotenv",
			"env",
		]);
	});
});
