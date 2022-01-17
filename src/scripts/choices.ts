import merge from 'deepmerge';
/* eslint-disable @typescript-eslint/no-explicit-any */
import Fuse from 'fuse.js';

import {
  activateChoices,
  addChoice,
  clearChoices,
  filterChoices,
  Result,
} from './actions/choices';
import { addGroup } from './actions/groups';
import { addItem, highlightItem, removeItem } from './actions/items';
import { clearAll, resetTo, setIsLoading } from './actions/misc';
import {
  Container,
  Dropdown,
  Input,
  List,
  WrappedInput,
  WrappedSelect,
} from './components';
import {
  EVENTS,
  KEY_CODES,
  SELECT_MULTIPLE_TYPE,
  SELECT_ONE_TYPE,
  TEXT_TYPE,
} from './constants';
import { DEFAULT_CONFIG } from './defaults';
import { Choice } from './interfaces/choice';
import { Group } from './interfaces/group';
import { Item } from './interfaces/item';
import { Notice } from './interfaces/notice';
import { Options } from './interfaces/options';
import { PassedElement } from './interfaces/passed-element';
import { State } from './interfaces/state';

import {
  diff,
  existsInArray,
  generateId,
  getAdjacentEl,
  getType,
  isScrolledIntoView,
  isType,
  sortByScore,
  strToEl,
} from './lib/utils';
import { defaultState } from './reducers';
import Store from './store/store';
import templates from './templates';

/** @see {@link http://browserhacks.com/#hack-acea075d0ac6954f275a70023906050c} */
const IS_IE11 =
  '-ms-scroll-limit' in document.documentElement.style &&
  '-ms-ime-align' in document.documentElement.style;

const USER_DEFAULTS: Partial<Options> = {};

/**
 * Choices
 * @author Josh Johnson<josh@joshuajohnson.co.uk>
 */
class Choices implements Choices {
  static get defaults(): {
    options: Partial<Options>;
    templates: typeof templates;
  } {
    return Object.preventExtensions({
      get options(): Partial<Options> {
        return USER_DEFAULTS;
      },
      get templates(): typeof templates {
        return templates;
      },
    });
  }

  initialised: boolean;

  config: Options;

  passedElement: WrappedInput | WrappedSelect;

  containerOuter: Container;

  containerInner: Container;

  choiceList: List;

  itemList: List;

  input: Input;

  dropdown: Dropdown;

  _isTextElement: boolean;

  _isSelectOneElement: boolean;

  _isSelectMultipleElement: boolean;

  _isSelectElement: boolean;

  _store: Store;

  _templates: typeof templates;

  _initialState: State;

  _currentState: State;

  _prevState: State;

  _currentValue: string;

  _canSearch: boolean;

  _isScrollingOnIe: boolean;

  _highlightPosition: number;

  _wasTap: boolean;

  _isSearching: boolean;

  _placeholderValue: string | null;

  _baseId: string;

  _direction: HTMLElement['dir'];

  _idNames: {
    itemChoice: string;
  };

  _presetGroups: Group[] | HTMLOptGroupElement[] | Element[];

  _presetOptions: Item[] | HTMLOptionElement[];

  _presetChoices: Partial<Choice>[];

  _presetItems: Item[] | string[];

  constructor(
    element:
      | string
      | Element
      | HTMLInputElement
      | HTMLSelectElement = '[data-choice]',
    userConfig: Partial<Options> = {},
  ) {
    if (userConfig.allowHTML === undefined) {
      console.warn(
        'Deprecation warning: allowHTML will default to false in a future release. To render HTML in Choices, you will need to set it to true. Setting allowHTML will suppress this message.',
      );
    }

    this.config = merge.all<Options>(
      [DEFAULT_CONFIG, Choices.defaults.options, userConfig],
      // When merging array configs, replace with a copy of the userConfig array,
      // instead of concatenating with the default array
      { arrayMerge: (_, sourceArray) => [...sourceArray] },
    );

    const invalidConfigOptions = diff(this.config, DEFAULT_CONFIG);
    if (invalidConfigOptions.length) {
      console.warn(
        'Unknown config option(s) passed',
        invalidConfigOptions.join(', '),
      );
    }

    const passedElement =
      typeof element === 'string' ? document.querySelector(element) : element;

    if (
      !(
        passedElement instanceof HTMLInputElement ||
        passedElement instanceof HTMLSelectElement
      )
    ) {
      throw TypeError(
        'Expected one of the following types text|select-one|select-multiple',
      );
    }

    this._isTextElement = passedElement.type === TEXT_TYPE;
    this._isSelectOneElement = passedElement.type === SELECT_ONE_TYPE;
    this._isSelectMultipleElement = passedElement.type === SELECT_MULTIPLE_TYPE;
    this._isSelectElement =
      this._isSelectOneElement || this._isSelectMultipleElement;

    this.config.searchEnabled =
      this._isSelectMultipleElement || this.config.searchEnabled;

    if (!['auto', 'always'].includes(`${this.config.renderSelectedChoices}`)) {
      this.config.renderSelectedChoices = 'auto';
    }

    if (
      userConfig.addItemFilter &&
      typeof userConfig.addItemFilter !== 'function'
    ) {
      const re =
        userConfig.addItemFilter instanceof RegExp
          ? userConfig.addItemFilter
          : new RegExp(userConfig.addItemFilter);

      this.config.addItemFilter = re.test.bind(re);
    }

    if (this._isTextElement) {
      this.passedElement = new WrappedInput({
        element: passedElement as HTMLInputElement,
        classNames: this.config.classNames,
        delimiter: this.config.delimiter,
      });
    } else {
      this.passedElement = new WrappedSelect({
        element: passedElement as HTMLSelectElement,
        classNames: this.config.classNames,
        template: (data: Item): HTMLOptionElement =>
          this._templates.option(data),
      });
    }

    this.initialised = false;

    this._store = new Store();
    this._initialState = defaultState;
    this._currentState = defaultState;
    this._prevState = defaultState;
    this._currentValue = '';
    this._canSearch = !!this.config.searchEnabled;
    this._isScrollingOnIe = false;
    this._highlightPosition = 0;
    this._wasTap = true;
    this._placeholderValue = this._generatePlaceholderValue();
    this._baseId = generateId(this.passedElement.element, 'choices-');

    /**
     * setting direction in cases where it's explicitly set on passedElement
     * or when calculated direction is different from the document
     */
    this._direction = this.passedElement.dir;

    if (!this._direction) {
      const { direction: elementDirection } = window.getComputedStyle(
        this.passedElement.element,
      );
      const { direction: documentDirection } = window.getComputedStyle(
        document.documentElement,
      );
      if (elementDirection !== documentDirection) {
        this._direction = elementDirection;
      }
    }

    this._idNames = {
      itemChoice: 'item-choice',
    };

    if (this._isSelectElement) {
      // Assign preset groups from passed element
      this._presetGroups = (this.passedElement as WrappedSelect).optionGroups;
      // Assign preset options from passed element
      this._presetOptions = (this.passedElement as WrappedSelect).options;
    }

    // Assign preset choices from passed object
    this._presetChoices = this.config.choices;
    // Assign preset items from passed object first
    this._presetItems = this.config.items;
    // Add any values passed from attribute
    if (this.passedElement.value && this._isTextElement) {
      const splitValues: string[] = this.passedElement.value.split(
        this.config.delimiter,
      );
      this._presetItems = (this._presetItems as string[]).concat(splitValues);
    }
    // Create array of choices from option elements
    if ((this.passedElement as WrappedSelect).options) {
      (this.passedElement as WrappedSelect).options.forEach((option) => {
        this._presetChoices.push({
          value: option.value,
          label: option.innerHTML,
          selected: !!option.selected,
          disabled: option.disabled || option.parentNode.disabled,
          placeholder:
            option.value === '' || option.hasAttribute('placeholder'),
          customProperties: option.dataset['custom-properties'],
        });
      });
    }

    this._render = this._render.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseOver = this._onMouseOver.bind(this);
    this._onFormReset = this._onFormReset.bind(this);
    this._onSelectKey = this._onSelectKey.bind(this);
    this._onEnterKey = this._onEnterKey.bind(this);
    this._onEscapeKey = this._onEscapeKey.bind(this);
    this._onDirectionKey = this._onDirectionKey.bind(this);
    this._onDeleteKey = this._onDeleteKey.bind(this);

    // If element has already been initialised with Choices, fail silently
    if (this.passedElement.isActive) {
      if (!this.config.silent) {
        console.warn(
          'Trying to initialise Choices on element already initialised',
          { element },
        );
      }

      this.initialised = true;

      return;
    }

    // Let's go
    this.init();
  }

