:robot: I have created a release *beep* *boop*
---


<details><summary>@kcconfigs/biome: 4.1.0</summary>

## [4.1.0](https://github.com/kc-workspace/kcws/compare/@kcconfigs/biome+v4.0.0...@kcconfigs/biome+v4.1.0) (2026-11-05)


### Features

* **kcconfigs/biome:** indent markdown with spaces ([06fde9a](https://github.com/kc-workspace/kcws/commit/06fde9acdd7bb7917fed94896639b6580fe6ba89))


### Performance Improvements

* **deps-dev:** bump biome, vitest, tsdown and dev tooling ([b396c8c](https://github.com/kc-workspace/kcws/commit/b396c8c4d500142b6ee41d8d993f7a6aa9a0bdda))
</details>

<details><summary>@kcconfigs/commitlint: 0.6.0</summary>

## [0.6.0](https://github.com/kc-workspace/kcws/compare/@kcconfigs/commitlint+v0.5.0...@kcconfigs/commitlint+v0.6.0) (2026-11-05)


###   BREAKING CHANGES

* **kcconfigs/biome:** requires Biome 2.6.0 or newer. Extend presets as @kcconfigs/biome/configs/<name> instead of @kcconfigs/biome or @kcconfigs/biome/<name>.
* **deps-dev:** requires vitest ^5.0.0 (and vite as its peer dependency).
* **kcconfigs/commitlint:** defineConfig no longer accepts { types, autoScopes, scopes }. Use typesPlugin(mode), scopePlugin(scopes) or autoScopePlugin(additional) from @kcconfigs/commitlint/plugins instead.

### Features

* **kcconfigs/biome:** publish presets through a Biome manifest ([56d882b](https://github.com/kc-workspace/kcws/commit/56d882bc43e081ec9dc8c4b341ae870d16337765))
* **kcconfigs/commitlint:** migrate to @kcinternals/config-builder plugin API ([96e4213](https://github.com/kc-workspace/kcws/commit/96e42134892610b091e40a598549b4685266ff0f))


### Performance Improvements

* **deps-dev:** bump @biomejs/biome from 2.5.15 to 2.6.2 ([169a69d](https://github.com/kc-workspace/kcws/commit/169a69df4a9259db4bb83b9b15c3d02d57f987ad))
* **deps-dev:** bump @biomejs/biome from 2.5.6 to 2.5.7 ([#205](https://github.com/kc-workspace/kcws/issues/205)) ([025fbd5](https://github.com/kc-workspace/kcws/commit/025fbd552f6166290dabbbc9a30fb91b5c819ffa))
* **deps-dev:** bump @biomejs/biome from 2.5.7 to 2.5.11 ([#227](https://github.com/kc-workspace/kcws/issues/227)) ([25dcfae](https://github.com/kc-workspace/kcws/commit/25dcfae79543746f01a39a2d8463643d2d662926))
* **deps-dev:** bump biome, vitest, tsdown and dev tooling ([b396c8c](https://github.com/kc-workspace/kcws/commit/b396c8c4d500142b6ee41d8d993f7a6aa9a0bdda))
* **deps-dev:** bump the commitlint group across 1 directory with 3 updates ([#215](https://github.com/kc-workspace/kcws/issues/215)) ([76f6943](https://github.com/kc-workspace/kcws/commit/76f6943767aad9c8a479c2ccc8ebc9359dd58419))
* **deps:** bump @biomejs/biome from 2.4.15 to 2.5.3 ([#171](https://github.com/kc-workspace/kcws/issues/171)) ([97638f0](https://github.com/kc-workspace/kcws/commit/97638f01c158a1a55c620edf1126480e314e783d))
* **deps:** bump the commitlint group across 1 directory with 4 updates ([#168](https://github.com/kc-workspace/kcws/issues/168)) ([68ce0be](https://github.com/kc-workspace/kcws/commit/68ce0be74f6d1d450b52dade886d04ff3885c6c8))
* **deps:** bump the commitlint group across 1 directory with 5 updates ([#159](https://github.com/kc-workspace/kcws/issues/159)) ([456e4e0](https://github.com/kc-workspace/kcws/commit/456e4e0937dcfb22f6263a2bc9efd7b5a4863e03))
* **deps:** bump the vitest group across 1 directory with 3 updates ([#188](https://github.com/kc-workspace/kcws/issues/188)) ([9159e1b](https://github.com/kc-workspace/kcws/commit/9159e1b1b9e192ee93b1528a45b8d4f13b2c35bd))
* **deps:** bump the vitest group across 1 directory with 4 updates ([#219](https://github.com/kc-workspace/kcws/issues/219)) ([9f02e3e](https://github.com/kc-workspace/kcws/commit/9f02e3e8c28d3f6353d10f9e0b067963e4ca5abd))
* **deps:** upgrade biome from 2.5.3 to 2.5.6 ([dc5e4ef](https://github.com/kc-workspace/kcws/commit/dc5e4efb2a521538f7bb27be922390a4ed67d53c))
* **kcconfigs/commitlint:** migrate tsdown config to new apis ([dd891b1](https://github.com/kc-workspace/kcws/commit/dd891b1943a12c7942c42391ce7adbd15cff2613))


### Documentation

* **kcconfigs/commitlint:** init readme ([c61646e](https://github.com/kc-workspace/kcws/commit/c61646e3c3bd53e393435da1c7773dda6e81c122))
* **kcconfigs/commitlint:** split async config section and align plugin table ([3a69502](https://github.com/kc-workspace/kcws/commit/3a69502bdee65efd5b7047a12e27d23cc3fef867))


### Code Refactoring

* change scripts from `:check` to `check:*` ([e904cd2](https://github.com/kc-workspace/kcws/commit/e904cd268f9935c784a9693b1ec12dd60f5e5fa3))
* **kcconfigs/commitlint:** migrate to async config-builder APIs ([5f8d350](https://github.com/kc-workspace/kcws/commit/5f8d3503d5bbc956af8ef6a6e5ff8a3cef4ab635))
* **kcconfigs/commitlint:** re-export Severity directly ([47368c5](https://github.com/kc-workspace/kcws/commit/47368c534df4113e1f108fafddb1d89dc6c35baf))
* **kcconfigs/commitlint:** use number type for plugin priority constants ([a70843d](https://github.com/kc-workspace/kcws/commit/a70843dbc5290529b79038b6bbf1031c4d5a8369))
* **kcconfigs/commitlint:** wrap plugin inputs with Promise.resolve ([2bff15a](https://github.com/kc-workspace/kcws/commit/2bff15a98a80c9a6d85ed92c5db3f4a2af2b0b9e))


### Miscellaneous Chores

* **deps-dev:** migrate to Vitest 5 ([#253](https://github.com/kc-workspace/kcws/issues/253)) ([d443847](https://github.com/kc-workspace/kcws/commit/d443847eb69177469110f0da19cb9ada8fad8f18))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @kcinternals/config-builder bumped to 0.5.0
  * devDependencies
    * @kcconfigs/biome bumped to 4.1.0
    * @kcconfigs/tsconfig bumped to 3.0.1
    * @kcconfigs/tsdown bumped to 0.6.0
    * @kcconfigs/vitest bumped to 0.2.0
</details>

<details><summary>@kcconfigs/lefthook: 0.4.0</summary>

## [0.4.0](https://github.com/kc-workspace/kcws/compare/@kcconfigs/lefthook+v0.3.0...@kcconfigs/lefthook+v0.4.0) (2026-11-05)


###   BREAKING CHANGES

* **kcconfigs/biome:** requires Biome 2.6.0 or newer. Extend presets as @kcconfigs/biome/configs/<name> instead of @kcconfigs/biome or @kcconfigs/biome/<name>.
* **kcconfigs/lefthook:** Require Node.js 22 or newer.

### Features

* **kcconfigs/biome:** publish presets through a Biome manifest ([56d882b](https://github.com/kc-workspace/kcws/commit/56d882bc43e081ec9dc8c4b341ae870d16337765))


### Performance Improvements

* **deps-dev:** bump @biomejs/biome from 2.5.15 to 2.6.2 ([169a69d](https://github.com/kc-workspace/kcws/commit/169a69df4a9259db4bb83b9b15c3d02d57f987ad))
* **deps-dev:** bump @biomejs/biome from 2.5.6 to 2.5.7 ([#205](https://github.com/kc-workspace/kcws/issues/205)) ([025fbd5](https://github.com/kc-workspace/kcws/commit/025fbd552f6166290dabbbc9a30fb91b5c819ffa))
* **deps-dev:** bump @biomejs/biome from 2.5.7 to 2.5.11 ([#227](https://github.com/kc-workspace/kcws/issues/227)) ([25dcfae](https://github.com/kc-workspace/kcws/commit/25dcfae79543746f01a39a2d8463643d2d662926))
* **deps-dev:** bump biome, vitest, tsdown and dev tooling ([b396c8c](https://github.com/kc-workspace/kcws/commit/b396c8c4d500142b6ee41d8d993f7a6aa9a0bdda))
* **deps:** bump @biomejs/biome from 2.4.15 to 2.5.3 ([#171](https://github.com/kc-workspace/kcws/issues/171)) ([97638f0](https://github.com/kc-workspace/kcws/commit/97638f01c158a1a55c620edf1126480e314e783d))
* **deps:** upgrade biome from 2.5.3 to 2.5.6 ([dc5e4ef](https://github.com/kc-workspace/kcws/commit/dc5e4efb2a521538f7bb27be922390a4ed67d53c))
* **kcconfigs/lefthook:** add features/debug.yaml for debugging output ([79d920b](https://github.com/kc-workspace/kcws/commit/79d920b9343a1fa3b4dd5d89af8a19b2af285faa))
* **kcconfigs/lefthook:** add peerDependencies to lefthook with v2 or higher ([54c2e53](https://github.com/kc-workspace/kcws/commit/54c2e53e1e906b268e0a756a67e62462bc7acfd5))


### Bugfixes

* **kcconfigs/lefthook:** pre-push never include change file due to wrong variable name ([54cbb2f](https://github.com/kc-workspace/kcws/commit/54cbb2fc3fff21bf95164e15757ffe98ad041241))


### Documentation

* format table ([8f2c2ce](https://github.com/kc-workspace/kcws/commit/8f2c2ceacf06ad8514502c50db7f5ae80848063a))
* **kcconfigs/lefthook:** refresh docs ([4109718](https://github.com/kc-workspace/kcws/commit/41097180073bfed6d7d95415cef0fd3518d36c3e))
* **kcconfigs/lefthook:** simplify hook import paths and update docs tables ([13717eb](https://github.com/kc-workspace/kcws/commit/13717ebd4c86dc0800811d6d2d9ff8e8837cc3b9))


### Code Refactoring

* change scripts from `:check` to `check:*` ([e904cd2](https://github.com/kc-workspace/kcws/commit/e904cd268f9935c784a9693b1ec12dd60f5e5fa3))


### Miscellaneous Chores

* **kcconfigs/lefthook:** require Node 22 ([81bd12c](https://github.com/kc-workspace/kcws/commit/81bd12cc9abbdc6247e97fba8732e7b08915f872))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 4.1.0
</details>

<details><summary>@kcconfigs/textlint: 0.4.0</summary>

## [0.4.0](https://github.com/kc-workspace/kcws/compare/@kcconfigs/textlint+v0.3.0...@kcconfigs/textlint+v0.4.0) (2026-11-05)


###   BREAKING CHANGES

* **kcconfigs/biome:** requires Biome 2.6.0 or newer. Extend presets as @kcconfigs/biome/configs/<name> instead of @kcconfigs/biome or @kcconfigs/biome/<name>.
* **deps-dev:** requires vitest ^5.0.0 (and vite as its peer dependency).
* **kcconfigs/textlint:** Require Node.js 22 or newer.

### Features

* **kcconfigs/biome:** publish presets through a Biome manifest ([56d882b](https://github.com/kc-workspace/kcws/commit/56d882bc43e081ec9dc8c4b341ae870d16337765))


### Performance Improvements

* **deps-dev:** bump @biomejs/biome from 2.5.15 to 2.6.2 ([169a69d](https://github.com/kc-workspace/kcws/commit/169a69df4a9259db4bb83b9b15c3d02d57f987ad))
* **deps-dev:** bump @biomejs/biome from 2.5.6 to 2.5.7 ([#205](https://github.com/kc-workspace/kcws/issues/205)) ([025fbd5](https://github.com/kc-workspace/kcws/commit/025fbd552f6166290dabbbc9a30fb91b5c819ffa))
* **deps-dev:** bump @biomejs/biome from 2.5.7 to 2.5.11 ([#227](https://github.com/kc-workspace/kcws/issues/227)) ([25dcfae](https://github.com/kc-workspace/kcws/commit/25dcfae79543746f01a39a2d8463643d2d662926))
* **deps-dev:** bump biome, vitest, tsdown and dev tooling ([b396c8c](https://github.com/kc-workspace/kcws/commit/b396c8c4d500142b6ee41d8d993f7a6aa9a0bdda))
* **deps:** bump @biomejs/biome from 2.4.15 to 2.5.3 ([#171](https://github.com/kc-workspace/kcws/issues/171)) ([97638f0](https://github.com/kc-workspace/kcws/commit/97638f01c158a1a55c620edf1126480e314e783d))
* **deps:** bump the vitest group across 1 directory with 3 updates ([#188](https://github.com/kc-workspace/kcws/issues/188)) ([9159e1b](https://github.com/kc-workspace/kcws/commit/9159e1b1b9e192ee93b1528a45b8d4f13b2c35bd))
* **deps:** bump the vitest group across 1 directory with 4 updates ([#219](https://github.com/kc-workspace/kcws/issues/219)) ([9f02e3e](https://github.com/kc-workspace/kcws/commit/9f02e3e8c28d3f6353d10f9e0b067963e4ca5abd))
* **deps:** upgrade biome from 2.5.3 to 2.5.6 ([dc5e4ef](https://github.com/kc-workspace/kcws/commit/dc5e4efb2a521538f7bb27be922390a4ed67d53c))


### Bugfixes

* **kcconfigs/textlint:** update sonar issue ([ad69304](https://github.com/kc-workspace/kcws/commit/ad69304b8443519d5fe11288db014a27f9725ffe))


### Documentation

* add blank lines around markdown lists ([af84f16](https://github.com/kc-workspace/kcws/commit/af84f167a4e9545d480c20097953c7b5f4663d77))
* improve prose quality and fix grammar in documentation ([9d7a6f0](https://github.com/kc-workspace/kcws/commit/9d7a6f0695dd7dadb3f3dc058d2a85d593deb083))
* **kcconfigs/lefthook:** commit as is ([ac93a49](https://github.com/kc-workspace/kcws/commit/ac93a49641606d5f4a6a85c41e50c91c315fc02c))


### Code Refactoring

* change scripts from `:check` to `check:*` ([e904cd2](https://github.com/kc-workspace/kcws/commit/e904cd268f9935c784a9693b1ec12dd60f5e5fa3))
* **kcconfigs/textlint:** inline rule module any type ([2b1c39a](https://github.com/kc-workspace/kcws/commit/2b1c39afa801c73b7a081daec886942b6555d7e0))
* use barrel import for plugins and remove empty defineConfig option ([9474fd0](https://github.com/kc-workspace/kcws/commit/9474fd0c9668bad18d259a49ac0c727f21112642))


### Miscellaneous Chores

* **deps-dev:** migrate to Vitest 5 ([#253](https://github.com/kc-workspace/kcws/issues/253)) ([d443847](https://github.com/kc-workspace/kcws/commit/d443847eb69177469110f0da19cb9ada8fad8f18))
* **kcconfigs/textlint:** require Node 22 ([3955376](https://github.com/kc-workspace/kcws/commit/395537658297af892eec70af344e8c91e10fbfa5))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 4.1.0
    * @kcconfigs/tsconfig bumped to 3.0.1
    * @kcconfigs/tsdown bumped to 0.6.0
    * @kcconfigs/vitest bumped to 0.2.0
</details>

<details><summary>@kcconfigs/tsconfig: 3.0.1</summary>

## [3.0.1](https://github.com/kc-workspace/kcws/compare/@kcconfigs/tsconfig+v3.0.0...@kcconfigs/tsconfig+v3.0.1) (2026-11-05)


###   BREAKING CHANGES

* **kcconfigs/biome:** requires Biome 2.6.0 or newer. Extend presets as @kcconfigs/biome/configs/<name> instead of @kcconfigs/biome or @kcconfigs/biome/<name>.
* **kcconfigs/tsconfig:** Require Node.js 22 or newer.

### Features

* **kcconfigs/biome:** publish presets through a Biome manifest ([56d882b](https://github.com/kc-workspace/kcws/commit/56d882bc43e081ec9dc8c4b341ae870d16337765))
* **kcconfigs/tsconfig:** add bun feature and preset configs ([ccbf7f3](https://github.com/kc-workspace/kcws/commit/ccbf7f3d56cbc1f03dc37d69841d321796aec7b2))
* **kcconfigs/tsconfig:** include all typescript files from root in bun preset ([#259](https://github.com/kc-workspace/kcws/issues/259)) ([c1aca40](https://github.com/kc-workspace/kcws/commit/c1aca400b7286527d67cae5d9adb8f9523240fc0))


### Performance Improvements

* **deps-dev:** bump @biomejs/biome from 2.5.15 to 2.6.2 ([169a69d](https://github.com/kc-workspace/kcws/commit/169a69df4a9259db4bb83b9b15c3d02d57f987ad))
* **deps-dev:** bump @biomejs/biome from 2.5.6 to 2.5.7 ([#205](https://github.com/kc-workspace/kcws/issues/205)) ([025fbd5](https://github.com/kc-workspace/kcws/commit/025fbd552f6166290dabbbc9a30fb91b5c819ffa))
* **deps-dev:** bump @biomejs/biome from 2.5.7 to 2.5.11 ([#227](https://github.com/kc-workspace/kcws/issues/227)) ([25dcfae](https://github.com/kc-workspace/kcws/commit/25dcfae79543746f01a39a2d8463643d2d662926))
* **deps-dev:** bump biome, vitest, tsdown and dev tooling ([b396c8c](https://github.com/kc-workspace/kcws/commit/b396c8c4d500142b6ee41d8d993f7a6aa9a0bdda))
* **deps:** bump @biomejs/biome from 2.4.15 to 2.5.3 ([#171](https://github.com/kc-workspace/kcws/issues/171)) ([97638f0](https://github.com/kc-workspace/kcws/commit/97638f01c158a1a55c620edf1126480e314e783d))
* **deps:** bump @types/bun from 1.3.14 to 1.4.0 ([#224](https://github.com/kc-workspace/kcws/issues/224)) ([ad74e83](https://github.com/kc-workspace/kcws/commit/ad74e8363b5c2f3c19dcb03bf07e623a27fdc294))
* **deps:** bump @types/bun from 1.4.2 to 1.4.3 ([#274](https://github.com/kc-workspace/kcws/issues/274)) ([e33537a](https://github.com/kc-workspace/kcws/commit/e33537a54e04099ce4b4c51a3ff6e2e2c3ccaf32))
* **deps:** bump @types/node from 24.13.3 to 24.19.0 ([#256](https://github.com/kc-workspace/kcws/issues/256)) ([c662bad](https://github.com/kc-workspace/kcws/commit/c662badf8e98b0a6828777959a965668e19f2c44))
* **deps:** bump @types/node from 24.19.0 to 24.19.2 ([#268](https://github.com/kc-workspace/kcws/issues/268)) ([2f1b372](https://github.com/kc-workspace/kcws/commit/2f1b372b7ab3e8d3778cb01624c8edaf86777e81))
* **deps:** upgrade biome from 2.5.3 to 2.5.6 ([dc5e4ef](https://github.com/kc-workspace/kcws/commit/dc5e4efb2a521538f7bb27be922390a4ed67d53c))
* **kcconfigs/tsconfig:** add lit support (https://lit.dev/) ([0cb7b74](https://github.com/kc-workspace/kcws/commit/0cb7b7407c3501ae0f3c4c11b7d7bf280d330569))
* **kcconfigs/tsconfig:** no reason to ignore example, config, and test file on tsconfig ([1fdf964](https://github.com/kc-workspace/kcws/commit/1fdf9648727afdb5ff08531fa0db4914ebfcd1f6))


### Bugfixes

* **kcconfigs/tsconfig:** @types/* and [@kctypes](https://github.com/kctypes) is optional peer when use with pnpm ([b335c38](https://github.com/kc-workspace/kcws/commit/b335c3880f2566d5bfb8afa3f4dbb4e29fec2a39))


### Documentation

* **kcconfigs/tsconfig:** add jscpd ignore markers to reduce false positives ([2b11147](https://github.com/kc-workspace/kcws/commit/2b111477af65a80c3ac882b23b12d35a02f0122f))
* **kcconfigs/tsconfig:** add React section to table of contents ([87a7335](https://github.com/kc-workspace/kcws/commit/87a73358aa58227b99b9bc6107333c806e87ce4d))
* **kcconfigs/tsconfig:** refresh docs ([42f497a](https://github.com/kc-workspace/kcws/commit/42f497aab25118e537d3ec62f8ad8622da6fab1a))
* **kcconfigs/tsconfig:** remove old todo annotation from readme ([b80b515](https://github.com/kc-workspace/kcws/commit/b80b5150cde1c7fd8a6dbc6d2cb957d627e0c7b4))
* **kcconfigs/tsconfig:** remove stale envs/node from example ([df26baf](https://github.com/kc-workspace/kcws/commit/df26baf6bdb061b1df7f59b2428cb486c2988ba0))


### Code Refactoring

* change scripts from `:check` to `check:*` ([e904cd2](https://github.com/kc-workspace/kcws/commit/e904cd268f9935c784a9693b1ec12dd60f5e5fa3))


### Miscellaneous Chores

* **kcconfigs/tsconfig:** force update v3.0.0 =&gt; v3.0.1 ([58a5d18](https://github.com/kc-workspace/kcws/commit/58a5d1882e54a6424cb254f87843ad8f0453adbb))
* **kcconfigs/tsconfig:** require Node 22 ([b6b771c](https://github.com/kc-workspace/kcws/commit/b6b771c14599fbec5552473b9120151b759d5eb0))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @kctypes/generic bumped to 3.0.1
  * devDependencies
    * @kcconfigs/biome bumped to 4.1.0
  * peerDependencies
    * @kctypes/generic bumped to 3.0.1
</details>

<details><summary>@kcconfigs/tsdown: 0.6.0</summary>

## [0.6.0](https://github.com/kc-workspace/kcws/compare/@kcconfigs/tsdown+v0.5.0...@kcconfigs/tsdown+v0.6.0) (2026-11-05)


###   BREAKING CHANGES

* **kcconfigs/biome:** requires Biome 2.6.0 or newer. Extend presets as @kcconfigs/biome/configs/<name> instead of @kcconfigs/biome or @kcconfigs/biome/<name>.
* **deps-dev:** requires vitest ^5.0.0 (and vite as its peer dependency).
* **kcconfigs/tsdown:** Require Node.js 22 or newer.
* **kcconfigs/tsdown:** `minify` and `css.minify` default to `false`. Add `minifyPlugin()` to keep minified output.

### Features

* **kcconfigs/biome:** publish presets through a Biome manifest ([56d882b](https://github.com/kc-workspace/kcws/commit/56d882bc43e081ec9dc8c4b341ae870d16337765))
* **kcconfigs/tsdown:** add CSS output configuration to css and debug plugins ([7f58915](https://github.com/kc-workspace/kcws/commit/7f5891530bfd55d9593c1ed4eb5d9d3b2bef91a9))
* **kcconfigs/tsdown:** add output option to cssPlugin ([92abc60](https://github.com/kc-workspace/kcws/commit/92abc60c6a432d7948789898b11ff04c2184cd0c))
* **kcconfigs/tsdown:** add plugin barrel exports ([ab96809](https://github.com/kc-workspace/kcws/commit/ab9680913b2bb954ce62b0c2224b69be19580b0a))
* **kcconfigs/tsdown:** add verbose option and applySetting to debugPlugin ([fb6154f](https://github.com/kc-workspace/kcws/commit/fb6154f6d5c86b32f81e0512c17a152f1dbca8c3))
* **kcconfigs/tsdown:** disable minify by default and add minifyPlugin ([18ec633](https://github.com/kc-workspace/kcws/commit/18ec6332702f1d447f435c861015a76823aab9c5))


### Performance Improvements

* **deps-dev:** bump @biomejs/biome from 2.5.15 to 2.6.2 ([169a69d](https://github.com/kc-workspace/kcws/commit/169a69df4a9259db4bb83b9b15c3d02d57f987ad))
* **deps-dev:** bump @biomejs/biome from 2.5.6 to 2.5.7 ([#205](https://github.com/kc-workspace/kcws/issues/205)) ([025fbd5](https://github.com/kc-workspace/kcws/commit/025fbd552f6166290dabbbc9a30fb91b5c819ffa))
* **deps-dev:** bump @biomejs/biome from 2.5.7 to 2.5.11 ([#227](https://github.com/kc-workspace/kcws/issues/227)) ([25dcfae](https://github.com/kc-workspace/kcws/commit/25dcfae79543746f01a39a2d8463643d2d662926))
* **deps-dev:** bump biome, vitest, tsdown and dev tooling ([b396c8c](https://github.com/kc-workspace/kcws/commit/b396c8c4d500142b6ee41d8d993f7a6aa9a0bdda))
* **deps:** bump @biomejs/biome from 2.4.15 to 2.5.3 ([#171](https://github.com/kc-workspace/kcws/issues/171)) ([97638f0](https://github.com/kc-workspace/kcws/commit/97638f01c158a1a55c620edf1126480e314e783d))
* **deps:** bump publint from 0.3.21 to 0.3.23 ([#206](https://github.com/kc-workspace/kcws/issues/206)) ([76dd726](https://github.com/kc-workspace/kcws/commit/76dd726c36c426925ba46fc5e5ac5f4b7080ca47))
* **deps:** bump publint from 0.3.23 to 0.3.24 ([#223](https://github.com/kc-workspace/kcws/issues/223)) ([89be044](https://github.com/kc-workspace/kcws/commit/89be044ea0b4e2db384ec5836f638f3f57a7b982))
* **deps:** upgrade biome from 2.5.3 to 2.5.6 ([dc5e4ef](https://github.com/kc-workspace/kcws/commit/dc5e4efb2a521538f7bb27be922390a4ed67d53c))


### Bugfixes

* **kcconfigs/tsdown:** align Node.js engines with tsdown 0.23 ([b767198](https://github.com/kc-workspace/kcws/commit/b7671983e0db0db0ac1132c9b28c2172d566494f))
* **kcconfigs/tsdown:** invalid build script ([46408a3](https://github.com/kc-workspace/kcws/commit/46408a3bde2ae0659ae12977d8f7341560123cea))
* **kcconfigs/tsdown:** previously tsconfig ignore test file by default cause some error to face up ([a2134ed](https://github.com/kc-workspace/kcws/commit/a2134edf9ee135d3fbcbbdb8dad85acec20990a2))
* **kcconfigs/tsdown:** still publish old cjs for tsdown on node v22.0.0 to v22.18.0 for now ([fd49d67](https://github.com/kc-workspace/kcws/commit/fd49d67d7c93f9c61a8179b909f83e06e43d1b8c))


### Documentation

* **kcconfigs/tsdown:** add readme ([a386e5e](https://github.com/kc-workspace/kcws/commit/a386e5ea32b18986880cbf66b3862ca08a048b62))
* **kcconfigs/tsdown:** refresh docs ([180065c](https://github.com/kc-workspace/kcws/commit/180065c1b9af1ea5f0e5183d6a3a93e53e4b21c5))


### Code Refactoring

* change scripts from `:check` to `check:*` ([e904cd2](https://github.com/kc-workspace/kcws/commit/e904cd268f9935c784a9693b1ec12dd60f5e5fa3))
* **kcconfigs/tsdown:** improve isEsm to handle array and object formats ([d2e859b](https://github.com/kc-workspace/kcws/commit/d2e859b12c0c84336759699cc71043de0cb34328))
* **kcconfigs/tsdown:** merge duplicate tsdown imports ([fc99d41](https://github.com/kc-workspace/kcws/commit/fc99d416bbaad48735b105a0601819fa33602357))
* **kcconfigs/tsdown:** migrate internals plugins to config-builder API ([1aa51ba](https://github.com/kc-workspace/kcws/commit/1aa51ba0e0b99838ae78f7f880c71fd486f79586))
* **kcconfigs/tsdown:** migrate to sync config-builder APIs ([627c7bd](https://github.com/kc-workspace/kcws/commit/627c7bdc934a14355da55009b4da29aeb394741e))
* **kcconfigs/tsdown:** rename apply to applyConfig and TsdownPlugin to TsdownConfigPlugin ([c405e5f](https://github.com/kc-workspace/kcws/commit/c405e5fc5face3ca0dfc470ec9400c886d5b6e1f))
* **kcconfigs/tsdown:** simplify defineConfig by removing DefineOption parameter ([3f0845f](https://github.com/kc-workspace/kcws/commit/3f0845fa6d518d5a70786aa38168ec2c97baa5d0))
* **kcconfigs/tsdown:** simplify format plugin to pass through format values ([149075e](https://github.com/kc-workspace/kcws/commit/149075ee153b5a974bd7889fef6ab9279c5dcee2))
* **kcconfigs/tsdown:** update models for config-builder API ([aed121c](https://github.com/kc-workspace/kcws/commit/aed121c595f7bab8cf4531bc16dc552b39e7ccda))
* **kcconfigs/tsdown:** use barrel import for plugins and clean up index exports ([86b7bd5](https://github.com/kc-workspace/kcws/commit/86b7bd5c7d31dc7a18bd4b9b8a5675839b77f3e9))
* **kcconfigs/tsdown:** use number type for plugin priority constants ([15b4682](https://github.com/kc-workspace/kcws/commit/15b46825492474eb96e5ec42ded27698b85ccbde))


### Miscellaneous Chores

* **deps-dev:** migrate to Vitest 5 ([#253](https://github.com/kc-workspace/kcws/issues/253)) ([d443847](https://github.com/kc-workspace/kcws/commit/d443847eb69177469110f0da19cb9ada8fad8f18))
* **kcconfigs/tsdown:** require Node 22 ([d26ffe7](https://github.com/kc-workspace/kcws/commit/d26ffe771ff4d89a3fb8bbeb0710a964e1b0096c))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @kcinternals/config-builder bumped to 0.5.0
  * devDependencies
    * @kcconfigs/biome bumped to 4.1.0
    * @kcconfigs/tsconfig bumped to 3.0.1
</details>

<details><summary>@kcconfigs/typedoc: 0.3.0</summary>

## [0.3.0](https://github.com/kc-workspace/kcws/compare/@kcconfigs/typedoc+v0.5.0...@kcconfigs/typedoc+v0.3.0) (2026-11-05)


###   BREAKING CHANGES

* **kcconfigs/biome:** requires Biome 2.6.0 or newer. Extend presets as @kcconfigs/biome/configs/<name> instead of @kcconfigs/biome or @kcconfigs/biome/<name>.
* **deps-dev:** requires vitest ^5.0.0 (and vite as its peer dependency).
* **kcconfigs/typedoc:** Require Node.js 22 or newer.

### Features

* **kcconfigs/biome:** publish presets through a Biome manifest ([56d882b](https://github.com/kc-workspace/kcws/commit/56d882bc43e081ec9dc8c4b341ae870d16337765))


### Performance Improvements

* **deps-dev:** bump @biomejs/biome from 2.5.15 to 2.6.2 ([169a69d](https://github.com/kc-workspace/kcws/commit/169a69df4a9259db4bb83b9b15c3d02d57f987ad))
* **deps-dev:** bump @biomejs/biome from 2.5.6 to 2.5.7 ([#205](https://github.com/kc-workspace/kcws/issues/205)) ([025fbd5](https://github.com/kc-workspace/kcws/commit/025fbd552f6166290dabbbc9a30fb91b5c819ffa))
* **deps-dev:** bump @biomejs/biome from 2.5.7 to 2.5.11 ([#227](https://github.com/kc-workspace/kcws/issues/227)) ([25dcfae](https://github.com/kc-workspace/kcws/commit/25dcfae79543746f01a39a2d8463643d2d662926))
* **deps-dev:** bump biome, vitest, tsdown and dev tooling ([b396c8c](https://github.com/kc-workspace/kcws/commit/b396c8c4d500142b6ee41d8d993f7a6aa9a0bdda))
* **deps:** bump @biomejs/biome from 2.4.15 to 2.5.3 ([#171](https://github.com/kc-workspace/kcws/issues/171)) ([97638f0](https://github.com/kc-workspace/kcws/commit/97638f01c158a1a55c620edf1126480e314e783d))
* **deps:** bump the vitest group across 1 directory with 3 updates ([#188](https://github.com/kc-workspace/kcws/issues/188)) ([9159e1b](https://github.com/kc-workspace/kcws/commit/9159e1b1b9e192ee93b1528a45b8d4f13b2c35bd))
* **deps:** bump the vitest group across 1 directory with 4 updates ([#219](https://github.com/kc-workspace/kcws/issues/219)) ([9f02e3e](https://github.com/kc-workspace/kcws/commit/9f02e3e8c28d3f6353d10f9e0b067963e4ca5abd))
* **deps:** upgrade biome from 2.5.3 to 2.5.6 ([dc5e4ef](https://github.com/kc-workspace/kcws/commit/dc5e4efb2a521538f7bb27be922390a4ed67d53c))


### Bugfixes

* **kcconfigs/typedoc:** upgrade typedoc-github-theme peer to match with root ([63f6c91](https://github.com/kc-workspace/kcws/commit/63f6c9155007658607c6f4ad6c31dc6507f636a5))


### Documentation

* **kcconfigs/typedoc:** commit as is ([9c29194](https://github.com/kc-workspace/kcws/commit/9c29194c4f91b27a08bd867ab731785f71c8eed5))


### Code Refactoring

* change scripts from `:check` to `check:*` ([e904cd2](https://github.com/kc-workspace/kcws/commit/e904cd268f9935c784a9693b1ec12dd60f5e5fa3))
* use barrel import for plugins and remove empty defineConfig option ([9474fd0](https://github.com/kc-workspace/kcws/commit/9474fd0c9668bad18d259a49ac0c727f21112642))


### Miscellaneous Chores

* **deps-dev:** migrate to Vitest 5 ([#253](https://github.com/kc-workspace/kcws/issues/253)) ([d443847](https://github.com/kc-workspace/kcws/commit/d443847eb69177469110f0da19cb9ada8fad8f18))
* **kcconfigs/typedoc:** force update v0.2.0-beta.7 =&gt; v0.3.0 ([e53b908](https://github.com/kc-workspace/kcws/commit/e53b908a8d1501df795dcd06fb58a5935106ca78))
* **kcconfigs/typedoc:** require Node 22 ([ed9dda1](https://github.com/kc-workspace/kcws/commit/ed9dda110f42064a59cf85cb7329ff07d12e5c32))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 4.1.0
    * @kcconfigs/tsconfig bumped to 3.0.1
    * @kcconfigs/tsdown bumped to 0.6.0
    * @kcconfigs/vitest bumped to 0.2.0
</details>

<details><summary>@kcconfigs/vitest: 0.2.0</summary>

## [0.2.0](https://github.com/kc-workspace/kcws/compare/@kcconfigs/vitest+v0.5.0...@kcconfigs/vitest+v0.2.0) (2026-11-05)


###   BREAKING CHANGES

* **kcconfigs/biome:** requires Biome 2.6.0 or newer. Extend presets as @kcconfigs/biome/configs/<name> instead of @kcconfigs/biome or @kcconfigs/biome/<name>.
* **deps-dev:** requires vitest ^5.0.0 (and vite as its peer dependency).
* **kcconfigs/vitest:** test reports move from reports/test-results and reports/coverage to .vitest/.
* **kcconfigs/vitest:** requires vitest ^5.0.0 (and vite as its peer dependency).
* **kcconfigs/vitest:** Require Node.js 22 or newer.
* **kcconfigs/vitest:** update fs mock and paths as well as export mock*

### Features

* **kcconfigs/biome:** publish presets through a Biome manifest ([56d882b](https://github.com/kc-workspace/kcws/commit/56d882bc43e081ec9dc8c4b341ae870d16337765))
* **kcconfigs/vitest:** add plugin infrastructure ([0377376](https://github.com/kc-workspace/kcws/commit/037737640b30face0560429474160ad2003147fe))
* **kcconfigs/vitest:** add replace mode to coverage plugin ([f98bbe4](https://github.com/kc-workspace/kcws/commit/f98bbe4232549e381babb0037bfd37757fb95494))
* **kcconfigs/vitest:** add tsPathsPlugin for tsconfig paths resolution ([c1af818](https://github.com/kc-workspace/kcws/commit/c1af818c64f862e2048831372615a2fcee5c125d))
* **kcconfigs/vitest:** exclude benchmark files from default coverage ([9bab9fc](https://github.com/kc-workspace/kcws/commit/9bab9fc072fe027ecf78db0554351e2c64168eed))
* **kcconfigs/vitest:** export plugin entrypoints ([7adb9b9](https://github.com/kc-workspace/kcws/commit/7adb9b952080cab3071227b3184a4ea903a65e67))
* **kcconfigs/vitest:** require Vitest 5 ([62be68f](https://github.com/kc-workspace/kcws/commit/62be68f6162dd3570da59b810354de518b045e2f))
* **kcconfigs/vitest:** support explicit root projects ([373f1be](https://github.com/kc-workspace/kcws/commit/373f1be40fc384ecaed7f7d57bb82194207bc419))
* **kcconfigs/vitest:** write reports to Vitest 5 .vitest directory ([628a23f](https://github.com/kc-workspace/kcws/commit/628a23f547429ef4383a022245fc0413ef32e3b9))


### Performance Improvements

* **deps-dev:** bump @biomejs/biome from 2.5.15 to 2.6.2 ([169a69d](https://github.com/kc-workspace/kcws/commit/169a69df4a9259db4bb83b9b15c3d02d57f987ad))
* **deps-dev:** bump @biomejs/biome from 2.5.6 to 2.5.7 ([#205](https://github.com/kc-workspace/kcws/issues/205)) ([025fbd5](https://github.com/kc-workspace/kcws/commit/025fbd552f6166290dabbbc9a30fb91b5c819ffa))
* **deps-dev:** bump @biomejs/biome from 2.5.7 to 2.5.11 ([#227](https://github.com/kc-workspace/kcws/issues/227)) ([25dcfae](https://github.com/kc-workspace/kcws/commit/25dcfae79543746f01a39a2d8463643d2d662926))
* **deps-dev:** bump biome, vitest, tsdown and dev tooling ([b396c8c](https://github.com/kc-workspace/kcws/commit/b396c8c4d500142b6ee41d8d993f7a6aa9a0bdda))
* **deps:** bump @biomejs/biome from 2.4.15 to 2.5.3 ([#171](https://github.com/kc-workspace/kcws/issues/171)) ([97638f0](https://github.com/kc-workspace/kcws/commit/97638f01c158a1a55c620edf1126480e314e783d))
* **deps:** bump memfs ([56d2219](https://github.com/kc-workspace/kcws/commit/56d22196d0ec787878f698d3050969698178e1d7))
* **deps:** bump memfs from 4.64.0 to 4.68.0 in the vitest group across 1 directory ([#203](https://github.com/kc-workspace/kcws/issues/203)) ([af8503a](https://github.com/kc-workspace/kcws/commit/af8503af1b0ff8d16d2c3b4d30ae75b2061c7315))
* **deps:** bump memfs from 4.68.2 to 4.79.0 in the vitest group across 1 directory ([#254](https://github.com/kc-workspace/kcws/issues/254)) ([0b9814b](https://github.com/kc-workspace/kcws/commit/0b9814b3724d3d2b9126255d07b191847d3d282e))
* **deps:** bump memfs from 4.79.0 to 4.80.0 in the vitest group across 1 directory ([#264](https://github.com/kc-workspace/kcws/issues/264)) ([56d2219](https://github.com/kc-workspace/kcws/commit/56d22196d0ec787878f698d3050969698178e1d7))
* **deps:** bump memfs in the vitest group across 1 directory ([af8503a](https://github.com/kc-workspace/kcws/commit/af8503af1b0ff8d16d2c3b4d30ae75b2061c7315))
* **deps:** bump the vitest group across 1 directory with 3 updates ([#188](https://github.com/kc-workspace/kcws/issues/188)) ([9159e1b](https://github.com/kc-workspace/kcws/commit/9159e1b1b9e192ee93b1528a45b8d4f13b2c35bd))
* **deps:** bump the vitest group across 1 directory with 4 updates ([#219](https://github.com/kc-workspace/kcws/issues/219)) ([9f02e3e](https://github.com/kc-workspace/kcws/commit/9f02e3e8c28d3f6353d10f9e0b067963e4ca5abd))
* **deps:** upgrade biome from 2.5.3 to 2.5.6 ([dc5e4ef](https://github.com/kc-workspace/kcws/commit/dc5e4efb2a521538f7bb27be922390a4ed67d53c))
* **kcconfigs/vitest:** export mergeConfig(base, ...overrides) instead of built-in that support only single override ([431e313](https://github.com/kc-workspace/kcws/commit/431e31398eea581ccae90fd386351bd24ea852f9))
* **kcconfigs/vitest:** update fs mock and paths as well as export mock* ([0836522](https://github.com/kc-workspace/kcws/commit/083652287f7bf824714d4837eb51cbe870978cfa))


### Bugfixes

* **kcconfigs/vitest:** load built config so package tests can run ([cd3add0](https://github.com/kc-workspace/kcws/commit/cd3add061a0e7b71080de5657062da4484a87658))
* **kcconfigs/vitest:** remove unused files whitelist in package.json ([b00e754](https://github.com/kc-workspace/kcws/commit/b00e7547fe73c24fe7ff46ed0e3f372e37297d95))
* **kcconfigs/vitest:** when import plugins from `@kcconfigs/vitest/plugins`, mock file didn't load correctly ([2a6c1f7](https://github.com/kc-workspace/kcws/commit/2a6c1f76c15181ab6d8456b99bed3948c08c0e62))


### Documentation

* **kcconfigs/vitest:** add tsdoc to expose utils and readme ([0bc2e30](https://github.com/kc-workspace/kcws/commit/0bc2e30aec59ffc16200e7f17c6b3fcc5617b951))
* **kcconfigs/vitest:** refresh docs ([be4880a](https://github.com/kc-workspace/kcws/commit/be4880af5d329e2be3680db37daa7acdca3871bf))


### Code Refactoring

* change scripts from `:check` to `check:*` ([e904cd2](https://github.com/kc-workspace/kcws/commit/e904cd268f9935c784a9693b1ec12dd60f5e5fa3))
* **kcconfigs/vitest:** drop clearMocks now default in Vitest 5 ([8e362b2](https://github.com/kc-workspace/kcws/commit/8e362b2e804a92cbcc291239bbc768d67e72aeab))
* **kcconfigs/vitest:** drop redundant fallback when spreading test config ([d104487](https://github.com/kc-workspace/kcws/commit/d104487cff19dc75ac136405b3d49680a4da5aa9))
* **kcconfigs/vitest:** drop unneeded async in fs mock factory ([82c3e8e](https://github.com/kc-workspace/kcws/commit/82c3e8ee58822e48038e9be84d16fd08c0546b51))
* **kcconfigs/vitest:** drop unneeded async in fs/promises mock factory ([794f424](https://github.com/kc-workspace/kcws/commit/794f424edd7b71bce2f4de1045fec71c04275177))
* **kcconfigs/vitest:** migrate to sync config-builder APIs ([2e154b0](https://github.com/kc-workspace/kcws/commit/2e154b0ff8f1493c95e96d3a8ab9e11a344dfca5))
* **kcconfigs/vitest:** rename models directory to types ([5210aa2](https://github.com/kc-workspace/kcws/commit/5210aa2964dd88e469931c5046081dfdc363d757))
* **kcconfigs/vitest:** replace define utils with plugin-based API ([50b03e4](https://github.com/kc-workspace/kcws/commit/50b03e47c3aef298fd2778cb60d9eb2c421d5b97))
* **kcconfigs/vitest:** restructure constants into directory ([c63d675](https://github.com/kc-workspace/kcws/commit/c63d67510c87d71619f1f6e3a56c9df24dae020d))
* **kcconfigs/vitest:** restructure models into directory ([15353c8](https://github.com/kc-workspace/kcws/commit/15353c8d6bf6dc5829ab0328d1908252143a9ac6))
* **kcconfigs/vitest:** scope default coverage include to src ([1ee0d3b](https://github.com/kc-workspace/kcws/commit/1ee0d3b18b31328b07cca597cff5a1c7b1a991d2))
* **kcconfigs/vitest:** update public API and add config-builder dependency ([8882933](https://github.com/kc-workspace/kcws/commit/8882933daf1237e59b622c33f883ffd329515ded))
* **kcconfigs/vitest:** use local mergeConfig utility ([a6eecc1](https://github.com/kc-workspace/kcws/commit/a6eecc1f1500e1f894be5c06140f3540a06fa7b7))
* use barrel import for plugins and remove empty defineConfig option ([9474fd0](https://github.com/kc-workspace/kcws/commit/9474fd0c9668bad18d259a49ac0c727f21112642))


### Miscellaneous Chores

* **deps-dev:** migrate to Vitest 5 ([#253](https://github.com/kc-workspace/kcws/issues/253)) ([d443847](https://github.com/kc-workspace/kcws/commit/d443847eb69177469110f0da19cb9ada8fad8f18))
* **kcconfigs/vitest:** force update v0.1.2-beta.9 =&gt; v0.2.0 ([fbab386](https://github.com/kc-workspace/kcws/commit/fbab38668d9f63d6b73a0ab7f32496ea29a2c04b))
* **kcconfigs/vitest:** require Node 22 ([0fceec3](https://github.com/kc-workspace/kcws/commit/0fceec32d5457ad54928fd3e9215c198202b1ee1))


### Dependencies

* The following workspace dependencies were updated
  * dependencies
    * @kcinternals/config-builder bumped to 0.5.0
  * devDependencies
    * @kcconfigs/biome bumped to 4.1.0
    * @kcconfigs/tsconfig bumped to 3.0.1
    * @kcconfigs/tsdown bumped to 0.6.0
    * @kctypes/generic bumped to 3.0.1
</details>

<details><summary>@kcinternals/config-builder: 0.5.0</summary>

## [0.5.0](https://github.com/kc-workspace/kcws/compare/@kcinternals/config-builder+v0.4.0...@kcinternals/config-builder+v0.5.0) (2026-11-05)


###   BREAKING CHANGES

* **kcconfigs/biome:** requires Biome 2.6.0 or newer. Extend presets as @kcconfigs/biome/configs/<name> instead of @kcconfigs/biome or @kcconfigs/biome/<name>.
* **deps-dev:** requires vitest ^5.0.0 (and vite as its peer dependency).
* **kcinternals/config-builder:** Require Node.js 22 or newer.
* **kcinternals/config-builder:** defineConfig, definePlugin and ConfigPlugin are removed; use the Sync or Async variants.
* **kcinternals/config-builder:** replace ConfigPlugin.priority with settingPriority and configPriority.
* **kcinternals/config-builder:** replace plugin.apply(baseConfig) with optional applySetting(setting) and applyConfig(config) hooks in ConfigPlugin.

### Features

* **kcconfigs/biome:** publish presets through a Biome manifest ([56d882b](https://github.com/kc-workspace/kcws/commit/56d882bc43e081ec9dc8c4b341ae870d16337765))
* **kcinternals/config-builder:** add base config wrapper ([447333d](https://github.com/kc-workspace/kcws/commit/447333d20c54c02c823061155eefe19feb4a5c2f))
* **kcinternals/config-builder:** add withEnabled utility ([cf6a19c](https://github.com/kc-workspace/kcws/commit/cf6a19c61d2eb1ebd559786403a441a24aaf7cf6))
* **kcinternals/config-builder:** refactor definePlugin api ([3e68cec](https://github.com/kc-workspace/kcws/commit/3e68cec1fb6338e2807be84aed5c75d6161ed42f))
* **kcinternals/config-builder:** split define APIs into sync and async variants ([16bf1e5](https://github.com/kc-workspace/kcws/commit/16bf1e56edaeb8fc053c52d476230442a37a54e1))
* **kcinternals/config-builder:** split plugin apply hooks ([7b2532a](https://github.com/kc-workspace/kcws/commit/7b2532a539cbc1d5874adf15d45191de279f0611))
* **kcinternals/config-builder:** split plugin priorities ([f1fb222](https://github.com/kc-workspace/kcws/commit/f1fb22251760ceec8731ebb68cac4fbdd72f93db))
* **kcinternals/config-builder:** split setting and config apply phases ([3f1edce](https://github.com/kc-workspace/kcws/commit/3f1edce1d12497f7cf8a1774805e43a88b56bcf3))


### Performance Improvements

* **deps-dev:** bump @biomejs/biome from 2.5.15 to 2.6.2 ([169a69d](https://github.com/kc-workspace/kcws/commit/169a69df4a9259db4bb83b9b15c3d02d57f987ad))
* **deps-dev:** bump @biomejs/biome from 2.5.6 to 2.5.7 ([#205](https://github.com/kc-workspace/kcws/issues/205)) ([025fbd5](https://github.com/kc-workspace/kcws/commit/025fbd552f6166290dabbbc9a30fb91b5c819ffa))
* **deps-dev:** bump @biomejs/biome from 2.5.7 to 2.5.11 ([#227](https://github.com/kc-workspace/kcws/issues/227)) ([25dcfae](https://github.com/kc-workspace/kcws/commit/25dcfae79543746f01a39a2d8463643d2d662926))
* **deps-dev:** bump biome, vitest, tsdown and dev tooling ([b396c8c](https://github.com/kc-workspace/kcws/commit/b396c8c4d500142b6ee41d8d993f7a6aa9a0bdda))
* **deps:** bump @biomejs/biome from 2.4.15 to 2.5.3 ([#171](https://github.com/kc-workspace/kcws/issues/171)) ([97638f0](https://github.com/kc-workspace/kcws/commit/97638f01c158a1a55c620edf1126480e314e783d))
* **deps:** bump the vitest group across 1 directory with 3 updates ([#188](https://github.com/kc-workspace/kcws/issues/188)) ([9159e1b](https://github.com/kc-workspace/kcws/commit/9159e1b1b9e192ee93b1528a45b8d4f13b2c35bd))
* **deps:** bump the vitest group across 1 directory with 4 updates ([#219](https://github.com/kc-workspace/kcws/issues/219)) ([9f02e3e](https://github.com/kc-workspace/kcws/commit/9f02e3e8c28d3f6353d10f9e0b067963e4ca5abd))
* **deps:** upgrade biome from 2.5.3 to 2.5.6 ([dc5e4ef](https://github.com/kc-workspace/kcws/commit/dc5e4efb2a521538f7bb27be922390a4ed67d53c))
* **kcinternals/config-builder:** export withEnabled for WithEnabled helpers ([fbe2b58](https://github.com/kc-workspace/kcws/commit/fbe2b58820633ab076e8568542e37c0fb59a98d1))


### Bugfixes

* **kcinternals/config-builder:** improve undefined applySetting and applyConfig in plugin better ([422b803](https://github.com/kc-workspace/kcws/commit/422b80345e7e97f3da74bfc69f57d0104cc4beb4))
* **kcinternals/config-builder:** use toSorted to avoid mutating plugins array ([2c1ee0a](https://github.com/kc-workspace/kcws/commit/2c1ee0a7f70a245ac30e4a237a933fb00c2b3fa6))


### Documentation

* **kcinternals/config-builder:** replace hard tabs with spaces in README examples ([82a7850](https://github.com/kc-workspace/kcws/commit/82a78505a1994ebe60a819f7c1d69f12c05a147f))


### Code Refactoring

* change scripts from `:check` to `check:*` ([e904cd2](https://github.com/kc-workspace/kcws/commit/e904cd268f9935c784a9693b1ec12dd60f5e5fa3))
* **kcinternals/config-builder:** drop clearMocks now default in Vitest 5 ([7649e92](https://github.com/kc-workspace/kcws/commit/7649e923a7c83398d73bdf8b6ffe25afe1718e23))
* **kcinternals/config-builder:** extract debug logger helpers ([695a28d](https://github.com/kc-workspace/kcws/commit/695a28d921ac0017192b8f75cab3e9d4cecd39bd))
* **kcinternals/config-builder:** remove redundant PluginPriority type alias ([9c7dc40](https://github.com/kc-workspace/kcws/commit/9c7dc400f8a6125164c654d7562d387c13984465))
* **kcinternals/config-builder:** rename models to types ([953851d](https://github.com/kc-workspace/kcws/commit/953851d988188dcfd41ca23896d9389033d0c8a2))
* **kcinternals/config-builder:** simplify defineConfig pipeline ([f53542f](https://github.com/kc-workspace/kcws/commit/f53542fb5a1f9c091708982928962443580d41c7))


### Miscellaneous Chores

* **deps-dev:** migrate to Vitest 5 ([#253](https://github.com/kc-workspace/kcws/issues/253)) ([d443847](https://github.com/kc-workspace/kcws/commit/d443847eb69177469110f0da19cb9ada8fad8f18))
* **kcinternals/config-builder:** require Node 22 ([5cbca76](https://github.com/kc-workspace/kcws/commit/5cbca760888d4416707070c6c1de5b0460ef28a8))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 4.1.0
    * @kcconfigs/tsconfig bumped to 3.0.1
</details>

<details><summary>@kcstyles/reset.css: 2.0.5</summary>

## [2.0.5](https://github.com/kc-workspace/kcws/compare/@kcstyles/reset.css+v2.0.4...@kcstyles/reset.css+v2.0.5) (2026-11-05)


### Performance Improvements

* **deps-dev:** bump biome, vitest, tsdown and dev tooling ([b396c8c](https://github.com/kc-workspace/kcws/commit/b396c8c4d500142b6ee41d8d993f7a6aa9a0bdda))


### Documentation

* add blank lines around markdown lists ([af84f16](https://github.com/kc-workspace/kcws/commit/af84f167a4e9545d480c20097953c7b5f4663d77))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/tsconfig bumped to 3.0.1
    * @kcconfigs/tsdown bumped to 0.6.0
</details>

<details><summary>@kctools/bun-server: 0.2.0</summary>

## [0.2.0](https://github.com/kc-workspace/kcws/compare/@kctools/bun-server+v0.5.0...@kctools/bun-server+v0.2.0) (2026-11-05)


###   BREAKING CHANGES

* **kcconfigs/biome:** requires Biome 2.6.0 or newer. Extend presets as @kcconfigs/biome/configs/<name> instead of @kcconfigs/biome or @kcconfigs/biome/<name>.
* **deps-dev:** requires vitest ^5.0.0 (and vite as its peer dependency).
* **kctools/bun-server:** Require Node.js 22 or newer.
* **kctools/bun-server:** `Program` is no longer exported from the package root; `setup` is the only export. Import it from `#core/program` when the class itself is needed.
* **kctools/bun-server:** build no longer bundles Tailwind CSS unconditionally. Declare the plugin in bunfig.toml to keep it:

### Features

* **kcconfigs/biome:** publish presets through a Biome manifest ([56d882b](https://github.com/kc-workspace/kcws/commit/56d882bc43e081ec9dc8c4b341ae870d16337765))
* **kctools/bun-server:** add --clean flag to build command ([#257](https://github.com/kc-workspace/kcws/issues/257)) ([bf43c80](https://github.com/kc-workspace/kcws/commit/bf43c80885137e97f467c91dd2b60e0ce375625b))
* **kctools/bun-server:** add --environment option to build command ([a158bf8](https://github.com/kc-workspace/kcws/commit/a158bf81c21174b638ce733de2edf087d4c358a1))
* **kctools/bun-server:** add --mode={spa,mpa} and preview command ([#235](https://github.com/kc-workspace/kcws/issues/235)) ([2b7cc54](https://github.com/kc-workspace/kcws/commit/2b7cc5452693a941808f1775637071a61c1433ab))
* **kctools/bun-server:** add env readers and pino based logger ([9526804](https://github.com/kc-workspace/kcws/commit/952680481630338ffde8986b8748ddccf0b420dc))
* **kctools/bun-server:** copy and serve static files with --statics ([#241](https://github.com/kc-workspace/kcws/issues/241)) ([47db522](https://github.com/kc-workspace/kcws/commit/47db5222ba0f974a6ba521bcccf6aa3fb0aa3922))
* **kctools/bun-server:** load bundler plugins from bunfig.toml ([#240](https://github.com/kc-workspace/kcws/issues/240)) ([977c874](https://github.com/kc-workspace/kcws/commit/977c874bbdd234863513cde66df5322046dcc8f1))
* **kctools/bun-server:** report built files, sizes, and duration ([0add500](https://github.com/kc-workspace/kcws/commit/0add500d210c2d4fbcdc46a81e7e03b781ca40bf))


### Performance Improvements

* **core:** deprecate @kctools/bun-*, and use @kctools/bun-server instead ([b369475](https://github.com/kc-workspace/kcws/commit/b3694757cfd2cfee40fc05416483133f31ee3534))
* **deps-dev:** bump @biomejs/biome from 2.5.15 to 2.6.2 ([169a69d](https://github.com/kc-workspace/kcws/commit/169a69df4a9259db4bb83b9b15c3d02d57f987ad))
* **deps-dev:** bump @biomejs/biome from 2.5.7 to 2.5.11 ([#227](https://github.com/kc-workspace/kcws/issues/227)) ([25dcfae](https://github.com/kc-workspace/kcws/commit/25dcfae79543746f01a39a2d8463643d2d662926))
* **deps-dev:** bump biome, vitest, tsdown and dev tooling ([b396c8c](https://github.com/kc-workspace/kcws/commit/b396c8c4d500142b6ee41d8d993f7a6aa9a0bdda))
* **deps:** bump @types/bun from 1.4.2 to 1.4.3 ([#274](https://github.com/kc-workspace/kcws/issues/274)) ([e33537a](https://github.com/kc-workspace/kcws/commit/e33537a54e04099ce4b4c51a3ff6e2e2c3ccaf32))
* **kctools/bun-server:** add debug log show how many static files and routes after transform ([4a1aa17](https://github.com/kc-workspace/kcws/commit/4a1aa170d3ca37ba2a1379c34acf0bea0e67700d))
* **kctools/bun-server:** create route specs concurrently ([0877461](https://github.com/kc-workspace/kcws/commit/08774611236579cbb4139e5482508ae98b2244b5))
* **kctools/bun-server:** load bunfig plugins concurrently ([7b6d925](https://github.com/kc-workspace/kcws/commit/7b6d92572872a8110a7d4b990824139d21522294))
* **kctools/bun-server:** load dev route bundles concurrently ([17c7c71](https://github.com/kc-workspace/kcws/commit/17c7c71ec7468b3cfa2fbb2e9c037500b0d33746))
* **kctools/bun-server:** resolve route specs concurrently ([8bcb920](https://github.com/kc-workspace/kcws/commit/8bcb92006ad3a9dfeb9304dc40c8d51a5c5e345a))
* **kctools/bun-server:** resolve static specs concurrently ([3223b42](https://github.com/kc-workspace/kcws/commit/3223b4232ebfff4a31ca9eeb1c45f128630c21eb))
* **kctools/bun-server:** split static paths concurrently ([677bc5a](https://github.com/kc-workspace/kcws/commit/677bc5a5614d463cb5eef196b3757e5961877454))


### Bugfixes

* **kctools/bun-server:** allow disabling next port with --no-next-port ([c1f3f6f](https://github.com/kc-workspace/kcws/commit/c1f3f6f1bf4ddc18fd83efa4ff3429660f48eefc))
* **kctools/bun-server:** preserve build date env ([6dda797](https://github.com/kc-workspace/kcws/commit/6dda797e4a3569ddd4109ac18952dca2521e4ef5))
* **kctools/bun-server:** preview should use different port than dev ([e44a892](https://github.com/kc-workspace/kcws/commit/e44a892e4fb768b1b0706359ef20896c67d7ae83))
* **kctools/bun-server:** satisfy the copy-paste and prose linters ([#236](https://github.com/kc-workspace/kcws/issues/236)) ([88129f0](https://github.com/kc-workspace/kcws/commit/88129f005b96a453f5a3c6c78eda85eb50a0023e))
* **kctools/bun-server:** serve html routes as bundles in dev ([b4ba66b](https://github.com/kc-workspace/kcws/commit/b4ba66b9bd628a6408f78bf0392691663acb4a77))
* **kctools/bun-server:** this package only work on bun runtime ([d4bd51a](https://github.com/kc-workspace/kcws/commit/d4bd51a365824f089d45c94189b73026b222a09e))
* **kctools/bun-server:** update @types/bun version to match with kcconfigs/tsconfig ([458cff0](https://github.com/kc-workspace/kcws/commit/458cff0c1f1515f2a1fc71b223073b22aec1bb90))
* minify flag with no- ([63bc34a](https://github.com/kc-workspace/kcws/commit/63bc34a99c121479da5d1582012214666e7347e4))


### Documentation

* **kctools/bun-server:** avoid sentence starting with "There is" ([15a6d22](https://github.com/kc-workspace/kcws/commit/15a6d221c4f51ae442b5d3db19585deb20ca1123))
* **kctools/bun-server:** reword NODE_ENV option without inline wording ([dc65685](https://github.com/kc-workspace/kcws/commit/dc65685ab1b8889ee50793a19dc93cb9188c5738))
* **kctools/bun-server:** rewrite README to match current commands ([c381b1e](https://github.com/kc-workspace/kcws/commit/c381b1e21351563d415a8a6c4fcac866c5c5d8de))
* **kctools/bun-server:** update readme toc and fix doc styles ([ff5b0a0](https://github.com/kc-workspace/kcws/commit/ff5b0a0f3eadd242feec10e3a9cf911aa4f4bee7))


### Code Refactoring

* **kctools/bun-server:** add shared types and constants modules ([00e9450](https://github.com/kc-workspace/kcws/commit/00e9450190284f454a14c86b17885a032f452c38))
* **kctools/bun-server:** drop unneeded async in preview action ([b4e395d](https://github.com/kc-workspace/kcws/commit/b4e395d2d4247a25df0cb4f3df738fed48563c77))
* **kctools/bun-server:** mark program private fields readonly ([713864a](https://github.com/kc-workspace/kcws/commit/713864a1c26863ba788dcbfdbc0a793dbe318e5b))
* **kctools/bun-server:** move commands into feature directories ([65e2c48](https://github.com/kc-workspace/kcws/commit/65e2c489346aea09ef41a69e62a92e6ca738540c))
* **kctools/bun-server:** move Program into core and drop legacy modules ([cbbd2d3](https://github.com/kc-workspace/kcws/commit/cbbd2d3c27fe93555607a9087668da47824c3ffe))
* **kctools/bun-server:** split build report into report module ([145b972](https://github.com/kc-workspace/kcws/commit/145b972f46d1396577c36ea67a938bf07e36622f))
* **kctools/bun-server:** split bunfig plugin loading into plugin module ([f4fc21f](https://github.com/kc-workspace/kcws/commit/f4fc21ff895ffc4f6c7792469b2930458650f9f6))
* **kctools/bun-server:** split path, option and url helpers ([da61f02](https://github.com/kc-workspace/kcws/commit/da61f026ce8649cf82af77a577673a1eaf3f3208))
* **kctools/bun-server:** split route resolution into routeFiles ([f96f033](https://github.com/kc-workspace/kcws/commit/f96f033359f10369ec9e849bd0ae9ce11c9fbfb9))
* **kctools/bun-server:** split server startup into server module ([dce2a83](https://github.com/kc-workspace/kcws/commit/dce2a8339b3d890d249dabd4924f98e303eaa24b))
* **kctools/bun-server:** split static handling into staticFiles ([3595dd7](https://github.com/kc-workspace/kcws/commit/3595dd7a12dc4a50d4b34f47263f32640aac6db8))
* **kctools/bun-server:** use object spread for server config ([181e243](https://github.com/kc-workspace/kcws/commit/181e243764d22c00decc99316fe279570b89b1cf))


### Miscellaneous Chores

* **deps-dev:** migrate to Vitest 5 ([#253](https://github.com/kc-workspace/kcws/issues/253)) ([d443847](https://github.com/kc-workspace/kcws/commit/d443847eb69177469110f0da19cb9ada8fad8f18))
* **kctools/bun-server:** force update v0.1.1 =&gt; v0.2.0 ([9cf04ff](https://github.com/kc-workspace/kcws/commit/9cf04ff5c5bd8880b26f413de3e6c9b5594ddc7b))
* **kctools/bun-server:** require Node 22 ([af668c2](https://github.com/kc-workspace/kcws/commit/af668c286ecdb0a80eafa2dc5369634392150404))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 4.1.0
    * @kcconfigs/tsconfig bumped to 3.0.1
    * @kcconfigs/tsdown bumped to 0.6.0
    * @kcconfigs/vitest bumped to 0.2.0
</details>

<details><summary>@kctypes/generic: 3.0.1</summary>

## [3.0.1](https://github.com/kc-workspace/kcws/compare/@kctypes/generic+v3.0.0...@kctypes/generic+v3.0.1) (2026-11-05)


### Performance Improvements

* **deps-dev:** bump biome, vitest, tsdown and dev tooling ([b396c8c](https://github.com/kc-workspace/kcws/commit/b396c8c4d500142b6ee41d8d993f7a6aa9a0bdda))
</details>

<details><summary>@kctypes/package_json: 3.0.1</summary>

## [3.0.1](https://github.com/kc-workspace/kcws/compare/@kctypes/package_json+v3.0.0...@kctypes/package_json+v3.0.1) (2026-11-05)


### Performance Improvements

* **deps-dev:** bump biome, vitest, tsdown and dev tooling ([b396c8c](https://github.com/kc-workspace/kcws/commit/b396c8c4d500142b6ee41d8d993f7a6aa9a0bdda))
</details>

<details><summary>@kcws/actkits: 0.4.0</summary>

## [0.4.0](https://github.com/kc-workspace/kcws/compare/@kcws/actkits+v0.3.0...@kcws/actkits+v0.4.0) (2026-11-05)


###   BREAKING CHANGES

* **kcconfigs/biome:** requires Biome 2.6.0 or newer. Extend presets as @kcconfigs/biome/configs/<name> instead of @kcconfigs/biome or @kcconfigs/biome/<name>.
* **deps-dev:** requires vitest ^5.0.0 (and vite as its peer dependency).
* **kcws/actkits:** Require Node.js 22 or newer.

### Features

* **kcconfigs/biome:** publish presets through a Biome manifest ([56d882b](https://github.com/kc-workspace/kcws/commit/56d882bc43e081ec9dc8c4b341ae870d16337765))
* **kcws/actkits:** add json/yaml string and file ztypes ([bae7726](https://github.com/kc-workspace/kcws/commit/bae77266f34b25077777f2f83bb93c9ccd00a784))


### Performance Improvements

* **deps-dev:** bump @biomejs/biome from 2.5.15 to 2.6.2 ([169a69d](https://github.com/kc-workspace/kcws/commit/169a69df4a9259db4bb83b9b15c3d02d57f987ad))
* **deps-dev:** bump @biomejs/biome from 2.5.6 to 2.5.7 ([#205](https://github.com/kc-workspace/kcws/issues/205)) ([025fbd5](https://github.com/kc-workspace/kcws/commit/025fbd552f6166290dabbbc9a30fb91b5c819ffa))
* **deps-dev:** bump @biomejs/biome from 2.5.7 to 2.5.11 ([#227](https://github.com/kc-workspace/kcws/issues/227)) ([25dcfae](https://github.com/kc-workspace/kcws/commit/25dcfae79543746f01a39a2d8463643d2d662926))
* **deps-dev:** bump biome, vitest, tsdown and dev tooling ([b396c8c](https://github.com/kc-workspace/kcws/commit/b396c8c4d500142b6ee41d8d993f7a6aa9a0bdda))
* **deps:** bump @biomejs/biome from 2.4.15 to 2.5.3 ([#171](https://github.com/kc-workspace/kcws/issues/171)) ([97638f0](https://github.com/kc-workspace/kcws/commit/97638f01c158a1a55c620edf1126480e314e783d))
* **deps:** bump the commitlint group across 1 directory with 4 updates ([#168](https://github.com/kc-workspace/kcws/issues/168)) ([68ce0be](https://github.com/kc-workspace/kcws/commit/68ce0be74f6d1d450b52dade886d04ff3885c6c8))
* **deps:** bump the vitest group across 1 directory with 3 updates ([#188](https://github.com/kc-workspace/kcws/issues/188)) ([9159e1b](https://github.com/kc-workspace/kcws/commit/9159e1b1b9e192ee93b1528a45b8d4f13b2c35bd))
* **deps:** bump the vitest group across 1 directory with 4 updates ([#219](https://github.com/kc-workspace/kcws/issues/219)) ([9f02e3e](https://github.com/kc-workspace/kcws/commit/9f02e3e8c28d3f6353d10f9e0b067963e4ca5abd))
* **deps:** bump zod from 4.3.6 to 4.4.3 ([#172](https://github.com/kc-workspace/kcws/issues/172)) ([19c3c99](https://github.com/kc-workspace/kcws/commit/19c3c99e52b1dfc16ee108a51232d11c2e24bf96))
* **deps:** bump zod from 4.4.3 to 4.6.5 ([#255](https://github.com/kc-workspace/kcws/issues/255)) ([aeee6fe](https://github.com/kc-workspace/kcws/commit/aeee6fefd47d4b4a4cc9d14da5db58b1c8bed34e))
* **deps:** bump zod from 4.6.5 to 4.6.7 ([#277](https://github.com/kc-workspace/kcws/issues/277)) ([20d6a9b](https://github.com/kc-workspace/kcws/commit/20d6a9b905776af29beca0f45fca7ee8e4ee3a5e))
* **deps:** upgrade biome from 2.5.3 to 2.5.6 ([dc5e4ef](https://github.com/kc-workspace/kcws/commit/dc5e4efb2a521538f7bb27be922390a4ed67d53c))


### Bugfixes

* **kcws/actkits:** refine parseInput env precedence ([0f0abdf](https://github.com/kc-workspace/kcws/commit/0f0abdfe3d616f85b29bcbd584774088edef66f2))


### Documentation

* **kcws/actkits:** add README ([fd3030b](https://github.com/kc-workspace/kcws/commit/fd3030b0eea1aa851e70352f143ae6994dd33bbc))


### Code Refactoring

* change scripts from `:check` to `check:*` ([e904cd2](https://github.com/kc-workspace/kcws/commit/e904cd268f9935c784a9693b1ec12dd60f5e5fa3))
* **kcws/actkits:** pass Number directly to map in zNumberArray ([cf7f83f](https://github.com/kc-workspace/kcws/commit/cf7f83ffb8ffc534c9937f8d31b12867ac0b80d5))
* **kcws/actkits:** replace createFileObjectParser with createObjectParser in zJsonFile and zYamlFile ([bc8e067](https://github.com/kc-workspace/kcws/commit/bc8e06711ee14d18e055ef46238618f305c782a7))
* use barrel import for plugins and remove empty defineConfig option ([9474fd0](https://github.com/kc-workspace/kcws/commit/9474fd0c9668bad18d259a49ac0c727f21112642))


### Miscellaneous Chores

* **deps-dev:** migrate to Vitest 5 ([#253](https://github.com/kc-workspace/kcws/issues/253)) ([d443847](https://github.com/kc-workspace/kcws/commit/d443847eb69177469110f0da19cb9ada8fad8f18))
* **kcws/actkits:** require Node 22 ([3743028](https://github.com/kc-workspace/kcws/commit/3743028cd657884fa81e84748796feb97eb6f28e))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 4.1.0
    * @kcconfigs/tsconfig bumped to 3.0.1
    * @kcconfigs/tsdown bumped to 0.6.0
    * @kcconfigs/vitest bumped to 0.2.0
</details>

<details><summary>@kcws/zconfig: 0.2.0</summary>

## [0.2.0](https://github.com/kc-workspace/kcws/compare/@kcws/zconfig+v0.4.0...@kcws/zconfig+v0.2.0) (2026-11-05)


###   BREAKING CHANGES

* **kcconfigs/biome:** requires Biome 2.6.0 or newer. Extend presets as @kcconfigs/biome/configs/<name> instead of @kcconfigs/biome or @kcconfigs/biome/<name>.
* **deps-dev:** requires vitest ^5.0.0 (and vite as its peer dependency).
* **kcws/zconfig:** Require Node.js 22 or newer.

### Features

* **kcconfigs/biome:** publish presets through a Biome manifest ([56d882b](https://github.com/kc-workspace/kcws/commit/56d882bc43e081ec9dc8c4b341ae870d16337765))
* **kcws/zconfig:** add auto config adapter ([7eb1586](https://github.com/kc-workspace/kcws/commit/7eb1586a7ad2efc6fdff7480a3e7f9f243f89401))
* **kcws/zconfig:** add configuration adapters ([fc51f6b](https://github.com/kc-workspace/kcws/commit/fc51f6be34847853831874391e2ce965afb18f3e))
* **kcws/zconfig:** add content and stream adapters ([#262](https://github.com/kc-workspace/kcws/issues/262)) ([a35afcc](https://github.com/kc-workspace/kcws/commit/a35afcc763ac6605cfebeea3373506d626cb5eaa))
* **kcws/zconfig:** add initial zconfig package ([911e3a9](https://github.com/kc-workspace/kcws/commit/911e3a9e745fb4b9fd4367a2a21264817cc4e70b))
* **kcws/zconfig:** document config source adapters ([078b0c7](https://github.com/kc-workspace/kcws/commit/078b0c717a0d2cd02d9521d0289e1b91d941485e))
* **kcws/zconfig:** implement core engine with merge, transform and validation ([6db4056](https://github.com/kc-workspace/kcws/commit/6db40569f56ab138d516524853733e140d30c7ef))
* **kcws/zconfig:** load dotenv files by default ([d85acdd](https://github.com/kc-workspace/kcws/commit/d85acddaa96f100ce8cd193e6c704cd65493a60e))
* **kcws/zconfig:** scaffold package foundation with errors and lazy loader ([1850940](https://github.com/kc-workspace/kcws/commit/18509401ee14ce6826b7fd10870bd44dafe3a9ff))
* **kcws/zconfig:** split env and dotenv config adapters ([049ab1f](https://github.com/kc-workspace/kcws/commit/049ab1f1e30e6e0039f76df56d3ad8d363f3c36f))


### Performance Improvements

* **deps-dev:** bump @biomejs/biome from 2.5.15 to 2.6.2 ([169a69d](https://github.com/kc-workspace/kcws/commit/169a69df4a9259db4bb83b9b15c3d02d57f987ad))
* **deps-dev:** bump @biomejs/biome from 2.5.6 to 2.5.7 ([#205](https://github.com/kc-workspace/kcws/issues/205)) ([025fbd5](https://github.com/kc-workspace/kcws/commit/025fbd552f6166290dabbbc9a30fb91b5c819ffa))
* **deps-dev:** bump @biomejs/biome from 2.5.7 to 2.5.11 ([#227](https://github.com/kc-workspace/kcws/issues/227)) ([25dcfae](https://github.com/kc-workspace/kcws/commit/25dcfae79543746f01a39a2d8463643d2d662926))
* **deps-dev:** bump biome, vitest, tsdown and dev tooling ([b396c8c](https://github.com/kc-workspace/kcws/commit/b396c8c4d500142b6ee41d8d993f7a6aa9a0bdda))
* **deps-dev:** bump dotenv from 18.0.6 to 18.0.8 ([#273](https://github.com/kc-workspace/kcws/issues/273)) ([8079857](https://github.com/kc-workspace/kcws/commit/8079857713ba9a2016ecf7d02a40ff0f6ef10a38))
* **deps-dev:** bump smol-toml from 1.9.0 to 1.9.1 ([#270](https://github.com/kc-workspace/kcws/issues/270)) ([a5c8c1c](https://github.com/kc-workspace/kcws/commit/a5c8c1c8fc074c4d54fb4de154ef3fcf34a6cfc7))
* **deps:** bump the vitest group across 1 directory with 4 updates ([#219](https://github.com/kc-workspace/kcws/issues/219)) ([9f02e3e](https://github.com/kc-workspace/kcws/commit/9f02e3e8c28d3f6353d10f9e0b067963e4ca5abd))
* **deps:** bump zod from 4.4.3 to 4.6.5 ([#255](https://github.com/kc-workspace/kcws/issues/255)) ([aeee6fe](https://github.com/kc-workspace/kcws/commit/aeee6fefd47d4b4a4cc9d14da5db58b1c8bed34e))
* **deps:** bump zod from 4.6.5 to 4.6.7 ([#277](https://github.com/kc-workspace/kcws/issues/277)) ([20d6a9b](https://github.com/kc-workspace/kcws/commit/20d6a9b905776af29beca0f45fca7ee8e4ee3a5e))
* **deps:** upgrade biome from 2.5.3 to 2.5.6 ([dc5e4ef](https://github.com/kc-workspace/kcws/commit/dc5e4efb2a521538f7bb27be922390a4ed67d53c))
* **kcws/zconfig:** add autoAdapter and getAutoFiles to `@kcws/zconfig/adapters` ns ([5e37832](https://github.com/kc-workspace/kcws/commit/5e37832c9abc19d207edd7009bdeeb18559f53ee))
* **kcws/zconfig:** design how kcws/zconfig should look like ([7c956d3](https://github.com/kc-workspace/kcws/commit/7c956d3e4d48b6495f6d212e7d3d740b2c9a3145))
* **kcws/zconfig:** disable debug plugin on tsdown ([f043bb5](https://github.com/kc-workspace/kcws/commit/f043bb57a7980b945a00dac35c0089889e136901))
* **kcws/zconfig:** loadConfig and loadConfigSync have define adapters when not define ([6d02f13](https://github.com/kc-workspace/kcws/commit/6d02f130a3a2c676d9214aead1f5c2f26bd4686a))
* **kcws/zconfig:** minor improvement and docs ([1e25358](https://github.com/kc-workspace/kcws/commit/1e25358c032073db8533fdbe4fd79b77c4fcb795))
* **kcws/zconfig:** update use*Adapters to use auto adapters instead ([bda371a](https://github.com/kc-workspace/kcws/commit/bda371a7a161b865fa7e5e367114a80c4e0235c7))
* **kcws/zconfig:** use [name].config.[ext] instead of just [name].[ext] when finding config file ([3d012de](https://github.com/kc-workspace/kcws/commit/3d012de70d7814a8b29f56de3043a4b4fa1faedd))
* **kcws/zconfig:** use*Adapters now enable jsonc auto when config extension is .jsonc ([f6be330](https://github.com/kc-workspace/kcws/commit/f6be33067d46cecdce06b113801ca497bc9576d7))


### Bugfixes

* **kcws/zconfig:** add jscpd ignore comments ([96b5ea3](https://github.com/kc-workspace/kcws/commit/96b5ea3251410ed00b0b105b53cd010dcf926861))
* **kcws/zconfig:** add jscpd ignore comments to adapter and loadConfig files ([ef24136](https://github.com/kc-workspace/kcws/commit/ef24136502d78e9865098fee0991738af060d24c))
* **kcws/zconfig:** load JSONC parser correctly ([329a512](https://github.com/kc-workspace/kcws/commit/329a5120bc1f02f6cfc76d2a2756f800dbeb1910))
* **kcws/zconfig:** update default value of optional in FileAdapterOptions to true ([8c27fad](https://github.com/kc-workspace/kcws/commit/8c27fadeb0bc914755f1be8224b8104c95dc9f44))
* **kcws/zconfig:** wrong adapter name when throw error ([5a14569](https://github.com/kc-workspace/kcws/commit/5a145697faee2928a81aabd4f114ed70184c23bb))


### Documentation

* **kcws/zconfig:** add design spec for zconfig package ([3db98bf](https://github.com/kc-workspace/kcws/commit/3db98bfa4e8e65ab507a266bcc9ea8e615cc0be3))
* **kcws/zconfig:** add public API TSDoc ([bd59952](https://github.com/kc-workspace/kcws/commit/bd599523b10d63387f677035fa0e278dc64e4201))
* **kcws/zconfig:** document adapter implementation ([36ac0da](https://github.com/kc-workspace/kcws/commit/36ac0da5c35c425e85fae6c4255bffd84a1f6141))
* **kcws/zconfig:** fix markdownlint errors in design spec ([11164c5](https://github.com/kc-workspace/kcws/commit/11164c5402c799fd1d70a0d37724d15d89add185))
* **kcws/zconfig:** fix typo ([c5d5d94](https://github.com/kc-workspace/kcws/commit/c5d5d940c0b0fd2cc5b4f9e09861b9695c6c6c3b))
* **kcws/zconfig:** fix typo ([18a38a5](https://github.com/kc-workspace/kcws/commit/18a38a58b1c3fba93c1a1572d075a6378a91ee6d))
* **kcws/zconfig:** remove tab from readme and use spacebar instead ([7c5d466](https://github.com/kc-workspace/kcws/commit/7c5d466a83831ee5ee2abbad72bf0fce3e5f89db))


### Code Refactoring

* **kcws/zconfig:** finalize core module layout ([86546c3](https://github.com/kc-workspace/kcws/commit/86546c3662beac8d0e8ff0de5b59544f738e7ae9))
* **kcws/zconfig:** reduce complex string template ([e35dbae](https://github.com/kc-workspace/kcws/commit/e35dbaeb766feabdb4c0d9a81cc95a575a1c083c))
* **kcws/zconfig:** remove redundant default export syntax on adapters ([70ca20e](https://github.com/kc-workspace/kcws/commit/70ca20edabb596f149b8403da78cc5aa8e89d6a5))
* **kcws/zconfig:** restructure config adapters ([66f5dba](https://github.com/kc-workspace/kcws/commit/66f5dba34c0c51775aa6fc63c52ac89a593e569b))
* **kcws/zconfig:** return Promise.resolve in env adapter load ([ee023bb](https://github.com/kc-workspace/kcws/commit/ee023bbb222ab7580fe879802a7e96497bbe0d50))
* **kcws/zconfig:** return Promise.resolve in static adapter load ([0d43ce7](https://github.com/kc-workspace/kcws/commit/0d43ce73eae00a98d9ad1408fa2ffee49a57546c))
* **kcws/zconfig:** share env utilities ([899a9a8](https://github.com/kc-workspace/kcws/commit/899a9a895138bcfea7238c29addab9938f5f4aaa))
* **kcws/zconfig:** simplify logic in decodeEnvKey function ([d1cb8ff](https://github.com/kc-workspace/kcws/commit/d1cb8ff1690243f1cc2c8bf7fc63a5d8ed62100e))
* **kcws/zconfig:** split utility modules ([c5f8abc](https://github.com/kc-workspace/kcws/commit/c5f8abc4510c4841381b1beb6a7479b76400c764))
* **kcws/zconfig:** use package import aliases ([10bf53e](https://github.com/kc-workspace/kcws/commit/10bf53e8bc71a4836243d8e9ea538ecd8c43f6a5))
* **kcws/zconfig:** use shorthand character classes in env key regex ([e22d334](https://github.com/kc-workspace/kcws/commit/e22d334aefb623dc42644cc919f1d080ee50dcd0))


### Miscellaneous Chores

* **deps-dev:** migrate to Vitest 5 ([#253](https://github.com/kc-workspace/kcws/issues/253)) ([d443847](https://github.com/kc-workspace/kcws/commit/d443847eb69177469110f0da19cb9ada8fad8f18))
* **kcws/zconfig:** force update v0.1.0-beta.11 =&gt; v0.2.0 ([8b303dd](https://github.com/kc-workspace/kcws/commit/8b303dd21c64c9060c39dfd6342f228e35394f83))
* **kcws/zconfig:** require Node 22 ([29cc46e](https://github.com/kc-workspace/kcws/commit/29cc46e74617cd9ebf2eb354dff14f0f433ef7eb))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 4.1.0
    * @kcconfigs/tsconfig bumped to 3.0.1
    * @kcconfigs/tsdown bumped to 0.6.0
    * @kcconfigs/vitest bumped to 0.2.0
</details>

---
This PR was generated with [Release Please](https://github.com/googleapis/release-please). See [documentation](https://github.com/googleapis/release-please#release-please).