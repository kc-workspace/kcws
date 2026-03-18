# AGENTS.md

## Project Overview

This is a **pnpm monorepo** containing libraries, tools, and configuration packages for TypeScript/Node.js projects. The workspace is organized into six main package namespaces:

- **@kcconfigs**: Shared configurations (Biome, CommitLint, TSConfig, TSDown, Vitest)
- **@kcexamples**: Example projects for testing and proof of concepts
- **@kcinternals**: Internal utilities specific to this monorepo
- **@kctools**: Command-line tools
- **@kctypes**: TypeScript type definition utilities
- **@kcws**: Generic full-stack development packages

**Key Technologies:**

- TypeScript (version is defined on package.json)
- Node.js managed via mise;
- pnpm (workspace protocol enabled via Corepack)
- Vitest v4 for testing
- Biome v2 for linting/formatting
- TSDown for building
- TypeDoc for documentation

**Architecture:**

- Isolated node linker for dependency resolution
- Shared workspace lockfile
- Automatic post-install builds for @kcconfigs packages
- Workspace catalog for dependency version management
- `@kctools/*` is currently reserved and effectively empty
- `@kctypes/*` packages can be type-only packages and do not always follow the same build/check script pattern as the runtime packages

## Setup Commands

NEVER use Volta when set up Node.js in local.
The volta config exists only for actions/setup-node in CI/CD.

```bash
# Clone repository
git clone git@github.com:kc-workspace/kcws.git
cd kcws

# Install Node.js (option 1: using mise - recommended)
mise install

# Enable pnpm (package manager is pinned via Corepack)
corepack enable

# Install all dependencies
pnpm install

# Initial build
pnpm build:all
```

## Development Workflow

### Navigating the Monorepo

```bash
# List all packages
pnpm list --recursive --depth -1

# Filter by specific package
pnpm --filter <package-name> <command>

# Example: build only commitlint config
pnpm --filter @kcconfigs/commitlint build
```

### Package Structure

Each package typically has:

- `src/` - Source TypeScript files
- `dist/` - Built output (ESM and CJS)
- `package.json` - Package configuration with exports
- `vitest.config.ts` - Test configuration
- `tsconfig.json` - TypeScript configuration
- `tsdown.json` - Tsdown configuration (if needed to compile)
- `biome.json` - Biome configuration
- `typedoc.jsonc` - Typedoc configuration (if needed to document)

Important exceptions:

- `@kcconfigs/biome` and `@kcconfigs/tsconfig` are config-first packages and do not use the full `src/` plus build-output layout
- `@kctypes/*` packages can expose declaration files from `types/` and may only provide `test` scripts
- `@kcexamples/demo` is intentionally a multi-builder example package and includes TSDown, Vite, Zshy, and DTS-specific build commands

### Common Commands

```bash
# Build all packages
pnpm build:all

# Build specific package
pnpm --filter <package-name> build

# Check all packages (lint, format, type check)
pnpm check:all

# Fix all lint/format issues
pnpm fix:all

# Root-level text and file naming checks
pnpm check:text
pnpm check:text:fix
pnpm check:file

# Generate docs
pnpm docs:all

# Clean built artifacts
pnpm clean

# Clean everything including node_modules
pnpm clean:all
```

## Testing Instructions

### Running Tests

```bash
# Run all tests across all packages
pnpm test:all

# Run tests for specific package
pnpm test:all --project '@kcconfigs/commitlint'
# or from package directory (not recommend)
cd packages/@kcconfigs/commitlint
pnpm test

# Run specific test file
pnpm test:all --project '@kcconfigs/commitlint' src/index.test.ts
# or
pnpm test src/index.test.ts
```

Most runtime packages follow a shared script shape:

- `build`
- `test`
- `fix`
- `check`
- `lint`, `lint:check`, `format`, `format:check`, `type:check`

Notable exceptions:

- `@kctypes/*` packages can be test-only declaration packages
- `@kcexamples/demo` has extra build entrypoints such as `build:tsdown`, `build:vite`, `build:vite:mjs`, `build:vite:cjs`, `build:zshy`, and `build:dts`

