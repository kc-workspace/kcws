# Changelog

## [0.2.2](https://github.com/kc-workspace/kcws/compare/@kcinternals/config-builder+v0.2.1...@kcinternals/config-builder+v0.2.2) (2026-08-25)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/tsconfig bumped to 1.1.5

## [0.2.1](https://github.com/kc-workspace/kcws/compare/@kcinternals/config-builder+v0.2.0...@kcinternals/config-builder+v0.2.1) (2026-08-22)


### Performance Improvements

* **deps-dev:** bump @biomejs/biome from 2.5.6 to 2.5.7 ([#205](https://github.com/kc-workspace/kcws/issues/205)) ([025fbd5](https://github.com/kc-workspace/kcws/commit/025fbd552f6166290dabbbc9a30fb91b5c819ffa))


### Code Refactoring

* change scripts from `:check` to `check:*` ([e904cd2](https://github.com/kc-workspace/kcws/commit/e904cd268f9935c784a9693b1ec12dd60f5e5fa3))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 2.0.4
    * @kcconfigs/tsconfig bumped to 1.1.4

## [0.2.0](https://github.com/kc-workspace/kcws/compare/@kcinternals/config-builder+v0.1.3...@kcinternals/config-builder+v0.2.0) (2026-08-02)


### ⚠ BREAKING CHANGES

* **kcinternals/config-builder:** replace ConfigPlugin.priority with settingPriority and configPriority.
* **kcinternals/config-builder:** replace plugin.apply(baseConfig) with optional applySetting(setting) and applyConfig(config) hooks in ConfigPlugin.

### Features

* **kcinternals/config-builder:** add base config wrapper ([447333d](https://github.com/kc-workspace/kcws/commit/447333d20c54c02c823061155eefe19feb4a5c2f))
* **kcinternals/config-builder:** add withEnabled utility ([cf6a19c](https://github.com/kc-workspace/kcws/commit/cf6a19c61d2eb1ebd559786403a441a24aaf7cf6))
* **kcinternals/config-builder:** refactor definePlugin api ([3e68cec](https://github.com/kc-workspace/kcws/commit/3e68cec1fb6338e2807be84aed5c75d6161ed42f))
* **kcinternals/config-builder:** split plugin apply hooks ([7b2532a](https://github.com/kc-workspace/kcws/commit/7b2532a539cbc1d5874adf15d45191de279f0611))
* **kcinternals/config-builder:** split plugin priorities ([f1fb222](https://github.com/kc-workspace/kcws/commit/f1fb22251760ceec8731ebb68cac4fbdd72f93db))
* **kcinternals/config-builder:** split setting and config apply phases ([3f1edce](https://github.com/kc-workspace/kcws/commit/3f1edce1d12497f7cf8a1774805e43a88b56bcf3))


### Performance Improvements

* **deps:** bump the vitest group across 1 directory with 3 updates ([#188](https://github.com/kc-workspace/kcws/issues/188)) ([9159e1b](https://github.com/kc-workspace/kcws/commit/9159e1b1b9e192ee93b1528a45b8d4f13b2c35bd))
* **deps:** upgrade biome from 2.5.3 to 2.5.6 ([dc5e4ef](https://github.com/kc-workspace/kcws/commit/dc5e4efb2a521538f7bb27be922390a4ed67d53c))
* **kcinternals/config-builder:** export withEnabled for WithEnabled helpers ([fbe2b58](https://github.com/kc-workspace/kcws/commit/fbe2b58820633ab076e8568542e37c0fb59a98d1))


### Bugfixes

* **kcinternals/config-builder:** improve undefined applySetting and applyConfig in plugin better ([422b803](https://github.com/kc-workspace/kcws/commit/422b80345e7e97f3da74bfc69f57d0104cc4beb4))


### Code Refactoring

* **kcinternals/config-builder:** extract debug logger helpers ([695a28d](https://github.com/kc-workspace/kcws/commit/695a28d921ac0017192b8f75cab3e9d4cecd39bd))
* **kcinternals/config-builder:** simplify defineConfig pipeline ([f53542f](https://github.com/kc-workspace/kcws/commit/f53542fb5a1f9c091708982928962443580d41c7))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 2.0.3
    * @kcconfigs/tsconfig bumped to 1.1.3

## [0.1.3](https://github.com/kc-workspace/kcws/compare/@kcinternals/config-builder+v0.1.2...@kcinternals/config-builder+v0.1.3) (2026-07-28)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 2.0.2
    * @kcconfigs/tsconfig bumped to 1.1.2

## [0.1.2](https://github.com/kc-workspace/kcws/compare/@kcinternals/config-builder+v0.1.1...@kcinternals/config-builder+v0.1.2) (2026-07-23)


### Performance Improvements

* **deps:** bump @biomejs/biome from 2.4.15 to 2.5.3 ([#171](https://github.com/kc-workspace/kcws/issues/171)) ([97638f0](https://github.com/kc-workspace/kcws/commit/97638f01c158a1a55c620edf1126480e314e783d))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 2.0.1
    * @kcconfigs/tsconfig bumped to 1.1.1

## [0.1.1](https://github.com/kc-workspace/kcws/compare/@kcinternals/config-builder+v0.1.0...@kcinternals/config-builder+v0.1.1) (2026-07-23)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/tsconfig bumped to 1.1.0

## 0.1.0 (2026-07-13)


### ⚠ BREAKING CHANGES

* **kcinternals/config-builder:** move @kcconfigs/_builder to internals namespace instead

### Features

* **kcinternals/config-builder:** move @kcconfigs/_builder to internals namespace instead ([76eb330](https://github.com/kc-workspace/kcws/commit/76eb33026ecd7f902517f017bb95538a03513919))


### Performance Improvements

* **kcinternals/config-builder:** add verbose field to define option for more verbose debug output ([87272e5](https://github.com/kc-workspace/kcws/commit/87272e55de4df9ebbe477029db1def581be0f83c))
* **kcinternals/config-builder:** update the package.json to latest information ([48ff3b5](https://github.com/kc-workspace/kcws/commit/48ff3b58506fa4354cd7fda62b2cc3e56b6b5b8e))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 2.0.0
    * @kcconfigs/tsconfig bumped to 1.0.3
