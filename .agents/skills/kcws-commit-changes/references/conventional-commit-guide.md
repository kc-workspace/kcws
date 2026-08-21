# Conventional Commit Guide

Use this guide when drafting commit headers for this skill.

## Header format

Use one of:

- `<type>(<scope>): <subject>`
- `<type>: <subject>`

Write `<subject>` in imperative form and keep it concise.

## Types

- `feat`: Add or expand user-visible functionality.
- `fix`: Correct incorrect behavior.
- `refactor`: Improve internal structure without behavior change.
- `perf`: Improve performance behavior.
- `test`: Add or update tests.
- `docs`: Update documentation only.
- `build`: Change build tooling or dependency wiring.
- `ci`: Change CI/CD configuration.
- `chore`: Maintenance work not covered above.

## Scope guidance

Use the narrowest scope that owns the change. In this repository, package
scopes are detected automatically from `pnpm-workspace.yaml`; write the
package name without the `@` prefix:

- `feat(kcws/zconfig): add lazy config loading`
- `fix(kcconfigs/vitest): preserve explicit project roots`
- `refactor(kctools/bun-react): simplify the build command`

For changes that affect the whole repository, use one of the configured
shared scopes: `core`, `config`, `script`, `deps`, or `deps-dev`.

- `build(deps): upgrade Biome`
- `ci(config): run the docs workflow only for relevant files`

Do not use a directory name or a file name when an owning package scope is
available. Omit the scope for changes with no single owner, such as a
repository-wide release or housekeeping change.

## Splitting heuristics

Split into separate commits when any of these are true:

- The changes can be described with different commit types.
- Files touch different subsystems with independent intent.
- One part can be reverted independently without breaking the other.
- A reviewer would likely comment on different concerns.

Keep a single commit when all changed files are required for one
feature/fix and cannot be reviewed independently.
