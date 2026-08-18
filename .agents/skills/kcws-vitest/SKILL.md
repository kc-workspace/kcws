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
9. Run the narrowest test file first. Then run the package `test` script and relevant `check`/`build` scripts.

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
