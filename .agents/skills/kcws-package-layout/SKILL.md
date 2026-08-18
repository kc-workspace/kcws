---
name: kcws-package-layout
description: "Use when creating or reorganizing a reusable TypeScript library package in the KCWS pnpm monorepo and deciding where core APIs, public types, and utility namespaces belong."
user-invocable: true
disable-model-invocation: false
---

# KCWS TypeScript Library Package Layout

## When to Use

Use this layout only for reusable runtime TypeScript libraries in `packages/`.

Do not use it for:

- Config-only packages, including configuration presets or shared tool configuration.
- `@kctypes/*` type-definition utility packages.
- `@kcstyles/*` CSS, Sass, or stylesheet packages.
- CLI-only tools, examples, or packages whose existing domain layout is required by its framework.

Classify the package before creating or moving files. If it is not a reusable TypeScript library, preserve its package-specific layout.

## Required Source Layout

```text
src/
  core/
    index.ts
    *.ts
  types/
    index.ts
    <namespace>.ts
  utils/
    <namespace>/
      index.ts
      utils.ts
      types.ts
      constants.ts
      <functionName>.ts
```

- `core/` contains the main functions exposed by the library.
- `types/` contains public type definitions.
- `utils/` contains reusable utility functions grouped by namespace.
- Keep core implementations as direct files under `src/core/`; `src/core/index.ts` is the required core export boundary. If a core namespace folder is needed, its `index.ts` follows the namespace template below.
- Each `src/types/<namespace>.ts` file is a public type module. In the template, `<name>` is that module's filename without `.ts`.
- Add `utils.ts`, `types.ts`, or `constants.ts` inside a utility namespace only when internal helpers require it.
- Keep utility namespaces shallow: `src/utils/<namespace>/` is the boundary.

## Index File Templates

`src/types/index.ts` re-exports types with type-only syntax:

```ts
export type * from "./<name>"
```

A `core` or `utils` namespace `index.ts` re-exports named functions:

```ts
export { default as <function> } from "./<function>"
```

Use the same template for each public function in the namespace. Keep internal helpers out of the namespace index. Preserve the repository's quote and semicolon formatting when Biome formats the file.

## Completion Check

- The package is a reusable runtime TypeScript library and is not in an excluded category.
- Core APIs, public types, and utilities are in their designated directories.
- Every public namespace has an `index.ts` export boundary.
- Type exports use `export type`; function exports use named exports from the specified template.
- Internal utility files are not re-exported accidentally.
- The package root entrypoint exposes only the intended public API.
