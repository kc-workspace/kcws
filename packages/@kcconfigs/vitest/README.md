# @kcconfigs/vitest

Shared [Vitest](https://vitest.dev/) configuration for KCWS packages.

## Installation

```bash
## @vitest/ui          - html reporter for test result
## @vitest/coverage-v8 - code coverage calculate
pnpm add -D @kcconfigs/vitest vitest @vitest/ui @vitest/coverage-v8
```

## Usage

Extend the shared configuration from your package's `vitest.config.ts`:

```ts
import { defineProjectConfig } from '@kcconfigs/vitest'
import { debugPlugin } from '@kcconfigs/vitest/plugins'

export default defineProjectConfig(debugPlugin())
```

Run tests with:

```bash
pnpm vitest run
```
