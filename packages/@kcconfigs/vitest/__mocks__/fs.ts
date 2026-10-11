import type * as fsType from "node:fs";
import { fs as _memfs } from "memfs";
import { vi } from "vitest";

/**
 * memfs >= 4.79 defines stream classes (ReadStream, WriteStream, ...) as
 * getters backed by a private symbol slot. Libraries like graceful-fs clone
 * `fs` with `Object.getOwnPropertyNames`, which copies the getter but drops
 * the symbol, so reading `ReadStream` on the clone throws. Spreading resolves
 * every getter into a plain data property.
 */
const memfs = { ..._memfs } as unknown as typeof fsType;

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
	const { fs: _mockFS, vol } = await import("memfs");
	const mockFS = { ..._mockFS };
	vol.fromJSON(
		{
			"./.gitkeep": "",
		},
		"/mock/tmp",
	);
	require.cache["fs"] = { exports: mockFS } as never;
});
/* jscpd:ignore-end */
