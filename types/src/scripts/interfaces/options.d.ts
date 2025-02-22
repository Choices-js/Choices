import { IFuseOptions } from 'fuse.js';
import { InputChoice } from './input-choice';
import { ClassNames } from './class-names';
import { PositionOptionsType } from './position-options-type';
import { Types } from './types';
import { CallbackOnCreateTemplatesFn } from './templates';
export declare const ObjectsInConfig: string[];
/**
 * Choices options interface
 *
 * **Terminology**
 *
 * - **Choice:** A choice is a value a user can select. A choice would be equivalent to the `<option></option>` element within a select input.
 * - **Group:** A group is a collection of choices. A group should be seen as equivalent to a `<optgroup></optgroup>` element within a select input.
 * - **Item:** An item is an inputted value **_(text input)_** or a selected choice **_(select element)_**. In the context of a select element, an item is equivelent to a selected option element: `<option value="Hello" selected></option>` whereas in the context of a text input an item is equivelant to `<input type="text" value="Hello">`
 */
export interface Options {
    /**
     * Optionally suppress console errors and warnings.
     *
     * **Input types affected:** text, select-single, select-multiple
     *
     * @default false
     */
    silent: boolean;
    /**
     * Add pre-selected items (see terminology) to text input.
     *
     * **Input types affected:** text
     *
     * @example
     * ```
     * ['value 1', 'value 2', 'value 3']
     * ```
     *
     * @example
     * ```
     * [{
     *    value: 'Value 1',
     *    label: 'Label 1',
     *    id: 1
     *  },
     *  {
     *    value: 'Value 2',
     *    label: 'Label 2',
     *    id: 2,
     *    customProperties: {
     *      random: 'I am a custom property'
     *  }
     * }]
     * ```
     *
     * @default []
     */
    items: string[] | InputChoice[];
    /**
     * Add choices (see terminology) to select input.
     *
     * **Input types affected:** select-one, select-multiple
     *
     * @example
     * ```
     * [{
     *   value: 'Option 1',
     *   label: 'Option 1',
     *   selected: true,
     *   disabled: false,
     * },
     * {
     *   value: 'Option 2',
     *   label: 'Option 2',
     *   selected: false,
     *   disabled: true,
     *   customProperties: {
     *     description: 'Custom description about Option 2',
     *     random: 'Another random custom property'
     *   },
     * },
     * {
     *   label: 'Group 1',
     *   choices: [{
     *     value: 'Option 3',
     *     label: 'Option 4',
     *     selected: true,
     *     disabled: false,
     *   },
     *   {
     *     value: 'Option 2',
     *     label: 'Option 2',
     *     selected: false,
     *     disabled: true,
     *     customProperties: {
     *       description: 'Custom description about Option 2',
     *       random: 'Another random custom property'
     *     }
     *   }]
     * }]
     * ```
     *
     * @default []
     */
    choices: InputChoice[];
    /**
     * The amount of choices to be rendered within the dropdown list `("-1" indicates no limit)`. This is useful if you have a lot of choices where it is easier for a user to use the search area to find a choice.
     *
     * **Input types affected:** select-one, select-multiple
     *
     * @default -1
     */
    renderChoiceLimit: number;
    /**
     * The amount of items a user can input/select `("-1" indicates no limit)`.
     *
     * **Input types affected:** text, select-multiple
     *
     * @default -1
     */
    maxItemCount: number;
    /**
     * Control how the dropdown closes after making a selection for select-one or select-multiple
     *
     * 'auto' defaults based on backing-element type:
     * select-one: true
     * select-multiple: false
     *
     * **Input types affected:** select-one, select-multiple
     *
     * @default 'auto'
     */
    closeDropdownOnSelect: boolean | 'auto';
    /**
     * Make select-multiple with a max item count of 1 work similar to select-one does.
     * Selecting an item will auto-close the dropdown and swap any existing item for the just selected choice.
     * If applied to a select-one, it functions as above and not the standard select-one.
     *
     * **Input types affected:** select-one, select-multiple
     *
     * @default false
     */
    singleModeForMultiSelect: boolean;
    /**
     * Whether a user can add choices dynamically.
     *
     * **Input types affected:** select-one, select-multiple
     *
     * @default false
     */
    addChoices: boolean;
    /**
     * Whether a user can add items.
     *
     * **Input types affected:** text
     *
     * @default true
     */
    addItems: boolean;
    /**
     * A filter that will need to pass for a user to successfully add an item.
     *
     * **Input types affected:** text, select-one, select-multiple
     *
     * @default (value) => !!value && value !== ''
     */
    addItemFilter: string | RegExp | Types.FilterFunction | null;
    /**
     * The text that is shown when a user has inputted a new item but has not pressed the enter key. To access the current input value, pass a function with a `value` argument (see the **default config** [https://github.com/jshjohnson/Choices#setup] for an example), otherwise pass a string.
     * The raw non-sanitised value is passed as a 2nd argument.
     *
     * Return type must be safe to insert into HTML (ie use the 1st argument which is sanitised)
     *
     * **Input types affected:** text, one-select, select-one, select-multiple
     *
     * @default
     * ```
     * (value, valueRaw) => `Press Enter to add <b>"${value}"</b>`;
     * ```
     */
    addItemText: string | Types.NoticeStringFunction;
    /**
     * The text/icon for the remove button. To access the item's value, pass a function with a `value` argument (see the **default config** [https://github.com/jshjohnson/Choices#setup] for an example), otherwise pass a string.
     * The raw non-sanitised value is passed as a 2nd argument.
     *
     * Return type must be safe to insert into HTML (ie use the 1st argument which is sanitised)
     *
     * **Input types affected:** text, select-one, select-multiple
     *
     * @default
     * ```
     * (value, valueRaw) => `Remove item`;
     * ```
     */
    removeItemIconText: string | Types.NoticeStringFunction;
    /**
     * The text for the remove button's aria label. To access the item's value, pass a function with a `value` argument (see the **default config** [https://github.com/jshjohnson/Choices#setup] for an example), otherwise pass a string.
     * The raw non-sanitised value is passed as a 2nd argument.
     *
     * Return type must be safe to insert into HTML (ie use the 1st argument which is sanitised)
     *
     * **Input types affected:** text, select-one, select-multiple
     *
     * @default
     * ```
     * (value, valueRaw) => `Remove item: ${value}`;
     * ```
     */
    removeItemLabelText: string | Types.NoticeStringFunction;
    /**
     * Whether a user can remove items.
     *
     * **Input types affected:** text, select-multiple
     *
     * @default true
     */
    removeItems: boolean;
    /**
     * Whether each item should have a remove button.
     *
     * **Input types affected:** text, select-one, select-multiple
     *
     * @default false
     */
    removeItemButton: boolean;
    /**
     * Align item remove button left vs right.
     *
     * **Input types affected:** text, select-one, select-multiple
     *
     * @default false
     */
    removeItemButtonAlignLeft: boolean;
    /**
     * Whether a user can edit items. An item's value can be edited by pressing the backspace.
     *
     * **Input types affected:** text
     *
     * @default false
     */
    editItems: boolean;
    /**
     * Whether HTML should be rendered in all Choices elements.
     * If `false`, all elements (placeholder, items, etc.) will be treated as plain text.
     * If `true`, this can be used to perform XSS scripting attacks if you load choices from a remote source.
     *
     * **Input types affected:** text, select-one, select-multiple
     *
     * @default false
     */
    allowHTML: boolean;
    /**
     * Whether HTML should be escaped on input when `addItems` or `addChoices` is true.
     * If `false`, user input will be treated as plain text.
     * If `true`, this can be used to perform XSS scripting attacks if you load previously submitted choices from a remote source.
     *
     * **Input types affected:** text, select-one, select-multiple
     *
     * @default false
     */
    allowHtmlUserInput: boolean;
    /**
     * Whether each inputted/chosen item should be unique.
     *
     * **Input types affected:** text, `select-multiple`, `select-one`
     *
     * @default true
     */
    duplicateItemsAllowed: boolean;
    /**
     * What divides each value. The default delimiter separates each value with a comma: `"Value 1, Value 2, Value 3"`.
     *
     * **Input types affected:** text
     *
     * @default ','
     */
    delimiter: string;
    /**
     * Whether a user can paste into the input.
     *
     * **Input types affected:** text, select-multiple
     *
     * @default true
     */
    paste: boolean;
    /**
     * Whether a search area should be shown.
     *
     * **Input types affected:** select-one, select-multiple
     *
     * @default true
     */
    searchEnabled: boolean;
    /**
     * Whether choices should be filtered by input or not. If `false`, the search event will still emit, but choices will not be filtered.
     *
     * **Input types affected:** select-one
     *
     * @default true
     */
    searchChoices: boolean;
    /**
     * The minimum length a search value should be before choices are searched.
     *
     * **Input types affected:** select-one, select-multiple
     *
     * @default 1
     */
    searchFloor: number;
    /**
     * The maximum amount of search results to show. `("-1" indicates no limit)`
     *
     * **Input types affected:** select-one, select-multiple
     *
     * @default 4
     */
    searchResultLimit: number;
    /**
     * Specify which fields should be used when a user is searching. If you have added custom properties to your choices, you can add these values thus: `['label', 'value', 'customProperties.example']`.
     *
     * Input types affected:select-one, select-multiple
     *
     * @default ['label', 'value']
     */
    searchFields: string[];
    /**
     * Whether the dropdown should appear above `(top)` or below `(bottom)` the input. By default, if there is not enough space within the window the dropdown will appear above the input, otherwise below it.
     *
     * **Input types affected:** select-one, select-multiple
     *
     * @default 'auto'
     */
    position: PositionOptionsType;
    /**
     * Whether the scroll position should reset after adding an item.
     *
     * **Input types affected:** select-multiple
     *
     * @default true
     */
    resetScrollPosition: boolean;
    /**
     * The shadow root for use within ShadowDom
     */
    shadowRoot: ShadowRoot | null;
    /**
     * Whether choices and groups should be sorted. If false, choices/groups will appear in the order they were given.
     *
     * **Input types affected:** select-one, select-multiple
     *
     * @default true
     */
    shouldSort: boolean;
    /**
     * Whether items should be sorted. If false, items will appear in the order they were selected.
     *
     * **Input types affected:** text, select-multiple
     *
     * @default false
     */
    shouldSortItems: boolean;
    /**
     * The function that will sort choices and items before they are displayed (unless a user is searching). By default choices and items are sorted by alphabetical order.
     *
     * **Input types affected:** select-one, select-multiple
     *
     * @example
     * ```
     * // Sorting via length of label from largest to smallest
     * const example = new Choices(element, {
     *   sorter: function(a, b) {
     *     return b.label.length - a.label.length;
     *   },
     * };
     * ```
     *
     * @default sortByAlpha
     */
    sorter: (current: Types.RecordToCompare, next: Types.RecordToCompare) => number;
    /**
     * Whether the input should show a placeholder. Used in conjunction with `placeholderValue`. If `placeholder` is set to true and no value is passed to `placeholderValue`, the passed input's placeholder attribute will be used as the placeholder value.
     *
     * **Input types affected:** text, select-multiple
     *
     * @note For single select boxes, the recommended way of adding a placeholder is as follows:
     * ```
     * <select data-placeholder="This is a placeholder">
     *   <option>...</option>
     *   <option>...</option>
     *   <option>...</option>
     * </select>
     * ```
     *
     * @default true
     */
    placeholder: boolean;
    /**
     * The value of the inputs placeholder.
     *
     * **Input types affected:** text, select-multiple
     *
     * @default null
     */
    placeholderValue: string | null;
    /**
     * The value of the search inputs placeholder.
     *
     * **Input types affected:** select-one
     *
     * @default null
     */
    searchPlaceholderValue: string | null;
    /**
     * Prepend a value to each item added/selected.
     *
     * **Input types affected:** text, select-one, select-multiple
     *
     * @default null
     */
    prependValue: string | null;
    /**
     * Append a value to each item added/selected.
     *
     * **Input types affected:** text, select-one, select-multiple
     *
     * @default null
     */
    appendValue: string | null;
    /**
     * Whether selected choices should be removed from the list. By default choices are removed when they are selected in multiple select box. To always render choices pass `always`.
     *
     * **Input types affected:** select-one, select-multiple
     *
     * @default 'auto';
     */
    renderSelectedChoices: 'auto' | 'always' | boolean;
    /**
     * The text that is shown whilst choices are being populated via AJAX.
     *
     * **Input types affected:** select-one, select-multiple
     *
     * @default 'Loading...'
     */
    loadingText: string;
    /**
     * The text that is shown when a user's search has returned no results. Optionally pass a function returning a string.
     *
     * **Input types affected:** select-one, select-multiple
     *
     * @default 'No results found'
     */
    noResultsText: string | Types.StringFunction;
    /**
     * The text that is shown when a user has selected all possible choices, or no choices exist. Optionally pass a function returning a string.
     *
     * **Input types affected:** select-multiple, select-one
     *
     * @default 'No choices to choose from'
     */
    noChoicesText: string | Types.StringFunction;
    /**
     * The text that is shown when a user hovers over a selectable choice. Set to empty to not reserve space for this text.
     *
     * **Input types affected:** select-multiple, select-one
     *
     * @default 'Press to select'
     */
    itemSelectText: string;
    /**
     * The text that is shown when a user has focus on the input but has already reached the **max item count** [https://github.com/jshjohnson/Choices#maxitemcount]. To access the max item count, pass a function with a `maxItemCount` argument (see the **default config** [https://github.com/jshjohnson/Choices#setup] for an example), otherwise pass a string.
     *
     * **Input types affected:** text
     *
     * @default
     * ```
     * (maxItemCount) => `Only ${maxItemCount} values can be added.`;
     * ```
     */
    maxItemText: string | Types.NoticeLimitFunction;
    /**
     * If no duplicates are allowed, and the value already exists in the array.
     *
     * Return type must be safe to insert into HTML (ie use the 1st argument which is sanitised)
     *
     * @default 'Only unique values can be added'
     */
    uniqueItemText: string | Types.NoticeStringFunction;
    /**
     * The text that is shown when addItemFilter is passed and it returns false
     *
     * Return type must be safe to insert into HTML (ie use the 1st argument which is sanitised)
     *
     * **Input types affected:** text
     *
     * @default 'Only values matching specific conditions can be added'
     */
    customAddItemText: string | Types.NoticeStringFunction;
    /**
     * Compare choice and value in appropriate way (e.g. deep equality for objects). To compare choice and value, pass a function with a `valueComparer` argument (see the [default config](https://github.com/jshjohnson/Choices#setup) for an example).
     *
     * **Input types affected:** select-one, select-multiple
     *
     * @default
     * ```
     * (choice, item) => choice === item;
     * ```
     */
    valueComparer: Types.ValueCompareFunction;
    /**
     * Classes added to HTML generated by  By default classnames follow the BEM notation.
     *
     * **Input types affected:** text, select-one, select-multiple
     */
    classNames: ClassNames;
    /**
     * Choices uses the great Fuse library for searching. You can find more options here: https://fusejs.io/api/options.html
     */
    fuseOptions: IFuseOptions<unknown>;
    /**
     * ID of the connected label to improve a11y. If set, aria-labelledby will be added.
     */
    labelId: string;
    /**
     * Function to run once Choices initialises.
     *
     * **Input types affected:** text, select-one, select-multiple
     *
     * @note For each callback, this refers to the current instance of  This can be useful if you need access to methods `(this.disable())` or the config object `(this.config)`.
     *
     * @default null
     */
    callbackOnInit: (() => void) | null;
    /**
     * Function to run on template creation. Through this callback it is possible to provide custom templates for the various components of Choices (see terminology). For Choices to work with custom templates, it is important you maintain the various data attributes defined here [https://github.com/jshjohnson/Choices/blob/67f29c286aa21d88847adfcd6304dc7d068dc01f/assets/scripts/src/choices.js#L1993-L2067].
     *
     * **Input types affected:** text, select-one, select-multiple
     *
     * @note For each callback, `this` refers to the current instance of Choices. This can be useful if you need access to methods `(this.disable())`.
     *
     * @example
     * ```
     * const example = new Choices(element, {
     *   callbackOnCreateTemplates: function (template, originalTemplates, getClassNames) {
     *     var classNames = this.config.classNames;
     *     return {
     *       item: (data) => {
     *         return template(`
     *           <div class="${getClassNames(classNames.item).join(' ')} ${data.highlighted ? classNames.highlightedState : classNames.itemSelectable}" data-item data-id="${data.id}" data-value="${data.value}" ${data.active ? 'aria-selected="true"' : ''} ${data.disabled ? 'aria-disabled="true"' : ''}>
     *             <span>&bigstar;</span> ${data.label}
     *           </div>
     *         `);
     *       },
     *       choice: (data) => {
     *         return template(`
     *           <div class="${getClassNames(classNames.item).join(' ')} ${classNames.itemChoice} ${data.disabled ? classNames.itemDisabled : classNames.itemSelectable}" data-select-text="${this.config.itemSelectText}" data-choice ${data.disabled ? 'data-choice-disabled aria-disabled="true"' : 'data-choice-selectable'} data-id="${data.id}" data-value="${data.value}" ${data.groupId ? 'role="treeitem"' : 'role="option"'}>
     *             <span>&bigstar;</span> ${data.label}
     *           </div>
     *         `);
     *       },
     *     };
     *   }
     * });
     * ```
     *
     * @default null
     */
    callbackOnCreateTemplates: CallbackOnCreateTemplatesFn | null;
    appendGroupInSearch: false;
}
