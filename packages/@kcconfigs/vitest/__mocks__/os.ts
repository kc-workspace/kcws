import type * as osType from "node:os";
import { vi } from "vitest";

const osMock = (actual: typeof osType) => {
	return {
		...actual,
		tmpdir: vi.fn(() => "/mock/tmp"),
		homedir: vi.fn(() => "/mock/home"),
	};
};

vi.mock(import("node:os"), async (importOriginal) => {
	const actual = await importOriginal();
	return osMock(actual);
});

// biome-ignore lint/style/useNodejsImportProtocol: For backward compatibility
vi.mock(import("os"), async (importOriginal) => {
	const actual = await importOriginal();
	return osMock(actual);
});

// Support CJS require() method since vi.mock didn't support require()
vi.hoisted(async () => {
	const originalOs = await import("node:os");
	require.cache["os"] = {
		exports: osMock(originalOs),
	} as never;
});
