# @kcws/zconfig

Type-safe configuration loading from files and environment variables with Zod 4.

## Install

```bash
pnpm add @kcws/zconfig zod
```

Install only the optional format libraries used by your adapters:

```bash
pnpm add dotenv yaml jsonc-parser json5 smol-toml
```

## Quick start

```typescript
import { z } from "zod";
import { loadConfig } from "@kcws/zconfig";
import {
	dotenvAdapter,
	envAdapter,
	yamlAdapter,
} from "@kcws/zconfig/adapters";

const schema = z.object({
	database: z.object({
		host: z.string(),
		port: z.coerce.number(),
	}),
	debug: z.union([z.boolean(), z.stringbool()]).default(false),
});

const config = await loadConfig(schema, [
	yamlAdapter({ path: "./config.yaml", optional: true }),
	dotenvAdapter({ path: "./.env", optional: true, prefix: "APP" }),
	envAdapter({ prefix: "APP" }),
]);
```

With these environment variables, environment values override values from YAML:

```bash
APP_DATABASE__HOST=db.internal
APP_DATABASE__PORT=5432
APP_DEBUG=true
```

`config` is typed as `z.output<typeof schema>`. Use `loadConfigSync` for synchronous loading.

## Imports

```typescript
import { loadConfig, loadConfigSync } from "@kcws/zconfig";
import {
	dotenvAdapter,
	envAdapter,
	jsonAdapter,
	json5Adapter,
	staticAdapter,
	tomlAdapter,
	yamlAdapter,
} from "@kcws/zconfig/adapters";
import jsonAdapter from "@kcws/zconfig/adapters/json";
```

The package exports `envAdapter`, `dotenvAdapter`, `staticAdapter`, `jsonAdapter`, `json5Adapter`, `yamlAdapter`,
and `tomlAdapter`. File adapters support discovery, an explicit `path`, `optional: true`, and a leaf `transform`.

## Schema keys

Every statically declared object key must match `/^[a-z][a-zA-Z0-9]*$/`: start with a lowercase letter, then
use letters and digits only. Underscores and leading uppercase letters are rejected with
`ZconfigSchemaError` before any adapter runs.

This rule makes environment names reversable.
Nested paths use `__`; word boundaries inside one camelCase key use `_`:

| Schema path | Environment name with `prefix: "APP"` |
| --- | --- |
| `database.host` | `APP_DATABASE__HOST` |
| `databaseHost` | `APP_DATABASE_HOST` |
| `database.hostName` | `APP_DATABASE__HOST_NAME` |
| `a.b.c` | `APP_A__B__C` |

Keys from source files may use another convention. Rename them with an adapter `transform` before validation.

## Value coercion

Adapters preserve source values. Put coercion in the schema, where the intended type is known:

- Use `z.coerce.number()` when a number may arrive from YAML as a number or from the environment as a string.
- Use `z.union([z.boolean(), z.stringbool()])` for booleans that may arrive from either source. Avoid
  `z.coerce.boolean()`: JavaScript truthiness makes the string `"false"` truthy.

## Adapters

- `envAdapter` reads `process.env` or a supplied environment object.
- `dotenvAdapter` reads dotenv-style files such as `.env` and decodes their keys using the same options as
	`envAdapter`.
- `staticAdapter` returns an already available raw configuration object and can apply a leaf `transform`.
- `jsonAdapter` reads JSONC by default for `.json` and always uses JSONC for `.jsonc`.
- `json5Adapter` reads JSON5 files.
- `yamlAdapter` reads `.yaml` and `.yml` files.
- `tomlAdapter` reads TOML files.

Format libraries are optional peers and loaded only when their adapter runs. A missing library throws
`ZconfigAdapterError` with the adapter name and package to install.

## Errors

- `ZconfigSchemaError` means a schema key violates the camelCase rule.
- `ZconfigAdapterError` means an adapter could not load or parse its source.
- `ZconfigValidationError` contains the original Zod `issues` and `cause`.
