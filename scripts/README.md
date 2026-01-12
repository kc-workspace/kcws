# Scripts

## Lifecycle

1. `./scripts/package-new.sh <package>`
  - Create package from `@kcinternals/starter`
  - Update package.json file
  - Add package to release-please/config.json
  - Initialize package in npm registry
2. `./scripts/package-version.sh <package> <version>`
  - Force set version on package
  - Update release-please/config.json depends on input version
  - Make a commit with Release-As body to force next version
3. `./scripts/package-publish.sh [git-tag]`
  - Publish package to npm registry
