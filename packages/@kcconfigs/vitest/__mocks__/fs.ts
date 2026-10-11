import { vi } from "vitest";
// Import from dist, the same module `@kcconfigs/vitest/mocks` resolves to,
// so tests and mocks share a single memfs volume.
import { createMockFs } from "../dist/mockHelpers/index.js";

const memfs = createMockFs();

/* jscpd:ignore-start */
vi.mock(import("node:fs"), () => {
	return memfs;
});

// biome-ignore lint/style/useNodejsImportProtocol: For backward compatibility
vi.mock(import("fs"), () => {
	return memfs;
});

// Support CJS require() method since vi.mock didn't support require()
vi.hoisted(async () => {
	const { createMockFs } = await import("../dist/mockHelpers/index.js");
	require.cache["fs"] = { exports: createMockFs() } as never;
});
/* jscpd:ignore-end */
