# @kcconfigs/textlint

Shared [textlint](https://textlint.github.io/) rule, filter, and preset
definitions.

> **Deprecated**: textlint's config format is not designed to be extended, so
> a shared config cannot be consumed through `extends` the way the other
> `@kcconfigs/*` packages are. Prefer configuring textlint directly in your
> repository. This package is still published and is documented below for the
> repositories that already depend on it.

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Rules](#rules)
- [Filters](#filters)
- [Presets](#presets)
- [Define helpers](#define-helpers)
- [References](#references)

## Prerequisites

- **textlint**: 15.0.0 or higher (as peer dependency)

The bundled rule and filter modules ship as direct dependencies, so they do not
need to be installed separately:

- `textlint-rule-terminology`
- `textlint-filter-rule-allowlist`
- `textlint-filter-rule-comments`

## Installation

```bash
pnpm add --save-dev textlint @kcconfigs/textlint
```

## Usage

The ready-made config is exported from `@kcconfigs/textlint/configs/default`.
It enables the `terminology` rule with the `comments` and `allowlist` filters:

```ts
import config from "@kcconfigs/textlint/configs/default";

export default config;
```

Because textlint reads `.textlintrc.*` rather than a TypeScript module, this is
only usable from a tool that can load the module and hand the resulting object
to textlint's API. For a plain `.textlintrc.yaml`, write the rule and filter
names directly.

## Rules

| Export          | textlint rule               | Description                                  |
| --------------- | --------------------------- | -------------------------------------------- |
| `terminology()` | `textlint-rule-terminology` | Enforces correct spelling of technical terms |

`terminology(config?)` accepts `defaultTerms`, `skip`, `terms`, and `exclude`.
Passing no config enables the rule with its own defaults.

## Filters

| Export        | textlint filter                  | Description                                  |
| ------------- | -------------------------------- | -------------------------------------------- |
| `comments()`  | `textlint-filter-rule-comments`  | Honors `textlint-disable` comments           |
| `allowlist()` | `textlint-filter-rule-allowlist` | Skips reports matching an allowlist of terms |

`comments(enabled?)` defaults to enabled; pass `false` to turn the filter off.

`allowlist(config?)` is disabled when called with no argument. Passing a config
without `allow` falls back to `DEFAULT_ALLOWLIST`, which is also exported:

```ts
import { DEFAULT_ALLOWLIST, allowlist } from "@kcconfigs/textlint";

// editorconfig, url, html, api, apis, github, typescript, json
console.log(DEFAULT_ALLOWLIST);

const filter = allowlist({ allow: [...DEFAULT_ALLOWLIST, "kcws"] });
```

## Presets

| Import path                           | Description                              |
| ------------------------------------- | ---------------------------------------- |
| `@kcconfigs/textlint/presets/default` | Preset containing the `terminology` rule |

A preset is a named bundle of rules, exposing `rules` (name to module) and
`rulesConfig` (name to config) for textlint to consume.

## Define helpers

The package root exports type-safe constructors for building your own rules,
filters, and presets:

| Export         | Description                                      |
| -------------- | ------------------------------------------------ |
| `defineRule`   | Build a `Rule` from `{ name, module, config }`   |
| `defineFilter` | Build a `Filter` from `{ name, config }`         |
| `definePreset` | Build a `Preset` from a name and a list of rules |

```ts
import { definePreset, defineRule, terminology } from "@kcconfigs/textlint";
import maxComma from "textlint-rule-max-comma";

const commas = defineRule({
  name: "max-comma",
  module: maxComma,
  config: { max: 4 },
});

export default definePreset("my-preset", terminology(), commas);
```

Types `Rule`, `Filter`, `Preset`, `Plugin`, `Config`, `UserConfig`, and their
`Any*` variants are exported from the package root as well.

## References

- [textlint configuration](https://textlint.github.io/docs/configuring.html)
- [Creating textlint rules](https://textlint.github.io/docs/rule.html)
