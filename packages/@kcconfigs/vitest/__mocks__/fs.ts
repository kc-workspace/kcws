import type * as fsType from "node:fs";
import { fs as _memfs } from "memfs";
import { vi } from "vitest";

const memfs = _memfs as unknown as typeof fsType;

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
	const { fs: mockFS, vol } = await import("memfs");
	vol.fromJSON(
		{
			"./.gitkeep": "",
		},
		"/mock/tmp",
	);
	require.cache["fs"] = { exports: mockFS } as never;
});
/* jscpd:ignore-end */