### Test File Conventions

- Test files: **Always use `*.test.ts`** (never `*.spec.ts`)
- Type tests: Use `*.test-d.ts` for type-only tests
- Located alongside source files in `src/` directory
- Use Vitest framework with expect assertions
- Mock file system operations using `@kcconfigs/vitest/mocks`

### Coverage Requirements

- **Coverage is enabled by default** for all test runs
- Coverage reports generated in the root `reports/coverage/`
- JUnit reports in the root `reports/test-results/junit.xml`
- HTML reports are written under `reports/test-results/`
- No strict coverage thresholds enforced (currently set to 0%)

### Test Patterns

```typescript
// Standard test structure
import { describe, expect, test, beforeEach, afterEach, vi } from "vitest";
import { vol } from "@kcconfigs/vitest/mocks"; // For file system mocking

describe("Feature", () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    vol.reset(); // Clean up mocks
  });

  test("should do something", () => {
    expect(result).toBe(expected);
  });
});
```

Additional testing notes:

- Many filesystem-oriented tests use `@kcconfigs/vitest/mocks` with `vol.reset()` in `afterEach`
- `@kcconfigs/vitest` also exposes `setupMocks()` helpers for `fs`, `fsPromises`, `process`, and `os` mocks
- Rare suppressions in tests use targeted Biome ignore comments rather than broad lint disable blocks

## Code Style Guidelines

### Linting and Formatting

**Primary Tool:** Biome (replaces ESLint + Prettier)

```bash
# Check all packages (lint, format, type check)
pnpm check:all

# Fix issues automatically in all packages
pnpm fix:all

# Check specific package
pnpm --filter <package-name> check

# Fix specific package
pnpm --filter <package-name> fix
```

### Language Conventions

- **TypeScript only** - Never use JavaScript unless absolutely necessary
- **TypeScript strict mode enabled**
- **No non-null assertions** - Use optional chaining or type guards instead
- **Avoid biome-ignore comments** - Write proper code instead of suppressing warnings
- **Prefer const over let**
- **Use explicit return types for exported functions**
- **Import organization:**
  - Node.js built-ins first (with `node:` prefix)
  - External dependencies
  - Internal workspace packages
  - Relative imports

### File Organization

**Note:** Folder structure inside `src/` depends on the package itself and is not standardized across packages.

```text
packages/
  @kcconfigs/
    <package-name>/
      src/
        index.ts              # Main entry point (required)
        index.test.ts         # Tests for index (required for tested code)
        index.test-d.ts       # Type tests (optional)
        apis/                 # Sub-modules (optional, package-specific)
          feature.ts
          feature.test.ts
      dist/                   # Built output (git-ignored, auto-generated)
      reports/                # Test reports and coverage (git-ignored, auto-generated)
      package.json            # Package manifest (required)
      tsconfig.json           # TypeScript config (required)
      vitest.config.ts        # Test config (required if has tests)
      tsdown.config.ts        # Build config (optional, only if needs custom build)
      biome.json              # Linter config (required on all packages)
      typedoc.jsonc           # Documentation config (optional, only if needs docs)
      README.md               # Package documentation (required)
```

### Naming Conventions

- **Files:**
  - camelCase for general files (`myFeature.ts`, `getUserData.ts`)
  - PascalCase for files with default class export (`MyClass.ts`, `UserConfig.ts`)
  - Test files: `fileName.test.ts` or `fileName.test-d.ts`
- **Classes/Interfaces:** PascalCase (`MyClass`, `UserConfig`)
- **Functions/Variables:** camelCase (`getUserData`, `isValid`)
- **Constants:** `UPPER_SNAKE_CASE` for true constants
- **Package names:** Use lowercase with hyphens, dot, or underscore if needed (`@kcconfigs/commit-lint`)
  - underscore only allow on @kctypes package

### Import/Export Patterns

```typescript
// Use named exports (preferred)
export const myFunction = () => {};
export type MyType = {};

// Default exports for configs
export default config;

// Barrel exports in index files
export { feature1 } from "./apis/feature1";
export type { Type1 } from "./apis/feature1";
```

### Biome Suppressions

