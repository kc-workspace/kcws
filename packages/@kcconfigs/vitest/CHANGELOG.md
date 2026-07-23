# Changelog

## [0.1.2-beta.8](https://github.com/kc-workspace/kcws/compare/@kcconfigs/vitest+v0.1.2-beta.7...@kcconfigs/vitest+v0.1.2-beta.8) (2026-07-23)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/tsconfig bumped to 1.1.0
    * @kcconfigs/tsdown bumped to 0.2.3
    * @kctypes/generic bumped to 1.31.0

## [0.1.2-beta.7](https://github.com/kc-workspace/kcws/compare/@kcconfigs/vitest+v0.1.2-beta.6...@kcconfigs/vitest+v0.1.2-beta.7) (2026-07-13)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/tsdown bumped to 0.2.2

## [0.1.2-beta.6](https://github.com/kc-workspace/kcws/compare/@kcconfigs/vitest+v0.1.2-beta.5...@kcconfigs/vitest+v0.1.2-beta.6) (2026-07-13)


### Performance Improvements

* **kcconfigs/vitest:** add console mock for minimize junk output ([e9c65b4](https://github.com/kc-workspace/kcws/commit/e9c65b48c4bb1359b2e00987f1e66f336d8e07d4))
* **kcconfigs/vitest:** migrate tsdown to new plugin system ([50e66a9](https://github.com/kc-workspace/kcws/commit/50e66a9f6aa5950b380aa940a746746b1d586cd9))


### Code Refactoring

* **kcconfigs/vitest:** reduce duplicate code on os and process mock ([7948c6c](https://github.com/kc-workspace/kcws/commit/7948c6c473261b207b8012408c3da81d1cbfde32))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/tsconfig bumped to 1.0.3
    * @kcconfigs/tsdown bumped to 0.2.1
    * @kcconfigs/biome bumped to 2.0.0

## [0.1.2-beta.5](https://github.com/kc-workspace/kcws/compare/@kcconfigs/vitest+v0.1.2-beta.4...@kcconfigs/vitest+v0.1.2-beta.5) (2026-07-06)


### Performance Improvements

* **deps:** bump @biomejs/biome from 2.4.10 to 2.4.15 ([#141](https://github.com/kc-workspace/kcws/issues/141)) ([dbbe17a](https://github.com/kc-workspace/kcws/commit/dbbe17a334f1ee2e43eb049ebeb0698c63e1d428))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/tsconfig bumped to 1.0.2
    * @kcconfigs/tsdown bumped to 0.2.0
    * @kcconfigs/biome bumped to 1.0.2

## [0.1.2-beta.4](https://github.com/kc-workspace/kcws/compare/@kcconfigs/vitest+v0.1.2-beta.3...@kcconfigs/vitest+v0.1.2-beta.4) (2026-06-02)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/tsconfig bumped to 1.0.1
    * @kcconfigs/tsdown bumped to 0.1.2-beta.5
    * @kcconfigs/biome bumped to 1.0.1

## [0.1.2-beta.3](https://github.com/kc-workspace/kcws/compare/@kcconfigs/vitest+v0.1.2-beta.2...@kcconfigs/vitest+v0.1.2-beta.3) (2026-04-06)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/tsconfig bumped to 1.0.0
    * @kcconfigs/tsdown bumped to 0.1.2-beta.4
    * @kcconfigs/biome bumped to 1.0.0

## [0.1.2-beta.2](https://github.com/kc-workspace/kcws/compare/@kcconfigs/vitest+v0.1.1-beta.2...@kcconfigs/vitest+v0.1.2-beta.2) (2026-03-20)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/tsconfig bumped to 1.0.0-beta.1
    * @kcconfigs/tsdown bumped to 0.1.2-beta.3
    * @kcconfigs/biome bumped to 1.0.0-beta.1
    * @kctypes/generic bumped to 1.30.4

## [0.1.1-beta.2](https://github.com/kc-workspace/kcws/compare/@kcconfigs/vitest+v0.1.0-beta.2...@kcconfigs/vitest+v0.1.1-beta.2) (2026-03-18)


### Performance Improvements

* **deps:** update biome schema version from 2.3.10 to 2.4.6 across all packages ([909ff7e](https://github.com/kc-workspace/kcws/commit/909ff7ede64869a571dac9969169067e8d4b7fbc))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/tsconfig bumped to 0.1.1
    * @kcconfigs/tsdown bumped to 0.1.1-beta.3
    * @kcconfigs/biome bumped to 0.2.2

## [0.1.0-beta.2](https://github.com/kc-workspace/kcws/compare/@kcconfigs/vitest+v0.1.0-beta.1...@kcconfigs/vitest+v0.1.0-beta.2) (2026-01-13)


### ⚠ BREAKING CHANGES

* **kcconfigs/tsconfig:** remove default types and kctypes, user must install themselves

### Features

* **kcconfigs/tsconfig:** remove default types and kctypes, user must install themselves ([5f2989d](https://github.com/kc-workspace/kcws/commit/5f2989d1c091a3ae78f43ce5320ff232246e035f))


### Bugfixes

* **script:** pnpm type:check should use tsc --noEmit instead of tsc --build ([e92504c](https://github.com/kc-workspace/kcws/commit/e92504ca6fca6bcfa2a863303000a5ba61d2dd40))


### Documentation

* add package version and changelog to documentation site ([722fab5](https://github.com/kc-workspace/kcws/commit/722fab5e2472b7d4e4fd5ba446c369f36bd1b4f1))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/tsconfig bumped to 0.1.0
    * @kcconfigs/tsdown bumped to 0.1.0-beta.3
    * @kcconfigs/biome bumped to 0.2.1

## [0.1.0-beta.1](https://github.com/kc-workspace/kcws/compare/@kcconfigs/vitest+v0.1.0-beta.0...@kcconfigs/vitest+v0.1.0-beta.1) (2026-01-10)


### ⚠ BREAKING CHANGES

* **kcconfigs/biome:** Use @kcconfigs/biome instead of @kcconfigs/biome/default when use shared config

### Features

* **config:** use shared typedoc config instead of manually config on every packages ([fd4cdc6](https://github.com/kc-workspace/kcws/commit/fd4cdc607f0fde49e5863c77aa7e0627676d0c42))


### Performance Improvements

* **kcconfigs/biome:** remove /default exports and add typedoc conditions ([5e1ab7d](https://github.com/kc-workspace/kcws/commit/5e1ab7d9be478fedbb29d2e68801c7689cd39882))


### Bugfixes

* **config:** update schema version from 2.3.8 to 2.3.10 across all biome configuration files ([751ee20](https://github.com/kc-workspace/kcws/commit/751ee207527ed05720ad415927e0b0f27bdf9bdf))
* **kcconfigs/vitest:** remove cycle dependencies ([240156b](https://github.com/kc-workspace/kcws/commit/240156bae0a7beb2fcece14dbef4cad1f19c78ee))


### Documentation

* **kcconfigs/vitest:** remove mocks from document ([c907ff3](https://github.com/kc-workspace/kcws/commit/c907ff32304377c37c216fd4f5550b7a2ff15e52))
* update changelog to fix invalid url ([7f14bb5](https://github.com/kc-workspace/kcws/commit/7f14bb520342dc1dfb546a166bf64ef8a357451e))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/tsconfig bumped to 0.1.0-beta.2
    * @kcconfigs/tsdown bumped to 0.1.0-beta.2
    * @kcconfigs/biome bumped to 0.2.0

## 0.1.0-beta.0 (2025-12-28)


### Features

* **core:** move all packages into packages/* directory ([58230cd](https://github.com/kc-workspace/kcws/commit/58230cd286d0dea953d232806c91508ebfc57701))
* **kcconfigs/vitest:** add @kcconfigs/vitest/mocks for mocking data and add setupMocks() ([e81927a](https://github.com/kc-workspace/kcws/commit/e81927afa84e33bc280319d1b1e8ced1ca3bc569))
* **kcconfigs/vitest:** add source and typedoc conditions in exports ([2c9e1c3](https://github.com/kc-workspace/kcws/commit/2c9e1c3c046ab5798c51dead219bac2953233f07))


### Performance Improvements

* **kcconfigs/vitest:** automatically include all ts files in coverage report ([5e2cd8f](https://github.com/kc-workspace/kcws/commit/5e2cd8fd2dad10fc4fc8d5715e3da9b7cf7c8225))
* **kcconfigs/vitest:** only enabled junit and html for test and text, lcov, and html for coverage ([bf2ef9e](https://github.com/kc-workspace/kcws/commit/bf2ef9e16f6b9792b3a531a92b467c5120fa35d7))
* **kcconfigs/vitest:** use `__mocks__` instead of mocks to ignore from coverage automatically ([9767ff2](https://github.com/kc-workspace/kcws/commit/9767ff20a6dd6dce68fd3bf54bccf502a709b2a1))


### Bugfixes

* homepage contains invalid url ([0ee37d6](https://github.com/kc-workspace/kcws/commit/0ee37d641fe5b04fb019099915c8aa3ddfed3be7))
* **kcconfigs/vitest:** remove unused dependencies from package.json file ([9c237d1](https://github.com/kc-workspace/kcws/commit/9c237d151240e466f3c43f3f03f6f013e0426bd5))
* **kcconfigs/vitest:** temporary ignore biome useLiteralKeys as it conflict with ts(4111) ([d186810](https://github.com/kc-workspace/kcws/commit/d1868101d2cdb1d865747a24be9d1fc08322b706))
* trigger re-release please ([65447a7](https://github.com/kc-workspace/kcws/commit/65447a776ed2f8638f6f35a4d00277d407143114))
* update all `@kcconfigs` description so it trigger new deployment with new tag separator ([cf5be8c](https://github.com/kc-workspace/kcws/commit/cf5be8cc02fba8becb7e8f31fd6f3a741c0f0b95))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/tsconfig bumped to 0.1.0-beta.1
    * @kcconfigs/tsdown bumped to 0.1.0-beta.1
    * @kcconfigs/biome bumped to 0.1.1
