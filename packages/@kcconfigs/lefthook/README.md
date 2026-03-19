# @kcconfigs/lefthook

Shared [Lefthook](https://github.com/evilmartians/lefthook) configuration
for Git hooks. Provides composable presets, features, and individual hook
definitions that can be mixed and matched via Lefthook's `extends` mechanism.

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Quick start](#quick-start)
  - [Presets](#presets)
  - [Features](#features)
  - [Hooks](#hooks)
    - [commit-msg](#commit-msg)
    - [pre-commit](#pre-commit)
    - [pre-push](#pre-push)
- [Templates](#templates)
- [Example](#example)

## Prerequisites

- **Lefthook**: 2.0.0 or higher

## Installation

```bash
pnpm add --save-dev @kcconfigs/lefthook
```

Then install the Git hooks:

```bash
lefthook install
```

## Usage

### Quick start

Create a `lefthook.yaml` at your repository root and extend the default preset
along with the hooks you need:

```yaml
# $schema: https://raw.githubusercontent.com/evilmartians/lefthook/v2.0.9/schema.json

extends:
  - ./node_modules/@kcconfigs/lefthook/src/presets/default.yaml
  - ./node_modules/@kcconfigs/lefthook/src/hooks/commit-msg/commitlint.yaml
  - ./node_modules/@kcconfigs/lefthook/src/hooks/pre-commit/biome-check.yaml
  - ./node_modules/@kcconfigs/lefthook/src/hooks/pre-push/vitest.yaml

templates:
  pm_cmd: pnpm
```

### Presets

Presets bundle multiple features together for convenience.

| Name      | Import path           | Description                                    |
| --------- | --------------------- | ---------------------------------------------- |
| `default` | `@kcconfigs/lefthook` | Enables `strict` and `minimal-output` features |

### Features

Features configure Lefthook behavior and can be extended individually.

| Name             | Import path                                   | Description                                                               |
| ---------------- | --------------------------------------------- | ------------------------------------------------------------------------- |
| `strict`         | `@kcconfigs/lefthook/features/strict`         | Asserts Lefthook is installed and enforces minimum version 2.0.0          |
| `minimal-output` | `@kcconfigs/lefthook/features/minimal-output` | Limits output to metadata, summary, and execution output for cleaner logs |

### Hooks

Each hook is a standalone YAML file that can be extended independently.
All hooks use the `{pm_cmd}` template variable for the package manager command
(see [Templates](#templates)).

#### commit-msg

| Hook         | Import path                                       | Description                               |
| ------------ | ------------------------------------------------- | ----------------------------------------- |
| `commitlint` | `@kcconfigs/lefthook/hooks/commit-msg/commitlint` | Validates commit messages with commitlint |

#### pre-commit

Pre-commit hooks run on staged files and autofix where possible
(`stage_fixed: true`).

| Hook           | Import path                                         | Glob                           | Description                         |
| -------------- | --------------------------------------------------- | ------------------------------ | ----------------------------------- |
| `biome-check`  | `@kcconfigs/lefthook/hooks/pre-commit/biome-check`  | JS/TS/JSON files               | Runs `biome check --fix --unsafe`   |
| `biome-format` | `@kcconfigs/lefthook/hooks/pre-commit/biome-format` | JS/TS/JSON files               | Runs `biome format --fix --unsafe`  |
| `biome-lint`   | `@kcconfigs/lefthook/hooks/pre-commit/biome-lint`   | JS/TS/JSON files               | Runs `biome lint --fix --unsafe`    |
| `ls-lint`      | `@kcconfigs/lefthook/hooks/pre-commit/ls-lint`      | All staged files               | Validates file naming conventions   |
| `textlint`     | `@kcconfigs/lefthook/hooks/pre-commit/textlint`     | `*.md`, `*.txt`                | Lints and fixes text/Markdown files |
| `type-check`   | `@kcconfigs/lefthook/hooks/pre-commit/type-check`   | `*.ts`, `*.tsx`, `*.d.cts/mts` | Runs `tsc --noEmit`                 |
| `vitest`       | `@kcconfigs/lefthook/hooks/pre-commit/vitest`       | JS/TS files                    | Runs the test suite via Vitest      |

#### pre-push

Pre-push hooks run broader validation checks before pushing.
Unlike pre-commit hooks, these do **not** autofix files.

| Hook           | Import path                                       | Glob                           | Description                         |
| -------------- | ------------------------------------------------- | ------------------------------ | ----------------------------------- |
| `biome-check`  | `@kcconfigs/lefthook/hooks/pre-push/biome-check`  | JS/TS/JSON files               | Runs `biome check` (read-only)      |
| `biome-format` | `@kcconfigs/lefthook/hooks/pre-push/biome-format` | JS/TS/JSON files               | Runs `biome format` (read-only)     |
| `biome-lint`   | `@kcconfigs/lefthook/hooks/pre-push/biome-lint`   | JS/TS/JSON files               | Runs `biome lint` (read-only)       |
| `type-check`   | `@kcconfigs/lefthook/hooks/pre-push/type-check`   | `*.ts`, `*.tsx`, `*.d.cts/mts` | Runs `tsc --noEmit`                 |
| `vitest`       | `@kcconfigs/lefthook/hooks/pre-push/vitest`       | JS/TS files                    | Runs the full test suite via Vitest |

## Templates

Hooks reference the `{pm_cmd}` Lefthook template variable so they stay
package-manager agnostic. Define it in your `lefthook.yaml`:

```yaml
templates:
  pm_cmd: pnpm   # or npm, yarn, bun
```

## Example

A full working configuration used in this monorepo:

```yaml
# $schema: https://raw.githubusercontent.com/evilmartians/lefthook/v2.0.9/schema.json

extends:
  # Preset (strict + minimal-output)
  - ./node_modules/@kcconfigs/lefthook/src/presets/default.yaml

  # Commit message validation
  - ./node_modules/@kcconfigs/lefthook/src/hooks/commit-msg/commitlint.yaml

  # Pre-commit hooks
  - ./node_modules/@kcconfigs/lefthook/src/hooks/pre-commit/type-check.yaml
  - ./node_modules/@kcconfigs/lefthook/src/hooks/pre-commit/biome-check.yaml
  - ./node_modules/@kcconfigs/lefthook/src/hooks/pre-commit/textlint.yaml
  - ./node_modules/@kcconfigs/lefthook/src/hooks/pre-commit/ls-lint.yaml

  # Pre-push hooks
  - ./node_modules/@kcconfigs/lefthook/src/hooks/pre-push/vitest.yaml

templates:
  pm_cmd: pnpm
```
