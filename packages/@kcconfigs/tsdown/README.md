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

Required peer dependencies:

- `tsdown`: 0.22.7 or higher
- `unrun`: 0.3.0 or higher

Optional peer dependencies, used by the checks that are enabled by default:

- `publint`
- `@arethetypeswrong/core`
- `unplugin-unused`

## Installation

```bash
pnpm add --save-dev tsdown unrun @kcconfigs/tsdown
```

The `publint`, `attw`, and `unused` checks are enabled by default, so install
their peers unless you turn those checks off:

```bash
pnpm add --save-dev publint @arethetypeswrong/core unplugin-unused
```

## Usage

### Quick start

Create `tsdown.config.ts`:

```ts
import { defineConfig, type TsdownConfig } from "@kcconfigs/tsdown";
import { entryPlugin, nodePlugin } from "@kcconfigs/tsdown/plugins";

const config: TsdownConfig = defineConfig(
  entryPlugin(["./src/index.ts"]),
  nodePlugin(),
);

export default config;
```

`defineConfig` takes plugins only; it has no separate config argument.
To merge a plain tsdown config object, wrap it in `overridePlugin`.

### Default behavior

`defineConfig()` starts from an internal base config, applies your plugins,
then appends internal normalizers for `attw`, `dts`, `format`, and `publint`.
Current defaults include:

- `entry`: `./src/index.ts`, excluding `*.example.ts`, `*.test.ts`, `*.spec.ts`,
  `*.test-d.ts`, and `*.spec-d.ts` under `./src`
- `platform`: `"neutral"`
- `outDir`: `"dist"`
- `clean`: `true`
- `minify`: `true`
- `fixedExtension`: `false`
- `failOnWarn`: `true`
- `publint.enabled`: `true` (warning level)
- `unused.enabled`: `true` (warning level; checks `dependencies` and `peerDependencies`)
- `attw.enabled`: `true`

### Plugins

You can import plugins from `@kcconfigs/tsdown/plugins` or direct subpaths
like `@kcconfigs/tsdown/plugins/node`.

| Plugin                            | Import                      | Description                                                                             |
| --------------------------------- | --------------------------- | --------------------------------------------------------------------------------------- |
| `attwPlugin(config)`              | `@kcconfigs/tsdown/plugins` | Configure `attw` (`@arethetypeswrong/core`) options                                     |
| `browserPlugin()`                 | `@kcconfigs/tsdown/plugins` | Set platform to `browser`                                                               |
| `cssPlugin(option?)`              | `@kcconfigs/tsdown/plugins` | Build CSS/SCSS entry as `index.css` with ESM output                                     |
| `debugPlugin(option?)`            | `@kcconfigs/tsdown/plugins` | Disable minification and set debug env flags; pass `{ verbose: true }` for verbose logs |
| `depsPlugin(config)`              | `@kcconfigs/tsdown/plugins` | Configure dependency externalization via `deps`                                         |
| `dtsPlugin(config)`               | `@kcconfigs/tsdown/plugins` | Configure declaration generation (`dts`)                                                |
| `entryPlugin(entry, useDefault?)` | `@kcconfigs/tsdown/plugins` | Override entries and optionally append default excludes                                 |
| `formatPlugin(format)`            | `@kcconfigs/tsdown/plugins` | Configure output formats                                                                |
| `nodePlugin()`                    | `@kcconfigs/tsdown/plugins` | Set platform to `node`                                                                  |
| `outputPlugin(outDir)`            | `@kcconfigs/tsdown/plugins` | Override output directory                                                               |
| `overridePlugin(...configs)`      | `@kcconfigs/tsdown/plugins` | Merge additional tsdown config objects                                                  |
| `publintPlugin(config)`           | `@kcconfigs/tsdown/plugins` | Configure `publint` checks                                                              |
| `unusedPlugin(config)`            | `@kcconfigs/tsdown/plugins` | Configure unused dependency checks                                                      |

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
  entryPlugin(["./src/index.ts", "./src/cli.ts"]),
  nodePlugin(),
  outputPlugin("dist"),
  unusedPlugin({
    ignore: ["publint", "@arethetypeswrong/core", "unplugin-unused", "unrun"],
  }),
);
```

CSS-only package build.
`cssPlugin` replaces the entry with `./src/index.<lang>`, forces `esm` format,
and disables the `publint` and `attw` checks:

```ts
import { defineConfig } from "@kcconfigs/tsdown";
import { cssPlugin } from "@kcconfigs/tsdown/plugins";

export default defineConfig(cssPlugin({ lang: "scss" }));
```

Merging a raw tsdown config object:

```ts
import { defineConfig } from "@kcconfigs/tsdown";
import { nodePlugin, overridePlugin } from "@kcconfigs/tsdown/plugins";

export default defineConfig(
  nodePlugin(),
  overridePlugin({ sourcemap: true, treeshake: false }),
);
```
