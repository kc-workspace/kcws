# @kcws/zconfig Implementation Tasks

**Date:** 2026-08-17
**Spec:** [DESIGN.md](./DESIGN.md)
**Status:** Epic 1 complete

Work breakdown for implementing the approved design. Epics are ordered by dependency; stories within an epic
are ordered unless marked parallel.

---

## Definition of Done (applies to every story)

- Tests written before implementation, covering the cases listed in the spec's Testing Strategy.
- `pnpm --filter @kcws/zconfig run build` passes (package buildable).
- `pnpm --filter @kcws/zconfig run check` passes (lint, format, type-check).
- `pnpm --filter @kcws/zconfig run test` passes with per-file coverage thresholds met.
- No `dist/` artifacts or `.tsbuildinfo` committed as part of the change.
- Public API surface has TSDoc comments; internal helpers marked `@internal`.

---

## Risk Gate — resolve before Epic 2

**R1 — `createRequire` in the CJS build.** ✅ **Resolved 2026-08-17.** tsdown emits
`(0, require("module").createRequire)(require("url").pathToFileURL(__filename).href)` in the CJS output, so
`import.meta.url` is shimmed correctly. Verified by executing both built artifacts: `dist/index.cjs` under
`require()` and `dist/index.js` under `import`, each resolving a real optional peer and producing
`ZconfigAdapterError` on a missing one. All five optional peers ship a CJS entry (`smol-toml` via its
`require` export condition), so none are ESM-only. The DESIGN.md loading strategy stands unchanged.

**R2 — `exports` map cannot precede the files it names.** Discovered during Epic 1. Declaring `./adapters`
and `./adapters/*` before any adapter exists makes `publint` and `attw` fail every build. Those two entries
are therefore added in **T3.8.4**, alongside the code they describe, rather than in Story 1.1. The
`entryPlugin` globs are harmless ahead of time — an unmatched glob is not a build error — so they stayed in
Story 1.2.

---

## Epic 1 — Package foundation

Get the manifest, build, test harness, and shared primitives in place. No feature logic.

### Story 1.1 — Manifest and dependencies

**Acceptance:** a consumer installing the package pulls no format libraries it does not use, and a second copy
of Zod is impossible.

- [x] T1.1.1 — Move `zod` to `peerDependencies` as `>=4`, add matching `devDependencies` entry
- [x] T1.1.2 — Add `yaml`, `smol-toml`, `jsonc-parser`, `json5`, `dotenv` as `peerDependencies`
- [x] T1.1.3 — Add `peerDependenciesMeta` marking all five format libraries `optional: true`
- [x] T1.1.4 — Add the same five to `devDependencies` so tests can exercise them
- [x] T1.1.5 — Bump `engines.node` from `>=14` to `>=20`
- [x] T1.1.6 — ~~Add the `"./adapters"` barrel entry to the `exports` map~~ — **moved to T3.8.4**, see R2.
      The reasoning still holds: subpath `./adapters` does not match the `./adapters/*` pattern, so an
      explicit barrel entry is required for `@kcws/zconfig/adapters` to resolve
- [x] T1.1.7 — Run `pnpm install` and confirm the lockfile records the optional peers correctly

### Story 1.2 — Build configuration

**Acceptance:** every path referenced by the `exports` map exists in `dist/` after `pnpm run build`.

- [x] T1.2.1 — Fix `entryPlugin` globs in `tsdown.config.ts` to
      `["./src/index.ts", "./src/adapters/index.ts", "./src/adapters/*/index.ts"]`
- [x] T1.2.2 — Build and diff the produced `dist/` tree against the `exports` map paths. Only `.` is
      declared at this point; the adapter subpaths are verified in **T3.8.5** once they exist
- [x] T1.2.3 — Confirm `publint` and `attw` pass on the built package

### Story 1.3 — Test harness

**Acceptance:** a test that writes to the filesystem leaves no trace on disk.

