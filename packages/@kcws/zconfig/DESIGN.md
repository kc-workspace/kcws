# @kcws/zconfig Design Spec

**Date:** 2026-08-20
**Package:** `@kcws/zconfig`
**Status:** Implemented through adapter exports; integration and release verification remain

---

## Overview

`@kcws/zconfig` is a type-safe configuration loader built on Zod v4. It loads config from multiple sources
(files and environment variables), deep-merges them in adapter order (later wins), then validates the merged
result against a Zod schema. Invalid config throws a typed error with full Zod issue details.

Schema keys are constrained to strict camelCase (see [Key Naming Rules](#key-naming-rules)). This guarantees
that every key path in a config has exactly one unambiguous environment variable name, in both directions.

---

## Architecture

### Module conventions

Every unit of behaviour lives in its own directory:

- `index.ts` is the directory's public surface, re-exporting as **named** bindings.
- Each exported function gets **its own file** with a `export default`.
- Internal helpers not part of the public surface are grouped into a single `utils.ts` with named exports,
  rather than one file each.
- Plain values go in `constants.ts` and local types in `types.ts`, both with named exports. Grouping is
  deliberate here — the one-file-per-unit rule applies to functions, not to every constant or type alias.

Callers therefore import from the barrel (`import { deepMerge } from "../utils/deepMerge"`), while a
directory's own files import each other directly.

### Layout

```text
src/
  index.ts              — public entry: loadConfig, loadConfigSync, error classes, shared types
  types/
    index.ts            — Adapter, RawConfig, TransformFn and friends
  core/
    index.ts            — barrel
    loadConfig.ts       — async entry point
    loadConfigSync.ts   — sync entry point
  utils/
    validators/
      index.ts          — barrel: validateSchema, validateConfig
      validateSchema.ts — camelCase key enforcement across the Zod type graph
      validateConfig.ts — safeParse of an already merged config
      utils.ts          — explain, assertKey, defOf, visit
      constants.ts      — KEY_PATTERN, RUNTIME_KEY, INNER_TYPE_WRAPPERS
      types.ts          — SchemaLike, SchemaDef (Zod introspection shapes)
    deepMerge/
      index.ts          — barrel
      deepMerge.ts      — recursive deep merge
      utils.ts          — mergeInto
    transforms/
      index.ts          — barrel
      applyTransform.ts — applies an adapter's transform to every leaf
      utils.ts          — walk, setPath
    imports/
      index.ts          — barrel
      importAsync.ts    — lazy ESM import for optional dependencies
      importSync.ts     — cached createRequire loader for optional dependencies
    errors/
      index.ts          — barrel
      errors.ts         — ZconfigSchemaError, ZconfigAdapterError, ZconfigValidationError
      asAdapterError.ts — normalises anything an adapter throws
      utils.ts          — trimConstructorFrame, summarise
    object/
      index.ts          — barrel
      isPlainObject.ts  — narrows to objects safe to recurse into
      constants.ts      — DANGEROUS_KEYS prototype pollution denylist
  adapters/
    file/
      adapter.ts        — shared file loading, discovery, parsing, and errors
      index.ts          — file adapter barrel
      types.ts          — common file adapter options
      utils.ts          — path lookup and read helpers
    env/
      adapter.ts        — environment and dotenv adapter
      index.ts          — env adapter barrel
      types.ts          — environment adapter options
      utils.ts          — env codec and nested config construction
    json/               — JSON and JSONC adapter
    json5/              — JSON5 adapter
    yaml/               — YAML adapter
    toml/               — TOML adapter
    index.ts            — named re-exports of all adapters
```

Only `src/index.ts`, `src/adapters/index.ts`, and `src/adapters/*/index.ts` are build entry points. Everything
under `utils/` is internal and bundled into whichever entry point reaches it.

### Data Flow

```text
loadConfig(schema, [adapter1, adapter2, ...])
  → validate schema key names (camelCase only)
      → failure: throw ZconfigSchemaError (before any I/O)
  → for each adapter sequentially: adapter.load() → RawConfig (plain object)
      → failure: throw ZconfigAdapterError
  → deepMerge all RawConfigs in order (later adapters win on conflict)
  → validateConfig: schema.safeParse(merged)
      → success: return typed config
      → failure: throw ZconfigValidationError
```

Schema validation runs first and performs no I/O, so a malformed schema fails fast and cheaply. Adapters are
loaded sequentially because `envAdapter` may populate an intermediate environment from a dotenv file and
later adapters must observe the resulting order.

Merging stays in `loadConfig` rather than inside `validateConfig`, so the whole pipeline is visible at one
call site and the validators own validation only.

---

## Core API

```typescript
import { loadConfig, loadConfigSync } from '@kcws/zconfig';

// Async
const config = await loadConfig(schema, adapters);

// Sync
const config = loadConfigSync(schema, adapters);
```

Both accept:

- `schema`: a Zod schema (`z.ZodType`)
- `adapters`: `Adapter[]` — ordered list, later adapters override earlier ones

Both return `z.output<typeof schema>`, so defaults and transforms declared in the schema are reflected in the
returned type.

---

## Key Naming Rules

Every object key reachable in the schema must match:

```text
/^[a-z][a-zA-Z0-9]*$/
```

That is: start with a lowercase letter, then letters and digits only. No underscores, no leading uppercase.

A violation throws `ZconfigSchemaError` before any adapter runs. This is a programming error — the fix is to
rename the schema key, not to change any config file.

### Why

Environment variable names are a flat `[A-Z0-9_]+` namespace. Encoding a nested key path into that namespace
requires a separator, and if `_` serves as both the path separator and the intra-key word separator the
encoding is ambiguous — `APP_DATABASE_HOST` could mean either `database.host` or `databaseHost`.

Reserving `__` for path separation and `_` for word separation resolves this, but only if keys themselves
never contain `_` and never start with an uppercase letter. With both constraints in place the key-path ↔
environment-variable encoding is total and injective in both directions.

The rule is enforced globally rather than only when `envAdapter` is present. Otherwise adding `envAdapter` to
an existing project would retroactively invalidate a previously working schema.

### Walking the schema

Validation recurses through the schema, unwrapping the wrapper types (`ZodOptional`, `ZodDefault`,
`ZodNullable`, `ZodCatch`, `ZodPipe`, `ZodLazy`) and descending into `ZodObject` shapes, `ZodArray` elements,
and every member of a `ZodUnion` / `ZodDiscriminatedUnion`. A visited-set guards against cycles introduced by
`ZodLazy`.

`ZodRecord`, `ZodMap`, and object catchalls have keys that only exist at runtime, so those keys cannot be
validated ahead of time. Record keys containing `_` will not be addressable from environment variables; this
is documented rather than enforced.

Their *value* schemas are still walked, under a `*` path segment. A `z.record(z.string(), z.object({ max_size:
z.number() }))` therefore reports `pools.*.max_size` — the runtime key is unknowable, but `max_size` is
statically declared and equally unaddressable, so it is rejected like any other key.

### Config sources that use other conventions

A TOML or YAML file using snake_case keys is still usable — supply a `transform` on that adapter to rename
keys into camelCase before the merge step. The constraint applies to the schema, not to the raw source.

---

## Adapter Interface

```typescript
type RawConfig = Record<string, unknown>;

type TransformInput  = { key: string[]; value: unknown };
type TransformOutput = { key: string[]; value: unknown };
type TransformFn     = (input: TransformInput) => TransformOutput | undefined;
// returning undefined skips the key entirely

interface Adapter {
  readonly name: string;   // e.g. "env", "json" — used in ZconfigAdapterError
  load(): Promise<RawConfig>;
  loadSync(): RawConfig;
}

interface BaseAdapterOptions {
  transform?: TransformFn;
}
```

`transform` is called once per leaf value, after the adapter has parsed its source into a nested structure and
after any adapter-specific key mapping has been applied. The `key` is the full path as a string array (e.g.
`["database", "host"]`). Returning `undefined` drops the key.

If two transformed keys resolve to the same path, the later one wins — consistent with the merge rule.

---

## Adapters

### `envAdapter`

Reads from `process.env` and optionally loads a `.env` file first.

```typescript
envAdapter(options?: BaseAdapterOptions & {
  prefix?: string;          // e.g. "APP" → strips APP_ before decoding
  pathSeparator?: string;   // default "__", splits the name into key-path segments
  dotenv?: boolean | string | string[];
  // default: true = auto-discover .env in cwd
  // false = skip .env file entirely
  // string = required explicit path to .env file
  // string[] = dotenv search paths
  customEnv?: Record<string, string> | false;
  processEnv?: Record<string, string> | false;
}): Adapter
```

`customEnv` is loaded first, dotenv values are loaded second, and `processEnv` is loaded last, so actual
process values override both earlier sources. `processEnv` defaults to `process.env`; `customEnv` defaults to
`false`. The adapter resolves `dotenv` only when it runs.

#### Encoding — key path to variable name

1. Convert each segment from camelCase to `SCREAMING_SNAKE`.
2. Join segments with `pathSeparator`.
3. Prepend `prefix` and `_`.

#### Decoding — variable name to key path

1. Strip `prefix` and `_`. A variable that does not match the prefix is ignored.
2. Split the remainder on `pathSeparator` to get segments.
3. Lowercase each segment, then convert snake to camel.

```text
database.host       ↔  APP_DATABASE__HOST
databaseHost        ↔  APP_DATABASE_HOST
database.hostName   ↔  APP_DATABASE__HOST_NAME
a.b.c               ↔  APP_A__B__C
```

#### Acronyms

The encoder inserts `_` before every uppercase letter with no acronym special-casing, so `dbURL` encodes to
`DB_U_R_L`. Acronym-aware encoding would break injectivity — `DB_URL` could decode to either `dbUrl` or
`dbURL`. Prefer `dbUrl` over `dbURL` in schemas.

#### Values

All environment values are strings. Coercion is the schema's responsibility — see
[Value Coercion](#value-coercion).

#### Arrays

Environment variables cannot express nesting, so arrays have no positional encoding. Source arrays from files,
or accept a delimited string in the schema:

```typescript
z.string().transform((s) => s.split(','))
```

### File adapters

The JSON, JSON5, YAML, and TOML adapters share the file adapter base. All file paths are resolved relative to
the current working directory unless a custom `directories` list is supplied. An explicit `path` bypasses
discovery. By default a missing file is an error; `optional: true` returns `{}` instead.

The default candidate list is generated from the adapter extensions in this order:

1. `config.<ext>` and `.config.<ext>`
2. `<name>.<ext>` and `.<name>.<ext>` when `name` is provided
3. `<name>/config.<ext>` and `.<name>/config.<ext>` when `name` is provided
4. `config/<name>.<ext>` and `.config/<name>.<ext>` when `name` is provided

The default search directory is `process.cwd()`. A custom `directories` list is searched in its given order.

### `jsonAdapter`

Loads a JSON or JSONC file.

```typescript
jsonAdapter(options?: BaseAdapterOptions & {
  name?: string;       // base filename, default "config"
  path?: string;       // explicit file path; if omitted, auto-discovers
  optional?: boolean;  // default false; true = missing file returns {}
  jsonc?: boolean;     // default true for .json; .jsonc always uses jsonc-parser
}): Adapter
```

The adapter searches `.json` and `.jsonc` files. With `jsonc: false`, `.json` files use `JSON.parse`; `.jsonc`
files always use `jsonc-parser`. JSONC diagnostics are surfaced as adapter errors.

### `json5Adapter`

Loads a JSON5 file (superset of JSON: comments, trailing commas, unquoted keys, etc.).

```typescript
json5Adapter(options?: BaseAdapterOptions & {
  name?: string;
  path?: string;
  optional?: boolean;
}): Adapter
```

It searches `.json5` files and loads `json5` only when the adapter runs.

### `yamlAdapter`

Loads a YAML file.

```typescript
yamlAdapter(options?: BaseAdapterOptions & {
  name?: string;
  path?: string;
  optional?: boolean;
}): Adapter
```

It searches `.yaml` and `.yml` files and loads `yaml` only when the adapter runs.

### `tomlAdapter`

Loads a TOML file.

```typescript
tomlAdapter(options?: BaseAdapterOptions & {
  name?: string;
  path?: string;
  optional?: boolean;
}): Adapter
```

It searches `.toml` files and loads `smol-toml` only when the adapter runs.

### Discovery and `optional`

`optional` applies to both explicit `path` and auto-discovery. With the default `optional: false`, an adapter
that finds no candidate file throws `ZconfigAdapterError`. Relative paths resolve against `process.cwd()`.

---

## Value Coercion

Adapters never coerce values. File formats already carry types, and environment values are always strings; the
schema is the only place that knows the intended type, so coercion belongs there.

```typescript
const schema = z.object({
  database: z.object({
    host: z.string(),
    port: z.coerce.number(),                     // accepts 5432 and "5432"
  }),
  debug: z.union([z.boolean(), z.stringbool()]), // accepts true and "false"
});
```

- **Numbers** — `z.coerce.number()` passes a real number through unchanged and parses a numeric string, so one
  schema works for every adapter.
- **Booleans** — do not use `z.coerce.boolean()`; it applies JS truthiness, so `"false"` becomes `true`. Use
  `z.stringbool()`, which accepts `true/false`, `1/0`, `yes/no`, `on/off`. It is a `ZodCodec<ZodString,
  ZodBoolean>` and therefore rejects a real boolean from YAML, so union it with `z.boolean()` when the value
  can come from either a file or the environment.

Adapter-side coercion was rejected deliberately: guessing a type from value shape misfires constantly —
version `"1.0"`, file mode `"0755"`, and zip code `"02134"` would all silently become numbers and then fail a
`z.string()`.

---

## Merge Semantics

`deepMerge` combines adapter outputs in order, later wins.

- Plain objects merge recursively.
- Arrays replace wholesale — they are not concatenated. Concatenation would make it impossible for a later
  source to shrink or clear a list.
- Primitives and `null` replace.
- `undefined` is skipped and does not override an earlier value.

### Prototype pollution

Config files are parsed input. JSON and YAML parsers can both emit a literal `__proto__` key, so the merge
must not blindly assign. Keys `__proto__`, `constructor`, and `prototype` are dropped during merge, and merge
targets are created with `Object.create(null)`. This is covered by a dedicated test.

---

## Error Handling

All errors thrown by `loadConfig` / `loadConfigSync` are one of three typed classes:

```typescript
// Thrown when the schema itself violates the key naming rules.
// Raised before any adapter runs — no I/O has occurred.
class ZconfigSchemaError extends Error {
  readonly key: string[];    // offending key path
  readonly reason: string;   // e.g. "key must be camelCase"
}

// Thrown when an adapter fails to load (file missing on non-optional,
// parse error, missing format library, etc.)
class ZconfigAdapterError extends Error {
  readonly adapter: string;  // adapter name, e.g. "json", "env"
  readonly cause?: unknown;  // original underlying error
}

// Thrown when merged config fails Zod schema validation
class ZconfigValidationError extends Error {
  readonly issues: z.core.$ZodIssue[]; // Zod issues array
  readonly cause: ZodError;            // original ZodError
}
```

`ZodIssue` is deprecated in Zod v4 in favour of `z.core.$ZodIssue` for libraries built on top of Zod, so the
latter is used.

All unexpected internal errors from adapters are wrapped into `ZconfigAdapterError`. No raw errors are leaked.

---

## Exports

```typescript
// Main entry
import { loadConfig, loadConfigSync } from '@kcws/zconfig';
import { ZconfigSchemaError, ZconfigAdapterError, ZconfigValidationError } from '@kcws/zconfig';

// All adapters (named)
import { envAdapter, jsonAdapter, json5Adapter, yamlAdapter, tomlAdapter } from '@kcws/zconfig/adapters';

// Individual adapters (default export)
import envAdapter   from '@kcws/zconfig/adapters/env';
import jsonAdapter  from '@kcws/zconfig/adapters/json';
import json5Adapter from '@kcws/zconfig/adapters/json5';
import yamlAdapter  from '@kcws/zconfig/adapters/yaml';
import tomlAdapter  from '@kcws/zconfig/adapters/toml';
```

### `package.json` exports map

The barrel and the wildcard are separate entries — subpath `./adapters` does not match the pattern
`./adapters/*`, so omitting the barrel would make `@kcws/zconfig/adapters` throw
`ERR_PACKAGE_PATH_NOT_EXPORTED`.

```json
{
  ".": { ... },
  "./adapters": { ... },
  "./adapters/*": { ... }
}
```

### Build entries

`tsdown.config.ts` must list entries matching the directory layout:

```typescript
entryPlugin([
  "./src/index.ts",
  "./src/adapters/index.ts",
  "./src/adapters/*/index.ts",
])
```

---

## Dependencies

| Package | Type | Purpose |
| --- | --- | --- |
| `zod` | peer (`>=4`) + dev | Schema validation |
| `yaml` | optional peer | YAML parsing |
| `smol-toml` | optional peer | TOML parsing |
| `jsonc-parser` | optional peer | JSONC parsing (comments support) |
| `json5` | optional peer | JSON5 parsing |
| `dotenv` | optional peer | `.env` file parsing |

### Why `zod` is a peer dependency

A direct dependency risks two copies of Zod in the tree. That breaks `instanceof ZodError`, makes
`ZconfigValidationError.cause` untypeable against the consumer's Zod, and causes schema brand mismatches
between the consumer's schema and this package's expectations.

### Why format libraries are optional peers

An environment-only consumer should not install `yaml`, `smol-toml`, `json5`, and `jsonc-parser`. Declaring
them as optional peers keeps the install lean and makes the "missing format library" branch of
`ZconfigAdapterError` a real, reachable case rather than dead text. A missing library produces a
`ZconfigAdapterError` naming the adapter and the package to install.

### Loading strategy

Optional format libraries are resolved lazily, at the moment the owning adapter first runs. Synchronous
adapters use a cached `createRequire(import.meta.url)` loader; asynchronous environment loading uses dynamic
`import()`. File parsers are synchronous internally and are wrapped by the file adapter's async read path.

> **Build note:** the CJS output must have a working `import.meta.url` shim for `createRequire` to resolve.
> Verify this in the built `dist/*.cjs` before release.

`engines.node` is `>=20`.

---

## Testing Strategy

**Framework:** Vitest
**Filesystem:** memfs, wired through `useMockPlugin` — no real FS I/O

Filesystem mocking is configured in `vitest.config.ts` via a plugin, not called from inside test bodies. That
the plugin actually replaces `node:fs` is `@kcconfigs/vitest`'s contract, covered by that package's own
tests, so this package does not re-assert it:

```typescript
// vitest.config.ts
import { defineProjectConfig } from '@kcconfigs/vitest';
import { useMockPlugin } from '@kcconfigs/vitest/plugins';

export default defineProjectConfig(
  useMockPlugin({ flags: { fs: true, fsPromises: true } }),
);
```

Tests then drive the in-memory volume directly:

```typescript
import { afterEach } from 'vitest';
import { vol } from '@kcconfigs/vitest/mocks';

afterEach(() => vol.reset());
```

### Test file layout

Tests sit beside the file they cover, named after it. A directory's `index.ts` barrel has no test of its own —
it holds no behaviour.

```text
src/
  core/index.test.ts
  utils/
    validators/validateSchema.test.ts
    validators/validateConfig.test.ts
    deepMerge/deepMerge.test.ts
    transforms/applyTransform.test.ts
    errors/errors.test.ts
    object/isPlainObject.test.ts
    imports/importAsync.test.ts
    imports/importSync.test.ts
  adapters/
    env/index.test.ts
    env/utils.test.ts
    json/index.test.ts
    json5/index.test.ts
    yaml/index.test.ts
    toml/index.test.ts
```

A directory's `utils.ts` carries no dedicated test file; its helpers are exercised through the exported
function that owns them, which keeps the tests aimed at the public surface rather than at private structure.

### Coverage per adapter test file

1. Happy path — valid input produces correct typed output
2. Nested objects — deep nested keys resolve correctly
3. `optional: true` — missing file returns `{}`
4. `optional: false` (default) — missing file throws `ZconfigAdapterError`
5. Auto-discovery — each candidate filename is found in priority order
6. Parse error — malformed content throws `ZconfigAdapterError`
7. `transform` — custom transform applied correctly; `undefined` return drops key

### `envAdapter` additional cases

1. Encode/decode round-trip — `database.host` and `databaseHost` stay distinct
2. `prefix` filtering — non-matching variables ignored
3. Acronym handling — `dbURL` ↔ `DB_U_R_L` round-trips
4. Custom `pathSeparator`

### `validateSchema` tests

1. Valid camelCase schema passes
2. Key containing `_` throws `ZconfigSchemaError` with the offending key path
3. Key starting with uppercase throws `ZconfigSchemaError`
4. Nested and wrapped schemas (`optional`, `default`, `nullable`, array element, union member) are walked
5. `ZodRecord` subtrees are skipped rather than rejected
6. `ZodLazy` cycle terminates

### `deepMerge` tests

1. Nested objects merge recursively
2. Arrays replace rather than concatenate
3. `undefined` does not override an earlier value
4. `__proto__` / `constructor` / `prototype` keys are dropped and `Object.prototype` is unpolluted

### Core `loadConfig` / `loadConfigSync` tests

1. Single adapter — schema validates and returns typed config
2. Multiple adapters — deep merge with later-wins behavior verified
3. Schema key violation — throws `ZconfigSchemaError` before any adapter is invoked
4. Validation failure — throws `ZconfigValidationError` with `issues` populated
5. Sync parity — `loadConfigSync` produces identical result to `loadConfig`

---

## Usage Example

```typescript
import { z } from 'zod';
import { loadConfig } from '@kcws/zconfig';
import { envAdapter, yamlAdapter } from '@kcws/zconfig/adapters';

const schema = z.object({
  database: z.object({
    host: z.string(),
    port: z.coerce.number(),
  }),
  debug: z.union([z.boolean(), z.stringbool()]).default(false),
});

const config = await loadConfig(schema, [
  yamlAdapter({ path: './config.yaml', optional: true }),
  envAdapter({ prefix: 'APP' }),
]);

// config is fully typed as z.output<typeof schema>
```

Overriding the YAML values from the environment:

```bash
APP_DATABASE__HOST=db.internal
APP_DATABASE__PORT=5432
APP_DEBUG=true
```
