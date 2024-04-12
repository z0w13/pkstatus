# Changelog

## [0.6.2](https://github.com/z0w13/pkstatus/compare/v0.6.1...v0.6.2) (2024-04-12)


### Bug Fixes

* **ui/update**: correctly enable update checks for desktop/mobile

## [0.6.1](https://github.com/z0w13/pkstatus/compare/v0.6.0...v0.6.1) (2024-04-12)


### Bug Fixes

* **ui:** don't show warning icon if we're not running a dev version
* **ui:** fix certain ui styling only working in dark mode

## [0.6.0](https://github.com/z0w13/pkstatus/compare/v0.5.2...v0.6.0) (2024-04-12)


### Features
* **ui:** added update notifications
* **ui:** turn top bar orange and show a warning icon when running a dev version

## [0.5.2](https://github.com/z0w13/pkstatus/compare/v0.5.1...v0.5.2) (2024-04-11)


### Bug Fixes
* **card/member:** don't show last message as 54 years ago if alter never sent a message
* **manage/add:** adding systems by discord id or uuid works again
* **switcher:** private system members show up again now
* **desktop:** project page opens in default browser now

## [0.5.1](https://github.com/z0w13/pkstatus/compare/v0.5.0...v0.5.1) (2024-04-10)


### Bug Fixes
* **status:** fronters/systems not updating due to caching issues

## [0.5.0](https://github.com/z0w13/pkstatus/compare/v0.4.3...v0.5.0) (2024-04-08)


### Features
* **internal:** rewrite caching to be more robust

## [0.4.3](https://github.com/z0w13/pkstatus/compare/v0.4.2...v0.4.3) (2024-04-06)


### Features

* **ui:** force light/dark mode by appending #dark or #light to url
* **status/table:** Option to show/hide avatars
* **status/table:** Option to switch between square/circle avatars
* **settings:** Give feedback when setting PluralKit token

### Bug Fixes

* **switch:** don't show loading graphic when token isn't set
* **lookup:** auto focus the id input
* **manage/add:** auto focus the id input

## [0.4.2](https://github.com/z0w13/pkstatus/compare/v0.4.1...v0.4.2) (2024-04-05)


### Bug Fixes

* **lookup:** don't accidentally track systems after looking them up
* **lookup:** show errors when we can't find or are not allowed to view a system/member

## [0.4.1](https://github.com/z0w13/pkstatus/compare/v0.4.0...v0.4.1) (2024-04-01)


### Bug Fixes

* **lookup:** fix search button not working
* **lookup/system:** handle private fronter/member lists

## [0.4.0](https://github.com/z0w13/pkstatus/compare/v0.4.0-dev165+sha.175282bb...v0.4.0) (2024-04-01)


### Features

* **ui:** added system and member lookup
* **status/table:** add toggle to force mobile UI
* **cards:** add button to view system
* **card/member:** show system member belongs to

### Bug Fixes

* **ui:** ensure initials on fallback avatars are always white

## [0.3.1](https://github.com/z0w13/pkstatus/compare/v0.3.0...v0.3.1) (2024-03-12)


### Bug Fixes

* **api:** show an error if a system no longer exists
* **api:** fix returning stale results
* **ui/switch:** sort members alphabetically
* **ui/switch:** fix sometimes not registering switches

## [0.3.0](https://github.com/z0w13/pkstatus/compare/v0.2.1...v0.3.0) (2024-03-11)


### Features

* **ui:** new UI for registering switches

## [0.2.1](https://github.com/z0w13/pkstatus/compare/v0.2.0...v0.2.1) (2024-03-11)


### Bug Fixes
* **ui:** give better feedback when options are saved
* **api:** more robustly handle calling the PluralKit API

## [0.2.0](https://github.com/z0w13/pkstatus/compare/v0.1.11...v0.2.0) (2024-03-07)


### Features

* **android:** We now have an Android version :)

## [0.1.11](https://github.com/z0w13/pkstatus/compare/v0.1.10...v0.1.11) (2024-03-04)


### Features

* **ui:** Added custom app icon

## [v0.1.10](https://github.com/z0w13/pkstatus/compare/v0.1.9...v0.1.10) (2024-03-04)


### Features

* **ui:** Improve display of names with pronouns removed
* **ui:** Add toggle for extracting pronouns from names

## [0.1.9](https://github.com/z0w13/pkstatus/compare/v0.1.8...v0.1.9) (2024-03-03)