**Important:** Avoid using biome-ignore comments as much as possible. Write proper code that doesn't require suppressions.

Only use suppressions in rare cases when:

1. Testing specific edge cases that require unsafe operations
2. Working with third-party types that are incompatible with strict rules
3. Temporary workarounds that are documented with todo comments

```typescript
// Only when absolutely necessary
// biome-ignore lint/style/noNonNullAssertion: testing known structure with TODO to refactor
const value = config!.rules!["type-enum"];
```

## Build and Deployment

### Build Process

```bash
# Build all packages
pnpm build:all

# Build specific package
pnpm --filter @kcconfigs/commitlint build

# Clean before build
pnpm clean && pnpm build:all
```

### Build Configuration

- **Builder:** TSDown (configured in `tsdown.config.ts`)
- **Output formats:** ESM (`.js`) and CJS (`.cjs`)
- **Type definitions:** `.d.ts` and `.d.cts`
- **Output directory:** `dist/`

### Package Exports

Each package defines exports in `package.json`:

```json
{
  "main": "./dist/index.js",
  "types": "./dist/index.d.cts",
  "exports": {
    ".": {
      "source": "./src/index.ts",
      "typedoc": "./src/index.ts",
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      },
      "default": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      }
    }
  }
}
```

### Documentation Generation

```bash
# Generate TypeDoc documentation
pnpm docs:all

# Output: ./docs/ directory
# View: open docs/index.html
```

### Publishing

**Note:** Packages use workspace protocol and semantic versioning.

```bash
# Before publishing, ensure:
# 1. All tests pass
pnpm test:all

# 2. All checks pass
pnpm check:all

# 3. Build is successful
pnpm build:all

# Note: publint and attw are automatically run after build
# No need to run them manually
```

### Utility Scripts

The `scripts/` directory contains repository maintenance helpers:

```bash
# Create a new package from the starter template
./scripts/package-new.sh <package>

# Update a package version and release-please config
./scripts/package-version.sh <package> <version>
```

These scripts also update release-please metadata, so prefer them over ad hoc manual edits when working on package lifecycle changes.

## Git Hooks (Lefthook)

Git hooks are managed by Lefthook and run automatically:

### Pre-commit

Runs on staged files:

- **Biome check:** Auto-fixes formatting and linting issues
- **Textlint:** Checks and fixes markdown/text files
- **ls-lint:** Validates file naming and layout rules

### Commit-msg

- **CommitLint:** Validates commit message format (conventional commits)
- Lefthook sets `LEFTHOOK=0` for this step to avoid recursive hook execution

### Pre-push

Runs before pushing:

- **Type check:** `pnpm hooks:pre-push:check:type`
- **Lint check:** Biome lint validation
- **Format check:** Biome format validation
- **Tests:** Full test suite via Vitest

### Manual Hook Commands

```bash
# Run pre-commit checks manually
pnpm hooks:pre-commit:check:biome <files>
pnpm hooks:pre-commit:check:text <files>
pnpm hooks:pre-commit:check:file <files>

# Run pre-push checks manually
pnpm hooks:pre-push:check:type
pnpm hooks:pre-push:check:lint <files>
pnpm hooks:pre-push:check:format <files>
pnpm hooks:pre-push:test
```

**Important:** Never skip Git hooks (using `--no-verify`) unless explicitly instructed by the user. Hooks ensure code quality and prevent breaking changes.

### Install Hooks

Hooks are installed automatically on `pnpm install`. To reinstall:

```bash
lefthook install
```

## Commit Guidelines

### Commit Message Format

This project uses **Conventional Commits** with commitizen:

```bash
# Interactive commit helper
pnpm commit

# Manual format
git commit -m "type(scope): subject"
```

### Commit Types

- `feat`: New feature
- `fix`: bugfix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Test changes
- `build`: build tool changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks
- `revert`: Revert previous commit

### Commit Scopes

Available scopes (configured in commitlint.config.ts):

- `core`: Core functionality
- `config`: Configuration changes
- `script`: Script changes
- `deps`: Production dependencies
- `deps-dev`: Development dependencies
- Package names: Auto-detected from workspace (remove `@` prefix from package.json name)
  - Example: `@kcconfigs/commitlint` → scope is `kcconfigs/commitlint`

