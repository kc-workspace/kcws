# Changelog

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
