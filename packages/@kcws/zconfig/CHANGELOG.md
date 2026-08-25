# Changelog

## [0.2.1](https://github.com/kc-workspace/kcws/compare/@kcws/zconfig+v0.2.0...@kcws/zconfig+v0.2.1) (2026-08-24)


### Features

* **kcws/zconfig:** add auto config adapter ([7eb1586](https://github.com/kc-workspace/kcws/commit/7eb1586a7ad2efc6fdff7480a3e7f9f243f89401))


### Bugfixes

* **kcws/zconfig:** load JSONC parser correctly ([329a512](https://github.com/kc-workspace/kcws/commit/329a5120bc1f02f6cfc76d2a2756f800dbeb1910))

## [0.2.0](https://github.com/kc-workspace/kcws/compare/@kcws/zconfig+v0.1.0...@kcws/zconfig+v0.2.0) (2026-08-22)


### Features

* **kcws/zconfig:** add configuration adapters ([fc51f6b](https://github.com/kc-workspace/kcws/commit/fc51f6be34847853831874391e2ce965afb18f3e))
* **kcws/zconfig:** document config source adapters ([078b0c7](https://github.com/kc-workspace/kcws/commit/078b0c717a0d2cd02d9521d0289e1b91d941485e))
* **kcws/zconfig:** implement core engine with merge, transform and validation ([6db4056](https://github.com/kc-workspace/kcws/commit/6db40569f56ab138d516524853733e140d30c7ef))
* **kcws/zconfig:** load dotenv files by default ([d85acdd](https://github.com/kc-workspace/kcws/commit/d85acddaa96f100ce8cd193e6c704cd65493a60e))
* **kcws/zconfig:** scaffold package foundation with errors and lazy loader ([1850940](https://github.com/kc-workspace/kcws/commit/18509401ee14ce6826b7fd10870bd44dafe3a9ff))
* **kcws/zconfig:** split env and dotenv config adapters ([049ab1f](https://github.com/kc-workspace/kcws/commit/049ab1f1e30e6e0039f76df56d3ad8d363f3c36f))


### Performance Improvements

* **deps-dev:** bump @biomejs/biome from 2.5.6 to 2.5.7 ([#205](https://github.com/kc-workspace/kcws/issues/205)) ([025fbd5](https://github.com/kc-workspace/kcws/commit/025fbd552f6166290dabbbc9a30fb91b5c819ffa))
* **kcws/zconfig:** design how kcws/zconfig should look like ([7c956d3](https://github.com/kc-workspace/kcws/commit/7c956d3e4d48b6495f6d212e7d3d740b2c9a3145))
* **kcws/zconfig:** disable debug plugin on tsdown ([f043bb5](https://github.com/kc-workspace/kcws/commit/f043bb57a7980b945a00dac35c0089889e136901))
* **kcws/zconfig:** loadConfig and loadConfigSync have define adapters when not define ([6d02f13](https://github.com/kc-workspace/kcws/commit/6d02f130a3a2c676d9214aead1f5c2f26bd4686a))
* **kcws/zconfig:** minor improvement and docs ([1e25358](https://github.com/kc-workspace/kcws/commit/1e25358c032073db8533fdbe4fd79b77c4fcb795))
* **kcws/zconfig:** use [name].config.[ext] instead of just [name].[ext] when finding config file ([3d012de](https://github.com/kc-workspace/kcws/commit/3d012de70d7814a8b29f56de3043a4b4fa1faedd))
* **kcws/zconfig:** use*Adapters now enable jsonc auto when config extension is .jsonc ([f6be330](https://github.com/kc-workspace/kcws/commit/f6be33067d46cecdce06b113801ca497bc9576d7))


### Bugfixes

* **kcws/zconfig:** add jscpd ignore comments ([96b5ea3](https://github.com/kc-workspace/kcws/commit/96b5ea3251410ed00b0b105b53cd010dcf926861))
* **kcws/zconfig:** add jscpd ignore comments to adapter and loadConfig files ([ef24136](https://github.com/kc-workspace/kcws/commit/ef24136502d78e9865098fee0991738af060d24c))
* **kcws/zconfig:** update default value of optional in FileAdapterOptions to true ([8c27fad](https://github.com/kc-workspace/kcws/commit/8c27fadeb0bc914755f1be8224b8104c95dc9f44))
* **kcws/zconfig:** wrong adapter name when throw error ([5a14569](https://github.com/kc-workspace/kcws/commit/5a145697faee2928a81aabd4f114ed70184c23bb))


### Documentation

* **kcws/zconfig:** add public API TSDoc ([bd59952](https://github.com/kc-workspace/kcws/commit/bd599523b10d63387f677035fa0e278dc64e4201))
* **kcws/zconfig:** document adapter implementation ([36ac0da](https://github.com/kc-workspace/kcws/commit/36ac0da5c35c425e85fae6c4255bffd84a1f6141))
* **kcws/zconfig:** fix typo ([c5d5d94](https://github.com/kc-workspace/kcws/commit/c5d5d940c0b0fd2cc5b4f9e09861b9695c6c6c3b))
* **kcws/zconfig:** fix typo ([18a38a5](https://github.com/kc-workspace/kcws/commit/18a38a58b1c3fba93c1a1572d075a6378a91ee6d))
* **kcws/zconfig:** remove tab from readme and use spacebar instead ([7c5d466](https://github.com/kc-workspace/kcws/commit/7c5d466a83831ee5ee2abbad72bf0fce3e5f89db))


### Code Refactoring

* **kcws/zconfig:** finalize core module layout ([86546c3](https://github.com/kc-workspace/kcws/commit/86546c3662beac8d0e8ff0de5b59544f738e7ae9))
* **kcws/zconfig:** remove redundant default export syntax on adapters ([70ca20e](https://github.com/kc-workspace/kcws/commit/70ca20edabb596f149b8403da78cc5aa8e89d6a5))
* **kcws/zconfig:** restructure config adapters ([66f5dba](https://github.com/kc-workspace/kcws/commit/66f5dba34c0c51775aa6fc63c52ac89a593e569b))
* **kcws/zconfig:** share env utilities ([899a9a8](https://github.com/kc-workspace/kcws/commit/899a9a895138bcfea7238c29addab9938f5f4aaa))
* **kcws/zconfig:** split utility modules ([c5f8abc](https://github.com/kc-workspace/kcws/commit/c5f8abc4510c4841381b1beb6a7479b76400c764))
* **kcws/zconfig:** use package import aliases ([10bf53e](https://github.com/kc-workspace/kcws/commit/10bf53e8bc71a4836243d8e9ea538ecd8c43f6a5))


### Miscellaneous Chores

* **kcws/zconfig:** force update v0.1.0-beta.11 =&gt; v0.2.0 ([8b303dd](https://github.com/kc-workspace/kcws/commit/8b303dd21c64c9060c39dfd6342f228e35394f83))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 2.0.4
    * @kcconfigs/vitest bumped to 0.2.2
    * @kcconfigs/tsconfig bumped to 1.1.4
    * @kcconfigs/tsdown bumped to 0.2.7

## 0.1.0 (2026-08-02)


### Features

* **kcws/zconfig:** add initial zconfig package ([911e3a9](https://github.com/kc-workspace/kcws/commit/911e3a9e745fb4b9fd4367a2a21264817cc4e70b))


### Performance Improvements

* **deps:** upgrade biome from 2.5.3 to 2.5.6 ([dc5e4ef](https://github.com/kc-workspace/kcws/commit/dc5e4efb2a521538f7bb27be922390a4ed67d53c))


### Documentation

* **kcws/zconfig:** add design spec for zconfig package ([3db98bf](https://github.com/kc-workspace/kcws/commit/3db98bfa4e8e65ab507a266bcc9ea8e615cc0be3))
* **kcws/zconfig:** fix markdownlint errors in design spec ([11164c5](https://github.com/kc-workspace/kcws/commit/11164c5402c799fd1d70a0d37724d15d89add185))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 2.0.3
    * @kcconfigs/vitest bumped to 0.2.1
    * @kcconfigs/tsconfig bumped to 1.1.3
    * @kcconfigs/tsdown bumped to 0.2.6
