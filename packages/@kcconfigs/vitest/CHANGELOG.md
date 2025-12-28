# Changelog

## 0.1.0-beta.0 (2025-12-28)


### Features

* **core:** move all packages into packages/* directory ([58230cd](https://github.com/kc-workspace/kcws/commit/58230cd286d0dea953d232806c91508ebfc57701))
* **kcconfigs/vitest:** add @kcconfigs/vitest/mocks for mocking data and add setupMocks() ([e81927a](https://github.com/kc-workspace/kcws/commit/e81927afa84e33bc280319d1b1e8ced1ca3bc569))
* **kcconfigs/vitest:** add source and typedoc conditions in exports ([2c9e1c3](https://github.com/kc-workspace/kcws/commit/2c9e1c3c046ab5798c51dead219bac2953233f07))


### Performance Improvements

* **kcconfigs/vitest:** automatically include all ts files in coverage report ([5e2cd8f](https://github.com/kc-workspace/kcws/commit/5e2cd8fd2dad10fc4fc8d5715e3da9b7cf7c8225))
* **kcconfigs/vitest:** only enabled junit and html for test and text, lcov, and html for coverage ([bf2ef9e](https://github.com/kc-workspace/kcws/commit/bf2ef9e16f6b9792b3a531a92b467c5120fa35d7))
* **kcconfigs/vitest:** use __mocks__ instead of mocks to ignore from coverage automatically ([9767ff2](https://github.com/kc-workspace/kcws/commit/9767ff20a6dd6dce68fd3bf54bccf502a709b2a1))


### Bugfixes

* homepage contains invalid url ([0ee37d6](https://github.com/kc-workspace/kcws/commit/0ee37d641fe5b04fb019099915c8aa3ddfed3be7))
* **kcconfigs/vitest:** remove unused dependencies from package.json file ([9c237d1](https://github.com/kc-workspace/kcws/commit/9c237d151240e466f3c43f3f03f6f013e0426bd5))
* **kcconfigs/vitest:** temporary ignore biome useLiteralKeys as it conflict with ts(4111) ([d186810](https://github.com/kc-workspace/kcws/commit/d1868101d2cdb1d865747a24be9d1fc08322b706))
* trigger re-release please ([65447a7](https://github.com/kc-workspace/kcws/commit/65447a776ed2f8638f6f35a4d00277d407143114))
* update all [@kcconfigs](https://github.com/kcconfigs) description so it trigger new deployment with new tag separator ([cf5be8c](https://github.com/kc-workspace/kcws/commit/cf5be8cc02fba8becb7e8f31fd6f3a741c0f0b95))


### Dependencies

* The following workspace dependencies were updated
  * devDependencies
    * @kcconfigs/tsconfig bumped to 0.1.0-beta.1
    * @kcconfigs/tsdown bumped to 0.1.0-beta.1
    * @kcconfigs/biome bumped to 0.1.1
