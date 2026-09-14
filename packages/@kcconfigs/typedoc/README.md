# @kcconfigs/typedoc

Shared TypeDoc configuration with composable presets, themes, and plugins
for generating consistent API documentation across the monorepo.

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Presets](#presets)
- [Themes](#themes)
- [Plugins](#plugins)
- [Programmatic API](#programmatic-api)
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

| Name                         | Description                                               |
| ---------------------------- | --------------------------------------------------------- |
| `@kcconfigs/typedoc/base`    | Bare configuration with default settings only             |
| `@kcconfigs/typedoc/package` | Single-package preset with GitHub theme and all plugins   |
| `@kcconfigs/typedoc/root`    | Monorepo root preset with `packages` entry point strategy |

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

| Import path                          | Theme                 | Peer dependency          |
| ------------------------------------ | --------------------- | ------------------------ |
| `@kcconfigs/typedoc/themes/github`   | GitHub style          | `typedoc-github-theme`   |
| `@kcconfigs/typedoc/themes/material` | Material Design style | `typedoc-material-theme` |
| `@kcconfigs/typedoc/themes/oxide`    | Rustdoc-like style    | `typedoc-theme-oxide`    |
| `@kcconfigs/typedoc/themes/rhineai`  | RhineAI style         | `typedoc-rhineai-theme`  |

All theme peer dependencies are optional.

## Plugins

Plugins are imported from `@kcconfigs/typedoc/plugins/*`:

| Import path                                 | Description                                       | Peer dependency                  |
| ------------------------------------------- | ------------------------------------------------- | -------------------------------- |
| `@kcconfigs/typedoc/plugins/dtLinks`        | Links references to `@types` package declarations | `typedoc-plugin-dt-links`        |
| `@kcconfigs/typedoc/plugins/extras`         | Extra features (footer version, last modified)    | `typedoc-plugin-extras`          |
| `@kcconfigs/typedoc/plugins/includeExample` | Include code examples from `*.example.ts` files   | `typedoc-plugin-include-example` |
| `@kcconfigs/typedoc/plugins/mdnLinks`       | Links references to MDN Web Docs                  | `typedoc-plugin-mdn-links`       |
| `@kcconfigs/typedoc/plugins/missingExports` | Include missing exports in documentation          | `typedoc-plugin-missing-exports` |
| `@kcconfigs/typedoc/plugins/all`            | Combines all plugins above with GitHub theme      | All plugin peer dependencies     |

## Programmatic API

The package root exports helpers for composing your own preset, for example in
a `typedoc.config.ts` or a private preset package.

| Export             | Description                                                                          |
| ------------------ | ------------------------------------------------------------------------------------ |
| `defineConfig`     | Merge configs onto the shared base, then normalize the result                        |
| `defineBaseConfig` | Shared base options only, without normalization                                      |
| `definePlugin`     | Type helper for a plugin config, carrying the plugin's custom option types           |
| `defineTheme`      | Type helper for a theme config                                                       |
| `mergeConfig`      | Deep-merge TypeDoc configs left to right, skipping `undefined` overrides             |
| `normalizeConfig`  | Deduplicate `plugin` and append TypeDoc's defaults to the array options listed below |

`normalizeConfig` appends the TypeDoc defaults to `blockTags`, `inlineTags`,
`modifierTags`, `highlightLanguages`, `kindSortOrder`, `sort`, and
`requiredToBeDocumented`, so setting one of them adds to the defaults instead of
replacing them. The same applies to those keys inside `packageOptions`.
The default arrays are also exported directly as `defaultBlockTags`,
`defaultInlineTags`, `defaultModifierTags`, `defaultHighlightLanguages`,
`defaultKindSortOrder`, `defaultSort`, and `defaultRequiredToBeDocumented`.

```ts
import { defineConfig, type UserConfig } from "@kcconfigs/typedoc";
import all from "@kcconfigs/typedoc/plugins/all";
import github from "@kcconfigs/typedoc/themes/github";

const config: UserConfig = defineConfig(github, all, {
  highlightLanguages: ["http"],
});

export default config;
```

### Base options

`defineBaseConfig` sets, among others:

- `entryPointStrategy`: `"resolve"`
- `emit`: `"docs"`, `cleanOutputDir`: `true`
- `packageOptions.includeVersion`: `true`
- `useTsLinkResolution`: `true`, `categorizeByGroup`: `true`
- `searchInDocuments` and `searchInComments`: `true`
- `validation`: reports `notExported`, `invalidLink`, `invalidPath`,
  `rewrittenLink`, and `unusedMergeModuleWith`, but not `notDocumented`
- `treatWarningsAsErrors` and `treatValidationWarningsAsErrors`: `false`

## References

- [TypeDoc](https://typedoc.org/)
- [TypeDoc Configuration](https://typedoc.org/documents/Options.html)
