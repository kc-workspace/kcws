import type * as processType from "node:process";
import { vi } from "vitest";

const processMock = (actual: typeof processType) => {
	return {
		...actual,
		cwd: vi.fn(() => "/mock"),
		exit: vi.fn<typeof process.exit>(),
		arch: "x64" as const,
		platform: "linux" as const,
	};
};

vi.mock(import("node:process"), async (importOriginal) => {
	const actual = await importOriginal();
	return processMock(actual);
});

// biome-ignore lint/style/useNodejsImportProtocol: For backward compatibility
vi.mock(import("process"), async (importOriginal) => {
	const actual = await importOriginal();
	return processMock(actual);
});

// Support CJS require() method since vi.mock didn't support require()
vi.hoisted(async () => {
	const originalProcess = await import("node:process");
	require.cache["process"] = {
		exports: processMock(originalProcess),
	} as never;
});
