/** biome-ignore-all lint/complexity/useLiteralKeys: Conflict with ts(4111) */

import type * as fsType from "node:fs";
import { fs } from "memfs";
import { vi } from "vitest";

/* jscpd:ignore-start */
vi.mock(import("node:fs"), async () => {
	return fs as unknown as typeof fsType;
});

// biome-ignore lint/style/useNodejsImportProtocol: For backward compatibility
vi.mock(import("fs"), async () => {
	return fs as unknown as typeof fsType;
});

// Support CJS require() method since vi.mock didn't support require()
vi.hoisted(async () => {
	const { fs: mockFS, vol } = await import("memfs");
	vol.fromJSON(
		{
			"./tmp/.gitkeep": "",
		},
		"/mock",
	);
	require.cache["fs"] = { exports: mockFS } as never;
});
/* jscpd:ignore-end */