- [x] T1.3.1 — Wire `useMockPlugin({ flags: { fs: true, fsPromises: true } })` into `vitest.config.ts`
- [x] T1.3.2 — Add a smoke test that writes via `vol.fromJSON`, reads it back through `node:fs`, and asserts
      the real working directory is untouched
- [x] T1.3.3 — Establish an `afterEach(() => vol.reset())` convention and document it in the test files

### Story 1.4 — Shared types and errors

**Acceptance:** all three error classes are constructible, carry their documented fields, and survive
`instanceof` across the sync and async entry points.

- [x] T1.4.1 — Delete the `multiply` stub in `src/index.ts` and its test file
- [x] T1.4.2 — Create `src/utils/types.ts` with `RawConfig`, `TransformInput`, `TransformOutput`,
      `TransformFn`, `Adapter` (including `readonly name`), and `BaseAdapterOptions`
- [x] T1.4.3 — Create `src/utils/errors.ts` with `ZconfigSchemaError` (`key`, `reason`)
- [x] T1.4.4 — Add `ZconfigAdapterError` (`adapter`, `cause`)
- [x] T1.4.5 — Add `ZconfigValidationError` (`issues: z.core.$ZodIssue[]`, `cause: ZodError`)
- [x] T1.4.6 — Set `name` on each class and verify `instanceof` and `Error.captureStackTrace` behaviour under
      the built output, not just source

### Story 1.5 — Lazy library loader

**Acceptance:** an adapter whose format library is absent throws `ZconfigAdapterError` naming both the adapter
and the package to install, and the library is not resolved until that adapter first runs.

- [x] T1.5.1 — **Spike (resolves R1):** verify `createRequire(import.meta.url)` resolves in the built
      `dist/*.cjs` as well as `dist/*.js`. Passed — see R1 above
- [x] T1.5.2 — Implement `src/utils/requireLib.ts` wrapping `createRequire` with a module-level cache
- [x] T1.5.3 — Map a resolution failure to `ZconfigAdapterError` with an actionable install hint
- [x] T1.5.4 — Test the cache-hit path and the missing-module path. Laziness is structurally guaranteed —
      the resolve call sits inside the function — and is verified end to end in **T4.2.3**, where an
      environment-only install must work with no format libraries present

---

## Epic 2 — Core engine

Pure logic, no filesystem and no adapters. Stories 2.1–2.3 are parallel; 2.4 depends on all three.

### Story 2.1 — `deepMerge`

**Acceptance:** merge behaviour matches the spec's Merge Semantics exactly, and `Object.prototype` cannot be
polluted by any config input.

- [ ] T2.1.1 — Recursive merge of plain objects, later source wins
- [ ] T2.1.2 — Arrays replace wholesale rather than concatenating
- [ ] T2.1.3 — Primitives and `null` replace; `undefined` is skipped and does not override
- [ ] T2.1.4 — Drop `__proto__`, `constructor`, and `prototype` keys; build merge targets with
      `Object.create(null)`
- [ ] T2.1.5 — Test that a parsed payload containing a literal `__proto__` key leaves `Object.prototype`
      unmodified
- [ ] T2.1.6 — Test that non-plain objects (Date, Map, class instances) replace rather than being walked

### Story 2.2 — Leaf transform walker

**Acceptance:** one shared implementation applies `transform` for every adapter, file and environment alike.

- [ ] T2.2.1 — Implement a walker that visits each leaf of a nested `RawConfig`, building the `key: string[]`
      path
- [ ] T2.2.2 — Apply `TransformFn`, rebuilding output at the returned key path
- [ ] T2.2.3 — Drop the key when the transform returns `undefined`
- [ ] T2.2.4 — Define and test collision behaviour: two transformed keys resolving to the same path, later
      wins
- [ ] T2.2.5 — Test that array values are treated as leaves, not walked into

### Story 2.3 — `validateSchema`

