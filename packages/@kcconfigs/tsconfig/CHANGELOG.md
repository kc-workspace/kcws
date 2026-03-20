# Changelog

## [1.0.0-beta.1](https://github.com/kc-workspace/kcws/compare/@kcconfigs/tsconfig+v0.1.1...@kcconfigs/tsconfig+v1.0.0-beta.1) (2026-03-20)


### Features

* **kcconfigs/tsconfig:** update root preset with monorepo structure layout ([73dc55d](https://github.com/kc-workspace/kcws/commit/73dc55dbf3f95702fd469340b2234a84e1e1b192))


### Miscellaneous Chores

* **kcconfigs/tsconfig:** force update v0.1.1 =&gt; v1.0.0-beta.1 ([707ae11](https://github.com/kc-workspace/kcws/commit/707ae116a0e7f534c054a6d4eca827b34191919f))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 1.0.0-beta.1

## [0.1.1](https://github.com/kc-workspace/kcws/compare/@kcconfigs/tsconfig+v0.1.0...@kcconfigs/tsconfig+v0.1.1) (2026-03-18)


### Features

* **kcconfigs/tsconfig:** add @types/node as default types ([d3a748d](https://github.com/kc-workspace/kcws/commit/d3a748d3deb77fdd8d721b9447738bb8c2dfee54))
* **kcconfigs/tsconfig:** add noDefaultTypes feature to disable default type from presets ([070d13b](https://github.com/kc-workspace/kcws/commit/070d13b96fbcc24f0fffd607b4337210e4e15c8a))


### Performance Improvements

* **deps:** bump tsdown from 0.18.4 to 0.20.1 ([#70](https://github.com/kc-workspace/kcws/issues/70)) ([24a3e06](https://github.com/kc-workspace/kcws/commit/24a3e0689e5b512d7a80fb6719387ab777662bb7))
* **deps:** update biome schema version from 2.3.10 to 2.4.6 across all packages ([909ff7e](https://github.com/kc-workspace/kcws/commit/909ff7ede64869a571dac9969169067e8d4b7fbc))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 0.2.2

## [0.1.0](https://github.com/kc-workspace/kcws/compare/@kcconfigs/tsconfig+v0.1.0-beta.2...@kcconfigs/tsconfig+v0.1.0) (2026-01-13)


### ⚠ BREAKING CHANGES

* **kcconfigs/tsconfig:** remove default types and kctypes, user must install themselves
* **kcconfigs/tsconfig:** remove /default and use `@kcconfigs/tsconfig` instead

### Features

* **kcconfigs/tsconfig:** remove default types and kctypes, user must install themselves ([5f2989d](https://github.com/kc-workspace/kcws/commit/5f2989d1c091a3ae78f43ce5320ff232246e035f))
* **kcconfigs/tsconfig:** rewrite the config and utilize ts5.5 features ([cf661d5](https://github.com/kc-workspace/kcws/commit/cf661d5c52e23d4a3e6d0c3ea5fe33e7cbd56060))
* **kcconfigs/tsconfig:** utilize typescript v5.5 features to support relative from root config ([48cd74a](https://github.com/kc-workspace/kcws/commit/48cd74a3a0e4a5e64530a22865d8c5a2f948cf5e))


### Performance Improvements

* **kcconfigs/tsconfig:** remove /default and use `@kcconfigs/tsconfig` instead ([bfec7e6](https://github.com/kc-workspace/kcws/commit/bfec7e6ea78c38019b267376e2f576cd6c9b79d5))


### Bugfixes

* **kcconfigs/tsconfig:** move checkJs to features/js instead of base preset ([0316897](https://github.com/kc-workspace/kcws/commit/0316897d7533a2eddf6c5510c1eb59d7731e1341))
* **kcconfigs/tsconfig:** update docs ([89a39e1](https://github.com/kc-workspace/kcws/commit/89a39e1f30db14854bbfe56b2c8a5163db84d96d))


### Documentation

* add package version and changelog to documentation site ([722fab5](https://github.com/kc-workspace/kcws/commit/722fab5e2472b7d4e4fd5ba446c369f36bd1b4f1))
* **kcconfigs/tsconfig:** add readme for installation, usage, and example ([87e9069](https://github.com/kc-workspace/kcws/commit/87e90699de4f26bb0c4c934f30894b2b640fc060))


### Miscellaneous Chores

* **kcconfigs/tsconfig:** force update v0.1.0-beta.2 =&gt; v0.1.0 ([6a2d78d](https://github.com/kc-workspace/kcws/commit/6a2d78dec4efaaf9a816618a558179a39d6c4e15))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 0.2.1

## [0.1.0-beta.2](https://github.com/kc-workspace/kcws/compare/@kcconfigs/tsconfig+v0.1.0-beta.1...@kcconfigs/tsconfig+v0.1.0-beta.2) (2026-01-10)


### ⚠ BREAKING CHANGES

* **kcconfigs/biome:** Use @kcconfigs/biome instead of @kcconfigs/biome/default when use shared config

### Performance Improvements

* **kcconfigs/biome:** remove /default exports and add typedoc conditions ([5e1ab7d](https://github.com/kc-workspace/kcws/commit/5e1ab7d9be478fedbb29d2e68801c7689cd39882))


### Bugfixes

* **config:** update schema version from 2.3.8 to 2.3.10 across all biome configuration files ([751ee20](https://github.com/kc-workspace/kcws/commit/751ee207527ed05720ad415927e0b0f27bdf9bdf))


### Documentation

* update changelog to fix invalid url ([7f14bb5](https://github.com/kc-workspace/kcws/commit/7f14bb520342dc1dfb546a166bf64ef8a357451e))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 0.2.0

## 0.1.0-beta.1 (2025-12-28)


### Bugfixes

* update all `@kcconfigs` description so it trigger new deployment with new tag separator ([cf5be8c](https://github.com/kc-workspace/kcws/commit/cf5be8cc02fba8becb7e8f31fd6f3a741c0f0b95))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 0.1.1

## 0.1.0-beta.0 (2025-12-26)


### Features

* **core:** move all packages into packages/* directory ([58230cd](https://github.com/kc-workspace/kcws/commit/58230cd286d0dea953d232806c91508ebfc57701))


### Performance Improvements

* **kcconfigs/tsconfig:** include @kctypes/generic types by default ([b795bad](https://github.com/kc-workspace/kcws/commit/b795bad2ffe90ea3dfc80c3444cd7e88e9228e64))


### Bugfixes

* exclude node_modules from tsconfig to avoid parsing external dependency files ([2af05dc](https://github.com/kc-workspace/kcws/commit/2af05dcb910995551abf5141c153840710cea18f))
* homepage contains invalid url ([0ee37d6](https://github.com/kc-workspace/kcws/commit/0ee37d641fe5b04fb019099915c8aa3ddfed3be7))
* trigger re-release please ([65447a7](https://github.com/kc-workspace/kcws/commit/65447a776ed2f8638f6f35a4d00277d407143114))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 0.1.0
