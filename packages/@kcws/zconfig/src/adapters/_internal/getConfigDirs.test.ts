import { mockCwd, mockHome } from "@kcconfigs/vitest/mocks";
import { describe, expect, test } from "vitest";
import getConfigDirs from "./getConfigDirs";

describe(getConfigDirs.name, () => {
	test("returns default config directory", () => {
		expect(getConfigDirs()).toEqual([mockCwd, mockHome]);
	});
});
