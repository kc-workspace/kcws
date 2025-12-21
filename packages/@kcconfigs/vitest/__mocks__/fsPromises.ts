import type * as fsPromisesType from "node:fs/promises";
import { fs } from "memfs";
import { vi } from "vitest";

vi.mock(import("node:fs/promises"), async () => {
	return fs.promises as unknown as typeof fsPromisesType;
});

// biome-ignore lint/style/useNodejsImportProtocol: For backward compatibility
vi.mock(import("fs/promises"), async () => {
	return fs.promises as unknown as typeof fsPromisesType;
});

// Support CJS require() method since vi.mock didn't support require()
vi.hoisted(async () => {
	const { fs: mockFS, vol } = await import("memfs");
	vol.fromJSON(
		{
			".gitkeep": "",
			"./tmp/.gitkeep": "",
		},
		"/mock",
	);

	require.cache["fs/promises"] = { exports: mockFS.promises } as never;
});