### Examples

```bash
feat(kcconfigs/commitlint): add support for custom types
fix(deps): update vulnerable dependency
chore(deps-dev): update typescript to 5.9.3
```

## Pull Request Guidelines

### PR Title Format

Follow the same format as commit messages:

```text
type(scope): Brief description
```

Examples:

- `feat(commitlint): add new configuration option`
- `fix(vitest): resolve test timeout issue`
- `docs(agents): create comprehensive AGENTS.md`

### Required Checks

All PRs must pass:

- ✅ Type checking
- ✅ Linting (Biome)
- ✅ Formatting (Biome)
- ✅ All tests
- ✅ Conventional commit format

### Review Process

- Ensure all CI checks pass
- **Always add or update tests** for any code changes
- **Always update documentation:**
  - README.md for user-facing changes
  - AGENTS.md for development workflow changes
  - TSDoc comments on all exported functions, classes, and types
- Keep PRs focused and atomic
- Run full test suite and checks before submitting

## Monorepo Tips

### Working with Specific Packages

```bash
# Jump to package directory quickly
cd packages/@kcconfigs/commitlint

# Install dependencies for specific package
pnpm --filter @kcconfigs/commitlint install

# Run command in specific package
pnpm --filter @kcconfigs/commitlint test

# Run command in all packages matching pattern
pnpm --filter "@kcconfigs/*" build

# Run command recursively with output
pnpm recursive run --if-present --stream build
```

### Cross-Package Dependencies

- Use `workspace:*` protocol in package.json
- Config packages (@kcconfigs) are built automatically on install
- Changes to local dependencies require rebuild

### Dependency Management

**Important Rules:**

1. **Always ask user before adding new dependencies** to any package
2. **Use exact versions** (no `^` or `~`) except for peer dependencies
3. **Peer dependencies** should use `^` with major version only
4. **Never manually upgrade dependencies** - dependabot handles this automatically
5. Only override version rules if user specifically requests it

```bash
# Add exact version dependency to specific package
pnpm --filter <package-name> add <dependency> --save-exact

# Add peer dependency with caret (major version)
pnpm --filter <package-name> add <dependency> --save-peer
# Then manually edit package.json to use ^X.0.0 format

# Add dev dependency
pnpm --filter <package-name> add -D <dependency> --save-exact

# Add workspace dependency
pnpm --filter <package-name> add <workspace-package> --workspace

# Check for outdated dependencies (view only)
pnpm outdated

# Do NOT run: pnpm update (dependabot handles updates)
```

### Package Catalog

This workspace uses pnpm catalog for shared dependency versions:

- Defined in `pnpm-workspace.yaml` under `catalog` and `catalogs`
- Use `catalog:` protocol in package.json

**Catalog Usage Guidelines:**

1. **Use default catalog** (`catalog:`) as much as possible
2. Use named catalogs (`catalog:<name>:latest`) only when package requires multiple dependencies at specific versions
3. **All peer dependencies** must use `:peer` suffix (e.g., `catalog:test:peer`)

Examples:

```json
{
  "dependencies": {
    "typescript": "catalog:",
    "vitest": "catalog:test:latest"
  },
  "peerDependencies": {
    "vitest": "catalog:test:peer"
  }
}
```

## Debugging and Troubleshooting

### Common Issues

Known repo-specific pitfalls:

- `@kcconfigs/textlint` currently has upstream breakage (`textlint/textlint#1896`)
- `@kcconfigs/biome/features/*` currently has upstream breakage (`biomejs/biome#9370`)
- release-please cannot easily convert prerelease packages back to stable versions
- Dependabot can generate an invalid `pnpm-lock.yaml`; inspect lockfile changes carefully on dependency PRs

**Issue**: Package not found

```bash
# Reinstall dependencies
pnpm install

# Clear pnpm cache
pnpm store prune

# Rebuild packages
pnpm build:all
```

**Issue**: Type errors in imports

