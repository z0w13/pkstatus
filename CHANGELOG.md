# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.1.0](https://github.com/z0w13/pkstatus/compare/v0.1.0-dev...v0.1.0) (2024-02-26)


### Features

* **ui:** show tooltips with system/fronter description in list/table view ([4088501](https://github.com/z0w13/pkstatus/commit/4088501c69097df3ec5d3329d6de098189908bcd))


### Bug Fixes

* **ui:** clearer (subjectively) icon for table view ([7e9d8bc](https://github.com/z0w13/pkstatus/commit/7e9d8bcdb34e446a2cb245a98cd0a8ce00eb235e))

## [0.1.0-dev](https://github.com/z0w13/pkstatus/compare/v0.0.8...v0.1.0-dev) (2024-02-25)


### ⚠ BREAKING CHANGES

* implement system for data migrations

### Features

* implement system for data migrations ([e09e28e](https://github.com/z0w13/pkstatus/commit/e09e28e7c9f92066aca34268179fd5e2fa75f43b))
* **ui:** rework last switch/last update ui ([802c266](https://github.com/z0w13/pkstatus/commit/802c26664dbc42ce9f334d0e2c27319b8aeb4642))


### Bug Fixes

* system data not being refreshed ([4776997](https://github.com/z0w13/pkstatus/commit/47769970b0f022fcbcce527dc1a5b1505b42f2f4))
* **ui:** hide empty alter descriptions in tile view ([6c0e068](https://github.com/z0w13/pkstatus/commit/6c0e068c7e09fe24f06c9d26b7d5e10b1839c887))
* **ui:** hide empty system descriptions in tile view ([8df3676](https://github.com/z0w13/pkstatus/commit/8df3676438b4597afd5cec3905f39712995430b8))
* **ui:** indent fronters in tile view ([8f86e87](https://github.com/z0w13/pkstatus/commit/8f86e8758ebd9cacfafe97ec6ca91dc9e2d07696))
* **ui:** show unknown when we can't access last switch ([fb15f4f](https://github.com/z0w13/pkstatus/commit/fb15f4f5d42e3fce3275024ad3f8a3efbb26aaaf))
* **ui:** tile settings, descriptionn -> description ([dcb5ae4](https://github.com/z0w13/pkstatus/commit/dcb5ae4da09d165d9323756d894b1c82908bff97))

## [0.0.8](https://github.com/z0w13/pkstatus/compare/v0.0.7...v0.0.8) (2024-02-23)


### Bug Fixes

* data updating logic ([f97ff1d](https://github.com/z0w13/pkstatus/commit/f97ff1dedd5f3fa02886bf6c2539ef5f6b768564))
* **packaging:** uploading artifacts ([16775a7](https://github.com/z0w13/pkstatus/commit/16775a788a191e76efc4647af6f3dad22e5e514d))



## [0.0.7](https://github.com/z0w13/pkstatus/compare/v0.0.6...v0.0.7) (2024-02-23)


### Bug Fixes

* set executable bit on package.sh ([c1e72a4](https://github.com/z0w13/pkstatus/commit/c1e72a491f11ff8028c12124ba8d395454250e87))
* **ui:** 'status' page always showed active in navigation ([96f60a6](https://github.com/z0w13/pkstatus/commit/96f60a6cdc8542209466d6119b0e284e9cdcd5b7))
* **ui:** input for new system should refer to System ID not systemRef ([05c2c36](https://github.com/z0w13/pkstatus/commit/05c2c364a0af9382cfa49c1988b2fd131fc88177))
* use system id from API when adding system, should be more robust ([1c990c0](https://github.com/z0w13/pkstatus/commit/1c990c010546dff96e248afb786c4a122e5d3795))


### Features

* configurable update intervals ([489c854](https://github.com/z0w13/pkstatus/commit/489c8549abb89dfe38e6af471c817c6f884f3596))
* set publicPath only for gh-pages build mode ([5189dc4](https://github.com/z0w13/pkstatus/commit/5189dc47bf38cb2892f37040b574c0eb3766543c))
* show last time a system switched ([d7b3634](https://github.com/z0w13/pkstatus/commit/d7b36341210632a6f26d8c093abfb5b193d4d50a))



## [0.0.6](https://github.com/z0w13/pkstatus/compare/v0.0.4...v0.0.6) (2024-02-23)


### Bug Fixes

* add missing import to TileLayout ([f00050e](https://github.com/z0w13/pkstatus/commit/f00050e621630fa99aa6fa4dbb969c048811891f))
* check for 403 error when fetching fronters otherwise rethrow ([c5a4cc4](https://github.com/z0w13/pkstatus/commit/c5a4cc4bd90327109f8cc41a87b0a6e6dc4e3bbc))
* correctly fallback to fronter 'name' instead of 'display_name' in tile view ([32fb85a](https://github.com/z0w13/pkstatus/commit/32fb85a8fb91db6e406c5060b4b5a6444505c2d0))
* remove unused property from SystemView ([62948af](https://github.com/z0w13/pkstatus/commit/62948afbd429ebfb7f6cd520fca9749fc20565f9))
* trim whitespace from ID input ([5f6d590](https://github.com/z0w13/pkstatus/commit/5f6d5903e0be9410e9faf0ccf661bee6302b75a3))



## [0.0.4](https://github.com/z0w13/pkstatus/compare/10c08b8f27a89adde7dadda17c9f98f510f8e820...v0.0.4) (2024-02-23)


### Bug Fixes

* use prettier for formatting .vue files ([ba261de](https://github.com/z0w13/pkstatus/commit/ba261de272f07378750022d3872f38cbbc4b9596))


### Features

* add type checking to quasar ([10c08b8](https://github.com/z0w13/pkstatus/commit/10c08b8f27a89adde7dadda17c9f98f510f8e820))
* **ui:** make card size configurable ([4b32d9d](https://github.com/z0w13/pkstatus/commit/4b32d9d869ef535801a860e1e827f4caff1cbe7c))
* **ui:** multiple views for the status page, and made settings persist ([117cbfb](https://github.com/z0w13/pkstatus/commit/117cbfb9ef5a1a0ac8ff67bf7c8ce7504d383dba))
* **ui:** remove color dot from system list ([6c1430a](https://github.com/z0w13/pkstatus/commit/6c1430af8a053a49dde11156350f67fc45ddd9b9))
* **ui:** rework settings UI ([80092c2](https://github.com/z0w13/pkstatus/commit/80092c2387096ea38b6f4608bc8cd63c80d8259d))
