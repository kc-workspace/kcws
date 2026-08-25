import { describe, expect, test } from "vitest";
import useDefaultAdapters from "./useDefaultAdapters";

describe("useDefaultAdapters", () => {
	test("creates adapters scoped to a name", () => {
		const adapters = useDefaultAdapters("app");

		expect(adapters.map(({ name }) => name)).toEqual(["auto", "dotenv", "env"]);
	});
});
