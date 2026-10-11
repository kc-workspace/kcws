import { vi } from "vitest";
// Import from dist, the same module `@kcconfigs/vitest/mocks` resolves to,
// so tests and mocks share a single memfs volume.
import { createMockFs } from "../dist/mockHelpers/index.js";

const memfs = createMockFs().promises;

/* jscpd:ignore-start */
vi.mock(import("node:fs/promises"), () => {
	return memfs;
});

// biome-ignore lint/style/useNodejsImportProtocol: For backward compatibility
vi.mock(import("fs/promises"), () => {
	return memfs;
});

// Support CJS require() method since vi.mock didn't support require()
vi.hoisted(async () => {
	const { createMockFs } = await import("../dist/mockHelpers/index.js");
	require.cache["fs/promises"] = {
		exports: createMockFs().promises,
	} as never;
});
/* jscpd:ignore-end */
