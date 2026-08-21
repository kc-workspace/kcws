/** biome-ignore-all lint/complexity/useLiteralKeys: Conflict with ts(4111) */

import { ZconfigSchemaError } from "../errors";
import { INNER_TYPE_WRAPPERS, KEY_PATTERN, RUNTIME_KEY } from "./constants";
import type { SchemaDef, SchemaLike } from "./types";

/**
 * Explains precisely which part of the camelCase rule a key broke.
 *
 * @internal
 */
export const explain = (key: string): string => {
	if (key.includes("_")) {
		return 'underscores are not allowed, because "_" separates words inside an environment variable name; use camelCase instead';
	}
	if (!/^[a-z]/.test(key)) {
		return "key must start with a lowercase letter";
	}
	return "key must contain only letters and digits";
};

/**
 * Reads a schema's definition, tolerating anything that is not a schema.
 *
 * Callers pass optional slots such as `catchall` and tuple `rest` straight
 * through, so null and undefined must both resolve to "nothing to walk".
 *
 * @internal
 */
export const defOf = (value: unknown): SchemaDef | undefined =>
	(value as SchemaLike | null | undefined)?._zod?.def;

/**
 * Throws unless a single schema key satisfies the camelCase rule.
 *
 * @throws {ZconfigSchemaError} when the key is not camelCase
 * @internal
 */
export const assertKey = (key: string, path: string[]): void => {
	if (KEY_PATTERN.test(key)) return;

	throw new ZconfigSchemaError(path, explain(key));
};

/**
 * Recursively walks a schema, asserting every reachable key.
 *
 * @param schema - node to walk; anything that is not a schema is ignored
 * @param path - key path leading to this node
 * @param seen - guard against cycles and repeated subtrees
 * @throws {ZconfigSchemaError} on the first offending key
 * @internal
 */
export const visit = (
	schema: unknown,
	path: string[],
	seen: Set<unknown>,
): void => {
	const def = defOf(schema);
	if (def === undefined) return;

	// Guards against both a self-referencing lazy schema and a schema instance
	// reused at many paths. A repeat visit would reach the same verdict anyway.
	if (seen.has(schema)) return;
	seen.add(schema);

	switch (def["type"]) {
		case "object": {
			// Deliberately unguarded: Zod's own types make `shape` required, and
			// defaulting a missing one to `{}` would silently validate nothing.
			// A loud TypeError is the better failure if Zod's internals ever move.
			const shape = def["shape"] as Record<string, unknown>;
			for (const key of Object.keys(shape)) {
				const keyPath = [...path, key];
				assertKey(key, keyPath);
				visit(shape[key], keyPath, seen);
			}

			// A catchall accepts arbitrary runtime keys, so its own keys cannot be
			// checked, but the shape of the values behind them still can be.
			// `visit` ignores undefined, so an object without one costs nothing.
			visit(def["catchall"], [...path, RUNTIME_KEY], seen);
			return;
		}

		case "record":
		case "map": {
			// Record keys exist only at runtime and are therefore unverifiable, but
			// the value schema may still declare a static shape worth checking.
			visit(def["valueType"], [...path, RUNTIME_KEY], seen);
			return;
		}

		case "array":
			visit(def["element"], path, seen);
			return;

		case "set":
			visit(def["valueType"], path, seen);
			return;

		case "union": {
			// Covers z.discriminatedUnion, which shares the "union" discriminator.
			const options = def["options"] as unknown[];
			for (const option of options) visit(option, path, seen);
			return;
		}

		case "intersection":
			visit(def["left"], path, seen);
			visit(def["right"], path, seen);
			return;

		case "tuple": {
			const items = def["items"] as unknown[];
			for (const item of items) visit(item, path, seen);
			// `rest` is null on a fixed-length tuple, which `visit` ignores.
			visit(def["rest"], path, seen);
			return;
		}

		case "pipe":
			// Covers codecs such as z.stringbool() and anything built by z.coerce.
			visit(def["in"], path, seen);
			visit(def["out"], path, seen);
			return;

		case "lazy": {
			const getter = def["getter"] as () => unknown;

			// Keyed on the getter rather than its result, since a getter that builds
			// a fresh schema per call would otherwise never repeat and never settle.
			if (seen.has(getter)) return;
			seen.add(getter);

			visit(getter(), path, seen);
			return;
		}

		default: {
			const type = def["type"];
			if (typeof type === "string" && INNER_TYPE_WRAPPERS.has(type)) {
				visit(def["innerType"], path, seen);
			}
		}
	}
};
