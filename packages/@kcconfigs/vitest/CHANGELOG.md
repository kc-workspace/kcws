# Changelog

## [0.2.2](https://github.com/kc-workspace/kcws/compare/@kcconfigs/vitest+v0.2.1...@kcconfigs/vitest+v0.2.2) (2026-08-22)


### Features

* **kcconfigs/vitest:** add tsPathsPlugin for tsconfig paths resolution ([c1af818](https://github.com/kc-workspace/kcws/commit/c1af818c64f862e2048831372615a2fcee5c125d))


### Performance Improvements

* **deps-dev:** bump @biomejs/biome from 2.5.6 to 2.5.7 ([#205](https://github.com/kc-workspace/kcws/issues/205)) ([025fbd5](https://github.com/kc-workspace/kcws/commit/025fbd552f6166290dabbbc9a30fb91b5c819ffa))
* **deps:** bump memfs from 4.64.0 to 4.68.0 in the vitest group across 1 directory ([#203](https://github.com/kc-workspace/kcws/issues/203)) ([af8503a](https://github.com/kc-workspace/kcws/commit/af8503af1b0ff8d16d2c3b4d30ae75b2061c7315))
* **deps:** bump memfs in the vitest group across 1 directory ([af8503a](https://github.com/kc-workspace/kcws/commit/af8503af1b0ff8d16d2c3b4d30ae75b2061c7315))


### Documentation

* **kcconfigs/vitest:** add tsdoc to expose utils and readme ([0bc2e30](https://github.com/kc-workspace/kcws/commit/0bc2e30aec59ffc16200e7f17c6b3fcc5617b951))


### Code Refactoring

* change scripts from `:check` to `check:*` ([e904cd2](https://github.com/kc-workspace/kcws/commit/e904cd268f9935c784a9693b1ec12dd60f5e5fa3))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @kcinternals/config-builder bumped to 0.2.1
  * devDependencies
    * @kcconfigs/tsconfig bumped to 1.1.4
    * @kcconfigs/tsdown bumped to 0.2.7
    * @kcconfigs/biome bumped to 2.0.4

## [0.2.1](https://github.com/kc-workspace/kcws/compare/@kcconfigs/vitest+v0.2.0...@kcconfigs/vitest+v0.2.1) (2026-08-02)


### Features

* **kcconfigs/vitest:** add plugin infrastructure ([0377376](https://github.com/kc-workspace/kcws/commit/037737640b30face0560429474160ad2003147fe))
* **kcconfigs/vitest:** add replace mode to coverage plugin ([f98bbe4](https://github.com/kc-workspace/kcws/commit/f98bbe4232549e381babb0037bfd37757fb95494))
* **kcconfigs/vitest:** export plugin entrypoints ([7adb9b9](https://github.com/kc-workspace/kcws/commit/7adb9b952080cab3071227b3184a4ea903a65e67))
* **kcconfigs/vitest:** support explicit root projects ([373f1be](https://github.com/kc-workspace/kcws/commit/373f1be40fc384ecaed7f7d57bb82194207bc419))


### Performance Improvements

* **deps:** bump the vitest group across 1 directory with 3 updates ([#188](https://github.com/kc-workspace/kcws/issues/188)) ([9159e1b](https://github.com/kc-workspace/kcws/commit/9159e1b1b9e192ee93b1528a45b8d4f13b2c35bd))
* **deps:** upgrade biome from 2.5.3 to 2.5.6 ([dc5e4ef](https://github.com/kc-workspace/kcws/commit/dc5e4efb2a521538f7bb27be922390a4ed67d53c))
* **kcconfigs/vitest:** export mergeConfig(base, ...overrides) instead of built-in that support only single override ([431e313](https://github.com/kc-workspace/kcws/commit/431e31398eea581ccae90fd386351bd24ea852f9))


### Bugfixes

* **kcconfigs/vitest:** when import plugins from `@kcconfigs/vitest/plugins`, mock file didn't load correctly ([2a6c1f7](https://github.com/kc-workspace/kcws/commit/2a6c1f76c15181ab6d8456b99bed3948c08c0e62))


### Code Refactoring

* **kcconfigs/vitest:** replace define utils with plugin-based API ([50b03e4](https://github.com/kc-workspace/kcws/commit/50b03e47c3aef298fd2778cb60d9eb2c421d5b97))
* **kcconfigs/vitest:** restructure constants into directory ([c63d675](https://github.com/kc-workspace/kcws/commit/c63d67510c87d71619f1f6e3a56c9df24dae020d))
* **kcconfigs/vitest:** restructure models into directory ([15353c8](https://github.com/kc-workspace/kcws/commit/15353c8d6bf6dc5829ab0328d1908252143a9ac6))
* **kcconfigs/vitest:** update public API and add config-builder dependency ([8882933](https://github.com/kc-workspace/kcws/commit/8882933daf1237e59b622c33f883ffd329515ded))
* **kcconfigs/vitest:** use local mergeConfig utility ([a6eecc1](https://github.com/kc-workspace/kcws/commit/a6eecc1f1500e1f894be5c06140f3540a06fa7b7))
* use barrel import for plugins and remove empty defineConfig option ([9474fd0](https://github.com/kc-workspace/kcws/commit/9474fd0c9668bad18d259a49ac0c727f21112642))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @kcinternals/config-builder bumped to 0.2.0
  * devDependencies
    * @kcconfigs/tsconfig bumped to 1.1.3
    * @kcconfigs/tsdown bumped to 0.2.6
    * @kcconfigs/biome bumped to 2.0.3
    * @kctypes/generic bumped to 1.31.1

## [0.2.0](https://github.com/kc-workspace/kcws/compare/@kcconfigs/vitest+v0.1.2-beta.9...@kcconfigs/vitest+v0.2.0) (2026-07-28)


### Miscellaneous Chores

* **kcconfigs/vitest:** force update v0.1.2-beta.9 =&gt; v0.2.0 ([fbab386](https://github.com/kc-workspace/kcws/commit/fbab38668d9f63d6b73a0ab7f32496ea29a2c04b))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/tsconfig bumped to 1.1.2
    * @kcconfigs/tsdown bumped to 0.2.5
    * @kcconfigs/biome bumped to 2.0.2

## [0.1.2-beta.9](https://github.com/kc-workspace/kcws/compare/@kcconfigs/vitest+v0.1.2-beta.8...@kcconfigs/vitest+v0.1.2-beta.9) (2026-07-23)


### Performance Improvements

* **deps:** bump @biomejs/biome from 2.4.15 to 2.5.3 ([#171](https://github.com/kc-workspace/kcws/issues/171)) ([97638f0](https://github.com/kc-workspace/kcws/commit/97638f01c158a1a55c620edf1126480e314e783d))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/tsconfig bumped to 1.1.1
    * @kcconfigs/tsdown bumped to 0.2.4
    * @kcconfigs/biome bumped to 2.0.1

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
