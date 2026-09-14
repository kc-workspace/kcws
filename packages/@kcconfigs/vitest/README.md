# @kcconfigs/vitest

Shared [Vitest](https://vitest.dev/) configuration with composable plugins,
a monorepo root/project split, and filesystem mock helpers.

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
  - [Project config](#project-config)
  - [Root config](#root-config)
- [API](#api)
- [Plugins](#plugins)
  - [Coverage](#coverage)
- [Defaults](#defaults)
- [Mocks](#mocks)
- [References](#references)

## Prerequisites

- **Vitest**: 4.0.0 or higher (as peer dependency)

Optional, only needed by the defaults they back:

- `@vitest/coverage-v8` for the default v8 coverage provider
- `@vitest/ui` for the default `html` reporter

## Installation

```bash
pnpm add --save-dev vitest @vitest/ui @vitest/coverage-v8 @kcconfigs/vitest
```

## Usage

Configs are plain TypeScript modules. Run Vitest with the native config loader
so the `.ts` config is loaded without a pre-bundle step:

```bash
pnpm vitest run --configLoader native
```

### Project config

Use `defineProjectConfig` in each package, including standalone repositories.
It applies `rootPlugin()` and `projectPlugin()` before your own plugins:

```ts
import { defineProjectConfig } from "@kcconfigs/vitest";
import { debugPlugin } from "@kcconfigs/vitest/plugins";

export default defineProjectConfig(debugPlugin());
```

### Root config

Use `defineRootConfig` only at the root of a monorepo. The first argument is
the list of project paths or globs:

```ts
import { defineRootConfig } from "@kcconfigs/vitest";
import { coveragePlugin } from "@kcconfigs/vitest/plugins";

export default defineRootConfig(
  ["packages/**/vitest.config.ts"],
  coveragePlugin({
    thresholds: { branches: 0, functions: 0, lines: 0, statements: 0 },
  }),
);
```

## API

Exported from `@kcconfigs/vitest`:

| Export                | Description                                                               |
| --------------------- | ------------------------------------------------------------------------- |
| `defineProjectConfig` | Build a project config from `rootPlugin` + `projectPlugin` + your plugins |
| `defineRootConfig`    | Build a monorepo root config from `rootPlugin(projects)` + your plugins   |
| `defineConfig`        | Build a config from plugins only, starting from an empty base             |
| `mergeConfig`         | Deep-merge Vitest configs left to right, skipping `undefined` overrides   |

Types: `UserConfig`, `ProjectConfig`, `AnyConfig`, `VitestConfigPlugin`,
and `AnyVitestConfigPlugin`.

## Plugins

Import from `@kcconfigs/vitest/plugins`, or from a subpath such as
`@kcconfigs/vitest/plugins/coverage`.

| Plugin                          | Description                                                           |
| ------------------------------- | --------------------------------------------------------------------- |
| `coveragePlugin(opt, replace?)` | Configure `test.coverage`; see [coverage](#coverage) below            |
| `debugPlugin()`                 | Turn on Vitest's debug setting                                        |
| `overridePlugin(config)`        | Merge a raw `test` config object last (highest config priority)       |
| `projectPlugin()`               | Apply the shared project base config                                  |
| `rootPlugin(projects?)`         | Apply the shared root base config, optionally setting `test.projects` |
| `tsPathsPlugin()`               | Resolve `compilerOptions.paths` from `tsconfig.json`                  |
| `useMockPlugin(option)`         | Register the built-in module mocks as setup files                     |
| `webPlugin(environment?)`       | Set `test.environment`, defaulting to `jsdom`                         |

### Coverage

`coveragePlugin` takes `true`, `false`, or a `CoverageOptions` object, plus an
optional `replace` flag:

| Call                         | Result                                             |
| ---------------------------- | -------------------------------------------------- |
| `coveragePlugin(true)`       | Merge the shared coverage defaults                 |
| `coveragePlugin(true, true)` | Replace coverage with `{ enabled: true }`          |
| `coveragePlugin(false)`      | Remove `test.coverage` entirely                    |
| `coveragePlugin({})`         | Merge the given options into the existing coverage |
| `coveragePlugin({}, true)`   | Replace coverage with the given options            |

## Defaults

The shared root base config sets:

- `environment`: `"node"`
- `restoreMocks`, `mockReset`, `clearMocks`, `unstubGlobals`, `unstubEnvs`: `true`
- `reporters`: `default`, `html`, `junit`
- `outputFile`: `reports/test-results/index.html` and
  `reports/test-results/junit.xml`
- `coverage`: enabled, `v8` provider, `text` + `lcovonly` + `html` reporters,
  written to `reports/coverage`, with per-file thresholds

Coverage includes `**/*.{ts,tsx}` and excludes hidden files, test files,
`__mocks__`, `dist`, declaration files, and `*.example.*`, `*.config.*`,
and `*.schema.*` files.

## Mocks

`useMockPlugin` registers setup files that replace Node built-ins with
in-memory implementations. Enable them per module:

```ts
import { defineProjectConfig } from "@kcconfigs/vitest";
import { useMockPlugin } from "@kcconfigs/vitest/plugins";

export default defineProjectConfig(
  useMockPlugin({
    flags: { fs: true, fsPromises: true, os: true, process: true },
  }),
);
```

Available flags: `fs`, `fsPromises`, `process`, `os`, and `console`.
Each flag must be set to `true`; the plugin throws at config load time if the
matching mock file cannot be found.

Tests then drive the in-memory filesystem through `@kcconfigs/vitest/mocks`:

| Export     | Description                                                         |
| ---------- | ------------------------------------------------------------------- |
| `vol`      | The [memfs](https://github.com/streamich/memfs) volume backing `fs` |
| `mockCwd`  | The mocked `process.cwd()` value, `/mock/cwd`                       |
| `mockHome` | The mocked home directory, `/mock/home`                             |
| `mockTmp`  | The mocked temp directory, `/mock/tmp`                              |

Reset the volume in `afterEach` so tests stay isolated:

```ts
import { mockCwd, vol } from "@kcconfigs/vitest/mocks";
import { afterEach, expect, test } from "vitest";
import { readConfig } from ".";

afterEach(() => {
  vol.reset();
});

test("reads config from the working directory", () => {
  vol.fromJSON({ "config.json": '{"name":"kcws"}' }, mockCwd);

  expect(readConfig()).toEqual({ name: "kcws" });
});
```

## References

- [Vitest configuration](https://vitest.dev/config/)
- [Vitest coverage](https://vitest.dev/guide/coverage.html)