  init(): void {
    if (this.initialised) {
      return;
    }

    this._createTemplates();
    this._createElements();
    this._createStructure();

    this._store.subscribe(this._render);

    this._render();
    this._addEventListeners();

    const shouldDisable =
      !this.config.addItems ||
      this.passedElement.element.hasAttribute('disabled');

    if (shouldDisable) {
      this.disable();
    }

    this.initialised = true;

    const { callbackOnInit } = this.config;
    // Run callback if it is a function
    if (callbackOnInit && typeof callbackOnInit === 'function') {
      callbackOnInit.call(this);
    }
  }

  destroy(): void {
    if (!this.initialised) {
      return;
    }

    this._removeEventListeners();
    this.passedElement.reveal();
    this.containerOuter.unwrap(this.passedElement.element);

    this.clearStore();

    if (this._isSelectElement) {
      (this.passedElement as WrappedSelect).options = this._presetOptions;
    }

    this._templates = templates;
    this.initialised = false;
  }

  enable(): this {
    if (this.passedElement.isDisabled) {
      this.passedElement.enable();
    }

    if (this.containerOuter.isDisabled) {
      this._addEventListeners();
      this.input.enable();
      this.containerOuter.enable();
    }

    return this;
  }

  disable(): this {
    if (!this.passedElement.isDisabled) {
      this.passedElement.disable();
    }

    if (!this.containerOuter.isDisabled) {
      this._removeEventListeners();
      this.input.disable();
      this.containerOuter.disable();
    }

    return this;
  }

  highlightItem(item: Item, runEvent = true): this {
    if (!item || !item.id) {
      return this;
    }

    const { id, groupId = -1, value = '', label = '' } = item;
    const group = groupId >= 0 ? this._store.getGroupById(groupId) : null;

    this._store.dispatch(highlightItem(id, true));

    if (runEvent) {
      this.passedElement.triggerEvent(EVENTS.highlightItem, {
        id,
        value,
        label,
        groupValue: group && group.value ? group.value : null,
      });
    }

    return this;
  }

  unhighlightItem(item: Item): this {
    if (!item || !item.id) {
      return this;
    }

    const { id, groupId = -1, value = '', label = '' } = item;
    const group = groupId >= 0 ? this._store.getGroupById(groupId) : null;

    this._store.dispatch(highlightItem(id, false));
    this.passedElement.triggerEvent(EVENTS.highlightItem, {
      id,
      value,
      label,
      groupValue: group && group.value ? group.value : null,
    });

    return this;
  }

  highlightAll(): this {
    this._store.items.forEach((item) => this.highlightItem(item));

    return this;
  }

  unhighlightAll(): this {
    this._store.items.forEach((item) => this.unhighlightItem(item));

    return this;
  }

  removeActiveItemsByValue(value: string): this {
    this._store.activeItems
      .filter((item) => item.value === value)
      .forEach((item) => this._removeItem(item));

    return this;
  }

  removeActiveItems(excludedId: number): this {
    this._store.activeItems
      .filter(({ id }) => id !== excludedId)
      .forEach((item) => this._removeItem(item));

    return this;
  }

  removeHighlightedItems(runEvent = false): this {
    this._store.highlightedActiveItems.forEach((item) => {
      this._removeItem(item);
      // If this action was performed by the user
      // trigger the event
      if (runEvent) {
        this._triggerChange(item.value);
      }
    });

    return this;
  }

  showDropdown(preventInputFocus?: boolean): this {
    if (this.dropdown.isActive) {
      return this;
    }

    requestAnimationFrame(() => {
      this.dropdown.show();
      this.containerOuter.open(this.dropdown.distanceFromTopWindow);

      if (!preventInputFocus && this._canSearch) {
        this.input.focus();
      }

      this.passedElement.triggerEvent(EVENTS.showDropdown, {});
    });

    return this;
  }

  hideDropdown(preventInputBlur?: boolean): this {
    if (!this.dropdown.isActive) {
      return this;
    }

    requestAnimationFrame(() => {
      this.dropdown.hide();
      this.containerOuter.close();

      if (!preventInputBlur && this._canSearch) {
        this.input.removeActiveDescendant();
        this.input.blur();
      }

      this.passedElement.triggerEvent(EVENTS.hideDropdown, {});
    });

    return this;
  }

  getValue(valueOnly = false): string[] | Item[] | Item | string {
    const values = this._store.activeItems.reduce<any[]>(
      (selectedItems, item) => {
        const itemValue = valueOnly ? item.value : item;
        selectedItems.push(itemValue);

        return selectedItems;
      },
      [],
    );

    return this._isSelectOneElement ? values[0] : values;
  }

  setValue(items: string[] | Item[]): this {
    if (!this.initialised) {
      return this;
    }

    items.forEach((value) => this._setChoiceOrItem(value));

    return this;
  }

  setChoiceByValue(value: string): this {
    if (!this.initialised || this._isTextElement) {
      return this;
    }

    // If only one value has been passed, convert to array
    const choiceValue = Array.isArray(value) ? value : [value];

    // Loop through each value and
    choiceValue.forEach((val) => this._findAndSelectChoiceByValue(val));

    return this;
  }