**Acceptance:** any schema key violating `/^[a-z][a-zA-Z0-9]*$/` throws `ZconfigSchemaError` carrying the
offending key path, before any I/O occurs.

- [ ] T2.3.1 — Implement the key regex check and `ZconfigSchemaError` construction with the full key path
- [ ] T2.3.2 — Walk `ZodObject` shapes recursively
- [ ] T2.3.3 — Unwrap `ZodOptional`, `ZodDefault`, `ZodNullable`, `ZodCatch`, `ZodPipe`, `ZodLazy`
- [ ] T2.3.4 — Descend into `ZodArray` elements
- [ ] T2.3.5 — Walk every member of `ZodUnion` and `ZodDiscriminatedUnion`
- [ ] T2.3.6 — Skip `ZodRecord` and object catchalls; add a code comment explaining why runtime keys are not
      checkable
- [ ] T2.3.7 — Add a visited-set cycle guard so a self-referencing `ZodLazy` terminates
- [ ] T2.3.8 — Test the underscore case, the leading-uppercase case, and each wrapper and container above

### Story 2.4 — `loadConfig` / `loadConfigSync`

**Acceptance:** both entry points produce identical results for identical inputs, and the return type is
`z.output<typeof schema>`.

- [ ] T2.4.1 — Implement the async pipeline: validate schema, load adapters in order, merge, `safeParse`
- [ ] T2.4.2 — Implement the sync pipeline sharing the same code path except for adapter invocation
- [ ] T2.4.3 — Wrap any non-`Zconfig*` error escaping an adapter into `ZconfigAdapterError` using
      `adapter.name`
- [ ] T2.4.4 — Convert a `safeParse` failure into `ZconfigValidationError` with `issues` populated
- [ ] T2.4.5 — Verify the returned type is `z.output<S>` with a type-level test, so schema defaults and
      transforms are reflected
- [ ] T2.4.6 — Test that a schema key violation throws before any adapter's `load` is called, using a spy
      adapter
- [ ] T2.4.7 — Sync/async parity test over a multi-adapter fixture

---

## Epic 3 — Adapters

Depends on Epics 1 and 2, and on R1 being resolved.

### Story 3.1 — Environment key codec

Pure functions, no I/O. The highest-risk logic in the package; build and test it in isolation before wiring it
into an adapter.

**Acceptance:** encode and decode round-trip for every valid camelCase key path, and `database.host` never
collides with `databaseHost`.

- [ ] T3.1.1 — Implement encode: camelCase segments to `SCREAMING_SNAKE`, joined by `pathSeparator`, prefixed
- [ ] T3.1.2 — Implement decode: strip prefix, split on `pathSeparator`, lowercase then snake-to-camel each
      segment
- [ ] T3.1.3 — Insert `_` before every uppercase letter with no acronym special-casing; add a comment
      recording that acronym-aware encoding would break injectivity
- [ ] T3.1.4 — Handle digits: they attach to the preceding segment (`db2Host` ↔ `DB2_HOST`)
- [ ] T3.1.5 — Reject malformed names (empty segment, leading or trailing separator) by ignoring the variable
- [ ] T3.1.6 — Round-trip test the spec's table: `database.host`, `databaseHost`, `database.hostName`, `a.b.c`
- [ ] T3.1.7 — Property test: for a generated set of valid camelCase key paths, `decode(encode(p)) === p` and
      no two distinct paths encode to the same name
- [ ] T3.1.8 — Test a custom `pathSeparator`

### Story 3.2 — `envAdapter`

**Acceptance:** environment variables override file values at the correct key paths, and non-matching
variables are ignored.

- [ ] T3.2.1 — Read `process.env`, filter by `prefix`, decode each name to a key path via Story 3.1
- [ ] T3.2.2 — Build the nested `RawConfig` from the decoded key paths
- [ ] T3.2.3 — Implement `dotenv` handling for all three option forms: `true` (auto-discover in cwd), `false`
      (skip), and an explicit path string
