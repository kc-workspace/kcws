<!-- Title section -->
<h1 align="center">
  Kamontat's Workspace ecosystem

  <img alt="TypeScript icon" src="https://simpleicons.org/icons/typescript.svg" width="24px">
  <img alt="Node.js icon" src="https://simpleicons.org/icons/nodedotjs.svg" width="24px">
  <img alt="CSS icon" src="https://simpleicons.org/icons/css.svg" width="24px">
  <img alt="HTML icon" src="https://simpleicons.org/icons/html5.svg" width="24px">
</h1>

<!-- Description section -->
<p align="center">
    <strong>This monorepo included libraries, tools, and helpers that will make my life easier.</strong>
</p>

<!-- Badge setup -->
<p align="center">
  <a href="https://www.conventionalcommits.org/">
    <img src="https://img.shields.io/badge/conventional--commits-brightgreen?style=flat-square&logo=conventionalcommits&color=black" alt="Conventional commits" />
  </a>
  <a href="http://commitizen.github.io/cz-cli/">
    <img src="https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square" alt="Commitizen friendly" />
  </a>
</p>

## Todo list

- [x] Support Pnpm monorepo
- [X] Move `@kc*` to `packages/@kc*` to simplify number of directories
- [X] Support run dts test using [vitest](https://vitest.dev/guide/testing-types.html)
- [X] Support test junit output (reports/test-results)
- [X] Support test coverage output (reports/coverage)
- [X] Support [TypeDocs](https://typedoc.org/)
- [X] Support Biome
- [X] Support commitlint && commitizen
- [X] Support Git hooks via [lefthook](https://lefthook.dev/)
- [X] Support Superlinter and configured linters
- [X] Support Megalinter and configured linters
- [X] Support SonarQube Cloud
- [ ] Support new package generator
- [X] Automatically update dependencies via [dependabot](https://github.com/dependabot)
- [X] Automatically merge PRs via [mergify](https://mergify.com/)
- [ ] Automatically increase version using [release-please](https://github.com/googleapis/release-please)
- [ ] Set GitHub release to immutable

## Known issues

- [X] tsconfig.json typeRoots didn't works when extends with package name
  - Workaround: using relative path (e.g. ./node_modules/xx/yy/zz.json)
- [X] typedoc didn't works with @kcconfigs/tsdown; when dts resolve is true, no custom function is export; when it's false, only custom function is exported
- [ ] release-please repository status (googleapis/release-please#2545)
- [ ] right now you cannot convert prerelease to stable version easily (googleapis/release-please#2515)
  - Workaround 1: use release-as commit to force which version to deploy
  - Workaround 2: use multiple config (https://github.com/sonderformat-llc/release-please-prerelease-example)
  - Workaround 3: manually update manifest.json file to previous version

## Get start

- Clone or Fork repository from GitHub: `git clone git@github.com/kc-workspace/kcws`
- Install Node.js using mise (or manual install based on mise.toml version)
- Install Pnpm: `corepack enable`
- Install dependencies: `pnpm install`
- Build package: `pnpm build:all` (required for some internal commands)

### Command cheat sheet

```bash
## Build all packages
pnpm build:all
## Test all packages
pnpm test:all
## Fix lint and format on all packages
pnpm fix:all
## Generate document html at ./docs folder
pnpm docs:all
## Clean built folders
pnpm clean

```

## Packages

### @kcconfigs/*

Shared configuration for KC's projects (personal)

### @kcexamples/*

Example project for testing and Proof of concept

### @kcinternals/*

Internal packages specifically for `@kc*/*` packages

### @kctools/*

Command-line tools for KC's projects (personal)

### @kctypes/*

TypeScript type definition utilities helper

### @kcws/*

Generic packages for full-stack development (including both Frontend and Backend).