```bash
# Ensure config packages are built
pnpm --filter "@kcconfigs/*" build

# Rebuild type definitions
pnpm --filter <package-name> build
```

**Issue**: Tests failing with module not found

```bash
# Ensure dependencies are installed
pnpm install

# Check if package is built
pnpm --filter <package-name> build

# Clear Vitest cache
pnpm vitest run --clearCache
```

**Issue**: Git hooks not running

```bash
# Reinstall lefthook hooks
lefthook install
```

**Issue**: Biome check failures

```bash
# Auto-fix most issues
biome check --fix --unsafe

# Check specific files
biome check --fix --unsafe path/to/file.ts
```

### Performance Considerations

- **Parallel execution:** Use `--stream` flag for better visibility
- **Incremental builds:** TSDown supports incremental compilation
- **Test isolation:** Each package has isolated tests
- **Dependency resolution:** Isolated node linker may be slower but more reliable

### Logging and Debug Mode

```bash
# Verbose pnpm output
pnpm --loglevel debug <command>

# Vitest debug output
pnpm vitest --reporter=verbose

# Node.js debug mode
NODE_OPTIONS='--inspect-brk' pnpm test
```

### Debugging with Visual Studio Code

**Recommended:** Use VS Code's "Run and Debug" panel for debugging:

1. Open Visual Studio Code
2. Go to "Run and Debug" panel (Ctrl+Shift+D / Cmd+Shift+D)
3. Select appropriate debug configuration
4. Set breakpoints in your code
5. Press F5 to start debugging

This provides full breakpoint support, variable inspection, and step-through debugging capabilities.

## Environment Setup

### Required Tools

- **Node.js:** use the version from `mise.toml`; root package engines currently allow `^20.9.0 || ^22.11.0 || ^24.11.0 || >=25.0.0`
- **pnpm:** 10.30.3 (managed by Corepack)
- **Git:** For version control
- **mise:** (Optional) For automatic Node.js version management

### Optional Tools

- **TypeDoc:** For documentation generation (included)
- **Biome:** For linting/formatting (included)
- **Vitest UI:** For interactive test debugging

### Environment Variables

No special environment variables required for basic development.

### IDE Setup (Recommended)

**Visual Studio Code:**

- Install Biome extension
- TypeScript version: Use workspace version
- Enable formatOnSave with Biome

**Settings:**

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [pnpm Workspace](https://pnpm.io/workspaces)
- [Vitest](https://vitest.dev/)
- [Biome](https://biomejs.dev/)
- [TSDown](https://tsdown.js.org/)
- [Lefthook](https://github.com/evilmartians/lefthook)

## Package-Specific Notes

### @kcconfigs/commitlint

Custom commitlint configuration with automatic workspace scope detection.

```bash
# Test commitlint config
pnpm --filter @kcconfigs/commitlint test

# Build
pnpm --filter @kcconfigs/commitlint build
```

### @kcconfigs/vitest

Shared Vitest configuration with file system mocking utilities.

```bash
# Important: Must be built before other packages can use it
pnpm --filter @kcconfigs/vitest build
```

### @kcconfigs/biome

Shared Biome configuration used across all packages.

```bash
# Configuration extends from this package
# See biome.json in each package
```

## Quick Reference

```bash
# Common workflows
pnpm install                    # Install dependencies
pnpm build:all                  # Build all packages
pnpm test:all                   # Run all tests
pnpm check:all                  # Run all checks
pnpm fix:all                    # Fix lint/format issues
pnpm commit                     # Interactive commit
pnpm clean                      # Clean build artifacts

# Package-specific
pnpm --filter <pkg> build       # Build package
pnpm --filter <pkg> test        # Test package
pnpm --filter <pkg> dev         # Watch mode

# Testing
pnpm test:all                   # Run all tests
vitest                          # Watch mode
vitest run                      # Run once
vitest --ui                     # UI mode
vitest run -t "pattern"         # Run specific tests

# Linting/Formatting
pnpm check:all                  # Check all packages
pnpm fix:all                    # Fix all packages
pnpm --filter <pkg> check       # Check specific package
pnpm --filter <pkg> fix         # Fix specific package
```
