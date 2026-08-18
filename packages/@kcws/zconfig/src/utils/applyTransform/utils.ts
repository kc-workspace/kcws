import type { RawConfig, TransformInput } from "../../types";
import { DANGEROUS_KEYS, isPlainObject } from "../object";

/**
 * Visits every leaf of a parsed configuration, deepest first within each branch.
 *
 * An empty object is reported as a leaf rather than skipped, so a source that
 * legitimately contains one keeps it through the walk.
 *
 * @internal
 */
export const walk = (
	config: RawConfig,
	path: string[],
	visit: (input: TransformInput) => void,
): void => {
	for (const key of Object.keys(config)) {
		const value = config[key];
		const keyPath = [...path, key];

		if (isPlainObject(value) && Object.keys(value).length > 0) {
			walk(value, keyPath, visit);
		} else {
			visit({ key: keyPath, value });
		}
	}
};

/**
 * Writes a value at a key path, creating intermediate objects as needed.
 *
 * A later write beneath an existing primitive replaces that primitive with an
 * object, matching the later-wins rule applied everywhere else.
 *
 * @internal
 */
export const setPath = (
	target: RawConfig,
	path: string[],
	value: unknown,
): void => {
	if (path.length === 0) return;
	// A transform is user code, so guard its output the same way parsed input is
	// guarded. Nothing is written when any segment is unsafe, so an unsafe path
	// leaves no half-built intermediates behind either.
	if (path.some((segment) => DANGEROUS_KEYS.has(segment))) return;

	const lastIndex = path.length - 1;
	let cursor = target;

	// Iterating with entries() keeps each segment typed as a plain string, so the
	// final write needs no impossible undefined check to satisfy the compiler.
	for (const [index, segment] of path.entries()) {
		if (index === lastIndex) {
			cursor[segment] = value;
			break;
		}

		const existing = cursor[segment];
		if (isPlainObject(existing)) {
			cursor = existing;
		} else {
			const next: RawConfig = Object.create(null);
			cursor[segment] = next;
			cursor = next;
		}
	}
};
