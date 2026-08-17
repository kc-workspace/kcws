/** biome-ignore-all lint/complexity/useLiteralKeys: Conflict with ts(4111) */

import type { ZodType } from "zod";
import { ZconfigSchemaError } from "../utils/errors";

/**
 * Every schema key must be strict camelCase.
 *
 * Environment variable names are a flat `[A-Z0-9_]+` namespace, so encoding a
 * nested key path into one needs `__` for path separation and `_` for word
 * separation. That encoding is only unambiguous while keys themselves contain
 * no underscore and never start with an uppercase letter — otherwise
 * `APP_DATABASE_HOST` could decode to either `database.host` or `databaseHost`.
 */
const KEY_PATTERN = /^[a-z][a-zA-Z0-9]*$/;

/** Placeholder path segment for values behind a runtime key. */
const RUNTIME_KEY = "*";

/** Wrappers that hold exactly one child schema under `innerType`. */
const INNER_TYPE_WRAPPERS: ReadonlySet<string> = new Set([
	"optional",
	"nullable",
	"default",
	"prefault",
	"nonoptional",
	"catch",
	"readonly",
	"promise",
	"success",
]);

/**
 * Minimal view of Zod's internals.
 *
 * Zod exposes no public traversal API, so this walks `_zod.def` directly. Only
 * the discriminator is typed; each branch casts the fields it needs, which
 * keeps the unavoidable unsafety local to one function.
 */
interface SchemaLike {
	_zod?: { def?: SchemaDef };
}

type SchemaDef = { type?: string } & Record<string, unknown>;

/**
 * Reads a schema's definition, tolerating anything that is not a schema.
 *
 * Callers pass optional slots such as `catchall` and tuple `rest` straight
 * through, so null and undefined must both resolve to "nothing to walk".
 */
const defOf = (value: unknown): SchemaDef | undefined =>
	(value as SchemaLike | null | undefined)?._zod?.def;

/** Explains precisely which part of the rule a key broke. */
const explain = (key: string): string => {
	if (key.includes("_")) {
		return 'underscores are not allowed, because "_" separates words inside an environment variable name; use camelCase instead';
	}
	if (!/^[a-z]/.test(key)) {
		return "key must start with a lowercase letter";
	}
	return "key must contain only letters and digits";
};

const assertKey = (key: string, path: string[]): void => {
	if (KEY_PATTERN.test(key)) return;

	throw new ZconfigSchemaError(path, explain(key));
};

const visit = (schema: unknown, path: string[], seen: Set<unknown>): void => {
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

/**
 * Asserts that every key reachable in a schema is strict camelCase.
 *
 * Runs before any adapter, so a malformed schema fails without performing I/O.
 * The rule is enforced for all schemas rather than only when `envAdapter` is
 * present — otherwise adding that adapter later would retroactively invalidate
 * a working schema.
 *
 * @throws {ZconfigSchemaError} on the first offending key
 * @internal
 */
const validateSchema = (schema: ZodType): void => {
	visit(schema, [], new Set());
};

export default validateSchema;