  /**
   * Set choices of select input via an array of objects (or function that returns array of object or promise of it),
   * a value field name and a label field name.
   * This behaves the same as passing items via the choices option but can be called after initialising Choices.
   * This can also be used to add groups of choices (see example 2); Optionally pass a true `replaceChoices` value to remove any existing choices.
   * Optionally pass a `customProperties` object to add additional data to your choices (useful when searching/filtering etc).
   *
   * **Input types affected:** select-one, select-multiple
   *
   * @example
   * ```js
   * const example = new Choices(element);
   *
   * example.setChoices([
   *   {value: 'One', label: 'Label One', disabled: true},
   *   {value: 'Two', label: 'Label Two', selected: true},
   *   {value: 'Three', label: 'Label Three'},
   * ], 'value', 'label', false);
   * ```
   *
   * @example
   * ```js
   * const example = new Choices(element);
   *
   * example.setChoices(async () => {
   *   try {
   *      const items = await fetch('/items');
   *      return items.json()
   *   } catch(err) {
   *      console.error(err)
   *   }
   * });
   * ```
   *
   * @example
   * ```js
   * const example = new Choices(element);
   *
   * example.setChoices([{
   *   label: 'Group one',
   *   id: 1,
   *   disabled: false,
   *   choices: [
   *     {value: 'Child One', label: 'Child One', selected: true},
   *     {value: 'Child Two', label: 'Child Two',  disabled: true},
   *     {value: 'Child Three', label: 'Child Three'},
   *   ]
   * },
   * {
   *   label: 'Group two',
   *   id: 2,
   *   disabled: false,
   *   choices: [
   *     {value: 'Child Four', label: 'Child Four', disabled: true},
   *     {value: 'Child Five', label: 'Child Five'},
   *     {value: 'Child Six', label: 'Child Six', customProperties: {
   *       description: 'Custom description about child six',
   *       random: 'Another random custom property'
   *     }},
   *   ]
   * }], 'value', 'label', false);
   * ```
   */
  setChoices(
    choicesArrayOrFetcher:
      | Choice[]
      | Group[]
      | ((instance: Choices) => Choice[] | Promise<Choice[]>) = [],
    value = 'value',
    label = 'label',
    replaceChoices = false,
  ): this | Promise<this> {
    if (!this.initialised) {
      throw new ReferenceError(
        `setChoices was called on a non-initialized instance of Choices`,
      );
    }
    if (!this._isSelectElement) {
      throw new TypeError(`setChoices can't be used with INPUT based Choices`);
    }

    if (typeof value !== 'string' || !value) {
      throw new TypeError(
        `value parameter must be a name of 'value' field in passed objects`,
      );
    }

    // Clear choices if needed
    if (replaceChoices) {
      this.clearChoices();
    }

    if (typeof choicesArrayOrFetcher === 'function') {
      // it's a choices fetcher function
      const fetcher = choicesArrayOrFetcher(this);

      if (typeof Promise === 'function' && fetcher instanceof Promise) {
        // that's a promise
        // eslint-disable-next-line no-promise-executor-return
        return new Promise((resolve) => requestAnimationFrame(resolve))
          .then(() => this._handleLoadingState(true))
          .then(() => fetcher)
          .then((data: Choice[]) =>
            this.setChoices(data, value, label, replaceChoices),
          )
          .catch((err) => {
            if (!this.config.silent) {
              console.error(err);
            }
          })
          .then(() => this._handleLoadingState(false))
          .then(() => this);
      }

      // function returned something else than promise, let's check if it's an array of choices
      if (!Array.isArray(fetcher)) {
        throw new TypeError(
          `.setChoices first argument function must return either array of choices or Promise, got: ${typeof fetcher}`,
        );
      }

      // recursion with results, it's sync and choices were cleared already
      return this.setChoices(fetcher, value, label, false);
    }

    if (!Array.isArray(choicesArrayOrFetcher)) {
      throw new TypeError(
        `.setChoices must be called either with array of choices with a function resulting into Promise of array of choices`,
      );
    }

    this.containerOuter.removeLoadingState();

    this._startLoading();

    type ChoiceGroup = {
      id: string;
      choices: Choice[];
    };

    choicesArrayOrFetcher.forEach((groupOrChoice: ChoiceGroup | Choice) => {
      if ((groupOrChoice as ChoiceGroup).choices) {
        this._addGroup({
          id: groupOrChoice.id ? parseInt(`${groupOrChoice.id}`, 10) : null,
          group: groupOrChoice,
          valueKey: value,
          labelKey: label,
        });
      } else {
        const choice = groupOrChoice as Choice;
        this._addChoice({
          value: choice[value],
          label: choice[label],
          isSelected: !!choice.selected,
          isDisabled: !!choice.disabled,
          placeholder: !!choice.placeholder,
          customProperties: choice.customProperties,
        });
      }
    });

    this._stopLoading();

    return this;
  }

  clearChoices(): this {
    this._store.dispatch(clearChoices());

    return this;
  }

  clearStore(): this {
    this._store.dispatch(clearAll());

    return this;
  }

  clearInput(): this {
    const shouldSetInputWidth = !this._isSelectOneElement;
    this.input.clear(shouldSetInputWidth);

    if (!this._isTextElement && this._canSearch) {
      this._isSearching = false;
      this._store.dispatch(activateChoices(true));
    }

    return this;
  }

  _render(): void {
    if (this._store.isLoading()) {
      return;
    }

    this._currentState = this._store.state;

    const stateChanged =
      this._currentState.choices !== this._prevState.choices ||
      this._currentState.groups !== this._prevState.groups ||
      this._currentState.items !== this._prevState.items;
    const shouldRenderChoices = this._isSelectElement;
    const shouldRenderItems =
      this._currentState.items !== this._prevState.items;

    if (!stateChanged) {
      return;
    }

    if (shouldRenderChoices) {
      this._renderChoices();
    }

    if (shouldRenderItems) {
      this._renderItems();
    }

    this._prevState = this._currentState;
  }

  _renderChoices(): void {
    const { activeGroups, activeChoices } = this._store;
    let choiceListFragment = document.createDocumentFragment();

    this.choiceList.clear();

    if (this.config.resetScrollPosition) {
      requestAnimationFrame(() => this.choiceList.scrollToTop());
    }

    // If we have grouped options
    if (activeGroups.length >= 1 && !this._isSearching) {
      // If we have a placeholder choice along with groups
      const activePlaceholders = activeChoices.filter(
        (activeChoice) =>
          activeChoice.placeholder === true && activeChoice.groupId === -1,
      );
      if (activePlaceholders.length >= 1) {
        choiceListFragment = this._createChoicesFragment(
          activePlaceholders,
          choiceListFragment,
        );
      }
      choiceListFragment = this._createGroupsFragment(
        activeGroups,
        activeChoices,
        choiceListFragment,
      );
    } else if (activeChoices.length >= 1) {
      choiceListFragment = this._createChoicesFragment(
        activeChoices,
        choiceListFragment,
      );
    }

    // If we have choices to show
    if (
      choiceListFragment.childNodes &&
      choiceListFragment.childNodes.length > 0
    ) {
      const { activeItems } = this._store;
      const canAddItem = this._canAddItem(activeItems, this.input.value);

      // ...and we can select them
      if (canAddItem.response) {
        // ...append them and highlight the first choice
        this.choiceList.append(choiceListFragment);
        this._highlightChoice();
      } else {
        const notice = this._getTemplate('notice', canAddItem.notice);
        this.choiceList.append(notice);
      }
    } else {
      // Otherwise show a notice
      let dropdownItem;
      let notice;

      if (this._isSearching) {
        notice =
          typeof this.config.noResultsText === 'function'
            ? this.config.noResultsText()
            : this.config.noResultsText;

        dropdownItem = this._getTemplate('notice', notice, 'no-results');
      } else {
        notice =
          typeof this.config.noChoicesText === 'function'
            ? this.config.noChoicesText()
            : this.config.noChoicesText;

        dropdownItem = this._getTemplate('notice', notice, 'no-choices');
      }

      this.choiceList.append(dropdownItem);
    }
  }

  _renderItems(): void {
    const activeItems = this._store.activeItems || [];
    this.itemList.clear();

    // Create a fragment to store our list items
    // (so we don't have to update the DOM for each item)
    const itemListFragment = this._createItemsFragment(activeItems);

    // If we have items to add, append them
    if (itemListFragment.childNodes) {
      this.itemList.append(itemListFragment);
    }
  }

  _createGroupsFragment(
    groups: Group[],
    choices: Choice[],
    fragment: DocumentFragment = document.createDocumentFragment(),
  ): DocumentFragment {
    const getGroupChoices = (group): Choice[] =>
      choices.filter((choice) => {
        if (this._isSelectOneElement) {
          return choice.groupId === group.id;
        }

        return (
          choice.groupId === group.id &&
          (this.config.renderSelectedChoices === 'always' || !choice.selected)
        );
      });

    // If sorting is enabled, filter groups
    if (this.config.shouldSort) {
      groups.sort(this.config.sorter);
    }

    groups.forEach((group) => {
      const groupChoices = getGroupChoices(group);
      if (groupChoices.length >= 1) {
        const dropdownGroup = this._getTemplate('choiceGroup', group);
        fragment.appendChild(dropdownGroup);
        this._createChoicesFragment(groupChoices, fragment, true);
      }
    });

    return fragment;
  }

