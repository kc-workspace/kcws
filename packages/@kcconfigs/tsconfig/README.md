# @kcconfigs/tsconfig

Shared TypeScript configuration presets for the kc-workspace monorepo.
Provides multiple tsconfig.json templates for different project types and use cases.

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Recommended settings](#recommended-settings)
- [Usage](#usage)
  - [Presets](#presets)
    - [Root](#root)
  - [Environments](#environments)
  - [Features](#features)
  - [Custom settings](#custom-settings)
- [Compiler Options](#compiler-options)
- [Example](#example)
  - [TSDown](#tsdown)
  - [React](#react)
- [Investigate](#investigate)
- [References](#references)

<!-- jscpd:ignore-start -->

## Prerequisites

- **TypeScript**: 5.5.0 or higher (as peer dependency)

## Installation

```bash
pnpm add --save-dev typescript @kcconfigs/tsconfig
```

## Recommended settings

- `"type": "module"` on package.json ([learn more][package.json#type])

## Usage

This package provides multiple tsconfig presets, environments, and features:

### Presets

| Name                           | Description                                |
| ------------------------------ | ------------------------------------------ |
| `@kcconfigs/tsconfig/base`     | Base configuration for general typescript  |
| `@kcconfigs/tsconfig`          | Default configuration                      |
| `@kcconfigs/tsconfig/commonjs` | Default but for CommonJS (not recommended) |
| `@kcconfigs/tsconfig/root`     | Use monorepo root with /packages           |
| `@kcconfigs/tsconfig/bundler`  | Use for with bundler (vite, tsdown, etc.)  |
| `@kcconfigs/tsconfig/react`    | Use for React projects (extends bundler)   |
| `@kcconfigs/tsconfig/dts`      | Use for generate declaration and maps      |
| `@kcconfigs/tsconfig/zshy`     | Use with [zshy][zshy]                      |

Example use presets

```json
{
  "extends": "@kcconfigs/tsconfig"
}
```

#### Root

We are have some restriction:

1. Your packages must be on `packages` directory

```json
{
  "extends": "@kcconfigs/tsconfig/root"
}
```

### Environments

| Name                            | Description             |
| ------------------------------- | ----------------------- |
| `@kcconfigs/tsconfig/envs/node` | For node environment    |
| `@kcconfigs/tsconfig/envs/web`  | For browser environment |

```json
{
  "extends": [
    "@kcconfigs/tsconfig",
    "@kcconfigs/tsconfig/envs/node"
  ]
}
```

### Features

| Name                                           | Description                                         |
| ---------------------------------------------- | --------------------------------------------------- |
| `@kcconfigs/tsconfig/features/bundler`         | Set for bundler mode                                |
| `@kcconfigs/tsconfig/features/declaration`     | Add declaration files                               |
| `@kcconfigs/tsconfig/features/declarationOnly` | Only emit declaration files                         |
| `@kcconfigs/tsconfig/features/diagnostics`     | Add diagnostics output for debugging                |
| `@kcconfigs/tsconfig/features/nodeRuntime`     | Set typescript to support directly run from Node.js |
| `@kcconfigs/tsconfig/features/noDefaultTypes`  | Disable small set of default types                  |
| `@kcconfigs/tsconfig/features/noIncremental`   | Disable incremental from base config                |
| `@kcconfigs/tsconfig/features/noSourcemap`     | Disable source map and declaration maps output      |
| `@kcconfigs/tsconfig/features/noStrict`        | Disable strict mode when type checks                |
| `@kcconfigs/tsconfig/features/tslib`           | Enable using helpers from `tslib`                   |
| `@kcconfigs/tsconfig/features/types`           | Support custom `@kctypes/*` packages as types       |
| `@kcconfigs/tsconfig/features/js`              | Allow JavaScript files to be imported               |
| `@kcconfigs/tsconfig/features/es5`             | Set target to ES5 (2009) for backward compatible    |
| `@kcconfigs/tsconfig/features/es6`             | Set target to ES6 (ES2015) for backward compatible  |
| `@kcconfigs/tsconfig/features/react`           | Enable JSX support with `react-jsx` transform       |
| `@kcconfigs/tsconfig/features/empty`           | Starting point for new features                     |

Example use features

```json
{
  "extends": [
    "@kcconfigs/tsconfig",
    "@kcconfigs/tsconfig/features/noSourcemap"
  ]
}
```

### Custom settings

To extend configurations with custom settings:

```json
{
  "extends": ["@kcconfigs/tsconfig", "@kcconfigs/tsconfig/envs/node"],
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"],
  "compilerOptions": {
    "declaration": true
  }
}
```

## Compiler Options

All configurations inherit base settings:

- **Target**: ESNext
- **Module**: ESNext
- **Strict Mode**: Enabled
- **Source Maps**: Enabled
- **Check Js**: Enabled

## Example

Below are the example configuration per tools or frameworks.

### TSDown

```json
{
  "extends": "@kcconfigs/tsconfig/bundler"
}
```

### React

The react preset extends from bundler with React support,
including JSX transform (`react-jsx`) and `.tsx` file inclusion.

```json
{
  "extends": "@kcconfigs/tsconfig/react"
}
```

## Investigate

You can use `tsc --showConfig` command to show the full config
after resolved **extends** path.

## References

- [TypeScript Configuration][tsconfig]

[package.json#type]: https://nodejs.org/api/packages.html#type
[zshy]: https://github.com/colinhacks/zshy
[tsconfig]: https://www.typescriptlang.org/tsconfig

<!-- jscpd:ignore-end -->
