# @kcconfigs/commitlint

Shared [commitlint](https://commitlint.js.org/) configuration with automatic
workspace scope detection and customizable commit types.

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Options](#options)
  - [Commit types](#commit-types)
  - [Scopes](#scopes)
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

Create a `commitlint.config.ts` at your repository root.
`defineConfig` is asynchronous because scopes are read from the workspace,
so `await` it (top-level `await` requires `"type": "module"`).

```ts
import { defineConfig, type UserConfig } from "@kcconfigs/commitlint";

const config: UserConfig = await defineConfig();

export default config;
```

### Options

| Option       | Type       | Default      | Description                                                |
| ------------ | ---------- | ------------ | ---------------------------------------------------------- |
| `types`      | `TypeMode` | `"standard"` | Commit types allowed by `type-enum`                        |
| `autoScopes` | `boolean`  | `true`       | Detect scopes from workspace packages                      |
| `scopes`     | `string[]` | -            | Extra scopes; the only scopes when `autoScopes` is `false` |

### Commit types

`types` accepts a `TypeMode`:

| Value        | Result                                                                                       |
| ------------ | -------------------------------------------------------------------------------------------- |
| `"standard"` | `feat`, `perf`, `fix`, `docs`, `test`, `style`, `build`, `refactor`, `ci`, `chore`, `revert` |
| `"minimal"`  | `feat`, `perf`, `fix`, `chore`                                                               |
| `string[]`   | Exactly the listed types, without descriptions                                               |
| `TypeObject` | Custom map of type name to `{ description?, title?, emoji? }`                                |

The `description`, `title`, and `emoji` fields are passed to the commitlint
prompt, so `@commitlint/prompt-cli` shows them when composing a commit.

### Scopes

When `autoScopes` is `true`, scopes are detected from the workspace in the
current working directory. The package manager is picked by the first match:

| Detected file                   | Source of packages               |
| ------------------------------- | -------------------------------- |
| `pnpm-workspace.yaml`           | `packages` patterns in that file |
| `bun.lock` or `bun.lockb`       | `workspaces` in `package.json`   |
| neither of the above (fallback) | `workspaces` in `package.json`   |

Package names become scopes with the leading `@` stripped, so
`@kcconfigs/commitlint` becomes the scope `kcconfigs/commitlint`.
The root package is always excluded.

If both `autoScopes` is `false` and `scopes` is empty, the config falls back to
`core`, `config`, `script`, `deps`, `deps-dev`.

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
import { defineConfig, type UserConfig } from "@kcconfigs/commitlint";

const config: UserConfig = await defineConfig({
  scopes: ["core", "config", "script", "deps", "deps-dev", "ai"],
});

export default config;
```

Use a fixed set of types and scopes in a single-package repository:

```ts
import { defineConfig, type UserConfig } from "@kcconfigs/commitlint";

const config: UserConfig = await defineConfig({
  types: "minimal",
  autoScopes: false,
  scopes: ["api", "web"],
});

export default config;
```

Custom types with prompt metadata:

```ts
import { defineConfig, type UserConfig } from "@kcconfigs/commitlint";

const config: UserConfig = await defineConfig({
  types: {
    feat: { description: "A new feature", title: "Features", emoji: "✨" },
    fix: { description: "A bug fix", title: "Bugfixes", emoji: "🐛" },
  },
});

export default config;
```

## References

- [commitlint rules](https://commitlint.js.org/reference/rules.html)
- [Conventional Commits](https://www.conventionalcommits.org/)