  _createChoicesFragment(
    choices: Choice[],
    fragment: DocumentFragment = document.createDocumentFragment(),
    withinGroup = false,
  ): DocumentFragment {
    // Create a fragment to store our list items (so we don't have to update the DOM for each item)
    const { renderSelectedChoices, searchResultLimit, renderChoiceLimit } =
      this.config;
    const filter = this._isSearching ? sortByScore : this.config.sorter;
    const appendChoice = (choice: Choice): void => {
      const shouldRender =
        renderSelectedChoices === 'auto'
          ? this._isSelectOneElement || !choice.selected
          : true;

      if (shouldRender) {
        const dropdownItem = this._getTemplate(
          'choice',
          choice,
          this.config.itemSelectText,
        );

        fragment.appendChild(dropdownItem);
      }
    };

    let rendererableChoices = choices;

    if (renderSelectedChoices === 'auto' && !this._isSelectOneElement) {
      rendererableChoices = choices.filter((choice) => !choice.selected);
    }

    // Split array into placeholders and "normal" choices
    const { placeholderChoices, normalChoices } = rendererableChoices.reduce(
      (acc, choice: Choice) => {
        if (choice.placeholder) {
          acc.placeholderChoices.push(choice);
        } else {
          acc.normalChoices.push(choice);
        }

        return acc;
      },
      {
        placeholderChoices: [] as Choice[],
        normalChoices: [] as Choice[],
      },
    );

    // If sorting is enabled or the user is searching, filter choices
    if (this.config.shouldSort || this._isSearching) {
      normalChoices.sort(filter);
    }

    let choiceLimit = rendererableChoices.length;

    // Prepend placeholeder
    const sortedChoices = this._isSelectOneElement
      ? [...placeholderChoices, ...normalChoices]
      : normalChoices;

    if (this._isSearching) {
      choiceLimit = searchResultLimit;
    } else if (renderChoiceLimit && renderChoiceLimit > 0 && !withinGroup) {
      choiceLimit = renderChoiceLimit;
    }

    // Add each choice to dropdown within range
    for (let i = 0; i < choiceLimit; i += 1) {
      if (sortedChoices[i]) {
        appendChoice(sortedChoices[i]);
      }
    }

    return fragment;
  }

  _createItemsFragment(
    items: Item[],
    fragment: DocumentFragment = document.createDocumentFragment(),
  ): DocumentFragment {
    // Create fragment to add elements to
    const { shouldSortItems, sorter, removeItemButton } = this.config;

    // If sorting is enabled, filter items
    if (shouldSortItems && !this._isSelectOneElement) {
      items.sort(sorter);
    }

    if (this._isTextElement) {
      // Update the value of the hidden input
      this.passedElement.value = items
        .map(({ value }) => value)
        .join(this.config.delimiter);
    } else {
      // Update the options of the hidden input
      (this.passedElement as WrappedSelect).options = items;
    }

    const addItemToFragment = (item: Item): void => {
      // Create new list element
      const listItem = this._getTemplate('item', item, removeItemButton);
      // Append it to list
      fragment.appendChild(listItem);
    };

    // Add each list item to list
    items.forEach(addItemToFragment);

    return fragment;
  }

  _triggerChange(value): void {
    if (value === undefined || value === null) {
      return;
    }

    this.passedElement.triggerEvent(EVENTS.change, {
      value,
    });
  }

  _selectPlaceholderChoice(placeholderChoice: Choice): void {
    this._addItem({
      value: placeholderChoice.value,
      label: placeholderChoice.label,
      choiceId: placeholderChoice.id,
      groupId: placeholderChoice.groupId,
      placeholder: placeholderChoice.placeholder,
    });

    this._triggerChange(placeholderChoice.value);
  }

  _handleButtonAction(activeItems?: Item[], element?: HTMLElement): void {
    if (
      !activeItems ||
      !element ||
      !this.config.removeItems ||
      !this.config.removeItemButton
    ) {
      return;
    }

    const itemId =
      element.parentNode && (element.parentNode as HTMLElement).dataset.id;
    const itemToRemove =
      itemId && activeItems.find((item) => item.id === parseInt(itemId, 10));

    if (!itemToRemove) {
      return;
    }

    // Remove item associated with button
    this._removeItem(itemToRemove);
    this._triggerChange(itemToRemove.value);

    if (this._isSelectOneElement && this._store.placeholderChoice) {
      this._selectPlaceholderChoice(this._store.placeholderChoice);
    }
  }

  _handleItemAction(
    activeItems?: Item[],
    element?: HTMLElement,
    hasShiftKey = false,
  ): void {
    if (
      !activeItems ||
      !element ||
      !this.config.removeItems ||
      this._isSelectOneElement
    ) {
      return;
    }

    const passedId = element.dataset.id;

    // We only want to select one item with a click
    // so we deselect any items that aren't the target
    // unless shift is being pressed
    activeItems.forEach((item) => {
      if (item.id === parseInt(`${passedId}`, 10) && !item.highlighted) {
        this.highlightItem(item);
      } else if (!hasShiftKey && item.highlighted) {
        this.unhighlightItem(item);
      }
    });

    // Focus input as without focus, a user cannot do anything with a
    // highlighted item
    this.input.focus();
  }

  _handleChoiceAction(activeItems?: Item[], element?: HTMLElement): void {
    if (!activeItems || !element) {
      return;
    }

    // If we are clicking on an option
    const { id } = element.dataset;
    const choice = id && this._store.getChoiceById(id);
    if (!choice) {
      return;
    }

    const passedKeyCode =
      activeItems[0] && activeItems[0].keyCode
        ? activeItems[0].keyCode
        : undefined;
    const hasActiveDropdown = this.dropdown.isActive;

    // Update choice keyCode
    choice.keyCode = passedKeyCode;

    this.passedElement.triggerEvent(EVENTS.choice, {
      choice,
    });

    if (!choice.selected && !choice.disabled) {
      const canAddItem = this._canAddItem(activeItems, choice.value);

      if (canAddItem.response) {
        this._addItem({
          value: choice.value,
          label: choice.label,
          choiceId: choice.id,
          groupId: choice.groupId,
          customProperties: choice.customProperties,
          placeholder: choice.placeholder,
          keyCode: choice.keyCode,
        });

        this._triggerChange(choice.value);
      }
    }

    this.clearInput();

    // We want to close the dropdown if we are dealing with a single select box
    if (hasActiveDropdown && this._isSelectOneElement) {
      this.hideDropdown(true);
      this.containerOuter.focus();
    }
  }

  _handleBackspace(activeItems?: Item[]): void {
    if (!this.config.removeItems || !activeItems) {
      return;
    }

    const lastItem = activeItems[activeItems.length - 1];
    const hasHighlightedItems = activeItems.some((item) => item.highlighted);

    // If editing the last item is allowed and there are not other selected items,
    // we can edit the item value. Otherwise if we can remove items, remove all selected items
    if (this.config.editItems && !hasHighlightedItems && lastItem) {
      this.input.value = lastItem.value;
      this.input.setWidth();
      this._removeItem(lastItem);
      this._triggerChange(lastItem.value);
    } else {
      if (!hasHighlightedItems) {
        // Highlight last item if none already highlighted
        this.highlightItem(lastItem, false);
      }
      this.removeHighlightedItems(true);
    }
  }

  _startLoading(): void {
    this._store.dispatch(setIsLoading(true));
  }

  _stopLoading(): void {
    this._store.dispatch(setIsLoading(false));
  }

  _handleLoadingState(setLoading = true): void {
    let placeholderItem = this.itemList.getChild(
      `.${this.config.classNames.placeholder}`,
    );

    if (setLoading) {
      this.disable();
      this.containerOuter.addLoadingState();

      if (this._isSelectOneElement) {
        if (!placeholderItem) {
          placeholderItem = this._getTemplate(
            'placeholder',
            this.config.loadingText,
          );

          if (placeholderItem) {
            this.itemList.append(placeholderItem);
          }
        } else {
          placeholderItem.innerHTML = this.config.loadingText;
        }
      } else {
        this.input.placeholder = this.config.loadingText;
      }
    } else {
      this.enable();
      this.containerOuter.removeLoadingState();

      if (this._isSelectOneElement) {
        if (placeholderItem) {
          placeholderItem.innerHTML = this._placeholderValue || '';
        }
      } else {
        this.input.placeholder = this._placeholderValue || '';
      }
    }
  }

  _handleSearch(value: string): void {
    if (!this.input.isFocussed) {
      return;
    }

    const { choices } = this._store;
    const { searchFloor, searchChoices } = this.config;
    const hasUnactiveChoices = choices.some((option) => !option.active);

    // Check that we have a value to search and the input was an alphanumeric character
    if (
      value !== null &&
      typeof value !== 'undefined' &&
      value.length >= searchFloor
    ) {
      const resultCount = searchChoices ? this._searchChoices(value) : 0;
      // Trigger search event
      this.passedElement.triggerEvent(EVENTS.search, {
        value,
        resultCount,
      });
    } else if (hasUnactiveChoices) {
      // Otherwise reset choices to active
      this._isSearching = false;
      this._store.dispatch(activateChoices(true));
    }
  }

