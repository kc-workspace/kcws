---
name: kcws-vitest
description: "Use when adding or changing Vitest tests or test configuration in the KCWS pnpm monorepo. Covers colocated tests, type tests, shared Vitest config, filesystem mocks, test isolation, and focused validation."
user-invocable: true
disable-model-invocation: false
---

# KCWS Vitest Conventions

## When to Use

- Add or modify a runtime test, type test, mock, or Vitest project configuration.
- Debug test isolation, filesystem mocks, module mocks, or package test commands.
- Create tests for a new public API or package behavior.

## Procedure

1. Read nearby tests and the package `vitest.config.ts` before choosing a pattern.
2. Keep runtime tests colocated with source under `src/`:
   - Use `src/index.test.ts` for package-level API tests.
   - Use `[feature].test.ts` beside feature implementation for focused tests.
   - Use `*.test-d.ts` for type-only assertions, commonly under `types/` in `@kctypes/*` packages.
3. Import test functions from `vitest`. Use `describe` for the unit or API area and name tests by observable behavior.
4. Test public behavior through the package entrypoint when the contract is public. Test internal modules directly only when the behavior is intentionally internal and stable enough to warrant coverage.
5. Use the shared helpers from `@kcconfigs/vitest` instead of creating package-local equivalents. For filesystem tests, use `@kcconfigs/vitest/mocks` and call `vol.reset()` in `afterEach`.
6. Use `beforeEach` for per-test setup and `afterEach` for cleanup. Reset mocks, virtual filesystems, environment changes, and timers so tests do not depend on execution order.
7. Mock only external effects or platform boundaries. Prefer real domain logic and explicit fixtures for deterministic tests.
8. Preserve the package's existing `vitest.config.ts` pattern, normally using `defineProjectConfig` from `@kcconfigs/vitest`. Add mock plugins or flags only for dependencies the package actually needs to isolate.
9. Select the Vitest config that owns the tests:
   - For one package, prefer `pnpm --filter <package-name> test` from the repository root. This runs the package script with that package's own config.
   - For a workspace project, use the repository root config with `pnpm test:all --project <project-name>` or `./node_modules/.bin/vitest run --project <project-name>`.
   - Do not pass a package config such as `--config packages/@kcws/zconfig/vitest.config.ts` to a workspace-wide run. A package config can apply its mock plugins to files outside that package; for example, zconfig's filesystem mock can break commitlint tests that need the real OS temporary directory.
10. Run the narrowest test file first. Then run the package `test` script and relevant `check`/`build` scripts.

### Vitest Config Selection

The root [`vitest.config.ts`](../../vitest.config.ts) discovers package configs as named projects. Use it when selecting among packages:

```bash
pnpm test:all --project @kcconfigs/commitlint
pnpm test:all --project @kcws/zconfig
```

Use a package config only with that package's tests, normally through its package script:

```bash
pnpm --filter @kcconfigs/commitlint test
pnpm --filter @kcws/zconfig test
```

Avoid this cross-package form:

```bash
vitest run --config packages/@kcws/zconfig/vitest.config.ts
```

It is not equivalent to `pnpm test:all`; it bypasses the root project configuration and can leak package-specific mocks into unrelated test suites.

## Naming And Scope

- Use `*.test.ts`; never introduce `*.spec.ts`.
- Keep each test focused on one behavior or contract.
- Assert useful output and failure behavior, not only that a function is defined.
- Include edge cases for parsing, defaults, empty inputs, invalid inputs, and async failures when applicable.
- Keep fixtures small and readable; avoid shared mutable fixtures unless reset is explicit.

## Completion Check

- Test file is colocated with the code or follows the package's type-only layout.
- Test exercises observable behavior and relevant failure paths.
- All global state, virtual files, mocks, timers, and environment changes are cleaned up.
- Narrow test passes, followed by package tests when practical.
- `check` and `build` pass for affected packages, or unrelated failures are reported.