### Bug Fixes

* **status/table:** Fix system description showing for alters on desktop

## [0.1.8](https://github.com/z0w13/pkstatus/compare/v0.1.7...v0.1.8) (2024-03-01)


### Features

* **status:** Scrollable descriptions for systems/alters on mobile
* **status:** Show pronouns on systems/alters
* **status/tile:** Improved UI with smaller tile sizes
* **manage:** Better avatar handling


### Bug Fixes

* **ui:** Fix fallback icons
* **ui:** Fix icon for broken images
* **ui:** Fix inconsistent text size on tiles
* **status/table:** Fix tooltip display

## [0.1.7](https://github.com/z0w13/pkstatus/compare/v0.1.6...v0.1.7) (2024-02-29)


### Features

* **status/list:** Added icon that shows system/alter description on hover
* **status/list:** Improved display of last switch/update
* **status/list:** Added toggle for square avatars
* **status/table:** Collapse fronters to a list on mobile
* **settings/systems:** Added separate page for adding systems with preview
* **settings/systems:** Systems list is now mobile-friendly
* **settings/general:** Reworked interval settings to use dropdowns instead


### Bug Fixes

* **sidebar:** Project page now correctly opens in new window
* **api/fronters:** Handle systems without switches correctly

## [0.1.6](https://github.com/z0w13/pkstatus/compare/v0.1.5...v0.1.6) (2024-02-28)


### Bug Fixes

* **api/fronters:** Handle bug in PKAPI that causes an error when a system has no registered switches

## [0.1.5](https://github.com/z0w13/pkstatus/compare/v0.1.4...v0.1.5) (2024-02-28)


### Features

* **status:** remember status layout
* **sidebar:** move dark mode toggle to bottom of sidebar
* **sidebar:** add link to project page

## [0.1.4](https://github.com/z0w13/pkstatus/compare/v0.1.3...v0.1.4) (2024-02-28)


### Features

* **status/table:** configurable position of table on page

## [0.1.3](https://github.com/z0w13/pkstatus/compare/v0.1.2...v0.1.3) (2024-02-28)


### Features

* **status/tile:** left align tiles
* **status/table:** make fronter column take up the full-width of the table

## [0.1.2](https://github.com/z0w13/pkstatus/compare/v0.1.1...v0.1.2) (2024-02-27)


### Bug Fixes

* Fixed fronter names sometimes displaying incorrectly

## [0.1.1](https://github.com/z0w13/pkstatus/compare/v0.1.0...v0.1.1) (2024-02-27)


### Features

* **build:** extra automation for release creation ([3fcd754](https://github.com/z0w13/pkstatus/commit/3fcd754348b68161b34903da0af79bb815538c84))
* **ui:** rework how different status views align on the page ([b38216c](https://github.com/z0w13/pkstatus/commit/b38216c4b3e92c8f96c54ef30f0a1edc13519bc8))


### Bug Fixes

* **ui:** also render filler cells in table view without fronter access ([77f76a4](https://github.com/z0w13/pkstatus/commit/77f76a4adf4fb91a758bcd561752f14656db0b08))
* **ui:** fix relative time display (for last switch/last updated) ([b50783a](https://github.com/z0w13/pkstatus/commit/b50783ae84f24bfcbbab814c48c32ee0f7c64125))
* **ui:** handle missing or unset avatars in table/list layout ([198369c](https://github.com/z0w13/pkstatus/commit/198369c696de673818d7d6560d835ac7bd73e94c))

## [0.1.0](https://github.com/z0w13/pkstatus/compare/v0.1.0-dev...v0.1.0) (2024-02-26)


### ⚠ BREAKING CHANGES

* implement system for data migrations


### Features

* implement system for data migrations ([e09e28e](https://github.com/z0w13/pkstatus/commit/e09e28e7c9f92066aca34268179fd5e2fa75f43b))
* **ui:** rework last switch/last update ui ([802c266](https://github.com/z0w13/pkstatus/commit/802c26664dbc42ce9f334d0e2c27319b8aeb4642))
* **ui:** show tooltips with system/fronter description in list/table view ([4088501](https://github.com/z0w13/pkstatus/commit/4088501c69097df3ec5d3329d6de098189908bcd))


### Bug Fixes

* **ui:** clearer (subjectively) icon for table view ([7e9d8bc](https://github.com/z0w13/pkstatus/commit/7e9d8bcdb34e446a2cb245a98cd0a8ce00eb235e))
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
