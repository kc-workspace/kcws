# @kcconfigs/commitlint

Shared [commitlint](https://commitlint.js.org/) configuration with a typed
`defineConfig` helper and composable plugins for commit types, fixed or
workspace-detected scopes, and raw overrides.

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Quick start](#quick-start)
  - [Asynchronous config](#asynchronous-config)
  - [Default behavior](#default-behavior)
  - [Plugins](#plugins)
    - [Commit types](#commit-types)
    - [Scopes](#scopes)
    - [Overrides](#overrides)
- [Rules](#rules)
- [Examples](#examples)
- [References](#references)

## Prerequisites

- **Node.js**: 22 or higher
- **commitlint**: installed in your repository to run the config

## Installation

```bash
pnpm add --save-dev @commitlint/cli @kcconfigs/commitlint
```

## Usage

### Quick start

Create a `commitlint.config.ts` at your repository root.

```ts
import { type CommitlintConfig, defineConfig } from "@kcconfigs/commitlint";

const config: CommitlintConfig = await defineConfig();

export default config;
```

### Asynchronous config

`defineConfig` returns a promise because workspace scopes are read from the
filesystem, so `await` it. Top-level `await` requires `"type": "module"` in
your `package.json`.

Plugins may be passed as values or as promises, so asynchronous factories such
as `autoScopePlugin` can be passed directly without awaiting them first:

```ts
import { type CommitlintConfig, defineConfig } from "@kcconfigs/commitlint";
import { autoScopePlugin, typesPlugin } from "@kcconfigs/commitlint/plugins";

const config: CommitlintConfig = await defineConfig(
  typesPlugin("minimal"),
  autoScopePlugin(["core", "config"]),
);

export default config;
```

`defineConfig` takes plugins only; it has no separate options argument.

### Default behavior

`defineConfig()` without plugins produces the same config as
`defineConfig(typesPlugin("standard"), autoScopePlugin())`:

- `parserPreset` is `@commitlint/config-conventional`
- `type-enum` allows the standard conventional commit types
- `scope-enum` allows the workspace packages detected in the current directory
- `subject-max-length` warns above 80, `body-max-line-length` warns above 300
- prompt exposes `type` and `scope` questions with `enableMultipleScopes: false`

When you pass your own `typesPlugin`, `scopePlugin`, or `autoScopePlugin`, the
matching default is skipped, so `scopePlugin([...])` never touches the
filesystem.

### Plugins

Import plugins from `@kcconfigs/commitlint/plugins`, or one at a time from
`@kcconfigs/commitlint/plugins/<name>`.

| Plugin                         | Description                                                                       |
| ------------------------------ | --------------------------------------------------------------------------------- |
| `typesPlugin(mode?)`           | Set `type-enum` and the prompt `type` question from a `TypeMode`                  |
| `scopePlugin(scopes)`          | Set `scope-enum` and the prompt `scope` question to a fixed list                  |
| `autoScopePlugin(additional?)` | Same, from workspace packages plus `additional`; asynchronous, returns a promise  |
| `overridePlugin(...configs)`   | Deep merge raw commitlint config after every other plugin                         |
| `debugPlugin(options?)`        | Log each plugin as it applies; `{ verbose: true }` also logs before/after configs |

#### Commit types

`typesPlugin` accepts a `TypeMode` and defaults to `"standard"`:

| Value        | Result                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------- |
| `"standard"` | `feat`, `perf`, `fix`, `docs`, `test`, `style`, `build`, `refactor`, `ci`, `chore`, `revert` |
| `"minimal"`  | `feat`, `perf`, `fix`, `chore`                                                               |
| `string[]`   | Exactly the listed types, without descriptions                                               |
| `TypeObject` | Custom map of type name to `{ description?, title?, emoji? }`                                |

The `description`, `title`, and `emoji` fields are passed to the commitlint
prompt, so `@commitlint/prompt-cli` shows them when composing a commit.
Each `typesPlugin` replaces the types set by an earlier one.

#### Scopes

`scopePlugin(scopes)` allows exactly the given scopes and never reads the
filesystem. Use it in single-package repositories or when scopes are curated
by hand.

`autoScopePlugin(additional?)` detects workspace packages in the current
working directory and appends `additional`. Scopes are resolved when the
plugin is created, so it returns a promise. The package manager is picked by
the first match:

| Detected file                   | Source of packages               |
| ------------------------------- | -------------------------------- |
| `pnpm-workspace.yaml`           | `packages` patterns in that file |
| `bun.lock` or `bun.lockb`       | `workspaces` in `package.json`   |
| neither of the above (fallback) | `workspaces` in `package.json`   |

Package names become scopes with the leading `@` stripped, so
`@kcconfigs/commitlint` becomes the scope `kcconfigs/commitlint`.
The root package is always excluded.

Both plugins fall back to `core`, `config`, `script`, `deps`, `deps-dev` when
the resolved list is empty. Each scope plugin replaces the scopes set by an
earlier one, so pass only one of them.

#### Overrides

`overridePlugin` deep merges plain objects and replaces arrays, functions, and
primitives. It runs with a high config priority, so it wins over built-in
plugins regardless of argument order.

## Rules

`defineConfig` returns a config built on `@commitlint/config-conventional` with:

| Rule                   | Level   | Value                             |
| ---------------------- | ------- | --------------------------------- |
| `type-enum`            | error   | Keys of the resolved commit types |
| `scope-enum`           | error   | Resolved scopes                   |
| `subject-max-length`   | warning | 80                                |
| `body-max-line-length` | warning | 300                               |

Multiple scopes per commit are disabled (`enableMultipleScopes: false`).

## Examples

Add extra scopes on top of the detected workspace packages:

```ts
import { type CommitlintConfig, defineConfig } from "@kcconfigs/commitlint";
import { autoScopePlugin } from "@kcconfigs/commitlint/plugins";

const config: CommitlintConfig = await defineConfig(
  autoScopePlugin(["core", "config", "script", "deps", "deps-dev", "ai"]),
);

export default config;
```

Use a fixed set of types and scopes in a single-package repository:

```ts
import { type CommitlintConfig, defineConfig } from "@kcconfigs/commitlint";
import { scopePlugin, typesPlugin } from "@kcconfigs/commitlint/plugins";

const config: CommitlintConfig = await defineConfig(
  typesPlugin("minimal"),
  scopePlugin(["api", "web"]),
);

export default config;
```

Custom types with prompt metadata:

```ts
import { type CommitlintConfig, defineConfig } from "@kcconfigs/commitlint";
import { typesPlugin } from "@kcconfigs/commitlint/plugins";

const config: CommitlintConfig = await defineConfig(
  typesPlugin({
    feat: { description: "A new feature", title: "Features", emoji: "✨" },
    fix: { description: "A bug fix", title: "Bugfixes", emoji: "🐛" },
  }),
);

export default config;
```

Tighten a rule and debug the plugin pipeline:

```ts
import { type CommitlintConfig, defineConfig, Severity } from "@kcconfigs/commitlint";
import { debugPlugin, overridePlugin } from "@kcconfigs/commitlint/plugins";

const config: CommitlintConfig = await defineConfig(
  debugPlugin(),
  overridePlugin({
    rules: { "subject-max-length": [Severity.Error, "always", 72] },
  }),
);

export default config;
```

## References

- [commitlint rules](https://commitlint.js.org/reference/rules.html)
- [Conventional Commits](https://www.conventionalcommits.org/)