- [ ] T3.2.4 — Load `dotenv` through `requireLib`; `.env` values must not override already-set `process.env`
      entries
- [ ] T3.2.5 — Apply `transform` via the Story 2.2 walker
- [ ] T3.2.6 — Implement `load` and `loadSync` (both synchronous internally; `load` wraps in a resolved
      promise)
- [ ] T3.2.7 — Set `name = "env"`
- [ ] T3.2.8 — Tests: prefix filtering, nested construction, `dotenv` in each form, transform, acronym
      round-trip

### Story 3.3 — File adapter base

Shared discovery, read, and error handling so the four file adapters differ only by extension list and parser.

**Acceptance:** the four file adapters contain no duplicated discovery or error-wrapping logic.

- [ ] T3.3.1 — Implement candidate generation from `name`: `<name>.<ext>`, `.<name>rc.<ext>`,
      `config/<name>.<ext>`
- [ ] T3.3.2 — Implement cwd-only discovery in priority order, no upward directory walk
- [ ] T3.3.3 — Resolve an explicit `path` relative to `process.cwd()`, bypassing discovery
- [ ] T3.3.4 — `optional: true` returns `{}` when nothing is found; `optional: false` throws
      `ZconfigAdapterError`. Applies to both explicit `path` and discovery
- [ ] T3.3.5 — Wrap parse failures into `ZconfigAdapterError` with the adapter name and the file path
- [ ] T3.3.6 — Reject a parsed root that is not a plain object
- [ ] T3.3.7 — Provide sync and async read paths over `node:fs` and `node:fs/promises`
- [ ] T3.3.8 — Apply `transform` via the Story 2.2 walker

### Story 3.4 — `jsonAdapter`

- [ ] T3.4.1 — Wire the base with extension `json` and `name` default `"config"`
- [ ] T3.4.2 — `jsonc: true` (default) parses via `jsonc-parser` loaded through `requireLib`
- [ ] T3.4.3 — `jsonc: false` parses via `JSON.parse`
- [ ] T3.4.4 — Surface `jsonc-parser` diagnostics as a `ZconfigAdapterError` message, not a silent empty
      result
- [ ] T3.4.5 — Set `name = "json"`; run the standard per-adapter test set plus a comments-allowed and a
      strict-mode-rejects-comments case

### Story 3.5 — `json5Adapter` (parallel with 3.4, 3.6, 3.7)

- [ ] T3.5.1 — Wire the base with extension `json5`, parser `json5` through `requireLib`
- [ ] T3.5.2 — Set `name = "json5"`; run the standard per-adapter test set

### Story 3.6 — `yamlAdapter` (parallel)

- [ ] T3.6.1 — Wire the base with extensions `yaml` and `yml`, parser `yaml` through `requireLib`
- [ ] T3.6.2 — Candidate order: `<name>.yaml`, `<name>.yml`, `.<name>rc.yaml`, `.<name>rc.yml`,
      `config/<name>.yaml`
- [ ] T3.6.3 — Set `name = "yaml"`; run the standard per-adapter test set
- [ ] T3.6.4 — Add a test feeding a YAML document containing a literal `__proto__` key, asserting the Story
      2.1 guard holds end to end

### Story 3.7 — `tomlAdapter` (parallel)

- [ ] T3.7.1 — Wire the base with extension `toml`, parser `smol-toml` through `requireLib`
- [ ] T3.7.2 — Set `name = "toml"`; run the standard per-adapter test set
- [ ] T3.7.3 — Add a test showing a snake_case TOML file made schema-compatible via `transform`, matching the
      spec's documented escape hatch

### Story 3.8 — Adapter barrel

