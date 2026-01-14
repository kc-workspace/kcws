# Scripts

## New package

> `./scripts/package-new.sh <package>`

1. Create package from `@kcinternals/starter`
2. Update package.json file (set version to beta)
3. Build package
4. Add package to release-please/config.json
5. Initializing package in npm registry
6. Set package back to stable on release-please

## Update package version

> `./scripts/package-version.sh <package> <version>`

1. Update package.json#version field
2. Update release-please/config.json (if needed)
3. Create a commit with Release-As body

## Publish package

> `./scripts/package-publish.sh [git-tag]`

1. If name is provided, use it to publish specific package
2. If run on GitHub Actions, use REF_NAME to determine package and version
3. If none provide, publish all packages to npm registry
