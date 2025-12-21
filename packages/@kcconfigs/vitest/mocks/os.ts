import type * as osType from "node:os";
import { vi } from "vitest";

vi.mock(import("node:os"), async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
	};
});

// biome-ignore lint/style/useNodejsImportProtocol: For backward compatibility
vi.mock(import("os"), async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
	};
});

// Support CJS require() method since vi.mock didn't support require()
vi.hoisted(async () => {
	const originalOs = await import("node:os");

	// biome-ignore lint/complexity/useLiteralKeys: Conflict with ts(4111)
	require.cache["os"] = {
		exports: {
			...originalOs,
			tmpdir: vi.fn(() => "/mock/tmp"),
			homedir: vi.fn(() => "/mock/home"),
		} as typeof osType,
	} as never;
});
