# @kcws/zconfig Design Spec

**Date:** 2026-08-01  
**Package:** `@kcws/zconfig`  
**Status:** Approved

---

## Overview

`@kcws/zconfig` is a type-safe configuration loader built on Zod v4. It loads config from multiple sources (files and environment variables), deep-merges them in adapter order (later wins), then validates the merged result against a Zod schema. Invalid config throws a typed error with full Zod issue details.

---

## Architecture

```
src/
  core/
    index.ts          — loadConfig, loadConfigSync
  utils/
    deepMerge.ts      — recursive deep merge utility
    errors.ts         — ZconfigAdapterError, ZconfigValidationError
    types.ts          — Adapter, RawConfig, TransformFn shared types
  adapters/
    env/
      index.ts        — envAdapter (default export + named export)
    json/
      index.ts        — jsonAdapter (default export + named export)
    json5/
      index.ts        — json5Adapter (default export + named export)
    yaml/
      index.ts        — yamlAdapter (default export + named export)
    toml/
      index.ts        — tomlAdapter (default export + named export)
    index.ts          — named re-exports of all adapters
  index.ts            — re-exports loadConfig, loadConfigSync, error classes
```

### Data Flow

```
loadConfig(schema, [adapter1, adapter2, ...])
  → for each adapter: adapter.load() → RawConfig (plain object)
  → deepMerge all RawConfigs in order (later adapters win on conflict)
  → schema.parse(merged)
      → success: return typed config
      → failure: throw ZconfigValidationError
```

---

## Core API

```typescript
import { loadConfig, loadConfigSync } from '@kcws/zconfig';

// Async
const config = await loadConfig(schema, adapters);

// Sync
const config = loadConfigSync(schema, adapters);
```

Both accept:
- `schema`: a Zod schema (`ZodType<T>`)
- `adapters`: `Adapter[]` — ordered list, later adapters override earlier ones

---

## Adapter Interface

```typescript
type RawConfig = Record<string, unknown>;

type TransformInput  = { key: string[]; value: unknown };
type TransformOutput = { key: string[]; value: unknown };
type TransformFn     = (input: TransformInput) => TransformOutput | undefined;
// returning undefined skips the key entirely

interface Adapter {
  load(): Promise<RawConfig>;
  loadSync(): RawConfig;
}

interface BaseAdapterOptions {
  transform?: TransformFn;
}
```

`transform` is called per leaf value after the adapter has parsed its source into a nested structure. The `key` is the full path as a string array (e.g. `["database", "host"]`). Returning `undefined` drops the key.

---

## Adapters

### `envAdapter`

Reads from `process.env` and optionally loads a `.env` file first.

```typescript
envAdapter(options?: BaseAdapterOptions & {
  prefix?: string;       // e.g. "APP" → strips APP_ and maps remaining
  separator?: string;    // default "_", used to split into nested keys
  dotenv?: boolean | string;
  // default: true = auto-discover .env in cwd
  // false = skip .env file entirely
  // string = explicit path to .env file
}): Adapter
```

**Key mapping:** `APP_DATABASE_HOST` with `prefix: "APP"` and `separator: "_"` → key path `["database", "host"]`.  
**Custom mapping:** provide `transform` to override or augment key path logic.

### `jsonAdapter`

Loads a JSON or JSONC file.

```typescript
jsonAdapter(options?: BaseAdapterOptions & {
  path?: string;       // explicit file path; if omitted, auto-discovers
  optional?: boolean;  // default false; true = missing file returns {}
  jsonc?: boolean;     // default true = allow comments via jsonc-parser; false = strict JSON.parse
}): Adapter
```

**Auto-discovery order (cwd):** `config.json`, `.configrc.json`, `config/config.json`

### `json5Adapter`

Loads a JSON5 file (superset of JSON: comments, trailing commas, unquoted keys, etc.).

```typescript
json5Adapter(options?: BaseAdapterOptions & {
  path?: string;
  optional?: boolean;
}): Adapter
```

**Auto-discovery order (cwd):** `config.json5`, `.configrc.json5`, `config/config.json5`

### `yamlAdapter`

Loads a YAML file.

```typescript
yamlAdapter(options?: BaseAdapterOptions & {
  path?: string;
  optional?: boolean;
}): Adapter
```

**Auto-discovery order (cwd):** `config.yaml`, `config.yml`, `.configrc.yaml`, `.configrc.yml`, `config/config.yaml`

### `tomlAdapter`

