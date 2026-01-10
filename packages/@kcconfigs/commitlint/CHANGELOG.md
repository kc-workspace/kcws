# Changelog

## [0.1.0-beta.1](https://github.com/kc-workspace/kcws/compare/@kcconfigs/commitlint+v0.1.0-beta.0...@kcconfigs/commitlint+v0.1.0-beta.1) (2026-01-10)


### ⚠ BREAKING CHANGES

* **kcconfigs/biome:** Use @kcconfigs/biome instead of @kcconfigs/biome/default when use shared config

### Features

* **config:** use shared typedoc config instead of manually config on every packages ([fd4cdc6](https://github.com/kc-workspace/kcws/commit/fd4cdc607f0fde49e5863c77aa7e0627676d0c42))


### Performance Improvements

* **config:** remove typedoc on package level, only use root level ([b24e48f](https://github.com/kc-workspace/kcws/commit/b24e48f5c03ee8e095dc795f3b7643d5adce406a))
* **kcconfigs/biome:** remove /default exports and add typedoc conditions ([5e1ab7d](https://github.com/kc-workspace/kcws/commit/5e1ab7d9be478fedbb29d2e68801c7689cd39882))


### Bugfixes

* **config:** update schema version from 2.3.8 to 2.3.10 across all biome configuration files ([751ee20](https://github.com/kc-workspace/kcws/commit/751ee207527ed05720ad415927e0b0f27bdf9bdf))


### Documentation

* update changelog to fix invalid url ([7f14bb5](https://github.com/kc-workspace/kcws/commit/7f14bb520342dc1dfb546a166bf64ef8a357451e))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 0.2.0
    * @kcconfigs/tsconfig bumped to 0.1.0-beta.2
    * @kcconfigs/tsdown bumped to 0.1.0-beta.2
    * @kcconfigs/vitest bumped to 0.1.0-beta.1

## 0.1.0-beta.0 (2025-12-28)


### Features

* **kcconfigs/commitlint:** add minimal type mode to only include 4 types ([181a731](https://github.com/kc-workspace/kcws/commit/181a7316219330d4107b29e29a11b6878fc3e32e))
* **kcconfigs/commitlint:** add new package for commitlint config ([1ce04a2](https://github.com/kc-workspace/kcws/commit/1ce04a206c2a12b930213e8b9e129e7b2874562a))
* **kcconfigs/commitlint:** add vitest configuration and implement tests for apis ([6f01788](https://github.com/kc-workspace/kcws/commit/6f0178871ca2d7545b5585890765e48a97a4586b))


### Performance Improvements

* improve pnpm script and dependencies catalogs ([672ccc2](https://github.com/kc-workspace/kcws/commit/672ccc2bf6a14421bd0582bded85c86c7db70c82))
* **kcconfigs/commitlint:** remove custom commit type, and use standard instead ([f02c53a](https://github.com/kc-workspace/kcws/commit/f02c53a7a5b757fa70dfbd33010e94d063349ac0))
* **kcconfigs/commitlint:** use generic global types instead of union ourself ([8082837](https://github.com/kc-workspace/kcws/commit/808283791de3f291a0bac3cbc8c7a948c465e9da))


### Bugfixes

* homepage contains invalid url ([0ee37d6](https://github.com/kc-workspace/kcws/commit/0ee37d641fe5b04fb019099915c8aa3ddfed3be7))
* **kcconfigs/commitlint:** remove unused dependencies from package.json file ([3d627ee](https://github.com/kc-workspace/kcws/commit/3d627eef7b9d48da3f080a89dc796b23da2d7140))
* trigger re-release please ([65447a7](https://github.com/kc-workspace/kcws/commit/65447a776ed2f8638f6f35a4d00277d407143114))
* update all `@kcconfigs` description so it trigger new deployment with new tag separator ([cf5be8c](https://github.com/kc-workspace/kcws/commit/cf5be8cc02fba8becb7e8f31fd6f3a741c0f0b95))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 0.1.1
    * @kcconfigs/tsconfig bumped to 0.1.0-beta.1
    * @kcconfigs/tsdown bumped to 0.1.0-beta.1
    * @kcconfigs/vitest bumped to 0.1.0-beta.0
