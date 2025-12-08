<!-- Title section -->
<h1 align="center">
  Kamontat's Workspace ecosystem

  <img alt="Typescript icon" src="https://simpleicons.org/icons/typescript.svg" width="24px">
  <img alt="Bun js icon" src="https://simpleicons.org/icons/bun.svg" width="24px">
  <img alt="Node js icon" src="https://simpleicons.org/icons/nodedotjs.svg" width="24px">
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

- [x] Support Bun monorepo
- [ ] Support Git hooks via [husky](https://github.com/typicode/husky)
- [ ] Support [lint-staged](https://github.com/lint-staged/lint-staged)
- [ ] Support Biome
- [ ] Support commitlint && commitizen
- [ ] Support test junit output (reports/test-results)
- [ ] Support test coverage output (reports/coverage)
- [ ] Support [TypeDocs](https://typedoc.org/)
- [ ] Support new package generator
- [ ] Automatically update dependencies via [dependabot](https://github.com/dependabot)
- [ ] Automatically merge PRs via [mergify](https://mergify.com/)
- [ ] Automatically increase version using [release-please](https://github.com/googleapis/release-please)

## Known issues

- [ ] https://github.com/oven-sh/bun/issues/4112

## Get start

1. Install bun
2. Run `bun install` to install all dependencies
3. Run `bun build:all` to build all packages

## Packages

### @kcconfigs/*

Shared configuration

### @kcexamples/*

Example project for trying and POC

### @kcinternals/*

Internal packages for all @kc*/* packages

### @kctools/*

CLI tools

### @kctypes/*

Typescript type definition utilities helper

### @kcutils/*

Javascript utilities functions

### @kcws/*

Packages for any javascript development (including both Frontend and Backend).