Loads a TOML file.

```typescript
tomlAdapter(options?: BaseAdapterOptions & {
  path?: string;
  optional?: boolean;
}): Adapter
```

**Auto-discovery order (cwd):** `config.toml`, `.configrc.toml`, `config/config.toml`

---

## Error Handling

All errors thrown by `loadConfig`/`loadConfigSync` are one of two typed classes:

```typescript
// Thrown when an adapter fails to load (file missing on non-optional,
// parse error, missing library at runtime, etc.)
class ZconfigAdapterError extends Error {
  readonly adapter: string;  // adapter name, e.g. "json", "env"
  readonly cause?: unknown;  // original underlying error
}

// Thrown when merged config fails Zod schema validation
class ZconfigValidationError extends Error {
  readonly issues: ZodIssue[]; // Zod issues array
  readonly cause: ZodError;    // original ZodError
}
```

All unexpected internal errors from adapters are wrapped into `ZconfigAdapterError`. No raw errors are leaked.

---

## Exports

```typescript
// Main entry
import { loadConfig, loadConfigSync } from '@kcws/zconfig';
import { ZconfigAdapterError, ZconfigValidationError } from '@kcws/zconfig';

// All adapters (named)
import { envAdapter, jsonAdapter, json5Adapter, yamlAdapter, tomlAdapter } from '@kcws/zconfig/adapters';

// Individual adapters (default export)
import envAdapter   from '@kcws/zconfig/adapters/env';
import jsonAdapter  from '@kcws/zconfig/adapters/json';
import json5Adapter from '@kcws/zconfig/adapters/json5';
import yamlAdapter  from '@kcws/zconfig/adapters/yaml';
import tomlAdapter  from '@kcws/zconfig/adapters/toml';
```

### `package.json` exports map

```json
{
  ".": { ... },
  "./adapters": { ... },
  "./adapters/env": { ... },
  "./adapters/json": { ... },
  "./adapters/json5": { ... },
  "./adapters/yaml": { ... },
  "./adapters/toml": { ... }
}
```

---

## Dependencies

| Package | Type | Purpose |
|---|---|---|
| `zod` | direct | Schema validation |
| `yaml` | direct | YAML parsing |
| `smol-toml` | direct | TOML parsing |
| `jsonc-parser` | direct | JSONC parsing (comments support) |
| `json5` | direct | JSON5 parsing |
| `dotenv` | direct | `.env` file parsing |

All are direct dependencies. Format libraries are imported lazily (dynamic `import()`) so the package doesn't fail at load time if a library is somehow unavailable.

---

## Testing Strategy

**Framework:** Vitest  
**Filesystem:** `setupMocks()` + `vol` from `@kcconfigs/vitest/mocks` (memfs, no real FS I/O)

```typescript
import { setupMocks } from '@kcconfigs/vitest/mocks';
import { vol } from '@kcconfigs/vitest/mocks';

setupMocks();
afterEach(() => vol.reset());
```

### Test file layout

```
src/
  core/index.test.ts
  utils/deepMerge.test.ts
  adapters/
    env/index.test.ts
    json/index.test.ts
    json5/index.test.ts
    yaml/index.test.ts
    toml/index.test.ts
```

### Coverage per adapter test file

1. Happy path — valid input produces correct typed output
2. Nested objects — deep nested keys resolve correctly
3. `optional: true` — missing file returns `{}`
4. `optional: false` (default) — missing file throws `ZconfigAdapterError`
5. Parse error — malformed content throws `ZconfigAdapterError`
6. `transform` — custom transform applied correctly; `undefined` return drops key

### Core `loadConfig`/`loadConfigSync` tests

1. Single adapter — schema validates and returns typed config
2. Multiple adapters — deep merge with later-wins behavior verified
3. Validation failure — throws `ZconfigValidationError` with `issues` populated
4. Sync parity — `loadConfigSync` produces identical result to `loadConfig`

---

## Usage Example

```typescript
import { z } from 'zod';
import { loadConfig } from '@kcws/zconfig';
import { envAdapter, yamlAdapter } from '@kcws/zconfig/adapters';

const schema = z.object({
  database: z.object({
    host: z.string(),
    port: z.number(),
  }),
  debug: z.boolean().default(false),
});

const config = await loadConfig(schema, [
  yamlAdapter({ path: './config.yaml', optional: true }),
  envAdapter({ prefix: 'APP' }),
]);

// config is fully typed as z.infer<typeof schema>
```