  _canAddItem(activeItems: Item[], value: string): Notice {
    let canAddItem = true;
    let notice =
      typeof this.config.addItemText === 'function'
        ? this.config.addItemText(value)
        : this.config.addItemText;

    if (!this._isSelectOneElement) {
      const isDuplicateValue = existsInArray(activeItems, value);

      if (
        this.config.maxItemCount > 0 &&
        this.config.maxItemCount <= activeItems.length
      ) {
        // If there is a max entry limit and we have reached that limit
        // don't update
        canAddItem = false;
        notice =
          typeof this.config.maxItemText === 'function'
            ? this.config.maxItemText(this.config.maxItemCount)
            : this.config.maxItemText;
      }

      if (
        !this.config.duplicateItemsAllowed &&
        isDuplicateValue &&
        canAddItem
      ) {
        canAddItem = false;
        notice =
          typeof this.config.uniqueItemText === 'function'
            ? this.config.uniqueItemText(value)
            : this.config.uniqueItemText;
      }

      if (
        this._isTextElement &&
        this.config.addItems &&
        canAddItem &&
        typeof this.config.addItemFilter === 'function' &&
        !this.config.addItemFilter(value)
      ) {
        canAddItem = false;
        notice =
          typeof this.config.customAddItemText === 'function'
            ? this.config.customAddItemText(value)
            : this.config.customAddItemText;
      }
    }

    return {
      response: canAddItem,
      notice,
    };
  }

  _searchChoices(value: string): number {
    const newValue = typeof value === 'string' ? value.trim() : value;
    const currentValue =
      typeof this._currentValue === 'string'
        ? this._currentValue.trim()
        : this._currentValue;

    if (newValue.length < 1 && newValue === `${currentValue} `) {
      return 0;
    }

    // If new value matches the desired length and is not the same as the current value with a space
    const haystack = this._store.searchableChoices;
    const needle = newValue;
    const options = Object.assign(this.config.fuseOptions, {
      keys: [...this.config.searchFields],
      includeMatches: true,
    }) as Fuse.IFuseOptions<Choice>;
    const fuse = new Fuse(haystack, options);
    const results: Result<Choice>[] = fuse.search(needle) as any[]; // see https://github.com/krisk/Fuse/issues/303

    this._currentValue = newValue;
    this._highlightPosition = 0;
    this._isSearching = true;
    this._store.dispatch(filterChoices(results));

    return results.length;
  }

  _addEventListeners(): void {
    const { documentElement } = document;

    // capture events - can cancel event processing or propagation
    documentElement.addEventListener('touchend', this._onTouchEnd, true);
    this.containerOuter.element.addEventListener(
      'keydown',
      this._onKeyDown,
      true,
    );
    this.containerOuter.element.addEventListener(
      'mousedown',
      this._onMouseDown,
      true,
    );

    // passive events - doesn't call `preventDefault` or `stopPropagation`
    documentElement.addEventListener('click', this._onClick, { passive: true });
    documentElement.addEventListener('touchmove', this._onTouchMove, {
      passive: true,
    });
    this.dropdown.element.addEventListener('mouseover', this._onMouseOver, {
      passive: true,
    });

    if (this._isSelectOneElement) {
      this.containerOuter.element.addEventListener('focus', this._onFocus, {
        passive: true,
      });
      this.containerOuter.element.addEventListener('blur', this._onBlur, {
        passive: true,
      });
    }

    this.input.element.addEventListener('keyup', this._onKeyUp, {
      passive: true,
    });

    this.input.element.addEventListener('focus', this._onFocus, {
      passive: true,
    });
    this.input.element.addEventListener('blur', this._onBlur, {
      passive: true,
    });

    if (this.input.element.form) {
      this.input.element.form.addEventListener('reset', this._onFormReset, {
        passive: true,
      });
    }

    this.input.addEventListeners();
  }

  _removeEventListeners(): void {
    const { documentElement } = document;

    documentElement.removeEventListener('touchend', this._onTouchEnd, true);
    this.containerOuter.element.removeEventListener(
      'keydown',
      this._onKeyDown,
      true,
    );
    this.containerOuter.element.removeEventListener(
      'mousedown',
      this._onMouseDown,
      true,
    );

    documentElement.removeEventListener('click', this._onClick);
    documentElement.removeEventListener('touchmove', this._onTouchMove);
    this.dropdown.element.removeEventListener('mouseover', this._onMouseOver);

    if (this._isSelectOneElement) {
      this.containerOuter.element.removeEventListener('focus', this._onFocus);
      this.containerOuter.element.removeEventListener('blur', this._onBlur);
    }

    this.input.element.removeEventListener('keyup', this._onKeyUp);
    this.input.element.removeEventListener('focus', this._onFocus);
    this.input.element.removeEventListener('blur', this._onBlur);

    if (this.input.element.form) {
      this.input.element.form.removeEventListener('reset', this._onFormReset);
    }

    this.input.removeEventListeners();
  }

  _onKeyDown(event: KeyboardEvent): void {
    const { keyCode } = event;
    const { activeItems } = this._store;
    const hasFocusedInput = this.input.isFocussed;
    const hasActiveDropdown = this.dropdown.isActive;
    const hasItems = this.itemList.hasChildren();
    const keyString = String.fromCharCode(keyCode);
    const wasAlphaNumericChar = /[a-zA-Z0-9-_ ]/.test(keyString);

    const {
      BACK_KEY,
      DELETE_KEY,
      ENTER_KEY,
      A_KEY,
      ESC_KEY,
      UP_KEY,
      DOWN_KEY,
      PAGE_UP_KEY,
      PAGE_DOWN_KEY,
    } = KEY_CODES;

    if (!this._isTextElement && !hasActiveDropdown && wasAlphaNumericChar) {
      this.showDropdown();

      if (!this.input.isFocussed) {
        /*
          We update the input value with the pressed key as
          the input was not focussed at the time of key press
          therefore does not have the value of the key.
        */
        this.input.value += keyString.toLowerCase();
      }
    }

    switch (keyCode) {
      case A_KEY:
        return this._onSelectKey(event, hasItems);
      case ENTER_KEY:
        return this._onEnterKey(event, activeItems, hasActiveDropdown);
      case ESC_KEY:
        return this._onEscapeKey(hasActiveDropdown);
      case UP_KEY:
      case PAGE_UP_KEY:
      case DOWN_KEY:
      case PAGE_DOWN_KEY:
        return this._onDirectionKey(event, hasActiveDropdown);
      case DELETE_KEY:
      case BACK_KEY:
        return this._onDeleteKey(event, activeItems, hasFocusedInput);
      default:
    }
  }

  _onKeyUp({
    target,
    keyCode,
  }: Pick<KeyboardEvent, 'target' | 'keyCode'>): void {
    const { value } = this.input;
    const { activeItems } = this._store;
    const canAddItem = this._canAddItem(activeItems, value);
    const { BACK_KEY: backKey, DELETE_KEY: deleteKey } = KEY_CODES;

    // We are typing into a text input and have a value, we want to show a dropdown
    // notice. Otherwise hide the dropdown
    if (this._isTextElement) {
      const canShowDropdownNotice = canAddItem.notice && value;

      if (canShowDropdownNotice) {
        const dropdownItem = this._getTemplate('notice', canAddItem.notice);
        this.dropdown.element.innerHTML = dropdownItem.outerHTML;
        this.showDropdown(true);
      } else {
        this.hideDropdown(true);
      }
    } else {
      const wasRemovalKeyCode = keyCode === backKey || keyCode === deleteKey;
      const userHasRemovedValue =
        wasRemovalKeyCode && target && !(target as HTMLSelectElement).value;
      const canReactivateChoices = !this._isTextElement && this._isSearching;
      const canSearch = this._canSearch && canAddItem.response;

      if (userHasRemovedValue && canReactivateChoices) {
        this._isSearching = false;
        this._store.dispatch(activateChoices(true));
      } else if (canSearch) {
        this._handleSearch(this.input.rawValue);
      }
    }

    this._canSearch = this.config.searchEnabled;
  }

