# Changelog

## [0.2.6](https://github.com/kc-workspace/kcws/compare/@kcconfigs/tsdown+v0.2.5...@kcconfigs/tsdown+v0.2.6) (2026-08-02)


### Features

* **kcconfigs/tsdown:** add output option to cssPlugin ([92abc60](https://github.com/kc-workspace/kcws/commit/92abc60c6a432d7948789898b11ff04c2184cd0c))
* **kcconfigs/tsdown:** add plugin barrel exports ([ab96809](https://github.com/kc-workspace/kcws/commit/ab9680913b2bb954ce62b0c2224b69be19580b0a))
* **kcconfigs/tsdown:** add verbose option and applySetting to debugPlugin ([fb6154f](https://github.com/kc-workspace/kcws/commit/fb6154f6d5c86b32f81e0512c17a152f1dbca8c3))


### Performance Improvements

* **deps:** upgrade biome from 2.5.3 to 2.5.6 ([dc5e4ef](https://github.com/kc-workspace/kcws/commit/dc5e4efb2a521538f7bb27be922390a4ed67d53c))


### Documentation

* **kcconfigs/tsdown:** add readme ([a386e5e](https://github.com/kc-workspace/kcws/commit/a386e5ea32b18986880cbf66b3862ca08a048b62))


### Code Refactoring

* **kcconfigs/tsdown:** migrate internals plugins to config-builder API ([1aa51ba](https://github.com/kc-workspace/kcws/commit/1aa51ba0e0b99838ae78f7f880c71fd486f79586))
* **kcconfigs/tsdown:** rename apply to applyConfig and TsdownPlugin to TsdownConfigPlugin ([c405e5f](https://github.com/kc-workspace/kcws/commit/c405e5fc5face3ca0dfc470ec9400c886d5b6e1f))
* **kcconfigs/tsdown:** simplify defineConfig by removing DefineOption parameter ([3f0845f](https://github.com/kc-workspace/kcws/commit/3f0845fa6d518d5a70786aa38168ec2c97baa5d0))
* **kcconfigs/tsdown:** update models for config-builder API ([aed121c](https://github.com/kc-workspace/kcws/commit/aed121c595f7bab8cf4531bc16dc552b39e7ccda))
* **kcconfigs/tsdown:** use barrel import for plugins and clean up index exports ([86b7bd5](https://github.com/kc-workspace/kcws/commit/86b7bd5c7d31dc7a18bd4b9b8a5675839b77f3e9))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @kcinternals/config-builder bumped to 0.2.0
  * devDependencies
    * @kcconfigs/biome bumped to 2.0.3
    * @kcconfigs/tsconfig bumped to 1.1.3

## [0.2.5](https://github.com/kc-workspace/kcws/compare/@kcconfigs/tsdown+v0.2.4...@kcconfigs/tsdown+v0.2.5) (2026-07-28)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @kcinternals/config-builder bumped to 0.1.3
  * devDependencies
    * @kcconfigs/biome bumped to 2.0.2
    * @kcconfigs/tsconfig bumped to 1.1.2

## [0.2.4](https://github.com/kc-workspace/kcws/compare/@kcconfigs/tsdown+v0.2.3...@kcconfigs/tsdown+v0.2.4) (2026-07-23)


### Performance Improvements

* **deps:** bump @biomejs/biome from 2.4.15 to 2.5.3 ([#171](https://github.com/kc-workspace/kcws/issues/171)) ([97638f0](https://github.com/kc-workspace/kcws/commit/97638f01c158a1a55c620edf1126480e314e783d))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @kcinternals/config-builder bumped to 0.1.2
  * devDependencies
    * @kcconfigs/biome bumped to 2.0.1
    * @kcconfigs/tsconfig bumped to 1.1.1

## [0.2.3](https://github.com/kc-workspace/kcws/compare/@kcconfigs/tsdown+v0.2.2...@kcconfigs/tsdown+v0.2.3) (2026-07-23)


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @kcinternals/config-builder bumped to 0.1.1
  * devDependencies
    * @kcconfigs/tsconfig bumped to 1.1.0

## [0.2.2](https://github.com/kc-workspace/kcws/compare/@kcconfigs/tsdown+v0.2.1...@kcconfigs/tsdown+v0.2.2) (2026-07-13)


### Features

* **kcconfigs/tsdown:** add CSS output configuration to css and debug plugins ([7f58915](https://github.com/kc-workspace/kcws/commit/7f5891530bfd55d9593c1ed4eb5d9d3b2bef91a9))

## [0.2.1](https://github.com/kc-workspace/kcws/compare/@kcconfigs/tsdown+v0.2.0...@kcconfigs/tsdown+v0.2.1) (2026-07-13)


### Features

* **kcconfigs/tsdown:** add attw and attw-normalize plugins ([3f2ea88](https://github.com/kc-workspace/kcws/commit/3f2ea88c68928920cefd0214ecb1413b4cdc106b))
* **kcconfigs/tsdown:** add css plugin ([46c559b](https://github.com/kc-workspace/kcws/commit/46c559b08e6c03b0eb54526e9aacb0cfe6c106a3))
* **kcconfigs/tsdown:** add deps and debug plugins ([5e5a1de](https://github.com/kc-workspace/kcws/commit/5e5a1de83a40c93743c3cbd3aca955512100bc29))
* **kcconfigs/tsdown:** add dts and dts-normalize plugins ([83b57b7](https://github.com/kc-workspace/kcws/commit/83b57b7a93f663b01c4257e75de1e1445952afb6))
* **kcconfigs/tsdown:** add format and format-normalize plugins ([d585947](https://github.com/kc-workspace/kcws/commit/d585947ef5f54b77d06e6d2c0f1814f7c5af9dd9))
* **kcconfigs/tsdown:** add node and browser platform plugins ([805416b](https://github.com/kc-workspace/kcws/commit/805416b64a7918f30af8cdca2c421d832980fb91))
* **kcconfigs/tsdown:** add override plugin ([9a2f1c1](https://github.com/kc-workspace/kcws/commit/9a2f1c16bb14a3661586a1fd1cdccee74aef87cd))
* **kcconfigs/tsdown:** add plugin config models, constants, and test setup ([3206de0](https://github.com/kc-workspace/kcws/commit/3206de0eabeb103c3274d2664a668b4d391c830e))
* **kcconfigs/tsdown:** add tests for node and browser platform plugins ([a61950b](https://github.com/kc-workspace/kcws/commit/a61950b7e077ae6c153d7e76e507ff4489781bb4))
* **kcconfigs/tsdown:** add tests for unused and publint plugins ([9cdef0e](https://github.com/kc-workspace/kcws/commit/9cdef0e52b2e1f89dd83ccf0c7c9744304f8043f))
* **kcconfigs/tsdown:** add unused and publint plugins ([431bc50](https://github.com/kc-workspace/kcws/commit/431bc50425d19eb51c175963def3a5fa01eb3fb2))
* **kcconfigs/tsdown:** export platform plugins from main entry point ([3b30835](https://github.com/kc-workspace/kcws/commit/3b30835a70c817b8b1c68b27c2f3f8ef4bfede6a))
* **kcconfigs/tsdown:** export unused and publint plugins from main entry point ([3400b54](https://github.com/kc-workspace/kcws/commit/3400b54f29420fb684679a288847b8d7eeee802a))
* **kcconfigs/tsdown:** migrate to use internals/config-builder with plugin instead ([d87b242](https://github.com/kc-workspace/kcws/commit/d87b2427938df7e7feeb60c4a24858df9c9a602f))
* **kcconfigs/tsdown:** normalize publint config before return from define ([ce4faee](https://github.com/kc-workspace/kcws/commit/ce4faeef45de9d9ab6930a4f80b8df17ae08589e))


### Performance Improvements

* **kcconfigs/tsdown:** add new outputPlugin to custom outDir ([4d13a94](https://github.com/kc-workspace/kcws/commit/4d13a94e21efca693825c86552188f593307a848))
* **kcconfigs/tsdown:** add publint config normalize and fix format ([faf556a](https://github.com/kc-workspace/kcws/commit/faf556a0fe409f98092771a88599ce1d1d2b6856))


### Bugfixes

* **kcconfigs/tsdown:** cssPlugin now work with css and scss ([c71e1b3](https://github.com/kc-workspace/kcws/commit/c71e1b320579c1149dbf02fa9c52df0f53223b1e))


### Code Refactoring

* **kcconfigs/tsconfig:** relocate @kctypes/generic to tsconfig deps for TS 6 type resolution ([6a556ae](https://github.com/kc-workspace/kcws/commit/6a556aefb8872db0084fe43b5aa27e5f806f6d2b))
* **kcconfigs/tsdown:** build itself using node and unused plugins ([9a1ae62](https://github.com/kc-workspace/kcws/commit/9a1ae62c9554a2845b1783cca415bc82bef8799e))
* **kcconfigs/tsdown:** improve isEsm to handle array and object formats ([d2e859b](https://github.com/kc-workspace/kcws/commit/d2e859b12c0c84336759699cc71043de0cb34328))
* **kcconfigs/tsdown:** rewrite defineConfig using plugin architecture ([24cdcb6](https://github.com/kc-workspace/kcws/commit/24cdcb69acc6b9358f2bfc1e227707cec1624004))
* **kcconfigs/tsdown:** simplify format plugin to pass through format values ([149075e](https://github.com/kc-workspace/kcws/commit/149075ee153b5a974bd7889fef6ab9279c5dcee2))
* **kcconfigs/tsdown:** use definePlugin for all internal and public plugins ([9d4fbb1](https://github.com/kc-workspace/kcws/commit/9d4fbb18e0fe22d51c40d50235697dbc8ff33161))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @kcinternals/config-builder bumped to 0.1.0
  * devDependencies
    * @kcconfigs/biome bumped to 2.0.0
    * @kcconfigs/tsconfig bumped to 1.0.3

## [0.2.0](https://github.com/kc-workspace/kcws/compare/@kcconfigs/tsdown+v0.1.2-beta.5...@kcconfigs/tsdown+v0.2.0) (2026-07-06)


### Performance Improvements

* **deps:** bump @biomejs/biome from 2.4.10 to 2.4.15 ([#141](https://github.com/kc-workspace/kcws/issues/141)) ([dbbe17a](https://github.com/kc-workspace/kcws/commit/dbbe17a334f1ee2e43eb049ebeb0698c63e1d428))


### Miscellaneous Chores

* **kcconfigs/tsdown:** force update v0.1.2-beta.5 =&gt; v0.2.0 ([7b03767](https://github.com/kc-workspace/kcws/commit/7b03767646ea6bd9788e3e2fd62ec112691ecc8b))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 1.0.2
    * @kcconfigs/tsconfig bumped to 1.0.2

## [0.1.2-beta.5](https://github.com/kc-workspace/kcws/compare/@kcconfigs/tsdown+v0.1.2-beta.4...@kcconfigs/tsdown+v0.1.2-beta.5) (2026-06-02)


### Performance Improvements

* **deps:** bump tsdown from 0.20.3 to 0.22.0 ([#131](https://github.com/kc-workspace/kcws/issues/131)) ([d1782f8](https://github.com/kc-workspace/kcws/commit/d1782f850e1dd62ad1de4d52eba9ad322c946833))
* **kcconfigs/tsdown:** dynamically set attw profile when only have esm format ([2e9185d](https://github.com/kc-workspace/kcws/commit/2e9185da8c96e2f21a229429715aaf12b2d827ca))


### Bugfixes

* **@kcconfigs/tsconfig:** exclude *.example.ts files from tsconfig and compile time ([acc32c2](https://github.com/kc-workspace/kcws/commit/acc32c2c97f002f81a547b0976aea2bcefc07a86))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 1.0.1
    * @kcconfigs/tsconfig bumped to 1.0.1

## [0.1.2-beta.4](https://github.com/kc-workspace/kcws/compare/@kcconfigs/tsdown+v0.1.2-beta.3...@kcconfigs/tsdown+v0.1.2-beta.4) (2026-04-06)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 1.0.0
    * @kcconfigs/tsconfig bumped to 1.0.0

## [0.1.2-beta.3](https://github.com/kc-workspace/kcws/compare/@kcconfigs/tsdown+v0.1.1-beta.3...@kcconfigs/tsdown+v0.1.2-beta.3) (2026-03-20)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 1.0.0-beta.1
    * @kcconfigs/tsconfig bumped to 1.0.0-beta.1
    * @kctypes/generic bumped to 1.30.4

## [0.1.1-beta.3](https://github.com/kc-workspace/kcws/compare/@kcconfigs/tsdown+v0.1.0-beta.3...@kcconfigs/tsdown+v0.1.1-beta.3) (2026-03-18)


### Performance Improvements

* **deps:** bump tsdown from 0.18.4 to 0.20.1 ([#70](https://github.com/kc-workspace/kcws/issues/70)) ([24a3e06](https://github.com/kc-workspace/kcws/commit/24a3e0689e5b512d7a80fb6719387ab777662bb7))
* **deps:** update biome schema version from 2.3.10 to 2.4.6 across all packages ([909ff7e](https://github.com/kc-workspace/kcws/commit/909ff7ede64869a571dac9969169067e8d4b7fbc))


### Bugfixes

* **kcconfigs/tsdown:** remove deprecated resolve property ([337fc47](https://github.com/kc-workspace/kcws/commit/337fc47823f579c06130788f3cd4a608ba06b027))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 0.2.2
    * @kcconfigs/tsconfig bumped to 0.1.1

## [0.1.0-beta.3](https://github.com/kc-workspace/kcws/compare/@kcconfigs/tsdown+v0.1.0-beta.2...@kcconfigs/tsdown+v0.1.0-beta.3) (2026-01-13)


### ⚠ BREAKING CHANGES

* **kcconfigs/tsconfig:** remove default types and kctypes, user must install themselves

### Features

* **kcconfigs/tsconfig:** remove default types and kctypes, user must install themselves ([5f2989d](https://github.com/kc-workspace/kcws/commit/5f2989d1c091a3ae78f43ce5320ff232246e035f))
* **kcconfigs/tsdown:** tsdown output is now minify by default ([2a1080c](https://github.com/kc-workspace/kcws/commit/2a1080cf438c73e6142a827708d3f31f25c3bc8f))


### Bugfixes

* **kcconfigs/tsdown:** fix type error due to stricter rules ([ca046a8](https://github.com/kc-workspace/kcws/commit/ca046a86dd9578a9212f0fb2383beada36ed70d8))
* **script:** pnpm type:check should use tsc --noEmit instead of tsc --build ([e92504c](https://github.com/kc-workspace/kcws/commit/e92504ca6fca6bcfa2a863303000a5ba61d2dd40))


### Documentation

* add package version and changelog to documentation site ([722fab5](https://github.com/kc-workspace/kcws/commit/722fab5e2472b7d4e4fd5ba446c369f36bd1b4f1))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 0.2.1
    * @kcconfigs/tsconfig bumped to 0.1.0

## [0.1.0-beta.2](https://github.com/kc-workspace/kcws/compare/@kcconfigs/tsdown+v0.1.0-beta.1...@kcconfigs/tsdown+v0.1.0-beta.2) (2026-01-10)


### ⚠ BREAKING CHANGES

* **kcconfigs/biome:** Use @kcconfigs/biome instead of @kcconfigs/biome/default when use shared config

### Features

* **config:** use shared typedoc config instead of manually config on every packages ([fd4cdc6](https://github.com/kc-workspace/kcws/commit/fd4cdc607f0fde49e5863c77aa7e0627676d0c42))
* **kcconfigs/tsdown:** refactor configuration handling and add utility functions ([fd2ec0f](https://github.com/kc-workspace/kcws/commit/fd2ec0f1bbbd659fb3d96eaf636bfe9038b3debc))


### Performance Improvements

* **kcconfigs/biome:** remove /default exports and add typedoc conditions ([5e1ab7d](https://github.com/kc-workspace/kcws/commit/5e1ab7d9be478fedbb29d2e68801c7689cd39882))


### Bugfixes

* **config:** update schema version from 2.3.8 to 2.3.10 across all biome configuration files ([751ee20](https://github.com/kc-workspace/kcws/commit/751ee207527ed05720ad415927e0b0f27bdf9bdf))
* **kcconfigs/tsdown:** when cjsDefault is false, it breaks compatibility ([621ac33](https://github.com/kc-workspace/kcws/commit/621ac331dfb681de406e895a3b2d89e194b0192e))


### Documentation

* update changelog to fix invalid url ([7f14bb5](https://github.com/kc-workspace/kcws/commit/7f14bb520342dc1dfb546a166bf64ef8a357451e))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 0.2.0
    * @kcconfigs/tsconfig bumped to 0.1.0-beta.2

## 0.1.0-beta.1 (2025-12-28)


### Bugfixes

* **kcconfigs/tsdown:** use outputOptions.postBanner and postFooter instead ([89c8369](https://github.com/kc-workspace/kcws/commit/89c836950926fa04db5f5007fa0274f128ee18bb))
* update all `@kcconfigs` description so it trigger new deployment with new tag separator ([cf5be8c](https://github.com/kc-workspace/kcws/commit/cf5be8cc02fba8becb7e8f31fd6f3a741c0f0b95))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 0.1.1
    * @kcconfigs/tsconfig bumped to 0.1.0-beta.1

## 0.1.0-beta.0 (2025-12-26)


### Features

* **core:** move all packages into packages/* directory ([58230cd](https://github.com/kc-workspace/kcws/commit/58230cd286d0dea953d232806c91508ebfc57701))
* **kcconfigs/tsdown:** add source and typedoc conditions in exports ([6911d45](https://github.com/kc-workspace/kcws/commit/6911d4557f67362d78e959b88af8f110a78ee3a0))


### Performance Improvements

* **kcconfigs/tsdown:** add [@generated](https://github.com/generated) to generated file ([f3efbca](https://github.com/kc-workspace/kcws/commit/f3efbca38e221ad9445e09fd4b772d3cc07c3027))
* **kcconfigs/tsdown:** enabled publint, unused, and arethetypewrong validators by default ([fd8a89e](https://github.com/kc-workspace/kcws/commit/fd8a89edfa6385c1211f5077499c56adf18f4b2c))


### Bugfixes

* homepage contains invalid url ([0ee37d6](https://github.com/kc-workspace/kcws/commit/0ee37d641fe5b04fb019099915c8aa3ddfed3be7))
* **kcconfigs/tsdown:** attw should be error or no one will care and disable older node &lt;16 ([7735770](https://github.com/kc-workspace/kcws/commit/77357707a071f358657b27e8eafeff626924442e))
* trigger re-release please ([65447a7](https://github.com/kc-workspace/kcws/commit/65447a776ed2f8638f6f35a4d00277d407143114))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 0.1.0
    * @kcconfigs/tsconfig bumped to 0.1.0-beta.0
