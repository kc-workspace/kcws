---
name: kcws-typescript
description: "Use when creating or changing TypeScript packages in the KCWS pnpm monorepo. Covers package classification, source layout, exports, public API types, tsconfig, tsdown, dependencies, and package documentation."
user-invocable: true
disable-model-invocation: false
---

# KCWS TypeScript Conventions

## When to Use

- Create or modify a TypeScript package in `packages/`.
- Add a public API, entrypoint, subpath export, or type declaration.
- Change package metadata, TypeScript configuration, or build configuration.
- Decide where implementation files, models, utilities, or tests belong.

## Procedure

1. Read the target package `package.json`, README, and nearby `src/` files before editing.
2. Classify the package before choosing its layout:
   - Runtime packages normally use `src/`, `src/index.ts`, `tsconfig.json`, and `tsdown.config.ts`.
   - `@kctypes/*` packages use `types/index.d.ts` and type tests instead of runtime source.
   - `@kcstyles/*` packages may build CSS or Sass rather than JavaScript.
   - Config-only packages and `@kcexamples/*` can have package-specific layouts; follow their existing files.
3. For runtime packages, keep feature code grouped by responsibility. Common folders are `apis/`, `models/`, `utils/`, `constants/`, and package-specific feature folders.
4. Put public exports behind `src/index.ts` or a feature `index.ts`. Prefer named exports. Use `export type` or `type` imports for type-only symbols.
5. Give exported APIs explicit return types and TSDoc. Keep implementation details private unless package consumers need them.
6. Extend the shared TypeScript preset, normally `@kcconfigs/tsconfig/bundler`; do not duplicate root compiler settings without a package-specific reason.
7. Use `@kcconfigs/tsdown` and its plugins for runtime builds when the package follows the standard bundle pattern. Preserve existing ESM/CJS and declaration output conventions.
8. Use `workspace:*` for local dependencies. Keep production dependency versions exact unless the repository convention explicitly requires a peer range. Ask before adding dependencies.
9. Update the package README and public API documentation when behavior or exported API changes.
10. Keep tests beside the code they cover. Follow `kcws-vitest` for test structure and `kcws-biome` for formatting and linting.

## Package Boundaries

- Do not edit generated `dist/`, coverage, test-result, or documentation output.
- Do not introduce `*.spec.ts`; use `*.test.ts` or `*.test-d.ts`.
- Do not add default exports when a named export matches the surrounding package style.
- Do not move code across package namespaces unless the task requires it.
- Preserve unrelated worktree changes.

## Completion Check

- Public symbols are reachable from the intended entrypoint or export map.
- New exported APIs have explicit types and TSDoc.
- Local dependencies use `workspace:*`.
- Relevant README content is current.
- Run the smallest relevant test, then the package `check` and `build` scripts.
- If a shared local config package changed, build that dependency before validating consumers.
