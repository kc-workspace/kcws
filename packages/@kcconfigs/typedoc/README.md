# @kcconfigs/typedoc

Shared TypeDoc configuration with composable presets, themes, and plugins
for generating consistent API documentation across the monorepo.

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Presets](#presets)
- [Themes](#themes)
- [Plugins](#plugins)
- [References](#references)

## Prerequisites

- **TypeDoc**: as peer dependency

## Installation

```bash
pnpm add --save-dev typedoc @kcconfigs/typedoc
```

Install optional peer dependencies for themes and plugins as needed:

```bash
# Themes (all optional)
pnpm add --save-dev typedoc-github-theme
pnpm add --save-dev typedoc-material-theme
pnpm add --save-dev typedoc-theme-oxide
pnpm add --save-dev typedoc-rhineai-theme

# Plugins (all optional)
pnpm add --save-dev typedoc-plugin-dt-links
pnpm add --save-dev typedoc-plugin-extras
pnpm add --save-dev typedoc-plugin-include-example
pnpm add --save-dev typedoc-plugin-mdn-links
pnpm add --save-dev typedoc-plugin-missing-exports
```

## Usage

### Presets

This package provides ready-to-use presets for `typedoc.jsonc`:

| Name                         | Description                                                    |
| ---------------------------- | -------------------------------------------------------------- |
| `@kcconfigs/typedoc/base`    | Bare configuration with default settings only                  |
| `@kcconfigs/typedoc/package` | Single-package preset with GitHub theme and all plugins        |
| `@kcconfigs/typedoc/root`    | Monorepo root preset with `packages` entry point strategy      |

Both `package` and `root` presets enable the GitHub theme and all plugins by default.
The `base` preset includes only the default TypeDoc settings without any themes or plugins.

Use a preset via the `extends` field in `typedoc.jsonc`:

```jsonc
{
  "$schema": "https://typedoc.org/schema.json",
  "extends": ["@kcconfigs/typedoc/package"]
}
```

For a monorepo root:

```jsonc
{
  "$schema": "https://typedoc.org/schema.json",
  "extends": ["@kcconfigs/typedoc/root"],
  "name": "My Workspace",
  "entryPoints": ["packages/*"]
}
```

## Themes

Themes are imported from `@kcconfigs/typedoc/themes/*`:

| Import path                              | Theme                   | Peer dependency              |
| ---------------------------------------- | ----------------------- | ---------------------------- |
| `@kcconfigs/typedoc/themes/github`       | GitHub style            | `typedoc-github-theme`       |
| `@kcconfigs/typedoc/themes/material`     | Material Design style   | `typedoc-material-theme`     |
| `@kcconfigs/typedoc/themes/oxide`        | Rustdoc-like style      | `typedoc-theme-oxide`        |
| `@kcconfigs/typedoc/themes/rhineai`      | RhineAI style           | `typedoc-rhineai-theme`      |

All theme peer dependencies are optional.

## Plugins

Plugins are imported from `@kcconfigs/typedoc/plugins/*`:

| Import path                                  | Description                                       | Peer dependency                       |
| -------------------------------------------- | ------------------------------------------------- | ------------------------------------- |
| `@kcconfigs/typedoc/plugins/dtLinks`         | Links references to `@types` package declarations | `typedoc-plugin-dt-links`             |
| `@kcconfigs/typedoc/plugins/extras`          | Extra features (footer version, last modified)    | `typedoc-plugin-extras`               |
| `@kcconfigs/typedoc/plugins/includeExample`  | Include code examples from `*.example.ts` files   | `typedoc-plugin-include-example`      |
| `@kcconfigs/typedoc/plugins/mdnLinks`        | Links references to MDN Web Docs                  | `typedoc-plugin-mdn-links`            |
| `@kcconfigs/typedoc/plugins/missingExports`  | Include missing exports in documentation          | `typedoc-plugin-missing-exports`      |
| `@kcconfigs/typedoc/plugins/all`             | Combines all plugins above with GitHub theme      | All plugin peer dependencies          |

## References

- [TypeDoc](https://typedoc.org/)
- [TypeDoc Configuration](https://typedoc.org/documents/Options.html)
