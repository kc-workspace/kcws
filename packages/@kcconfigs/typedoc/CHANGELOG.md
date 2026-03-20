# Changelog

## [0.1.2-beta.1](https://github.com/kc-workspace/kcws/compare/@kcconfigs/typedoc+v0.1.1-beta.1...@kcconfigs/typedoc+v0.1.2-beta.1) (2026-03-20)


### Documentation

* **kcconfigs/typedoc:** add README ([ffe852e](https://github.com/kc-workspace/kcws/commit/ffe852edd4ef1d181dc12844f959bdac8e31940e))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 1.0.0-beta.1
    * @kcconfigs/tsconfig bumped to 1.0.0-beta.1
    * @kcconfigs/tsdown bumped to 0.1.2-beta.3
    * @kcconfigs/vitest bumped to 0.1.2-beta.2
    * @kctypes/generic bumped to 1.30.4

## [0.1.1-beta.1](https://github.com/kc-workspace/kcws/compare/@kcconfigs/typedoc+v0.1.0-beta.1...@kcconfigs/typedoc+v0.1.1-beta.1) (2026-03-18)


### Performance Improvements

* **deps:** update biome schema version from 2.3.10 to 2.4.6 across all packages ([909ff7e](https://github.com/kc-workspace/kcws/commit/909ff7ede64869a571dac9969169067e8d4b7fbc))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 0.2.2
    * @kcconfigs/tsconfig bumped to 0.1.1
    * @kcconfigs/tsdown bumped to 0.1.1-beta.3
    * @kcconfigs/vitest bumped to 0.1.1-beta.2

## [0.1.0-beta.1](https://github.com/kc-workspace/kcws/compare/@kcconfigs/typedoc+v0.1.0-beta.0...@kcconfigs/typedoc+v0.1.0-beta.1) (2026-01-13)


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
    * @kcconfigs/biome bumped to 0.2.1
    * @kcconfigs/tsconfig bumped to 0.1.0
    * @kcconfigs/tsdown bumped to 0.1.0-beta.3
    * @kcconfigs/vitest bumped to 0.1.0-beta.2

## 0.1.0-beta.0 (2026-01-10)


### ⚠ BREAKING CHANGES

* **kcconfigs/biome:** Use @kcconfigs/biome instead of @kcconfigs/biome/default when use shared config

### Features

* **kcconfigs/typedoc:** add new package for shared typedoc config ([3c7895f](https://github.com/kc-workspace/kcws/commit/3c7895fb06722361d7100356ff15fe91d458ddbc))
* **kcconfigs/typedoc:** new implementation using typescript instead of raw json ([902a3cb](https://github.com/kc-workspace/kcws/commit/902a3cb400894d53f3a1f7cf81733eb682035a08))
* **kcconfigs/typedoc:** update typedoc share config to use github theme instead ([11829ee](https://github.com/kc-workspace/kcws/commit/11829ee79f829819d54c26df431212d6f5851927))


### Performance Improvements

* **kcconfigs/biome:** remove /default exports and add typedoc conditions ([5e1ab7d](https://github.com/kc-workspace/kcws/commit/5e1ab7d9be478fedbb29d2e68801c7689cd39882))


### Bugfixes

* **kcconfigs/typedoc:** ignore test file from use as entrypoint ([83ff38a](https://github.com/kc-workspace/kcws/commit/83ff38ac6ae25ebd5d043adf9639d61b4cc72622))
* **kcconfigs/typedoc:** output didn't write to current directory ([0706ea8](https://github.com/kc-workspace/kcws/commit/0706ea878c9aa2b9a9f3ce331d093bb73f6b061a))
* trigger re-release please ([65447a7](https://github.com/kc-workspace/kcws/commit/65447a776ed2f8638f6f35a4d00277d407143114))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 0.2.0
    * @kcconfigs/tsconfig bumped to 0.1.0-beta.2
    * @kcconfigs/tsdown bumped to 0.1.0-beta.2
    * @kcconfigs/vitest bumped to 0.1.0-beta.1
