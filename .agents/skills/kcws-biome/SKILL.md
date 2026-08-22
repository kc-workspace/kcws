---
name: kcws-biome
description: "Use when formatting, linting, or configuring TypeScript and related files in the KCWS pnpm monorepo. Covers shared Biome presets, package scripts, safe fixes, and validation."
user-invocable: true
disable-model-invocation: false
---

# KCWS Biome Conventions

## When to Use

- Format or lint TypeScript, JSON, Markdown, or configuration files.
- Add or modify a package Biome configuration or validation script.
- Fix Biome diagnostics after changing source or tests.
- Decide which repository check or fix command to run.

## Procedure

1. Read the nearest `biome.json` and the package `package.json` before changing tooling configuration.
2. Extend the shared preset instead of duplicating rules. The root configuration normally uses:

   ```json
   {
     "$schema": "https://biomejs.dev/schemas/2.5.7/schema.json",
     "extends": ["@kcconfigs/biome"],
     "root": true
   }
   ```

3. Preserve the repository's Biome version and shared configuration package. Do not add ad hoc formatter or linter settings when an existing preset covers the need.
4. Use package scripts for validation:
   - `pnpm run check:lint` runs `biome lint`.
   - `pnpm run check:format` runs `biome format`.
   - `pnpm run check` runs lint, format, and TypeScript checks.
   - `pnpm run fix` runs `biome check --fix --unsafe`.
   - `pnpm run fix:lint` runs lint fixes.
   - `pnpm run fix:format` runs format fixes.
5. Prefer the smallest scoped command while iterating, then run the affected package `check` script before completion.
6. Use automatic fixes only when the resulting change is understood. Review `--unsafe` fixes carefully, especially around imports, types, and generated or configuration files.
7. Keep formatting-only changes separate from behavior changes when practical. Do not reformat unrelated files or generated output.
8. If a diagnostic reflects a real code issue, fix the code rather than weakening the shared rule. Change configuration only when the repository-wide rule is wrong and the exception is documented by surrounding configuration.

## Boundaries

- Do not manually edit generated `dist/`, coverage, test-result, or documentation output.
- Do not bypass Biome with unrelated formatter tools.
- Do not add package-local rule copies that drift from `@kcconfigs/biome`.
- Preserve existing user changes and unrelated formatting.

## Completion Check

- Nearest Biome configuration remains based on the shared preset.
- Modified files pass lint and format checks.
- TypeScript changes also pass the package type check.
- Fixes did not alter unrelated files or generated output.
- Run the affected package `check`; run `build` or tests when the change affects code behavior.
