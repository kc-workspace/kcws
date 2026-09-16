# @kcconfigs/biome

Shared [Biome](https://biomejs.dev/) formatter, linter, and assist settings.

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Integrate with vscode](#integrate-with-vscode)
  - [Presets](#presets)
- [Formatter defaults](#formatter-defaults)
- [Test file relaxations](#test-file-relaxations)
- [Example](#example)

## Prerequisites

- **Biome**: 2.0.0 or higher (as peer dependency)

## Installation

```bash
pnpm add --save-dev @biomejs/biome @kcconfigs/biome
```

## Usage

Add a `biome.json` (or `biome.jsonc`) that extends the default preset:

```jsonc
{
  "$schema": "https://biomejs.dev/schemas/2.5.11/schema.json",
  "extends": ["@kcconfigs/biome"]
}
```

### Integrate with vscode

I recommended to add following to `.vscode/settings.json`.

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.biome": "explicit"
  }
}
```

### Presets

| Name                    | Description                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `@kcconfigs/biome`      | Default preset. Extends `base` and adds file includes/excludes plus `useEditorconfig`         |
| `@kcconfigs/biome/base` | Bare preset with formatter, linter, and assist rules only, without workspace-specific filters |

The default preset excludes generated artifacts such as `dist`, `reports/coverage`,
`reports/test-results`, lock files, `*.tsbuildinfo`, and release-please manifests.
See [default.json](./src/presets/default.json) for the full list.

Use `base` when you need to own the include/exclude patterns yourself.

## Formatter defaults

Inherited from [base.json](./src/presets/base.json):

- **Indent style**: tab
- **Indent width**: 2
- **Line width**: 120
- **Line ending**: LF
- **VCS integration**: enabled, uses `.gitignore`, default branch `main`

The default preset also sets `formatter.useEditorconfig` to `true`,
so an `.editorconfig` in your repository takes precedence over the values above.

## Test file relaxations

The default preset relaxes a few rules for `**/*.test.*`, `**/*.spec.*`,
and `**/__mocks__/**`:

- `complexity/useLiteralKeys`: off
- `suspicious/noExplicitAny`: off
- `style/noNonNullAssertion`: off

## Example

Base preset with custom includes and a rule override:

```jsonc
{
  "$schema": "https://biomejs.dev/schemas/2.5.11/schema.json",
  "extends": ["@kcconfigs/biome/base"],
  "files": { "includes": ["src/**/*.ts", "tests/**/*.ts"] },
  "linter": {
    "rules": {
      "complexity": {
        "noUselessSwitchCase": "warn"
      }
    }
  }
}
```
