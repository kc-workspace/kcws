# Changelog

## [0.3.4](https://github.com/kc-workspace/kcws/compare/@kctools/bun-server+v0.3.3...@kctools/bun-server+v0.3.4) (2026-10-04)


### Features

* **kctools/bun-server:** add --environment option to build command ([a158bf8](https://github.com/kc-workspace/kcws/commit/a158bf81c21174b638ce733de2edf087d4c358a1))


### Performance Improvements

* **kctools/bun-server:** create route specs concurrently ([0877461](https://github.com/kc-workspace/kcws/commit/08774611236579cbb4139e5482508ae98b2244b5))
* **kctools/bun-server:** load bunfig plugins concurrently ([7b6d925](https://github.com/kc-workspace/kcws/commit/7b6d92572872a8110a7d4b990824139d21522294))
* **kctools/bun-server:** load dev route bundles concurrently ([17c7c71](https://github.com/kc-workspace/kcws/commit/17c7c71ec7468b3cfa2fbb2e9c037500b0d33746))
* **kctools/bun-server:** resolve route specs concurrently ([8bcb920](https://github.com/kc-workspace/kcws/commit/8bcb92006ad3a9dfeb9304dc40c8d51a5c5e345a))
* **kctools/bun-server:** resolve static specs concurrently ([3223b42](https://github.com/kc-workspace/kcws/commit/3223b4232ebfff4a31ca9eeb1c45f128630c21eb))
* **kctools/bun-server:** split static paths concurrently ([677bc5a](https://github.com/kc-workspace/kcws/commit/677bc5a5614d463cb5eef196b3757e5961877454))


### Documentation

* **kctools/bun-server:** reword NODE_ENV option without inline wording ([dc65685](https://github.com/kc-workspace/kcws/commit/dc65685ab1b8889ee50793a19dc93cb9188c5738))


### Code Refactoring

* **kctools/bun-server:** drop unneeded async in preview action ([b4e395d](https://github.com/kc-workspace/kcws/commit/b4e395d2d4247a25df0cb4f3df738fed48563c77))
* **kctools/bun-server:** mark program private fields readonly ([713864a](https://github.com/kc-workspace/kcws/commit/713864a1c26863ba788dcbfdbc0a793dbe318e5b))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/tsdown bumped to 0.3.1
    * @kcconfigs/vitest bumped to 0.3.5

## [0.3.3](https://github.com/kc-workspace/kcws/compare/@kctools/bun-server+v0.3.2...@kctools/bun-server+v0.3.3) (2026-10-02)


### Performance Improvements

* **kctools/bun-server:** add debug log show how many static files and routes after transform ([4a1aa17](https://github.com/kc-workspace/kcws/commit/4a1aa170d3ca37ba2a1379c34acf0bea0e67700d))


### Bugfixes

* **kctools/bun-server:** allow disabling next port with --no-next-port ([c1f3f6f](https://github.com/kc-workspace/kcws/commit/c1f3f6f1bf4ddc18fd83efa4ff3429660f48eefc))
* **kctools/bun-server:** this package only work on bun runtime ([d4bd51a](https://github.com/kc-workspace/kcws/commit/d4bd51a365824f089d45c94189b73026b222a09e))


### Documentation

* **kctools/bun-server:** avoid sentence starting with "There is" ([15a6d22](https://github.com/kc-workspace/kcws/commit/15a6d221c4f51ae442b5d3db19585deb20ca1123))
* **kctools/bun-server:** rewrite README to match current commands ([c381b1e](https://github.com/kc-workspace/kcws/commit/c381b1e21351563d415a8a6c4fcac866c5c5d8de))

## [0.3.2](https://github.com/kc-workspace/kcws/compare/@kctools/bun-server+v0.3.1...@kctools/bun-server+v0.3.2) (2026-09-20)


### Bugfixes

* **kctools/bun-server:** serve html routes as bundles in dev ([b4ba66b](https://github.com/kc-workspace/kcws/commit/b4ba66b9bd628a6408f78bf0392691663acb4a77))

## [0.3.1](https://github.com/kc-workspace/kcws/compare/@kctools/bun-server+v0.3.0...@kctools/bun-server+v0.3.1) (2026-09-18)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/tsdown bumped to 0.3.0
    * @kcconfigs/vitest bumped to 0.3.4

## [0.3.0](https://github.com/kc-workspace/kcws/compare/@kctools/bun-server+v0.2.1...@kctools/bun-server+v0.3.0) (2026-09-17)


### ⚠ BREAKING CHANGES

* **kctools/bun-server:** `Program` is no longer exported from the package root; `setup` is the only export. Import it from `#core/program` when the class itself is needed.
* **kctools/bun-server:** build no longer bundles Tailwind CSS unconditionally. Declare the plugin in bunfig.toml to keep it:

### Features

* **kctools/bun-server:** add env readers and pino based logger ([9526804](https://github.com/kc-workspace/kcws/commit/952680481630338ffde8986b8748ddccf0b420dc))
* **kctools/bun-server:** copy and serve static files with --statics ([#241](https://github.com/kc-workspace/kcws/issues/241)) ([47db522](https://github.com/kc-workspace/kcws/commit/47db5222ba0f974a6ba521bcccf6aa3fb0aa3922))
* **kctools/bun-server:** load bundler plugins from bunfig.toml ([#240](https://github.com/kc-workspace/kcws/issues/240)) ([977c874](https://github.com/kc-workspace/kcws/commit/977c874bbdd234863513cde66df5322046dcc8f1))


### Code Refactoring

* **kctools/bun-server:** add shared types and constants modules ([00e9450](https://github.com/kc-workspace/kcws/commit/00e9450190284f454a14c86b17885a032f452c38))
* **kctools/bun-server:** move commands into feature directories ([65e2c48](https://github.com/kc-workspace/kcws/commit/65e2c489346aea09ef41a69e62a92e6ca738540c))
* **kctools/bun-server:** move Program into core and drop legacy modules ([cbbd2d3](https://github.com/kc-workspace/kcws/commit/cbbd2d3c27fe93555607a9087668da47824c3ffe))
* **kctools/bun-server:** split build report into report module ([145b972](https://github.com/kc-workspace/kcws/commit/145b972f46d1396577c36ea67a938bf07e36622f))
* **kctools/bun-server:** split bunfig plugin loading into plugin module ([f4fc21f](https://github.com/kc-workspace/kcws/commit/f4fc21ff895ffc4f6c7792469b2930458650f9f6))
* **kctools/bun-server:** split path, option and url helpers ([da61f02](https://github.com/kc-workspace/kcws/commit/da61f026ce8649cf82af77a577673a1eaf3f3208))
* **kctools/bun-server:** split route resolution into routeFiles ([f96f033](https://github.com/kc-workspace/kcws/commit/f96f033359f10369ec9e849bd0ae9ce11c9fbfb9))
* **kctools/bun-server:** split server startup into server module ([dce2a83](https://github.com/kc-workspace/kcws/commit/dce2a8339b3d890d249dabd4924f98e303eaa24b))
* **kctools/bun-server:** split static handling into staticFiles ([3595dd7](https://github.com/kc-workspace/kcws/commit/3595dd7a12dc4a50d4b34f47263f32640aac6db8))

## [0.2.1](https://github.com/kc-workspace/kcws/compare/@kctools/bun-server+v0.2.0...@kctools/bun-server+v0.2.1) (2026-09-14)


### Bugfixes

* minify flag with no- ([63bc34a](https://github.com/kc-workspace/kcws/commit/63bc34a99c121479da5d1582012214666e7347e4))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 2.0.6
    * @kcconfigs/vitest bumped to 0.3.3
    * @kcconfigs/tsconfig bumped to 1.1.8
    * @kcconfigs/tsdown bumped to 0.2.11

## [0.2.0](https://github.com/kc-workspace/kcws/compare/@kctools/bun-server+v0.1.1...@kctools/bun-server+v0.2.0) (2026-09-14)


### Features

* **kctools/bun-server:** report built files, sizes, and duration ([0add500](https://github.com/kc-workspace/kcws/commit/0add500d210c2d4fbcdc46a81e7e03b781ca40bf))


### Bugfixes

* **kctools/bun-server:** preview should use different port than dev ([e44a892](https://github.com/kc-workspace/kcws/commit/e44a892e4fb768b1b0706359ef20896c67d7ae83))


### Documentation

* **kctools/bun-server:** update readme toc and fix doc styles ([ff5b0a0](https://github.com/kc-workspace/kcws/commit/ff5b0a0f3eadd242feec10e3a9cf911aa4f4bee7))


### Miscellaneous Chores

* **kctools/bun-server:** force update v0.1.1 =&gt; v0.2.0 ([9cf04ff](https://github.com/kc-workspace/kcws/commit/9cf04ff5c5bd8880b26f413de3e6c9b5594ddc7b))

## [0.1.1](https://github.com/kc-workspace/kcws/compare/@kctools/bun-server+v0.1.0...@kctools/bun-server+v0.1.1) (2026-09-14)


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/vitest bumped to 0.3.2
    * @kcconfigs/tsconfig bumped to 1.1.7
    * @kcconfigs/tsdown bumped to 0.2.10

## 0.1.0 (2026-09-14)


### Features

* **kctools/bun-server:** add --mode={spa,mpa} and preview command ([#235](https://github.com/kc-workspace/kcws/issues/235)) ([2b7cc54](https://github.com/kc-workspace/kcws/commit/2b7cc5452693a941808f1775637071a61c1433ab))


### Performance Improvements

* **core:** deprecate @kctools/bun-*, and use @kctools/bun-server instead ([b369475](https://github.com/kc-workspace/kcws/commit/b3694757cfd2cfee40fc05416483133f31ee3534))
* **deps-dev:** bump @biomejs/biome from 2.5.7 to 2.5.11 ([#227](https://github.com/kc-workspace/kcws/issues/227)) ([25dcfae](https://github.com/kc-workspace/kcws/commit/25dcfae79543746f01a39a2d8463643d2d662926))


### Bugfixes

* **kctools/bun-server:** satisfy the copy-paste and prose linters ([#236](https://github.com/kc-workspace/kcws/issues/236)) ([88129f0](https://github.com/kc-workspace/kcws/commit/88129f005b96a453f5a3c6c78eda85eb50a0023e))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/biome bumped to 2.0.5
    * @kcconfigs/vitest bumped to 0.3.1
    * @kcconfigs/tsconfig bumped to 1.1.6
    * @kcconfigs/tsdown bumped to 0.2.9