  _onSelectKey(event: KeyboardEvent, hasItems: boolean): void {
    const { ctrlKey, metaKey } = event;
    const hasCtrlDownKeyPressed = ctrlKey || metaKey;

    // If CTRL + A or CMD + A have been pressed and there are items to select
    if (hasCtrlDownKeyPressed && hasItems) {
      this._canSearch = false;

      const shouldHightlightAll =
        this.config.removeItems &&
        !this.input.value &&
        this.input.element === document.activeElement;

      if (shouldHightlightAll) {
        this.highlightAll();
      }
    }
  }

  _onEnterKey(
    event: KeyboardEvent,
    activeItems: Item[],
    hasActiveDropdown: boolean,
  ): void {
    const { target } = event;
    const { ENTER_KEY: enterKey } = KEY_CODES;
    const targetWasButton =
      target && (target as HTMLElement).hasAttribute('data-button');

    if (this._isTextElement && target && (target as HTMLInputElement).value) {
      const { value } = this.input;
      const canAddItem = this._canAddItem(activeItems, value);

      if (canAddItem.response) {
        this.hideDropdown(true);
        this._addItem({ value });
        this._triggerChange(value);
        this.clearInput();
      }
    }

    if (targetWasButton) {
      this._handleButtonAction(activeItems, target as HTMLElement);
      event.preventDefault();
    }

    if (hasActiveDropdown) {
      const highlightedChoice = this.dropdown.getChild(
        `.${this.config.classNames.highlightedState}`,
      );

      if (highlightedChoice) {
        // add enter keyCode value
        if (activeItems[0]) {
          activeItems[0].keyCode = enterKey; // eslint-disable-line no-param-reassign
        }
        this._handleChoiceAction(activeItems, highlightedChoice);
      }

      event.preventDefault();
    } else if (this._isSelectOneElement) {
      this.showDropdown();
      event.preventDefault();
    }
  }

  _onEscapeKey(hasActiveDropdown: boolean): void {
    if (hasActiveDropdown) {
      this.hideDropdown(true);
      this.containerOuter.focus();
    }
  }

  _onDirectionKey(event: KeyboardEvent, hasActiveDropdown: boolean): void {
    const { keyCode, metaKey } = event;
    const {
      DOWN_KEY: downKey,
      PAGE_UP_KEY: pageUpKey,
      PAGE_DOWN_KEY: pageDownKey,
    } = KEY_CODES;

    // If up or down key is pressed, traverse through options
    if (hasActiveDropdown || this._isSelectOneElement) {
      this.showDropdown();
      this._canSearch = false;

      const directionInt =
        keyCode === downKey || keyCode === pageDownKey ? 1 : -1;
      const skipKey =
        metaKey || keyCode === pageDownKey || keyCode === pageUpKey;
      const selectableChoiceIdentifier = '[data-choice-selectable]';

      let nextEl;
      if (skipKey) {
        if (directionInt > 0) {
          nextEl = this.dropdown.element.querySelector(
            `${selectableChoiceIdentifier}:last-of-type`,
          );
        } else {
          nextEl = this.dropdown.element.querySelector(
            selectableChoiceIdentifier,
          );
        }
      } else {
        const currentEl = this.dropdown.element.querySelector(
          `.${this.config.classNames.highlightedState}`,
        );
        if (currentEl) {
          nextEl = getAdjacentEl(
            currentEl,
            selectableChoiceIdentifier,
            directionInt,
          );
        } else {
          nextEl = this.dropdown.element.querySelector(
            selectableChoiceIdentifier,
          );
        }
      }

      if (nextEl) {
        // We prevent default to stop the cursor moving
        // when pressing the arrow
        if (
          !isScrolledIntoView(nextEl, this.choiceList.element, directionInt)
        ) {
          this.choiceList.scrollToChildElement(nextEl, directionInt);
        }
        this._highlightChoice(nextEl);
      }

      // Prevent default to maintain cursor position whilst
      // traversing dropdown options
      event.preventDefault();
    }
  }

  _onDeleteKey(
    event: KeyboardEvent,
    activeItems: Item[],
    hasFocusedInput: boolean,
  ): void {
    const { target } = event;
    // If backspace or delete key is pressed and the input has no value
    if (
      !this._isSelectOneElement &&
      !(target as HTMLInputElement).value &&
      hasFocusedInput
    ) {
      this._handleBackspace(activeItems);
      event.preventDefault();
    }
  }

  _onTouchMove(): void {
    if (this._wasTap) {
      this._wasTap = false;
    }
  }

  _onTouchEnd(event: TouchEvent): void {
    const { target } = event || (event as TouchEvent).touches[0];
    const touchWasWithinContainer =
      this._wasTap && this.containerOuter.element.contains(target as Node);

    if (touchWasWithinContainer) {
      const containerWasExactTarget =
        target === this.containerOuter.element ||
        target === this.containerInner.element;

      if (containerWasExactTarget) {
        if (this._isTextElement) {
          this.input.focus();
        } else if (this._isSelectMultipleElement) {
          this.showDropdown();
        }
      }

      // Prevents focus event firing
      event.stopPropagation();
    }

    this._wasTap = true;
  }

  /**
   * Handles mousedown event in capture mode for containetOuter.element
   */
  _onMouseDown(event: MouseEvent): void {
    const { target } = event;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    // If we have our mouse down on the scrollbar and are on IE11...
    if (IS_IE11 && this.choiceList.element.contains(target)) {
      // check if click was on a scrollbar area
      const firstChoice = this.choiceList.element
        .firstElementChild as HTMLElement;

      const isOnScrollbar =
        this._direction === 'ltr'
          ? event.offsetX >= firstChoice.offsetWidth
          : event.offsetX < firstChoice.offsetLeft;
      this._isScrollingOnIe = isOnScrollbar;
    }

    if (target === this.input.element) {
      return;
    }

    const item = target.closest('[data-button],[data-item],[data-choice]');
    if (item instanceof HTMLElement) {
      const hasShiftKey = event.shiftKey;
      const { activeItems } = this._store;
      const { dataset } = item;

      if ('button' in dataset) {
        this._handleButtonAction(activeItems, item);
      } else if ('item' in dataset) {
        this._handleItemAction(activeItems, item, hasShiftKey);
      } else if ('choice' in dataset) {
        this._handleChoiceAction(activeItems, item);
      }
    }

    event.preventDefault();
  }

  /**
   * Handles mouseover event over this.dropdown
   * @param {MouseEvent} event
   */
  _onMouseOver({ target }: Pick<MouseEvent, 'target'>): void {
    if (target instanceof HTMLElement && 'choice' in target.dataset) {
      this._highlightChoice(target);
    }
  }

  _onClick({ target }: Pick<MouseEvent, 'target'>): void {
    const clickWasWithinContainer = this.containerOuter.element.contains(
      target as Node,
    );

    if (clickWasWithinContainer) {
      if (!this.dropdown.isActive && !this.containerOuter.isDisabled) {
        if (this._isTextElement) {
          if (document.activeElement !== this.input.element) {
            this.input.focus();
          }
        } else {
          this.showDropdown();
          this.containerOuter.focus();
        }
      } else if (
        this._isSelectOneElement &&
        target !== this.input.element &&
        !this.dropdown.element.contains(target as Node)
      ) {
        this.hideDropdown();
      }
    } else {
      const hasHighlightedItems = this._store.highlightedActiveItems.length > 0;

      if (hasHighlightedItems) {
        this.unhighlightAll();
      }

      this.containerOuter.removeFocusState();
      this.hideDropdown(true);
    }
  }

