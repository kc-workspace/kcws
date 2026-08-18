# KCWS Agent Guide

## Project

pnpm monorepo for My personal TypeScript/Node.js libraries, tooling,
styles, examples, and shared configuration.

- `@kcconfigs/*` - Shared configuration
- `@kcexamples/*` - Starter and proof of concept packages
- `@kcinternals/*` Monorepo-internal packages
- `@kcstyles/*` - Shraed CSS packages
- `@kctools/*` - Commandline tools
- `@kctypes/*` - Typescript definition utilty packages
- `@kcws/*` - General full-stack packages

`pnpm-workspace.yaml` controls workspaces, overrides,
strict peers, and the isolated node linker. All packages share one lockfile.

## Environment And Setup

We have couple of way to set up environment. `nodejs` and `pnpm` is the only prerequisite requirement. To install correct version of those, we provide couple options.

- Use `mise` (Prefer method)

```shell
## This will read mise.toml and install
mise install
```

- Use `corepack`

```shell
## You must have node/npm first
## if corepack is missing, install via `npm install -g corepack`
corepack enable
```

- Use standalone script ([ref](https://pnpm.io/installation#using-a-standalone-script))

```shell
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

After set up prerequisite requirement, you should run following to make sure it working

```shell
pnpm install
pnpm build:all
```

## Commands

All commands should be run from repository root.

```shell
## Run build all packages
pnpm build:all
## Test all packages
pnpm test:all
## Run build on specific package
pnpm --filter <package-name> build
pnpm --filter @kcconfigs/commitlint build
## Run test on specific package
pnpm --filter <package-name> test
pnpm --filter @kcws/actkits test
```

Standard runtime-package scripts are `build`, `test`, `check`, `fix`, `lint`, `format`, and `type:check`.

## Code And Tests

- Write TypeScript. Strict mode applies.
- Use named exports by default. Exported APIs require TSDoc and explicit return types.
- Test files use `*.test.ts`; type-only tests use `*.test-d.ts`.
- Do not introduce `*.spec.ts`.
- Tests are colocated with source under `src/` and use Vitest.
- Filesystem tests use `@kcconfigs/vitest/mocks`; call `vol.reset()` in `afterEach`.
- Run the smallest relevant test and package check after edits.
- Run `fix` and `check` script after code edits.

## Dependencies And Packages

- Ask before adding dependencies.
- Use exact dependency versions; only peer dependencies use a major-version caret range.
- Use `workspace:*` for workspace dependencies. Do not run `pnpm update`; Dependabot manages upgrades.
- Do not manually edit generated `dist/`, coverage, test-result, or documentation output.
- Changing a local package dependency may require rebuilding the dependency package.

## Documentation And Releases

- Update a package `README.md` for user-facing changes and TSDoc for exported APIs.
- Use `scripts/package-new.sh <package>` and `scripts/package-version.sh <package> <version>` for package lifecycle changes. See [scripts/README.md](scripts/README.md).
- Use Conventional Commit when create commits
- Scope must be either whitelist at [commitlint.config.ts](commitlint.config.ts) or package name without `@`. Example: `@kcconfigs/commitlint` uses `kcconfigs/commitlint`.
- Do not bypass Git hooks with `--no-verify` unless explicitly instructed.

## Validation And Troubleshooting

- Biome provides formatting and linting. Prefer package `check` or `fix` commands over ad hoc tool flags.
- Build local configuration packages when an import or generated type cannot be resolved:

```bash
pnpm build:config
pnpm --filter <package-name> build
```

- For package-specific usage and configuration, read that package's `README.md` and `package.json` before changing behavior.

## Git Hygiene

- Worktree may contain unrelated user changes. Preserve them; never revert, discard, or reformat them as part of another task.
- Keep edits scoped. Add or update tests for behavior changes.
- Before claiming completion, run a focused executable validation when available and report unrelated failures separately.
