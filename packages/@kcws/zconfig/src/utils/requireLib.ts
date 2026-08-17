import { createRequire } from "node:module";
import { ZconfigAdapterError } from "./errors";

/**
 * Resolution is anchored to this package rather than the caller's working
 * directory, so an optional peer installed alongside `@kcws/zconfig` is found
 * regardless of where the consuming process was started.
 */
const require_ = createRequire(import.meta.url);

const cache = new Map<string, unknown>();

/**
 * Loads an optional peer format library on first use.
 *
 * `createRequire` is used rather than a dynamic `import()` because
 * `loadConfigSync` has no `await` available; this gives one resolution path
 * that serves both the synchronous and asynchronous entry points. Nothing is
 * resolved until the owning adapter actually runs, so an environment-only
 * consumer never pays for the file format libraries.
 *
 * @param adapter - adapter name, reported on failure
 * @param moduleName - package to resolve, e.g. `"yaml"`
 * @throws {ZconfigAdapterError} when the package cannot be resolved
 */
export const requireLib = <T>(adapter: string, moduleName: string): T => {
	if (cache.has(moduleName)) return cache.get(moduleName) as T;

	try {
		const loaded = require_(moduleName) as T;
		cache.set(moduleName, loaded);
		return loaded;
	} catch (cause) {
		throw new ZconfigAdapterError(
			adapter,
			`cannot resolve "${moduleName}"; install it to use this adapter`,
			cause,
		);
	}
};
