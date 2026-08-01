# @kcconfigs/tsdown

Shared [tsdown](https://tsdown.dev/) configuration with a typed
`defineConfig` helper and composable plugins for common package build setups.

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Quick start](#quick-start)
  - [Default behavior](#default-behavior)
  - [Plugins](#plugins)
- [Examples](#examples)

## Prerequisites

- **tsdown** as a peer dependency

Optional peer dependencies used by specific checks/features:

- `publint`
- `@arethetypeswrong/core`
- `unplugin-unused`
- `unrun`

## Installation

```bash
pnpm add --save-dev tsdown @kcconfigs/tsdown
```

Install optional peers only when you use related features:

```bash
pnpm add --save-dev publint @arethetypeswrong/core unplugin-unused unrun
```

## Usage

### Quick start

Create `tsdown.config.ts`:

```ts
import { defineConfig } from "@kcconfigs/tsdown";
import { entryPlugin, nodePlugin } from "@kcconfigs/tsdown/plugins";

export default defineConfig({}, entryPlugin(["./src/index.ts"]), nodePlugin());
```

### Default behavior

`defineConfig()` starts from an internal base config and appends internal
normalizers. Current defaults include:

- `entry`: `./src/index.ts` with test/example excludes
- `platform`: `"neutral"`
- `outDir`: `"dist"`
- `clean`: `true`
- `minify`: `true`
- `failOnWarn`: `true`
- `publint.enabled`: `true` (warning level)
- `unused.enabled`: `true` (warning level; checks `dependencies` and `peerDependencies`)
- `attw.enabled`: `true`

### Plugins

You can import plugins from `@kcconfigs/tsdown/plugins` or direct subpaths
like `@kcconfigs/tsdown/plugins/node`.

| Plugin | Import | Description |
| ------ | ------ | ----------- |
| `attwPlugin(config)` | `@kcconfigs/tsdown/plugins` | Configure `attw` (`@arethetypeswrong/core`) options |
| `browserPlugin()` | `@kcconfigs/tsdown/plugins` | Set platform to `browser` |
| `cssPlugin(option?)` | `@kcconfigs/tsdown/plugins` | Build CSS/SCSS entry as `index.css` with ESM output |
| `debugPlugin()` | `@kcconfigs/tsdown/plugins` | Disable minification and set debug env flags |
| `depsPlugin(config)` | `@kcconfigs/tsdown/plugins` | Configure dependency externalization via `deps` |
| `dtsPlugin(config)` | `@kcconfigs/tsdown/plugins` | Configure declaration generation (`dts`) |
| `entryPlugin(entry, useDefault?)` | `@kcconfigs/tsdown/plugins` | Override entries and optionally append default excludes |
| `formatPlugin(format)` | `@kcconfigs/tsdown/plugins` | Configure output formats |
| `nodePlugin()` | `@kcconfigs/tsdown/plugins` | Set platform to `node` |
| `outputPlugin(outDir)` | `@kcconfigs/tsdown/plugins` | Override output directory |
| `overridePlugin(...configs)` | `@kcconfigs/tsdown/plugins` | Merge additional tsdown config objects |
| `publintPlugin(config)` | `@kcconfigs/tsdown/plugins` | Configure `publint` checks |
| `unusedPlugin(config)` | `@kcconfigs/tsdown/plugins` | Configure unused dependency checks |

## Examples

Node package build with custom output and unused dependency ignore list:

```ts
import { defineConfig } from "@kcconfigs/tsdown";
import {
  entryPlugin,
  nodePlugin,
  outputPlugin,
  unusedPlugin,
} from "@kcconfigs/tsdown/plugins";

export default defineConfig(
  {},
  entryPlugin(["./src/index.ts", "./src/cli.ts"]),
  nodePlugin(),
  outputPlugin("dist"),
  unusedPlugin({
    ignore: ["publint", "@arethetypeswrong/core", "unplugin-unused", "unrun"],
  }),
);
```

CSS-only package build:

```ts
import { defineConfig } from "@kcconfigs/tsdown";
import { cssPlugin } from "@kcconfigs/tsdown/plugins";

export default defineConfig({}, cssPlugin({ lang: "scss" }));
```