  _onFocus({ target }: Pick<FocusEvent, 'target'>): void {
    const focusWasWithinContainer =
      target && this.containerOuter.element.contains(target as Node);

    if (!focusWasWithinContainer) {
      return;
    }

    const focusActions = {
      [TEXT_TYPE]: (): void => {
        if (target === this.input.element) {
          this.containerOuter.addFocusState();
        }
      },
      [SELECT_ONE_TYPE]: (): void => {
        this.containerOuter.addFocusState();
        if (target === this.input.element) {
          this.showDropdown(true);
        }
      },
      [SELECT_MULTIPLE_TYPE]: (): void => {
        if (target === this.input.element) {
          this.showDropdown(true);
          // If element is a select box, the focused element is the container and the dropdown
          // isn't already open, focus and show dropdown
          this.containerOuter.addFocusState();
        }
      },
    };

    focusActions[this.passedElement.element.type]();
  }

  _onBlur({ target }: Pick<FocusEvent, 'target'>): void {
    const blurWasWithinContainer =
      target && this.containerOuter.element.contains(target as Node);

    if (blurWasWithinContainer && !this._isScrollingOnIe) {
      const { activeItems } = this._store;
      const hasHighlightedItems = activeItems.some((item) => item.highlighted);
      const blurActions = {
        [TEXT_TYPE]: (): void => {
          if (target === this.input.element) {
            this.containerOuter.removeFocusState();
            if (hasHighlightedItems) {
              this.unhighlightAll();
            }
            this.hideDropdown(true);
          }
        },
        [SELECT_ONE_TYPE]: (): void => {
          this.containerOuter.removeFocusState();
          if (
            target === this.input.element ||
            (target === this.containerOuter.element && !this._canSearch)
          ) {
            this.hideDropdown(true);
          }
        },
        [SELECT_MULTIPLE_TYPE]: (): void => {
          if (target === this.input.element) {
            this.containerOuter.removeFocusState();
            this.hideDropdown(true);
            if (hasHighlightedItems) {
              this.unhighlightAll();
            }
          }
        },
      };

      blurActions[this.passedElement.element.type]();
    } else {
      // On IE11, clicking the scollbar blurs our input and thus
      // closes the dropdown. To stop this, we refocus our input
      // if we know we are on IE *and* are scrolling.
      this._isScrollingOnIe = false;
      this.input.element.focus();
    }
  }

  _onFormReset(): void {
    this._store.dispatch(resetTo(this._initialState));
  }

  _highlightChoice(el: HTMLElement | null = null): void {
    const choices: HTMLElement[] = Array.from(
      this.dropdown.element.querySelectorAll('[data-choice-selectable]'),
    );

    if (!choices.length) {
      return;
    }

    let passedEl = el;
    const highlightedChoices = Array.from(
      this.dropdown.element.querySelectorAll(
        `.${this.config.classNames.highlightedState}`,
      ),
    );

    // Remove any highlighted choices
    highlightedChoices.forEach((choice) => {
      choice.classList.remove(this.config.classNames.highlightedState);
      choice.setAttribute('aria-selected', 'false');
    });

    if (passedEl) {
      this._highlightPosition = choices.indexOf(passedEl);
    } else {
      // Highlight choice based on last known highlight location
      if (choices.length > this._highlightPosition) {
        // If we have an option to highlight
        passedEl = choices[this._highlightPosition];
      } else {
        // Otherwise highlight the option before
        passedEl = choices[choices.length - 1];
      }

      if (!passedEl) {
        passedEl = choices[0];
      }
    }

    passedEl.classList.add(this.config.classNames.highlightedState);
    passedEl.setAttribute('aria-selected', 'true');
    this.passedElement.triggerEvent(EVENTS.highlightChoice, { el: passedEl });

    if (this.dropdown.isActive) {
      // IE11 ignores aria-label and blocks virtual keyboard
      // if aria-activedescendant is set without a dropdown
      this.input.setActiveDescendant(passedEl.id);
      this.containerOuter.setActiveDescendant(passedEl.id);
    }
  }

  _addItem({
    value,
    label = null,
    choiceId = -1,
    groupId = -1,
    customProperties = {},
    placeholder = false,
    keyCode = -1,
  }: {
    value: string;
    label?: string | null;
    choiceId?: number;
    groupId?: number;
    customProperties?: object;
    placeholder?: boolean;
    keyCode?: number;
  }): void {
    let passedValue = typeof value === 'string' ? value.trim() : value;

    const { items } = this._store;
    const passedLabel = label || passedValue;
    const passedOptionId = choiceId || -1;
    const group = groupId >= 0 ? this._store.getGroupById(groupId) : null;
    const id = items ? items.length + 1 : 1;

    // If a prepended value has been passed, prepend it
    if (this.config.prependValue) {
      passedValue = this.config.prependValue + passedValue.toString();
    }

    // If an appended value has been passed, append it
    if (this.config.appendValue) {
      passedValue += this.config.appendValue.toString();
    }

    this._store.dispatch(
      addItem({
        value: passedValue,
        label: passedLabel,
        id,
        choiceId: passedOptionId,
        groupId,
        customProperties,
        placeholder,
        keyCode,
      }),
    );

    if (this._isSelectOneElement) {
      this.removeActiveItems(id);
    }

    // Trigger change event
    this.passedElement.triggerEvent(EVENTS.addItem, {
      id,
      value: passedValue,
      label: passedLabel,
      customProperties,
      groupValue: group && group.value ? group.value : null,
      keyCode,
    });
  }

  _removeItem(item: Item): void {
    const { id, value, label, customProperties, choiceId, groupId } = item;
    const group =
      groupId && groupId >= 0 ? this._store.getGroupById(groupId) : null;

    if (!id || !choiceId) {
      return;
    }

    this._store.dispatch(removeItem(id, choiceId));
    this.passedElement.triggerEvent(EVENTS.removeItem, {
      id,
      value,
      label,
      customProperties,
      groupValue: group && group.value ? group.value : null,
    });
  }

  _addChoice({
    value,
    label = null,
    isSelected = false,
    isDisabled = false,
    groupId = -1,
    customProperties = {},
    placeholder = false,
    keyCode = -1,
  }: {
    value: string;
    label?: string | null;
    isSelected?: boolean;
    isDisabled?: boolean;
    groupId?: number;
    customProperties?: Record<string, any>;
    placeholder?: boolean;
    keyCode?: number;
  }): void {
    if (typeof value === 'undefined' || value === null) {
      return;
    }

    // Generate unique id
    const { choices } = this._store;
    const choiceLabel = label || value;
    const choiceId = choices ? choices.length + 1 : 1;
    const choiceElementId = `${this._baseId}-${this._idNames.itemChoice}-${choiceId}`;

    this._store.dispatch(
      addChoice({
        id: choiceId,
        groupId,
        elementId: choiceElementId,
        value,
        label: choiceLabel,
        disabled: isDisabled,
        customProperties,
        placeholder,
        keyCode,
      }),
    );

    if (isSelected) {
      this._addItem({
        value,
        label: choiceLabel,
        choiceId,
        customProperties,
        placeholder,
        keyCode,
      });
    }
  }

  _addGroup({ group, id, valueKey = 'value', labelKey = 'label' }): void {
    const groupChoices: Choice[] | HTMLOptionElement[] = isType('Object', group)
      ? group.choices
      : Array.from(group.getElementsByTagName('OPTION'));
    const groupId = id || Math.floor(new Date().valueOf() * Math.random());
    const isDisabled = group.disabled ? group.disabled : false;

    if (groupChoices) {
      this._store.dispatch(
        addGroup({
          value: group.label,
          id: groupId,
          active: true,
          disabled: isDisabled,
        }),
      );

      const addGroupChoices = (choice: any): void => {
        const isOptDisabled =
          choice.disabled || (choice.parentNode && choice.parentNode.disabled);

        this._addChoice({
          value: choice[valueKey],
          label: isType('Object', choice) ? choice[labelKey] : choice.innerHTML,
          isSelected: choice.selected,
          isDisabled: isOptDisabled,
          groupId,
          customProperties: choice.customProperties,
          placeholder: choice.placeholder,
        });
      };

      groupChoices.forEach(addGroupChoices);
    } else {
      this._store.dispatch(
        addGroup({
          value: group.label,
          id: group.id,
          active: false,
          disabled: group.disabled,
        }),
      );
    }
  }