- [ ] T3.8.1 — Create `src/adapters/index.ts` with named re-exports of all five adapters
- [ ] T3.8.2 — Confirm each adapter directory exports both a default and a named binding
- [ ] T3.8.3 — Re-export `loadConfig`, `loadConfigSync`, and the three error classes from `src/index.ts`
- [ ] T3.8.4 — Add the `"./adapters"` and `"./adapters/*"` entries to the `exports` map (deferred from
      T1.1.6 per R2; `./adapters` needs its own entry because it does not match the `./adapters/*` pattern)
- [ ] T3.8.5 — Build and diff the produced `dist/` tree against every `exports` map path, for `.`,
      `./adapters`, and each `./adapters/*` subpath, in both `require` and `default` conditions
      (deferred from T1.2.2)

---

## Epic 4 — Integration and release readiness

### Story 4.1 — Integration tests

**Acceptance:** the spec's usage example runs verbatim as a test and produces the documented result.

- [ ] T4.1.1 — Multi-adapter precedence: YAML base overridden by environment, asserting later-wins per key
- [ ] T4.1.2 — Execute the DESIGN.md usage example as a test, including the `APP_DATABASE__HOST` environment
      block
- [ ] T4.1.3 — Coercion cases: `z.coerce.number()` from both a real YAML number and an environment string;
      `z.stringbool()` union accepting both `true` and `"false"`
- [ ] T4.1.4 — Validation failure surfaces `ZconfigValidationError` with issue paths matching the schema key
      paths
- [ ] T4.1.5 — Sync parity across the full adapter set

### Story 4.2 — Consumption verification

**Acceptance:** all documented import paths resolve from a fresh install of the built tarball.

- [ ] T4.2.1 — Resolve every import form in the spec's Exports section against the built package: root
      barrel, `./adapters` barrel, and each `./adapters/*` subpath
- [ ] T4.2.2 — Verify both ESM and CJS consumption, confirming the `createRequire` path works in each
- [ ] T4.2.3 — Verify an environment-only install with no format libraries present works, and that a
      file adapter then fails with the actionable `ZconfigAdapterError`

### Story 4.3 — Documentation

- [ ] T4.3.1 — Write README covering quick start, the camelCase key rule, the environment encoding table, and
      the coercion guidance
- [ ] T4.3.2 — Document the camelCase constraint prominently — it is the package's most surprising rule and
      the error message alone is not enough
- [ ] T4.3.3 — Confirm `typedoc.jsonc` picks up the new entry points
- [ ] T4.3.4 — Changeset for the release

---

## Dependency graph

```text
E1.1 manifest ─┬─> E1.2 build ─┬─> E1.5 requireLib (R1 gate)
               │               │
E1.3 harness ──┴─> E1.4 types ─┘
                        │
                        v
     ┌──────────── E2.1 deepMerge ────────────┐
     ├──────────── E2.2 transform walker ─────┤
     └──────────── E2.3 validateSchema ───────┘
                        │
                        v
                 E2.4 loadConfig
                        │
        ┌───────────────┴───────────────┐
        v                               v
  E3.1 env codec              E3.3 file adapter base
        │                               │
        v                  ┌─────┬──────┼──────┬─────┐
  E3.2 envAdapter          v     v      v      v     v
        │                E3.4  E3.5   E3.6   E3.7  (parallel)
        └───────────────────┴─────┴──────┴──────┘
                        │
                        v
                 E3.8 barrel ──> E4.1 ──> E4.2 ──> E4.3
```

---

## Out of scope

Deferred deliberately; revisit only if a concrete need appears.

- **`.env.example` generator** — the schema walk in Story 2.3 already enumerates every key path, so generating
  a template is cheap. Deferred because it is a separate feature, not a prerequisite.
- **Env-to-schema collision detection** — made unnecessary by the camelCase key rule, which removes the only
  source of collisions.
- **`strictKeys: false` opt-out** — add only if someone genuinely needs an underscore key alongside
  `envAdapter`.
- **CLI argument adapter** and **inline `objectAdapter`** for defaults.
- **Upward directory walking** during file discovery, and **`.env` cascades** (`.env.local`, `.env.production`).
