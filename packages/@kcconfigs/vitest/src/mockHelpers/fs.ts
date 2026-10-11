import type * as fsType from "node:fs";
import { memfs, type Volume } from "memfs";
import { mockCwd, mockHome, mockTmp } from "./constants";

const instance = memfs({}, mockCwd);

/**
 * The [memfs](https://github.com/streamich/memfs) volume backing the mocked
 * `fs` and `fs/promises` modules. Relative paths resolve against
 * {@link mockCwd}, matching the mocked `process.cwd()`.
 */
export const vol: Volume = instance.vol;

const seedVol = (): void => {
	for (const dir of [mockCwd, mockHome, mockTmp]) {
		vol.mkdirSync(dir, { recursive: true });
	}
};
seedVol();

/**
 * Reset {@link vol} to its initial state: every file is removed, then the
 * {@link mockCwd}, {@link mockHome}, and {@link mockTmp} directories are
 * recreated. Call it in `afterEach` to keep tests isolated.
 */
export const resetVol = (): void => {
	vol.reset();
	seedVol();
};

/**
 * Create a `node:fs` compatible object backed by {@link vol}.
 *
 * memfs defines some members (for example `ReadStream`) as getters backed by
 * a private symbol. Libraries such as graceful-fs clone `fs` with
 * `Object.getOwnPropertyNames`, which keeps the getter but drops the symbol.
 * The returned object is a fresh copy where every getter is resolved into a
 * plain data property, so cloning it is safe.
 */
export const createMockFs = (): typeof fsType => {
	return { ...instance.fs } as unknown as typeof fsType;
};
