import type * as fsPromisesType from "node:fs/promises";
import { fs as _memfs } from "memfs";
import { vi } from "vitest";

const memfs = _memfs.promises as unknown as typeof fsPromisesType;

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
	const { fs: mockFS, vol } = await import("memfs");
	vol.fromJSON(
		{
			"./.gitkeep": "",
		},
		"/mock/tmp",
	);

	require.cache["fs/promises"] = { exports: mockFS.promises } as never;
});
/* jscpd:ignore-end */
