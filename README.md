# Choices.js [![Actions Status](https://github.com/jshjohnson/Choices/workflows/Build%20and%20test/badge.svg)](https://github.com/jshjohnson/Choices/actions) [![Actions Status](https://github.com/jshjohnson/Choices/workflows/Bundle%20size%20checks/badge.svg)](https://github.com/jshjohnson/Choices/actions) [![npm](https://img.shields.io/npm/v/choices.js.svg)](https://www.npmjs.com/package/choices.js)

A vanilla, lightweight (~20kb gzipped 🎉), configurable select box/text input plugin. Similar to Select2 and Selectize but without the jQuery dependency.

[Demo](https://choices-js.github.io/Choices/)

## TL;DR

- Lightweight
- No jQuery dependency
- Configurable sorting
- Flexible styling
- Fast search/filtering
- Clean API
- Right-to-left support
- Custom templates

---

### Interested in writing your own ES6 JavaScript plugins? Check out [ES6.io](https://ES6.io/friend/JOHNSON) for great tutorials! 💪🏼

### Sponsored by:

<p align="center">
  <a href="https://forums.sufficientvelocity.com/" target="_blank" rel="noopener noreferrer">
    <img src="https://forums.sufficientvelocity.com/data/assets/static_light_logo.svg" alt="Sufficient Velocity" width="310" height="108">
  </a>
</p>

<p align="center">
  <a href="https://wanderermaps.com/" target="_blank" rel="noopener noreferrer">
    <img src="https://cdn.shopify.com/s/files/1/0614/3357/7715/files/Logo_BlackWithBackground_200x.png?v=1644802773" alt="Wanderer Maps logo">
  </a>
</p>

---

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Terminology](#terminology)
- [Input Types](#input-types)
- [Configuration Options](#configuration-options)
- [Callbacks](#callbacks)
- [Events](#events)
- [Methods](#methods)
- [Development](#development)
- [License](#license)

## Installation

With [NPM](https://www.npmjs.com/package/choices.js):

```zsh
npm install choices.js
```

With [Yarn](https://yarnpkg.com/):

```zsh
yarn add choices.js
```

From a [CDN](https://www.jsdelivr.com/package/npm/choices.js):

**Note:** There is sometimes a delay before the latest version of Choices is reflected on the CDN.

```html
<!-- Include base CSS (optional) -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/base.min.css"
/>
<!-- Or versioned -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/choices.js@9.0.1/public/assets/styles/base.min.css"
/>

<!-- Include Choices CSS -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css"
/>
<!-- Or versioned -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/choices.js@9.0.1/public/assets/styles/choices.min.css"
/>

<!-- Include Choices JavaScript (latest) -->
<script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>
<!-- Or versioned -->
<script src="https://cdn.jsdelivr.net/npm/choices.js@9.0.1/public/assets/scripts/choices.min.js"></script>
```

Or include Choices directly:

```html
<!-- Include base CSS (optional) -->
<link rel="stylesheet" href="public/assets/styles/base.min.css" />
<!-- Include Choices CSS -->
<link rel="stylesheet" href="public/assets/styles/choices.min.css" />
<!-- Include Choices JavaScript -->
<script src="/public/assets/scripts/choices.min.js"></script>
```

### CSS/SCSS

The use of `import` of css/scss is supported from webpack.

In .scss:
```scss
@import "choices.js/src/styles/choices";
```

In .js/.ts:
```javascript
import "choices.js/public/assets/styles/choices.css";
```

## Setup

**Note:** If you pass a selector which targets multiple elements, the first matching element will be used. Versions prior to 8.x.x would return multiple Choices instances.

```js
  // Pass single element
  const element = document.querySelector('.js-choice');
  const choices = new Choices(element);

  // Pass reference
  const choices = new Choices('[data-trigger]');
  const choices = new Choices('.js-choice');

  // Pass jQuery element
  const choices = new Choices($('.js-choice')[0]);

  // Passing options (with default options)
  const choices = new Choices(element, {
    silent: false,
    items: [],
    choices: [],
    renderChoiceLimit: -1,
    maxItemCount: -1,
    closeDropdownOnSelect: 'auto',
    singleModeForMultiSelect: false,
    addChoices: false,
    addItems: true,
    addItemFilter: (value) => !!value && value !== '',
    removeItems: true,
    removeItemButton: false,
    removeItemButtonAlignLeft: false,
    editItems: false,
    allowHTML: false,
    allowHtmlUserInput: false,
    duplicateItemsAllowed: true,
    delimiter: ',',
    paste: true,
    searchEnabled: true,
    searchChoices: true,
    searchFloor: 1,
    searchResultLimit: 4,
    searchFields: ['label', 'value'],
    position: 'auto',
    resetScrollPosition: true,
    shouldSort: true,
    shouldSortItems: false,
    sorter: () => {...},
    shadowRoot: null,
    placeholder: true,
    placeholderValue: null,
    searchPlaceholderValue: null,
    prependValue: null,
    appendValue: null,
    renderSelectedChoices: 'auto',
    loadingText: 'Loading...',
    noResultsText: 'No results found',
    noChoicesText: 'No choices to choose from',
    itemSelectText: 'Press to select',
    uniqueItemText: 'Only unique values can be added',
    customAddItemText: 'Only values matching specific conditions can be added',
    addItemText: (value) => {
      return `Press Enter to add <b>"${value}"</b>`;
    },
    removeItemIconText: () => `Remove item`,
    removeItemLabelText: (value) => `Remove item: ${value}`,
    maxItemText: (maxItemCount) => {
      return `Only ${maxItemCount} values can be added`;
    },
    valueComparer: (value1, value2) => {
      return value1 === value2;
    },
    classNames: {
      containerOuter: ['choices'],
      containerInner: ['choices__inner'],
      input: ['choices__input'],
      inputCloned: ['choices__input--cloned'],
      list: ['choices__list'],
      listItems: ['choices__list--multiple'],
      listSingle: ['choices__list--single'],
      listDropdown: ['choices__list--dropdown'],
      item: ['choices__item'],
      itemSelectable: ['choices__item--selectable'],
      itemDisabled: ['choices__item--disabled'],
      itemChoice: ['choices__item--choice'],
      description: ['choices__description'],
      placeholder: ['choices__placeholder'],
      group: ['choices__group'],
      groupHeading: ['choices__heading'],
      button: ['choices__button'],
      activeState: ['is-active'],
      focusState: ['is-focused'],
      openState: ['is-open'],
      disabledState: ['is-disabled'],
      highlightedState: ['is-highlighted'],
      selectedState: ['is-selected'],
      flippedState: ['is-flipped'],
      loadingState: ['is-loading'],
      notice: ['choices__notice'],
      addChoice: ['choices__item--selectable', 'add-choice'],
      noResults: ['has-no-results'],
      noChoices: ['has-no-choices'],
    },
    // Choices uses the great Fuse library for searching. You
    // can find more options here: https://fusejs.io/api/options.html
    fuseOptions: {
      includeScore: true
    },
    labelId: '',
    callbackOnInit: null,
    callbackOnCreateTemplates: null,
    appendGroupInSearch: false,
  });
```

## Terminology

| Word   | Definition                                                                                                                                                                                                                                                                                                              |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Choice | A choice is a value a user can select. A choice would be equivalent to the `<option></option>` element within a select input.                                                                                                                                                                                           |
| Group  | A group is a collection of choices. A group should be seen as equivalent to a `<optgroup></optgroup>` element within a select input.                                                                                                                                                                                    |
| Item   | An item is an inputted value (text input) or a selected choice (select element). In the context of a select element, an item is equivalent to a selected option element: `<option value="Hello" selected></option>` whereas in the context of a text input an item is equivalent to `<input type="text" value="Hello">` |

## Input Types

Choices works with the following input types, referenced in the documentation as noted.

| HTML Element                                                                                           | Documentation "Input Type" |
| -------------------------------------------------------------------------------------------------------| -------------------------- |
| [`<input type="text">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)               | `text`                     |
| [`<select>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)                         | `select-one`               |
| [`<select multiple>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select#attr-multiple)  | `select-multiple`          |

## Configuration Options

### silent

**Type:** `Boolean` **Default:** `false`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Optionally suppress console errors and warnings.

### items

**Type:** `Array` **Default:** `[]`

**Input types affected:** `text`

**Usage:** Add pre-selected items (see terminology) to text input.

Pass an array of strings:

`['value 1', 'value 2', 'value 3']`

Pass an array of objects:

```
[{
  value: 'Value 1',
  label: 'Label 1',
  id: 1
},
{
  value: 'Value 2',
  label: 'Label 2',
  id: 2,
  customProperties: {
    random: 'I am a custom property'
  }
}]
```

### choices

**Type:** `Array` **Default:** `[]`

**Input types affected:** `select-one`, `select-multiple`

**Usage:** Add choices (see terminology) to select input.

Pass an array of objects:

```
[{
  value: 'Option 1',
  label: 'Option 1',
  selected: true,
  disabled: false,
},
{
  value: 'Option 2',
  label: 'Option 2',
  selected: false,
  disabled: true,
  customProperties: {
    description: 'Custom description about Option 2',
    random: 'Another random custom property'
  },
},
{
  label: 'Group 1',
  choices: [{
    value: 'Option 3',
    label: 'Option 4',
    selected: true,
    disabled: false,
  },
  {
    value: 'Option 2',
    label: 'Option 2',
    selected: false,
    disabled: true,
    customProperties: {
      description: 'Custom description about Option 2',
      random: 'Another random custom property'
    }
  }]
}]
```

### renderChoiceLimit

**Type:** `Number` **Default:** `-1`

**Input types affected:** `select-one`, `select-multiple`

**Usage:** The amount of choices to be rendered within the dropdown list ("-1" indicates no limit). This is useful if you have a lot of choices where it is easier for a user to use the search area to find a choice.

### maxItemCount

**Type:** `Number` **Default:** `-1`

**Input types affected:** `text`, `select-multiple`

**Usage:** The amount of items a user can input/select ("-1" indicates no limit).

### closeDropdownOnSelect

**Type:** `Boolean` | 'auto' **Default:** `auto`

**Input types affected:** select-one, select-multiple

**Usage:** Control how the dropdown closes after making a selection for select-one or select-multiple.
- 'auto' defaults based on backing-element type:
- select-one: true
- select-multiple: false

### singleModeForMultiSelect

**Type:** `Boolean` **Default:** `false`

**Input types affected:** select-one, select-multiple

**Usage:** Make select-multiple with a max item count of 1 work similar to select-one does. Selecting an item will auto-close the dropdown and swap any existing item for the just selected choice. If applied to a select-one, it functions as above and not the standard select-one.

### addChoices
**Type**: `Boolean` **Default:** `false`

**Input types affected:** `select-multiple`, `select-one`

**Usage:** Whether a user can add choices dynamically.

**Note:** `addItems` must also be `true`

### addItems

**Type:** `Boolean` **Default:** `true`

**Input types affected:** `text`

**Usage:** Whether a user can add items.

### removeItems

**Type:** `Boolean` **Default:** `true`

**Input types affected:** `text`, `select-multiple`

**Usage:** Whether a user can remove items.

### removeItemButton

**Type:** `Boolean` **Default:** `false`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Whether each item should have a remove button.

### removeItemButtonAlignLeft

**Type:** `Boolean` **Default:** `false`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Align item remove button left vs right

### editItems

**Type:** `Boolean` **Default:** `false`

**Input types affected:** `text`

**Usage:** Whether a user can edit items. An item's value can be edited by pressing the backspace.

### allowHTML

**Type:** `Boolean` **Default:** `false`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Whether HTML should be rendered in all Choices elements. If `false`, all elements (placeholder, items, etc.) will be treated as plain text. If `true`, this can be used to perform XSS scripting attacks if you load choices from a remote source.

### allowHtmlUserInput

**Type:** `Boolean` **Default:** `false`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Whether HTML should be escaped on input when `addItems` or `addChoices` is true. If `false`, user input will be treated as plain text. If `true`, this can be used to perform XSS scripting attacks if you load choices from a remote source.

### duplicateItemsAllowed

**Type:** `Boolean` **Default:** `true`

**Input types affected:** `text`, `select-multiple`, `select-one`

**Usage:** Whether duplicate inputted/chosen items are allowed

### delimiter

**Type:** `String` **Default:** `,`

**Input types affected:** `text`

**Usage:** What divides each value. The default delimiter separates each value with a comma: `"Value 1, Value 2, Value 3"`.

### paste

**Type:** `Boolean` **Default:** `true`

**Input types affected:** `text`, `select-multiple`

**Usage:** Whether a user can paste into the input.

### searchEnabled

**Type:** `Boolean` **Default:** `true`

**Input types affected:** `select-one`, `select-multiple`

**Usage:** Whether a search area should be shown.

### searchChoices

**Type:** `Boolean` **Default:** `true`

**Input types affected:** `select-one`

**Usage:** Whether choices should be filtered by input or not. If `false`, the search event will still emit, but choices will not be filtered.

### searchFields

**Type:** `Array/String` **Default:** `['label', 'value']`

**Input types affected:**`select-one`, `select-multiple`

**Usage:** Specify which fields should be used when a user is searching. If you have added custom properties to your choices, you can add these values thus: `['label', 'value', 'customProperties.example']`.

### searchFloor

**Type:** `Number` **Default:** `1`

**Input types affected:** `select-one`, `select-multiple`

**Usage:** The minimum length a search value should be before choices are searched.

### searchResultLimit: 4,

**Type:** `Number` **Default:** `4`

**Input types affected:** `select-one`, `select-multiple`

**Usage:** The maximum amount of search results to show  ("-1" indicates no limit).

### shadowRoot

**Type:** Document Element **Default:** null

**Input types affected:** `select-one`, `select-multiple`

**Usage:** You can pass along the shadowRoot from your application like so.

```js
var shadowRoot = document
  .getElementById('wrapper')
  .attachShadow({ mode: 'open' });
...
var el = shadowRoot.querySelector(...);
var choices = new Choices(el, {
  shadowRoot: shadowRoot,
});
```

### position

**Type:** `String` **Default:** `auto`

**Input types affected:** `select-one`, `select-multiple`

**Usage:** Whether the dropdown should appear above (`top`) or below (`bottom`) the input. By default, if there is not enough space within the window the dropdown will appear above the input, otherwise below it.

### resetScrollPosition

**Type:** `Boolean` **Default:** `true`

**Input types affected:** `select-multiple`

**Usage:** Whether the scroll position should reset after adding an item.

### addItemFilter

**Type:** `string | RegExp | Function` **Default:** `null`

**Input types affected:** `text`

**Usage:** A RegExp or string (will be passed to RegExp constructor internally) or filter function that will need to return `true` for a user to successfully add an item.

**Example:**

```js
// Only adds items matching the text test
new Choices(element, {
  addItemFilter: (value) => {
    return ['orange', 'apple', 'banana'].includes(value);
  };
});

// only items ending to `-red`
new Choices(element, {
  addItemFilter: '-red$';
});

```

### shouldSort

**Type:** `Boolean` **Default:** `true`

**Input types affected:** `select-one`, `select-multiple`

**Usage:** Whether choices and groups should be sorted. If false, choices/groups will appear in the order they were given.

### shouldSortItems

**Type:** `Boolean` **Default:** `false`

**Input types affected:** `text`, `select-multiple`

**Usage:** Whether items should be sorted. If false, items will appear in the order they were selected.

### sorter

**Type:** `Function` **Default:** sortByAlpha

**Input types affected:** `select-one`, `select-multiple`

**Usage:** The function that will sort choices and items before they are displayed (unless a user is searching). By default choices and items are sorted by alphabetical order.

**Example:**

```js
// Sorting via length of label from largest to smallest
const example = new Choices(element, {
  sorter: function(a, b) {
    return b.label.length - a.label.length;
  },
};
```

### placeholder

**Type:** `Boolean` **Default:** `true`

**Input types affected:** `text`

**Usage:** Whether the input should show a placeholder. Used in conjunction with `placeholderValue`. If `placeholder` is set to true and no value is passed to `placeholderValue`, the passed input's placeholder attribute will be used as the placeholder value.

**Note:** For select boxes, the recommended way of adding a placeholder is as follows:

```html
<select data-placeholder="This is a placeholder">
  <option>...</option>
  <option>...</option>
  <option>...</option>
</select>
```

For backward compatibility, `<option value="">This is a placeholder</option>` and `<option placeholder>This is a placeholder</option>` are also supported.

### placeholderValue

**Type:** `String` **Default:** `null`

**Input types affected:** `text`

**Usage:** The value of the inputs placeholder.

### searchPlaceholderValue

**Type:** `String` **Default:** `null`

**Input types affected:** `select-one`

**Usage:** The value of the search inputs placeholder.

### prependValue

**Type:** `String` **Default:** `null`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Prepend a value to each item added/selected.

### appendValue

**Type:** `String` **Default:** `null`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Append a value to each item added/selected.

### renderSelectedChoices

**Type:** `String` **Default:** `auto`

**Input types affected:** `select-multiple`

**Usage:** Whether selected choices should be removed from the list. By default choices are removed when they are selected in multiple select box. To always render choices pass `always`.

### loadingText

**Type:** `String` **Default:** `Loading...`

**Input types affected:** `select-one`, `select-multiple`

**Usage:** The text that is shown whilst choices are being populated via AJAX.

### noResultsText

**Type:** `String/Function` **Default:** `No results found`

**Input types affected:** `select-one`, `select-multiple`

**Usage:** The text that is shown when a user's search has returned no results. Optionally pass a function returning a string.

### noChoicesText

**Type:** `String/Function` **Default:** `No choices to choose from`

**Input types affected:** `select-multiple`, `select-one`

**Usage:** The text that is shown when a user has selected all possible choices, or no choices exist. Optionally pass a function returning a string.

### itemSelectText

**Type:** `String` **Default:** `Press to select`

**Input types affected:** `select-multiple`, `select-one`

**Usage:** The text that is shown when a user hovers over a selectable choice. Set to empty to not reserve space for this text.

### addItemText

**Type:** `String/Function` **Default:** `Press Enter to add "${value}"`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** The text that is shown when a user has inputted a new item but has not pressed the enter key. To access the current input value, pass a function with a `value` argument (see the [default config](https://github.com/jshjohnson/Choices#setup) for an example), otherwise pass a string.

Return type must be safe to insert into HTML (ie use the 1st argument which is sanitised)

### removeItemIconText

**Type:** `String/Function` **Default:** `Remove item"`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** The text/icon for the remove button. To access the item's value, pass a function with a `value` argument (see the **default config** [https://github.com/jshjohnson/Choices#setup] for an example), otherwise pass a string.

Return type must be safe to insert into HTML (ie use the 1st argument which is sanitised)

### removeItemLabelText

**Type:** `String/Function` **Default:** `Remove item: ${value}"`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** The text for the remove button's aria label. To access the item's value, pass a function with a `value` argument (see the **default config** [https://github.com/jshjohnson/Choices#setup] for an example), otherwise pass a string.

Return type must be safe to insert into HTML (ie use the 1st argument which is sanitised)

### maxItemText

**Type:** `String/Function` **Default:** `Only ${maxItemCount} values can be added`

**Input types affected:** `text`

**Usage:** The text that is shown when a user has focus on the input but has already reached the [max item count](https://github.com/jshjohnson/Choices#maxitemcount). To access the max item count, pass a function with a `maxItemCount` argument (see the [default config](https://github.com/jshjohnson/Choices#setup) for an example), otherwise pass a string.

### valueComparer

**Type:** `Function` **Default:** `strict equality`

**Input types affected:** `select-one`, `select-multiple`

**Usage:** A custom compare function used when finding choices by value (using `setChoiceByValue`).

**Example:**

```js
const example = new Choices(element, {
  valueComparer: (a, b) => value.trim() === b.trim(),
};
```

### labelId

**Type:** `String` **Default:** ``

**Input types affected:** `select-one`, `select-multiple`

**Usage:** The labelId improves accessibility. If set, it will add aria-labelledby to the choices element.

### classNames

**Type:** `Object` **Default:**

```
classNames: {
  containerOuter: ['choices'],
  containerInner: ['choices__inner'],
  input: ['choices__input'],
  inputCloned: ['choices__input--cloned'],
  list: ['choices__list'],
  listItems: ['choices__list--multiple'],
  listSingle: ['choices__list--single'],
  listDropdown: ['choices__list--dropdown'],
  item: ['choices__item'],
  itemSelectable: ['choices__item--selectable'],
  itemDisabled: ['choices__item--disabled'],
  itemChoice: ['choices__item--choice'],
  description: ['choices__description'],
  placeholder: ['choices__placeholder'],
  group: ['choices__group'],
  groupHeading: ['choices__heading'],
  button: ['choices__button'],
  activeState: ['is-active'],
  focusState: ['is-focused'],
  openState: ['is-open'],
  disabledState: ['is-disabled'],
  highlightedState: ['is-highlighted'],
  selectedState: ['is-selected'],
  flippedState: ['is-flipped'],
  loadingState: ['is-loading'],
  notice: ['choices__notice'],
  addChoice: ['choices__item--selectable', 'add-choice'],
  noResults: ['has-no-results'],
  noChoices: ['has-no-choices'],
}
```

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Classes added to HTML generated by Choices. By default classnames follow the [BEM](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) notation.

## Callbacks

**Note:** For each callback, `this` refers to the current instance of Choices. This can be useful if you need access to methods (`this.disable()`) or the config object (`this.config`).

### callbackOnInit

**Type:** `Function` **Default:** `null`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Function to run once Choices initialises.

### callbackOnCreateTemplates(strToEl: (str: string) => HTMLElement, escapeForTemplate: (allowHTML: boolean, s: StringUntrusted | StringPreEscaped | string) => string, getClassNames: (s: Array<string> | string) => string)

**Type:** `Function` **Default:** `null` **Arguments:** `strToEl`, `escapeForTemplate`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Function to run on template creation. Through this callback it is possible to provide custom templates for the various components of Choices (see terminology). For Choices to work with custom templates, it is important you maintain the various data attributes defined [here](https://github.com/Choices-js/Choices/blob/master/src/scripts/templates.ts).
If you want just extend a little original template then you may use `Choices.defaults.templates` to get access to
original template function.

Templates receive the full Choices config as the first argument to any template, which allows you to conditionally display things based on the options specified.

@note For each callback, `this` refers to the current instance of Choices. This can be useful if you need access to methods `(this.disable())`.

**Example:**

```js
const example = new Choices(element, {
  callbackOnCreateTemplates: (strToEl, escapeForTemplate, getClassNames) => ({
    input: (...args) =>
      Object.assign(Choices.defaults.templates.input.call(this, ...args), {
        type: 'email',
      }),
  }),
});
```

or more complex:

```js
const example = new Choices(element, {
  callbackOnCreateTemplates: function(strToEl, escapeForTemplate, getClassNames) {
    return {
      item: ({ classNames }, data) => {
        return template(`
          <div class="${getClassNames(classNames.item).join(' ')} ${
          getClassNames(data.highlighted
            ? classNames.highlightedState
            : classNames.itemSelectable).join(' ')
        } ${
          data.placeholder ? classNames.placeholder : ''
        }" data-item data-id="${data.id}" data-value="${escapeForTemplate(data.value)}" ${
          data.active ? 'aria-selected="true"' : ''
        } ${data.disabled ? 'aria-disabled="true"' : ''}>
            <span>&bigstar;</span> ${escapeForTemplate(data.label)}
          </div>
        `);
      },
      choice: ({ classNames }, data) => {
        return template(`
          <div class="${getClassNames(classNames.item).join(' ')} ${getClassNames(classNames.itemChoice).join(' ')} ${
          getClassNames(data.disabled ? classNames.itemDisabled : classNames.itemSelectable).join(' ')
        }" data-select-text="${this.config.itemSelectText}" data-choice ${
          data.disabled
            ? 'data-choice-disabled aria-disabled="true"'
            : 'data-choice-selectable'
        } data-id="${data.id}" data-value="${escapeForTemplate(data.value)}" ${
          data.groupId > 0 ? 'role="treeitem"' : 'role="option"'
        }>
            <span>&bigstar;</span> ${escapeForTemplate(data.label)}
          </div>
        `);
      },
    };
  },
});
```

## Events

**Note:** Events fired by Choices behave the same as standard events. Each event is triggered on the element passed to Choices (accessible via `this.passedElement`. Arguments are accessible within the `event.detail` object.

**Example:**

```js
const element = document.getElementById('example');
const example = new Choices(element);

element.addEventListener(
  'addItem',
  function(event) {
    // do something creative here...
    console.log(event.detail.id);
    console.log(event.detail.value);
    console.log(event.detail.label);
    console.log(event.detail.customProperties);
    console.log(event.detail.groupValue);
  },
  false,
);

// or
const example = new Choices(document.getElementById('example'));

example.passedElement.element.addEventListener(
  'addItem',
  function(event) {
    // do something creative here...
    console.log(event.detail.id);
    console.log(event.detail.value);
    console.log(event.detail.label);
    console.log(event.detail.customProperties);
    console.log(event.detail.groupValue);
  },
  false,
);
```

### addItem

**Payload:** `id, highlighted, labelClass, labelDescription, customProperties, disabled, active, label, placeholder, value, groupValue, element, keyCode`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Triggered each time an item is added (programmatically or by the user).

### removeItem

**Payload:** `id, highlighted, labelClass, labelDescription, customProperties, disabled, active, label, placeholder, value, groupValue, element, keyCode`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Triggered each time an item is removed (programmatically or by the user).

### highlightItem

**Payload:** `id, highlighted, labelClass, labelDescription, customProperties, disabled, active, label, placeholder, value, groupValue, element, keyCode`

**Input types affected:** `text`, `select-multiple`

**Usage:** Triggered each time an item is highlighted.

### unhighlightItem

**Payload:** `id, highlighted, labelClass, labelDescription, customProperties, disabled, active, label, placeholder, value, groupValue, element, keyCode`

**Input types affected:** `text`, `select-multiple`

**Usage:** Triggered each time an item is unhighlighted.

### choice

**Payload:** `id, highlighted, labelClass, labelDescription, customProperties, disabled, active, label, placeholder, value, groupValue, element, keyCode`

**Input types affected:** `select-one`, `select-multiple`

**Usage:** Triggered each time a choice is selected **by a user**, regardless if it changes the value of the input.
`choice` is a Choice object here (see terminology or typings file)

### change

**Payload:** `value: string`

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Triggered each time an item is added/removed **by a user**.

### search

**Payload:** `value: string`, `resultCount: number`

**Input types affected:** `select-one`, `select-multiple`

**Usage:** Triggered when a user types into an input to search choices. When a search is ended, a search event with an empty value with no resultCount is triggered.

### showDropdown

**Payload:** -

**Input types affected:** `select-one`, `select-multiple`

**Usage:** Triggered when the dropdown is shown.

### hideDropdown

**Payload:** -

**Input types affected:** `select-one`, `select-multiple`

**Usage:** Triggered when the dropdown is hidden.

### highlightChoice

**Payload:** `el`

**Input types affected:** `select-one`, `select-multiple`

**Usage:** Triggered when a choice from the dropdown is highlighted.
The `el` argument is choices.passedElement object that was affected.

## Methods

Methods can be called either directly or by chaining:

```js
// Calling a method by chaining
const choices = new Choices(element, {
  addItems: false,
  removeItems: false,
})
  .setValue(['Set value 1', 'Set value 2'])
  .disable();

// Calling a method directly
const choices = new Choices(element, {
  addItems: false,
  removeItems: false,
});

choices.setValue(['Set value 1', 'Set value 2']);
choices.disable();
```

### destroy();

**Input types affected:** `text`, `select-multiple`, `select-one`

**Usage:** Kills the instance of Choices, removes all event listeners and returns passed input to its initial state.

### init();

**Input types affected:** `text`, `select-multiple`, `select-one`

**Usage:** Creates a new instance of Choices, adds event listeners, creates templates and renders a Choices element to the DOM.

**Note:** This is called implicitly when a new instance of Choices is created. This would be used after a Choices instance had already been destroyed (using `destroy()`).

### refresh(withEvents: boolean = false, selectFirstOption: boolean = false);

**Input types affected:** `select-multiple`, `select-one`

**Usage:** Reads options from backing `<select>` element, and recreates choices. Existing items are preserved. When `withEvents` is truthy, only `addItem` events are generated.

### highlightAll();

**Input types affected:** `text`, `select-multiple`

**Usage:** Highlight each chosen item (selected items can be removed).

### unhighlightAll();

**Input types affected:** `text`, `select-multiple`

**Usage:** Un-highlight each chosen item.

### removeActiveItemsByValue(value: string);

**Input types affected:** `text`, `select-multiple`

**Usage:** Remove each item by a given value.

### removeActiveItems(excludedId?: number);

**Input types affected:** `text`, `select-multiple`

**Usage:** Remove each selectable item.

## removeChoice(value: string);

**Input types affected:** `text`, `select-multiple`, `select-one`

**Usage:** Remove an option/item by value

### removeHighlightedItems(runEvent?: boolean);

**Input types affected:** `text`, `select-multiple`

**Usage:** Remove each item the user has selected.

### showDropdown(preventInputFocus?: boolean);

**Input types affected:** `select-one`, `select-multiple`

**Usage:** Show choices list dropdown.

### hideDropdown(preventInputFocus?: boolean);

**Input types affected:** ``select-one`, `select-multiple`

**Usage:** Hide choices list dropdown.

### setChoices(choicesArrayOrFetcher?: (InputChoice | InputGroup)[] | ((instance: Choices) => (InputChoice | InputGroup)[] | Promise<(InputChoice | InputGroup)[]>), value?: string | null, label?: string, replaceChoices?: boolean = false, clearSearchFlag?: boolean = false, replaceItems?: boolean = false): this | Promise<this>;

**Input types affected:** `select-one`, `select-multiple`

**Usage:** Set choices of select input via an array of objects (or function that returns array of object or promise of it), a value field name and a label field name.

This behaves the similar as passing items via the `choices` option but can be called after initialising Choices. This can also be used to add groups of choices (see example 3); Optionally pass a true `replaceChoices` value to remove any existing choices. Optionally pass a true `replaceItems` value to remove any items, if false choices for selected items are preserved. Optionally pass a `customProperties` object to add additional data to your choices (useful when searching/filtering etc). Passing an empty array as the first parameter, and a true `replaceChoices` is the same as calling `clearChoices` (see below).

**Example 1:**

```js
const example = new Choices(element);

example.setChoices(
  [
    { value: 'One', label: 'Label One', disabled: true },
    { value: 'Two', label: 'Label Two', selected: true },
    { value: 'Three', label: 'Label Three' },
  ],
  'value',
  'label',
  false,
);
```

**Example 2:**

```js
const example = new Choices(element);

// Passing a function that returns Promise of choices
example.setChoices(async () => {
  try {
    const items = await fetch('/items');
    return items.json();
  } catch (err) {
    console.error(err);
  }
});
```

**Example 3:**

```js
const example = new Choices(element);

example.setChoices(
  [
    {
      label: 'Group one',
      disabled: false,
      choices: [
        { value: 'Child One', label: 'Child One', selected: true },
        { value: 'Child Two', label: 'Child Two', disabled: true },
        { value: 'Child Three', label: 'Child Three' },
      ],
    },
    {
      label: 'Group two',
      disabled: false,
      choices: [
        { value: 'Child Four', label: 'Child Four', disabled: true },
        { value: 'Child Five', label: 'Child Five' },
        {
          value: 'Child Six',
          label: 'Child Six',
          customProperties: {
            description: 'Custom description about child six',
            random: 'Another random custom property',
          },
        },
      ],
    },
  ],
  'value',
  'label',
  false,
);
```

### clearChoices(clearOptions: boolean = true, clearItems: boolean = false);

**Input types affected:** `select-one`, `select-multiple`

**Usage:** Clear all choices from select including any selected items. Does **not** reset the search state.
- `clearOptions` If true, clears the backing options from the `<select>` element
- `clearItems` If false, preserves selected items instead of clearing them

### getValue(valueOnly?: boolean): string[] | EventChoice[] | EventChoice | string;

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Get value(s) of input (i.e. inputted items (text) or selected choices (select)). Optionally pass an argument of `true` to only return values rather than value objects.

**Example:**

```js
const example = new Choices(element);
const values = example.getValue(true); // returns ['value 1', 'value 2'];
const valueArray = example.getValue(); // returns [{ active: true, choiceId: 1, highlighted: false, id: 1, label: 'Label 1', value: 'Value 1'},  { active: true, choiceId: 2, highlighted: false, id: 2, label: 'Label 2', value: 'Value 2'}];
```

### setValue(items: string[] | InputChoice[]): this;

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Set value of input based on an array of objects or strings. This behaves exactly the same as passing items via the `items` option but can be called after initialising Choices.

**Example:**

```js
const example = new Choices(element);

// via an array of objects
example.setValue([
  { value: 'One', label: 'Label One' },
  { value: 'Two', label: 'Label Two' },
  { value: 'Three', label: 'Label Three' },
]);

// or via an array of strings
example.setValue(['Four', 'Five', 'Six']);
```

### setChoiceByValue(value: string | string[]);

**Input types affected:** `select-one`, `select-multiple`

**Usage:** Set value of input based on existing Choice. `value` can be either a single string or an array of strings

**Example:**

```js
const example = new Choices(element, {
  choices: [
    { value: 'One', label: 'Label One' },
    { value: 'Two', label: 'Label Two', disabled: true },
    { value: 'Three', label: 'Label Three' },
  ],
});

example.setChoiceByValue('Two'); // Choice with value of 'Two' has now been selected.
```

### clearStore();

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Removes all items, choices and groups. Resets the search state. Use with caution.

### clearInput();

**Input types affected:** `text`

**Usage:** Clear input of any user inputted text.

### disable();

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Disables input from accepting new value/selecting further choices.

### enable();

**Input types affected:** `text`, `select-one`, `select-multiple`

**Usage:** Enables input to accept new values/select further choices.

## Browser compatibility

Choices is compiled using [Babel](https://babeljs.io/) targeting browsers [with more than 1% of global usage](https://github.com/jshjohnson/Choices/blob/master/.browserslistrc) and expecting that features [listed below](https://github.com/jshjohnson/Choices/blob/master/.eslintrc.json#L62) are available or polyfilled in browser.
You may see exact list of target browsers by running `npm exec browserslist` within this repository folder.
If you need to support a browser that does not have one of the features listed below,
I suggest including a polyfill from [cdnjs.cloudflare.com/polyfill](https://cdnjs.cloudflare.com/polyfill):

**Polyfill example used for the demo:**

```html
<script src="https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?version=4.8.0&features=Array.from%2CArray.prototype.find%2CArray.prototype.includes%2CSymbol%2CSymbol.iterator%2CDOMTokenList%2CObject.assign%2CCustomEvent%2CElement.prototype.classList%2CElement.prototype.closest%2CElement.prototype.dataset%2CElement.prototype.replaceChildren"></script>
```

**Features used in Choices:**

```polyfills
Array.from
Array.prototype.find
Array.prototype.includes
Symbol
Symbol.iterator
DOMTokenList
Object.assign
CustomEvent
Element.prototype.classList
Element.prototype.closest
Element.prototype.dataset
Element.prototype.replaceChildren
```

## Development

To setup a local environment: clone this repo, navigate into its directory in a terminal window and run the following command:

`npm install`

### playwright

e2e (End-to-end) tests are implemented using playwright, which requires installing likely with OS support.

`npx playwright install`
`npx playwright install-deps `

For JetBrain IDE's the `Test automation` plugin is recommended:
https://plugins.jetbrains.com/plugin/20175-test-automation
For usage see:
https://www.jetbrains.com/help/phpstorm/playwright.html

### NPM tasks

| Task                      | Usage                                                        |
|---------------------------|--------------------------------------------------------------|
| `npm run start`           | Fire up local server for development                         |
| `npm run test:unit`       | Run sequence of tests once                                   |
| `npm run test:unit:watch` | Fire up test server and re-test on file change               |
| `npm run test:e2e`        | Run sequence of e2e tests (with local server)                |
| `npm run test`            | Run both unit and e2e tests                                  |
| `npm run playwright:gui`  | Run Playwright e2e tests (GUI)                               |
| `npm run playwright:cli`  | Run Playwright e2e tests (CLI)                               |
| `npm run js:build`        | Compile Choices to an uglified JavaScript file               |
| `npm run css:watch`       | Watch SCSS files for changes. On a change, run build process |
| `npm run css:build`       | Compile, minify and prefix SCSS files to CSS                 |


### Build flags

Choices supports various environment variables as build-flags to enable/disable features.
The pre-built bundles these features set, and tree shaking uses the non-used parts.

#### CHOICES_SEARCH_FUSE
**Values:** `full` / `basic` / `null`
**Default:** `full`

Fuse.js support a `full`/`basic` profile. `full` adds additional logic operations, which aren't used by default with Choices. The `null` option drops Fuse.js as a dependency and instead uses a simple prefix only search feature.

#### CHOICES_SEARCH_KMP
**Values:** `1` / `0`
**Default:** `0`

If `CHOICES_SEARCH_FUSE` is `null`, this enables an `indexOf`-like [Knuth–Morris–Pratt algorithm](https://en.wikipedia.org/wiki/Knuth%E2%80%93Morris%E2%80%93Pratt_algorithm). Useful for very large data sets, without fuzzy searching.

#### CHOICES_CAN_USE_DOM
**Values:** `1` / `0`
**Default:** `1`

Allows loading Choices into a non-browser environment.

### Interested in contributing?

We're always interested in having more active maintainers.  Please get in touch if you're interested 👍

## License

MIT License

## Web component

Want to use Choices as a web component? You're in luck. Adidas have built one for their design system which can be found [here](https://github.com/adidas/choicesjs-stencil).

## Misc

Thanks to [@mikefrancis](https://github.com/mikefrancis/) for [sending me on a hunt](https://twitter.com/_mikefrancis/status/701797835826667520) for a non-jQuery solution for select boxes that eventually led to this being built!