  _getTemplate(template: string, ...args: any): any {
    return this._templates[template].call(this, this.config, ...args);
  }

  _createTemplates(): void {
    const { callbackOnCreateTemplates } = this.config;
    let userTemplates = {};

    if (
      callbackOnCreateTemplates &&
      typeof callbackOnCreateTemplates === 'function'
    ) {
      userTemplates = callbackOnCreateTemplates.call(this, strToEl);
    }

    this._templates = merge(templates, userTemplates);
  }

  _createElements(): void {
    this.containerOuter = new Container({
      element: this._getTemplate(
        'containerOuter',
        this._direction,
        this._isSelectElement,
        this._isSelectOneElement,
        this.config.searchEnabled,
        this.passedElement.element.type,
        this.config.labelId,
      ),
      classNames: this.config.classNames,
      type: this.passedElement.element.type as PassedElement['type'],
      position: this.config.position,
    });

    this.containerInner = new Container({
      element: this._getTemplate('containerInner'),
      classNames: this.config.classNames,
      type: this.passedElement.element.type as PassedElement['type'],
      position: this.config.position,
    });

    this.input = new Input({
      element: this._getTemplate('input', this._placeholderValue),
      classNames: this.config.classNames,
      type: this.passedElement.element.type as PassedElement['type'],
      preventPaste: !this.config.paste,
    });

    this.choiceList = new List({
      element: this._getTemplate('choiceList', this._isSelectOneElement),
    });

    this.itemList = new List({
      element: this._getTemplate('itemList', this._isSelectOneElement),
    });

    this.dropdown = new Dropdown({
      element: this._getTemplate('dropdown'),
      classNames: this.config.classNames,
      type: this.passedElement.element.type as PassedElement['type'],
    });
  }

  _createStructure(): void {
    // Hide original element
    this.passedElement.conceal();
    // Wrap input in container preserving DOM ordering
    this.containerInner.wrap(this.passedElement.element);
    // Wrapper inner container with outer container
    this.containerOuter.wrap(this.containerInner.element);

    if (this._isSelectOneElement) {
      this.input.placeholder = this.config.searchPlaceholderValue || '';
    } else if (this._placeholderValue) {
      this.input.placeholder = this._placeholderValue;
      this.input.setWidth();
    }

    this.containerOuter.element.appendChild(this.containerInner.element);
    this.containerOuter.element.appendChild(this.dropdown.element);
    this.containerInner.element.appendChild(this.itemList.element);

    if (!this._isTextElement) {
      this.dropdown.element.appendChild(this.choiceList.element);
    }

    if (!this._isSelectOneElement) {
      this.containerInner.element.appendChild(this.input.element);
    } else if (this.config.searchEnabled) {
      this.dropdown.element.insertBefore(
        this.input.element,
        this.dropdown.element.firstChild,
      );
    }

    if (this._isSelectElement) {
      this._highlightPosition = 0;
      this._isSearching = false;
      this._startLoading();

      if (this._presetGroups.length) {
        this._addPredefinedGroups(this._presetGroups);
      } else {
        this._addPredefinedChoices(this._presetChoices);
      }

      this._stopLoading();
    }

    if (this._isTextElement) {
      this._addPredefinedItems(this._presetItems);
    }
  }

  _addPredefinedGroups(
    groups: Group[] | HTMLOptGroupElement[] | Element[],
  ): void {
    // If we have a placeholder option
    const placeholderChoice = (this.passedElement as WrappedSelect)
      .placeholderOption;

    if (
      placeholderChoice &&
      placeholderChoice.parentNode &&
      (placeholderChoice.parentNode as HTMLElement).tagName === 'SELECT'
    ) {
      this._addChoice({
        value: placeholderChoice.value,
        label: placeholderChoice.innerHTML,
        isSelected: placeholderChoice.selected,
        isDisabled: placeholderChoice.disabled,
        placeholder: true,
      });
    }

    groups.forEach((group) =>
      this._addGroup({
        group,
        id: group.id || null,
      }),
    );
  }

  _addPredefinedChoices(choices: Partial<Choice>[]): void {
    // If sorting is enabled or the user is searching, filter choices
    if (this.config.shouldSort) {
      choices.sort(this.config.sorter);
    }

    const hasSelectedChoice = choices.some((choice) => choice.selected);
    const firstEnabledChoiceIndex = choices.findIndex(
      (choice) => choice.disabled === undefined || !choice.disabled,
    );

    choices.forEach((choice, index) => {
      const { value = '', label, customProperties, placeholder } = choice;

      if (this._isSelectElement) {
        // If the choice is actually a group
        if (choice.choices) {
          this._addGroup({
            group: choice,
            id: choice.id || null,
          });
        } else {
          /**
           * If there is a selected choice already or the choice is not the first in
           * the array, add each choice normally.
           *
           * Otherwise we pre-select the first enabled choice in the array ("select-one" only)
           */
          const shouldPreselect =
            this._isSelectOneElement &&
            !hasSelectedChoice &&
            index === firstEnabledChoiceIndex;

          const isSelected = shouldPreselect ? true : choice.selected;
          const isDisabled = choice.disabled;

          this._addChoice({
            value,
            label,
            isSelected: !!isSelected,
            isDisabled: !!isDisabled,
            placeholder: !!placeholder,
            customProperties,
          });
        }
      } else {
        this._addChoice({
          value,
          label,
          isSelected: !!choice.selected,
          isDisabled: !!choice.disabled,
          placeholder: !!choice.placeholder,
          customProperties,
        });
      }
    });
  }

  _addPredefinedItems(items: Item[] | string[]): void {
    items.forEach((item) => {
      if (typeof item === 'object' && item.value) {
        this._addItem({
          value: item.value,
          label: item.label,
          choiceId: item.id,
          customProperties: item.customProperties,
          placeholder: item.placeholder,
        });
      }

      if (typeof item === 'string') {
        this._addItem({
          value: item,
        });
      }
    });
  }

  _setChoiceOrItem(item: any): void {
    const itemType = getType(item).toLowerCase();
    const handleType = {
      object: (): void => {
        if (!item.value) {
          return;
        }

        // If we are dealing with a select input, we need to create an option first
        // that is then selected. For text inputs we can just add items normally.
        if (!this._isTextElement) {
          this._addChoice({
            value: item.value,
            label: item.label,
            isSelected: true,
            isDisabled: false,
            customProperties: item.customProperties,
            placeholder: item.placeholder,
          });
        } else {
          this._addItem({
            value: item.value,
            label: item.label,
            choiceId: item.id,
            customProperties: item.customProperties,
            placeholder: item.placeholder,
          });
        }
      },
      string: (): void => {
        if (!this._isTextElement) {
          this._addChoice({
            value: item,
            label: item,
            isSelected: true,
            isDisabled: false,
          });
        } else {
          this._addItem({
            value: item,
          });
        }
      },
    };

    handleType[itemType]();
  }

  _findAndSelectChoiceByValue(value: string): void {
    const { choices } = this._store;
    // Check 'value' property exists and the choice isn't already selected
    const foundChoice = choices.find((choice) =>
      this.config.valueComparer(choice.value, value),
    );

    if (foundChoice && !foundChoice.selected) {
      this._addItem({
        value: foundChoice.value,
        label: foundChoice.label,
        choiceId: foundChoice.id,
        groupId: foundChoice.groupId,
        customProperties: foundChoice.customProperties,
        placeholder: foundChoice.placeholder,
        keyCode: foundChoice.keyCode,
      });
    }
  }

  _generatePlaceholderValue(): string | null {
    if (
      this._isSelectElement &&
      (this.passedElement as WrappedSelect).placeholderOption
    ) {
      const { placeholderOption } = this.passedElement as WrappedSelect;

      return placeholderOption ? placeholderOption.text : null;
    }

    const { placeholder, placeholderValue } = this.config;
    const {
      element: { dataset },
    } = this.passedElement;

    if (placeholder) {
      if (placeholderValue) {
        return placeholderValue;
      }

      if (dataset.placeholder) {
        return dataset.placeholder;
      }
    }

    return null;
  }
}

export default Choices;
