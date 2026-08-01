# @kcws/actkits

Shared GitHub Actions toolkit utilities for context detection, typed input parsing, structured logging, and workflow outputs.

- [Installation](#installation)
- [What is included](#what-is-included)
- [Usage](#usage)
  - [Parse typed inputs](#parse-typed-inputs)
  - [Work with GitHub context](#work-with-github-context)
  - [Log with namespaces](#log-with-namespaces)
  - [Set workflow outputs](#set-workflow-outputs)

## Installation

```bash
pnpm add @kcws/actkits
```

## What is included

- `@kcws/actkits/context`
  - Read GitHub Actions runtime context from environment variables
  - Check common workflow predicates (push, pull request, release, tag, branch)
  - Build links to repository and run pages
- `@kcws/actkits/input`
  - Parse action inputs with Zod schemas
  - Resolve values from `process.env` and `@actions/core` inputs
  - Includes parsers such as `zBoolean`, `zNumber`, `zJsonString`, and `zYamlFile`
- `@kcws/actkits/logging`
  - Namespaced logger wrapper around `@actions/core`
  - `printf` style formatting and grouped logs
- `@kcws/actkits/output`
  - Type-friendly `setOutput` and `setOutputs` helpers

## Usage

### Parse typed inputs

```ts
import { parseInput, z, zBoolean, zNumber } from "@kcws/actkits/input";

const schema = z.object({
  dryRun: zBoolean().default(false),
  retries: zNumber().int().min(0).default(0),
  token: z.string().min(1),
});

const input = parseInput(schema);
// input is strongly typed from the schema
```

### Work with GitHub context

```ts
import { getContext, isPullRequestEvent, getRunUrl } from "@kcws/actkits/context";

const context = getContext();

if (isPullRequestEvent(context)) {
  const runUrl = getRunUrl(context);
  console.log("Running on pull request", runUrl);
}
```

### Log with namespaces

```ts
import { createLogger } from "@kcws/actkits/logging";

const logger = createLogger("release", "publish");

logger.info("Starting publish for %s", "my-package");
logger.notice("Version %s is ready", "1.2.3");
```

### Set workflow outputs

```ts
import { setOutput, setOutputs } from "@kcws/actkits/output";

setOutput("version", "1.2.3");

setOutputs({
  published: true,
  artifactCount: 2,
  metadata: { channel: "stable" },
});
```
