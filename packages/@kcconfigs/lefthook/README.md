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

| Name             | Import path               | Description                                                               |
| ---------------- | ------------------------- | ------------------------------------------------------------------------- |
| `strict`         | `features/strict`         | Asserts Lefthook is installed and enforces minimum version 2.0.0          |
| `minimal-output` | `features/minimal-output` | Limits output to metadata, summary, and execution output for cleaner logs |

### Hooks

Each hook is a standalone YAML file that can be extended independently.
All hooks use the `{pm_cmd}` template variable for the package manager command
(see [Templates](#templates)).

#### commit-msg

| Hook         | Import path                   | Description                               |
| ------------ | ----------------------------- | ----------------------------------------- |
| `commitlint` | `hooks/commit-msg/commitlint` | Validates commit messages with commitlint |

#### pre-commit

Pre-commit hooks run on staged files and autofix where possible
(`stage_fixed: true`).

| Hook           | Import path                     | Description                         |
| -------------- | ------------------------------- | ----------------------------------- |
| `biome-check`  | `hooks/pre-commit/biome-check`  | Runs `biome check --fix --unsafe`   |
| `biome-format` | `hooks/pre-commit/biome-format` | Runs `biome format --fix --unsafe`  |
| `biome-lint`   | `hooks/pre-commit/biome-lint`   | Runs `biome lint --fix --unsafe`    |
| `ls-lint`      | `hooks/pre-commit/ls-lint`      | Validates file naming conventions   |
| `textlint`     | `hooks/pre-commit/textlint`     | Lints and fixes text/Markdown files |
| `type-check`   | `hooks/pre-commit/type-check`   | Runs `tsc --noEmit`                 |
| `vitest`       | `hooks/pre-commit/vitest`       | Runs the test suite via Vitest      |

#### pre-push

Pre-push hooks run broader validation checks before pushing.
Unlike pre-commit hooks, these do **not** autofix files.

| Hook           | Import path                   | Description                     |
| -------------- | ----------------------------- | ------------------------------- |
| `biome-check`  | `hooks/pre-push/biome-check`  | Runs `biome check` (read-only)  |
| `biome-format` | `hooks/pre-push/biome-format` | Runs `biome format` (read-only) |
| `biome-lint`   | `hooks/pre-push/biome-lint`   | Runs `biome lint` (read-only)   |

## Templates

Hooks reference the `{pm_cmd}` Lefthook template variable so they stay
package-manager agnostic. Define it in your `lefthook.yaml`:

```yaml
templates:
  pm_cmd: pnpm   # or npm, yarn, bun
```

## Example

A full working configuration used in this monorepo:

<!-- jscpd:ignore-start -->
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
<!-- jscpd:ignore-end -->
