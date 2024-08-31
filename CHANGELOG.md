# Changelog

## [11.0.2]

### Bug Fixes (from 11.0.0)
* Fix choice disable state wasn't considered when showing the "no choices to choose from" notice
* Fix regression "no choices to choose from" notice not triggering when no selectable choices exist for select-one. [#1185](https://github.com/Choices-js/Choices/issues/1185)
* Fix regression where webpack doesn't permit importing scss/css [#1184](https://github.com/Choices-js/Choices/issues/1184)

### Chore
* Add e2e tests for "no choices" behavior to match v10

## [11.0.1] (2024-08-30)

### Bug Fixes (from 11.0.0)
* Fix the rendered item list was not cleared when `clearStore` was called. This impacted the on-form-reset and `refresh` features.

### Chore
* Add e2e test for 'form reset' and 'on paste & search'.
* Cleanup adding classes to generated elements.

## [11.0.0] (2024-08-28)

### ⚠ BREAKING CHANGES
* Update polyfills to include `Element.prototype.replaceChildren`
* Number of internal APIs have changed

### Bug Fixes (from 10.2.0)
* Reduce work done for `unhighlightAll` during on-click handler (batching in v11.0.0-rc8 would also have helped) [#522](https://github.com/Choices-js/Choices/issues/522) [#599](https://github.com/Choices-js/Choices/issues/599)
* Improve performance when rendering very large number of items and choices. Stuttering when stopping searching or selecting an item still happens depending on device and number of choices.

## [11.0.0-rc8] (2024-08-23)

### ⚠ BREAKING CHANGES
* Trigger a search event (with empty value and 0 resultCount) when search stops

### Features
* `searchResultLimit` can be set to `-1` for no limit of search results to display.

### Bug Fixes (from 10.2.0)
* Fix edge case where aria-label could be added twice
* Fix the page scrolls when you press 'space' on a single select input #1103
* Update typescript definition for `removeActiveItems` to explicitly mark `excludedId` as optional #1116

### Chore
* Reduce the number of loops over choices when rendering search results, results in more compact code.
* Byte shave bundle sizes down

## [11.0.0-rc7] (2024-08-19)

### ⚠ BREAKING CHANGES
* Improve consistency of the `choice` event firing. `choice` event now occurs after the `addItem` event
* `enter` key now consistently opens/closes the dropdown instead of the behavior varying depending on backing element or internal state of the highlighted choice

### Features
* Add `closeDropdownOnSelect` option, controls how the dropdown is close after selection is made. [#636](https://github.com/Choices-js/Choices/issues/636) [#973](https://github.com/Choices-js/Choices/issues/873) [#1012](https://github.com/Choices-js/Choices/issues/1012)
* Allow choices.js to be imported on nodejs, useful for tests and also server side rendering. As windows.document is by default not defined, the default template rendering will not function. The `callbackOnCreateTemplates` callback must be used. [#861](https://github.com/Choices-js/Choices/issues/861)

### Bug Fixes (from 10.2.0)
* Improve various `[aria-*]` attribute handling for better lighthouse accessibility scores [#1169](https://github.com/Choices-js/Choices/issues/1169)
* Improve contrast on default CSS by darkening primary item selection color [#924](https://github.com/Choices-js/Choices/issues/924)

### Bug Fixes (from 11.0.0RC6)
* Fix destroy&init of `choices.js` would lost track of data from the backing `<input>`/`<select>`
* Update e2e tests

### Bug Fixes (from 11.0.0RC1)
* Fix various `select-one` bugs related to how `<select>` initializes and selected values do not match the configured `choices.js`
* Fix legacy `placeholder` attribute support for `select-one`
* Fix `data-value` attribute on choices may not be correctly rendered into html

### Chore
* Switch e2e tests from `puppeteer`/`selenium`/`cypress` to `playwright`
* Restructure end-to-end tests so html/script blocks are co-located to improve debugability
* Enable `@typescript-eslint/explicit-function-return-type` eslint rule

## [11.0.0-rc6] (2024-08-12)

### ⚠ BREAKING CHANGES
* Mutation APIs `setChoiceByValue`/`setChoices`/`setValue` now throw an error if the Choices instance was not initialized or multiple choices instances where initialized on the same element. Prevents bad internal states from triggering unexpected errors [#1129](https://github.com/Choices-js/Choices/issues/1129)

### Features
* Improve performance of search/filtering with large number of choices.

### Bug Fixes (from 10.2.0)
* Fix Choices does not accept an element from an iframe [#1057](https://github.com/Choices-js/Choices/issues/1057)
* Fix Choices was not disable in a `<fieldset disabled>` [#1132](https://github.com/Choices-js/Choices/issues/1132)
* Fix `silent` option does not silence warnings about unknown options [#1119](https://github.com/Choices-js/Choices/issues/1119)
* Fix documentation that suggests duplicateItemsAllowed works with select-multiple, when it only works for text. [#1123](https://github.com/Choices-js/Choices/issues/1123)
* Fix quadratic algorithm complexity (aka O(N^2) ) when filtering/search choices.
* Fix search results could be unexpectedly unstable, and that `fuseOptions.sortFn` was effectively ignored [#1106](https://github.com/Choices-js/Choices/issues/1106)

### Bug Fixes (from 11.0.0RC1)
* Fix possible empty `aria-label` generation on remove item button
* Fix `clearChoices()` did not remove the actual selection options

## [11.0.0-rc5] (2024-08-08)

### ⚠ BREAKING CHANGES
* Update to using Fuse.js v7.0.0
* Update choices.js package to be an ES module, and use '[subpath exports](https://nodejs.org/api/packages.html#subpath-exports)' to expose multiple versions (UMD, CJS or MTS bundles).
* Provide "fuse full" (default `choices.js`, ~20.36KB), or "fuse basic" (`choices.search-basic.js` ~19.31KB) or "prefix filter" (`choices.search-filter.js` ~15.27KB) based on how much Fuse.js is included.

### Bug Fixes (from 10.2.0)
* Fix `select-one` placeholder could ignore the non-option placeholder configuration
* Remove typescript types for tests from distribution

### Chore
* Reduce bundle size from ~24KB to ~20.36KB
* Switch bundler from `webpack` to `rollup`
* Switch test framework from `mocha` to `vitest`

### Bug Fixes (from 11.0.0RC4)
* Fix `aria-describedby` was being assigned when it shouldn't be
* Fix check to ensure search was fully enabled for multiple select mode, as this functionality is hard-coded enabled elsewhere in the code base.

## [11.0.0 RC3] (2024-08-04)

### ⚠ BREAKING CHANGES
* For `select-one` and `select-multiple`, the placeholder value is pulled from `config.placeholderValue="..."` or `<select data-placeholder="...">` before attempting to extract a placeholder from the options list. [#912](https://github.com/Choices-js/Choices/issues/912) [#567](https://github.com/Choices-js/Choices/issues/567) [#843](https://github.com/Choices-js/Choices/issues/843)

### Bug Fixes (from 10.2.0)
* Fix search did not trigger to copy&paste events [#860](https://github.com/Choices-js/Choices/issues/860) [#174](https://github.com/Choices-js/Choices/issues/174)

### Chore
* Update defaults for classnames to be arrays instead of strings

### Bug Fixes (from 11.0.0 RC1)
* Fix `noResults`/`noChoices` classes could not be set to a list of classes
* Fix failing to add an item would close the dropdown
* Fix invalid css selectors being generated for configurable css class-names with multiple css classes for an element
* Fix "Press Enter to add..." would not render if the dropdown had partially matching search results
* Fix render limit would allow `select-one` to select multiple items

## [11.0.0 RC2] (2024-08-03)

### Bug Fixes (from 10.2.0)
* Avoid pushing a search to fuse.js which is just additional whitespace to the existing search term

### Bug Fixes (from 11.0.0 RC1)
* Fix error when using backspace key after adding an item and then removing it
* Fix adding items for select boxes would not give the max item messages reliably
* Fix `destroy()`/`init()` would not load choices from the underlying `<select>` as expected
* Fix adding user provided choices for `select-one` would not remove the existing item and result in a select-one with multiple items set.

### Chore
* Remove unused code
* Use constant enum instead of repeating strings and type information
* For test html pages, prevent a failing `fetch()` from breaking the rest of the examples
* Tweak `_render()` loop to avoid duplicating has-changed checks

## [11.0.0 RC1] (2024-08-02)

### ⚠ BREAKING CHANGES

* `allowHtml` now defaults to false.
* HTML escaping of choice/item labels should no longer double escape depending on allowHTML mode.
* Templates/text functions now escape `'` characters for display.
* `addItemText`/`uniqueItemText`/`customAddItemText` are now called with the `value` argument already escaped.
* Typescript classes for input data vs internal working data have been adjusted resulting in the `Choice`/`Group`/`Item` typescript classes have been renamed, and aliases left as required.

### Features

* `config.classNames` now accept arrays to support multiple classes. [#1121](https://github.com/Choices-js/Choices/issues/1121) [#1074](https://github.com/Choices-js/Choices/issues/1074) [#907](https://github.com/Choices-js/Choices/issues/907) [#832](https://github.com/Choices-js/Choices/issues/832)
* The original option list for the select is not destroyed, and all loaded choices are serialised to HTML for better compatibility with external javascript. [#1053](https://github.com/Choices-js/Choices/issues/1053) [#1023](https://github.com/Choices-js/Choices/issues/1023)
* New `singleModeForMultiSelect` feature to treat a `select-single` as if it was a `select-multiple` with a max item count of `1`, and still auto-close the dropdown and swap the active item on selection. [#1136](https://github.com/Choices-js/Choices/issues/1136) [#904](https://github.com/Choices-js/Choices/issues/904)
* `Remove item text` can be localized.
* Allow user-created choices for selects. [#1117](https://github.com/Choices-js/Choices/issues/1117) [#1114](https://github.com/Choices-js/Choices/issues/1114)
    * User input is escaped by default. At the risk of XSS attacks this can be disabled by `allowHtmlUserInput`.
* Render options without a group even if groups are present. [#615](https://github.com/Choices-js/Choices/issues/615) [#1110](https://github.com/Choices-js/Choices/issues/1110)
* Read `data-labelclass`/`data-label-description` from `<option>` HTML to drive adding a per-choice CSS label and description text when `allowHtml: false`.
* Add `removeItemButtonAlignLeft` option, to control if the remove item button is at the start or the end of the item.
* Add `removeChoice` method. Removes the choice from the `choices.js` object and any backing `<option>` HTML element
* Add `refresh` method. Reloads choices from the backing `<select>`s options.
* Improve rendering performance by batching changes.
* `escapeForTemplate` function is passed to the 2nd method of the `callbackOnCreateTemplates` callback.
* When `allowHtml` is false, default templates now render escaped html to `innerHtml` writing to `innerText`.
    * This provides consistent rendering performance as `innerText` is quirky and slower than escaped html into `innerHtml`
* Shadow DOM support [#938](https://github.com/Choices-js/Choices/pull/938)

### Bug Fixes

* Replace malicious polyfill with cdnjs. [#1161](https://github.com/Choices-js/Choices/issues/1161)
* Maintain groups in search mode. [#1152](https://github.com/Choices-js/Choices/issues/1152)
* Fix various "first press" bugs on single select dropdowns. [#1104](https://github.com/Choices-js/Choices/issues/1104)
* Fix 'esc' would close the dropdown and also apply to the container resulting in an overlay/modal unexpectedly closing. [#1039](https://github.com/Choices-js/Choices/issues/1039)
* Fix form reset would clear the choices list, but not clear the search bar. [#1023](https://github.com/Choices-js/Choices/issues/1023)
* Fix options would be disabled when choices.js was intialized on a disabled `<select>` element. [#1025](https://github.com/Choices-js/Choices/issues/1025)
* Fix a `search_term` element to appear in form submit data. [#1049](https://github.com/Choices-js/Choices/issues/1049)
* Fix 'remove item' button would trigger the change event twice due to placeholder value being used (match html single-select). [#892](https://github.com/Choices-js/Choices/issues/892)
* Fix optgroups are not preserved when Choices is destroyed [#1055](https://github.com/Choices-js/Choices/issues/1055)
* Fix placeholder config option would be ignored for select boxes which have blank entries.
* Fix `data-custom-properties` attribute did not serialize to created elements as a json blob as expected. [#840](https://github.com/Choices-js/Choices/issues/840) [#1155](https://github.com/Choices-js/Choices/issues/1155) [#543](https://github.com/Choices-js/Choices/issues/543)
* Fix multi-select did not correctly resizing when a select option is selected on choices.js initialization.
* Fix clearInput function did not clear the last search.
* Fix `addItemFilter` would allow empty strings as input to be added for items.
* Fix various issues with double escaping when displaying items/choices depending on allowHTML mode.
* Fix `aria-label` for placeholders was set to the string `null`
* Fix `searchEnable` flag was not respected for `select-multiple` [#1042](https://github.com/Choices-js/Choices/issues/1042)
* Fix poor error message when Choices is passed a string selector which fails to find the element for Choices to attach to.

### Chore
* Remove `deepMerge` dependency.
