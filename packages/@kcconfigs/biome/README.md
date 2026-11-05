# @kcconfigs/biome

Shared [Biome](https://biomejs.dev/) formatter, linter, and assist settings.
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Integrate with vscode](#integrate-with-vscode)
  - [Presets](#presets)
  - [Features](#features)
- [Formatter defaults](#formatter-defaults)
- [Test file relaxations](#test-file-relaxations)
- [Example](#example)
- [Migrating from 3.x](#migrating-from-3x)

## Prerequisites

- **Biome**: 2.6.0 or higher (as peer dependency). Presets are published through a
  [Biome manifest](https://biomejs.dev/guides/publish-packages/#publish-biome-configurations), which requires Biome 2.6.0.

## Installation

```bash
pnpm add --save-dev @biomejs/biome @kcconfigs/biome
```

## Usage

Add a `biome.json` (or `biome.jsonc`) that extends the default preset.
Presets are referenced as `@kcconfigs/biome/configs/<name>`:

```jsonc
{
	"$schema": "https://biomejs.dev/schemas/2.6.5/schema.json",
	"extends": ["@kcconfigs/biome/configs/default"]
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

| Name                               | Description                                                                                                                   |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `@kcconfigs/biome/configs/default` | `base` + `ignores`, `ignoresBuild`, `useEditorconfig`, [test file relaxations](#test-file-relaxations)                        |
| `@kcconfigs/biome/configs/base`    | Formatter, linter, and assist rules only, without file includes                                                               |
| `@kcconfigs/biome/configs/astro`   | `base` + `ignores`, `htmlFull`, and excludes `.astro`                                                                         |
| `@kcconfigs/biome/configs/svelte`  | `base` + `ignores`, `ignoresBuild` (SvelteKit `adapter-static`/`adapter-node` output), `htmlFull`, and excludes `.svelte-kit` |

Presets are composed from [features](#features). Names are declared in [biome-manifest.json](./biome-manifest.json).
Other generated files are expected to be ignored through `.gitignore`.

Use `base` when you need to own the include/exclude patterns yourself.

### Features

Features are config pieces shared by more than one preset. Extend them after a preset to opt in:

| Name                                             | Description                                                                       |
| ------------------------------------------------ | --------------------------------------------------------------------------------- |
| `@kcconfigs/biome/configs/features.ignores`      | Include `**`, exclude `.vitest`, `dist`, `dist.*`, `.*.old`, `node_modules`       |
| `@kcconfigs/biome/configs/features.ignoresBuild` | Exclude `.dist`, `build`, `build.*`, `out`, `out.*`, and generated `CHANGELOG.md` |
| `@kcconfigs/biome/configs/features.htmlFull`     | Enable `html.experimentalFullSupportEnabled` for `*.astro` and `*.svelte`         |

`files.includes` from every extended config is concatenated in `extends` order, and later patterns win.
Only `features.ignores` includes `**`. Do not add `**` to your own `files.includes`: it re-includes everything excluded before it.

With `htmlFull`, Biome analyzes both the script and the template of `*.astro` and `*.svelte` files.
Variables and imports used only in the template are not reported as unused.

## Formatter defaults

Inherited from [base.json](./src/presets/base.json):
- **Indent style**: tab
- **Indent width**: 2
- **Line width**: 120
- **Line ending**: LF
- **package.json**: arrays and objects always expanded, one item per line
- **VCS integration**: enabled, uses `.gitignore`, default branch `main`

The default preset also sets `formatter.useEditorconfig` to `true`,
so an `.editorconfig` in your repository takes precedence over the values above.

## Test file relaxations

The default preset relaxes a few rules for `**/*.test.*`, `**/*.spec.*`,
and `**/__mocks__/**`:
- `suspicious/noExplicitAny`: off
- `style/noNonNullAssertion`: off

## Example

Base preset with custom includes and a rule override:

```jsonc
{
	"$schema": "https://biomejs.dev/schemas/2.6.5/schema.json",
	"extends": ["@kcconfigs/biome/configs/base"],
	"files": {"includes": ["src/**/*.ts", "tests/**/*.ts"]},
	"linter": {
		"rules": {
			"complexity": {
				"noUselessSwitchCase": "warn"
			}
		}
	}
}
```

Base preset with shared ignores and full HTML support:

```jsonc
{
	"$schema": "https://biomejs.dev/schemas/2.6.5/schema.json",
	"extends": [
		"@kcconfigs/biome/configs/base",
		"@kcconfigs/biome/configs/features.ignores",
		"@kcconfigs/biome/configs/features.htmlFull"
	]
}
```

## Migrating from 3.x

Version 4 publishes presets through a Biome manifest instead of `package.json` exports.
Upgrade Biome to 2.6.0 or higher, then update `extends`:

| 3.x                       | 4.x                                |
| ------------------------- | ---------------------------------- |
| `@kcconfigs/biome`        | `@kcconfigs/biome/configs/default` |
| `@kcconfigs/biome/base`   | `@kcconfigs/biome/configs/base`    |
| `@kcconfigs/biome/astro`  | `@kcconfigs/biome/configs/astro`   |
| `@kcconfigs/biome/svelte` | `@kcconfigs/biome/configs/svelte`  |
