import { describe, expect, test } from "vitest";
import useEnvOnlyAdapters from "./useEnvOnlyAdapters";

describe("useEnvOnlyAdapters", () => {
	test("creates dotenv and environment adapters scoped to a name", () => {
		const adapters = useEnvOnlyAdapters("app");

		expect(adapters.map(({ name }) => name)).toEqual(["dotenv", "env"]);
	});
});
