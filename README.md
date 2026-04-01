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

- [Terminology](#terminology)
- [Todo list](#todo-list)
- [Known issues](#known-issues)
- [Get start](#get-start)
  - [Command cheat sheet](#command-cheat-sheet)
- [Packages](#packages)
  - [@kcconfigs/\*](#kcconfigs)
  - [@kcexamples/\*](#kcexamples)
  - [@kcinternals/\*](#kcinternals)
  - [@kcstyles/\*](#kcstyles)
  - [@kctools/\*](#kctools)
  - [@kctypes/\*](#kctypes)
  - [@kcws/\*](#kcws)

## Terminology

- **package** - package name (e.g. `@kcconfigs/tsconfig`, `@kcexamples/demo`)
  - Use on package.json#name field and release-please/config.json#component field
- **component** - package name without at(@) sign (e.g. `kcconfigs/tsconfig`)
  - Use on Git commit scope and Git tag prefix
- **package version** || **version** - package version (e.g. `0.2.0`, `1.2.3`, `1.0.0-beta.1`)
  - Use on package.json#version field
- **prerelease** - package version contains prerelease identifier (e.g. `1.0.0-beta.1`)
  - Similar to **package version**; more specific to **prerelease** only
- **prerelease number** - number at the end of **prerelease** (e.g. `1`, `2`)
  - If package version is `1.0.0`, then **prerelease number** is empty
  - If package version is `0.1.2-beta.2`, then **prerelease number** is `2`
- **Git tag** || **tag** - Git tag string (e.g. `kcconfigs/tsconfig+v1.2.3`)
  - Syntax: `<component>+v<version>`
- **npm tag** - npm tag string (e.g. `latest`, `rc`, `beta`, `alpha`)
  - Use with install package (e.g. `npm install @kcconfigs/tsconfig@beta`)
  - Node will use `latest` when not specify

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
- [X] Automatically increase version using [release-please](https://github.com/googleapis/release-please)
- [X] Set GitHub release to immutable

## Known issues

- release-please repository status (googleapis/release-please#2545)
- right now you cannot convert prerelease to stable version easily (googleapis/release-please#2515)
  - Workaround 1: use release-as commit to force which version to deploy
  - Workaround 2: use multiple config ([release-please-example](https://github.com/sonderformat-llc/release-please-prerelease-example))
  - Workaround 3: manually update manifest.json file to previous version
- @kcconfigs/textlint didn't works at all (textlint/textlint#1896)
- @kcconfigs/biome/features/* didn't works (biomejs/biome#9370)
- Dependabot generate invalid pnpm-lock.yaml file cause ci to failed (dependabot/dependabot-core#12244)

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

### @kcstyles/*

Cascading Style Sheets for KC's projects (personal)

### @kctools/*

Command-line tools for KC's projects (personal)

### @kctypes/*

TypeScript type definition utilities helper

### @kcws/*

Generic packages for full-stack development (including both Frontend and Backend).
