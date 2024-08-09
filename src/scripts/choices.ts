/* eslint-disable @typescript-eslint/no-explicit-any */
import search from './search';

import {
  activateChoices,
  addChoice,
  removeChoice,
  clearChoices,
  filterChoices,
} from './actions/choices';
import { addGroup } from './actions/groups';
import { addItem, highlightItem, removeItem } from './actions/items';
import { clearAll } from './actions/misc';
import {
  Container,
  Dropdown,
  Input,
  List,
  WrappedInput,
  WrappedSelect,
} from './components';
import { SELECT_MULTIPLE_TYPE, SELECT_ONE_TYPE, TEXT_TYPE } from './constants';
import { DEFAULT_CONFIG } from './defaults';
import { InputChoice } from './interfaces/input-choice';
import { InputGroup } from './interfaces/input-group';
import { Notice } from './interfaces/notice';
import { Options, ObjectsInConfig } from './interfaces/options';
import { PassedElement } from './interfaces/passed-element';
import { State } from './interfaces/state';
import {
  diff,
  generateId,
  getAdjacentEl,
  getClassNames,
  getClassNamesSelector,
  isScrolledIntoView,
  sanitise,
  sortByScore,
  strToEl,
} from './lib/utils';
import { defaultState } from './reducers';
import Store from './store/store';
import templates, { escapeForTemplate } from './templates';
import { mapInputToChoice } from './lib/choice-input';
import { ChoiceFull } from './interfaces/choice-full';
import { GroupFull } from './interfaces/group-full';
import { EventType, KeyCodeMap, PassedElementType } from './interfaces';
import { Choices as ChoicesInterface } from './interfaces/choices';
import { EventChoice } from './interfaces/event-choice';
import { Templates } from './interfaces/templates';
import { SearchHandler } from './interfaces/search';
import {
  isHtmlInputElement,
  isHtmlSelectElement,
} from './lib/html-guard-statements';

/** @see {@link http://browserhacks.com/#hack-acea075d0ac6954f275a70023906050c} */
const IS_IE11 =
  '-ms-scroll-limit' in document.documentElement.style &&
  '-ms-ime-align' in document.documentElement.style;

const USER_DEFAULTS: Partial<Options> = {};

const parseDataSetId = (element?: HTMLElement): number | undefined => {
  if (!element) {
    return undefined;
  }

  const { id } = element.dataset;

  return id ? parseInt(id, 10) : undefined;
};

/**
 * Choices
 * @author Josh Johnson<josh@joshuajohnson.co.uk>
 */
class Choices implements ChoicesInterface {
  static version: string = 'git';

  static get defaults(): {
    options: Partial<Options>;
    allOptions: Options;
    templates: Templates;
  } {
    return Object.preventExtensions({
      get options(): Partial<Options> {
        return USER_DEFAULTS;
      },
      get allOptions(): Options {
        return DEFAULT_CONFIG;
      },
      get templates(): Templates {
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

  _elementType: PassedElementType;

  _isTextElement: boolean;

  _isSelectOneElement: boolean;

  _isSelectMultipleElement: boolean;

  _isSelectElement: boolean;

  _hasNonChoicePlaceholder: boolean = false;

  _canAddUserChoices: boolean;

  _store: Store;

  _templates: Templates;

  _initialState: State;

  _currentState: State;

  _prevState: State;

  _lastAddedChoiceId: number = 0;

  _lastAddedGroupId: number = 0;

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

  _presetChoices: (ChoiceFull | GroupFull)[];

  _presetItems: ChoiceFull[];

  _initialItems: string[];

  _searchFn: SearchHandler;

  constructor(
    element:
      | string
      | Element
      | HTMLInputElement
      | HTMLSelectElement = '[data-choice]',
    userConfig: Partial<Options> = {},
  ) {
    this.config = {
      ...Choices.defaults.allOptions,
      ...Choices.defaults.options,
      ...userConfig,
    } as Options;
    ObjectsInConfig.forEach((key) => {
      this.config[key] = {
        ...Choices.defaults.allOptions[key],
        ...Choices.defaults.options[key],
        ...userConfig[key],
      };
    });

    if (!this.config.silent) {
      this._validateConfig();
    }

    const documentElement = this.config.shadowRoot || document.documentElement;
    const passedElement =
      typeof element === 'string'
        ? documentElement.querySelector(element)
        : element;

    if (
      !passedElement ||
      typeof passedElement !== 'object' ||
      !(isHtmlInputElement(passedElement) || isHtmlSelectElement(passedElement))
    ) {
      if (!passedElement && typeof element === 'string') {
        throw TypeError(`Selector ${element} failed to find an element`);
      }
      throw TypeError(
        `Expected one of the following types text|select-one|select-multiple`,
      );
    }

    this._elementType = passedElement.type as PassedElementType;
    this._isTextElement = this._elementType === TEXT_TYPE;
    if (this._isTextElement || this.config.maxItemCount !== 1) {
      this.config.singleModeForMultiSelect = false;
    }
    if (this.config.singleModeForMultiSelect) {
      this._elementType = SELECT_MULTIPLE_TYPE;
    }
    this._isSelectOneElement = this._elementType === SELECT_ONE_TYPE;
    this._isSelectMultipleElement = this._elementType === SELECT_MULTIPLE_TYPE;
    this._isSelectElement =
      this._isSelectOneElement || this._isSelectMultipleElement;
    this._canAddUserChoices =
      (this._isTextElement && this.config.addItems) ||
      (this._isSelectElement && this.config.addChoices);
    if (!['auto', 'always'].includes(`${this.config.renderSelectedChoices}`)) {
      this.config.renderSelectedChoices = 'auto';
    }

    if (this.config.placeholder) {
      if (this.config.placeholderValue) {
        this._hasNonChoicePlaceholder = true;
      } else if (passedElement.dataset.placeholder) {
        this._hasNonChoicePlaceholder = true;
        this.config.placeholderValue = passedElement.dataset.placeholder;
      }
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
      });
    } else {
      const selectEl = passedElement as HTMLSelectElement;
      this.passedElement = new WrappedSelect({
        element: selectEl,
        classNames: this.config.classNames,
        template: (data: ChoiceFull): HTMLOptionElement =>
          this._templates.option(data),
        extractPlaceholder:
          this.config.placeholder && !this._hasNonChoicePlaceholder,
      });
    }

    this.initialised = false;

    this._store = new Store();
    this._initialState = defaultState;
    this._currentState = defaultState;
    this._prevState = defaultState;
    this._currentValue = '';
    this.config.searchEnabled =
      (!this._isTextElement && this.config.searchEnabled) ||
      this._elementType === SELECT_MULTIPLE_TYPE;
    this._canSearch = this.config.searchEnabled;
    this._isScrollingOnIe = false;
    this._highlightPosition = 0;
    this._wasTap = true;
    this._placeholderValue = this._generatePlaceholderValue();
    this._baseId = generateId(this.passedElement.element, 'choices-');
    this._searchFn = search;

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

    this._render = this._render.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onInput = this._onInput.bind(this);
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
    // preserve the selected item list after setup for form reset
    this._initialItems = this._store.items.map((choice) => choice.value);
  }

  init(): void {
    if (this.initialised) {
      return;
    }

    this._loadChoices();
    this._createTemplates();
    this._createElements();
    this._createStructure();

    this._store.subscribe(this._render);

    this._render();
    this._addEventListeners();

    const shouldDisable =
      (this._isTextElement && !this.config.addItems) ||
      this.passedElement.element.hasAttribute('disabled') ||
      !!this.passedElement.element.closest('fieldset:disabled');

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
    this._stopSearch();

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

  highlightItem(item: InputChoice, runEvent = true): this {
    if (!item || !item.id) {
      return this;
    }
    const choice = this._store.choices.find((c) => c.id === item.id);
    if (!choice || choice.highlighted) {
      return this;
    }

    this._store.dispatch(highlightItem(choice, true));

    if (runEvent) {
      this.passedElement.triggerEvent(
        EventType.highlightItem,
        this._getChoiceForOutput(choice),
      );
    }

    return this;
  }

  unhighlightItem(item: InputChoice, runEvent = true): this {
    if (!item || !item.id) {
      return this;
    }
    const choice = this._store.choices.find((c) => c.id === item.id);
    if (!choice || !choice.highlighted) {
      return this;
    }

    this._store.dispatch(highlightItem(choice, false));

    if (runEvent) {
      this.passedElement.triggerEvent(
        EventType.highlightItem,
        this._getChoiceForOutput(choice),
      );
    }

    return this;
  }

  highlightAll(): this {
    this._store.withDeferRendering(() => {
      this._store.items.forEach((item) => this.highlightItem(item));
    });

    return this;
  }

  unhighlightAll(): this {
    this._store.withDeferRendering(() => {
      this._store.items.forEach((item) => this.unhighlightItem(item));
    });

    return this;
  }

  removeActiveItemsByValue(value: string): this {
    this._store.withDeferRendering(() => {
      this._store.items
        .filter((item) => item.value === value)
        .forEach((item) => this._removeItem(item));
    });

    return this;
  }

  removeActiveItems(excludedId: number): this {
    this._store.withDeferRendering(() => {
      this._store.items
        .filter(({ id }) => id !== excludedId)
        .forEach((item) => this._removeItem(item));
    });

    return this;
  }

  removeHighlightedItems(runEvent = false): this {
    this._store.withDeferRendering(() => {
      this._store.highlightedActiveItems.forEach((item) => {
        this._removeItem(item);
        // If this action was performed by the user
        // trigger the event
        if (runEvent) {
          this._triggerChange(item.value);
        }
      });
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

      this.passedElement.triggerEvent(EventType.showDropdown, {});
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

      this.passedElement.triggerEvent(EventType.hideDropdown, {});
    });

    return this;
  }

  getValue(valueOnly = false): string[] | EventChoice[] | EventChoice | string {
    const values = this._store.items.reduce<any[]>((selectedItems, item) => {
      const itemValue = valueOnly ? item.value : this._getChoiceForOutput(item);
      selectedItems.push(itemValue);

      return selectedItems;
    }, []);

    return this._isSelectOneElement || this.config.singleModeForMultiSelect
      ? values[0]
      : values;
  }

  setValue(items: string[] | InputChoice[]): this {
    if (!this.initialised) {
      return this;
    }

    this._store.withDeferRendering(() => {
      items.forEach((value: string | InputChoice) => {
        if (value) {
          this._addChoice(mapInputToChoice(value, false));
        }
      });
    });

    return this;
  }

  setChoiceByValue(value: string | string[]): this {
    if (!this.initialised || this._isTextElement) {
      return this;
    }
    this._store.withDeferRendering(() => {
      // If only one value has been passed, convert to array
      const choiceValue = Array.isArray(value) ? value : [value];

      // Loop through each value and
      choiceValue.forEach((val) => this._findAndSelectChoiceByValue(val));
    });

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
      | (InputChoice | InputGroup)[]
      | ((
          instance: Choices,
        ) =>
          | (InputChoice | InputGroup)[]
          | Promise<(InputChoice | InputGroup)[]>) = [],
    value: string | null = 'value',
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
          .then((data: InputChoice[]) =>
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

    this._store.withDeferRendering(() => {
      const isDefaultValue = value === 'value';
      const isDefaultLabel = label === 'label';

      choicesArrayOrFetcher.forEach(
        (groupOrChoice: InputGroup | InputChoice) => {
          if ('choices' in groupOrChoice) {
            let group = groupOrChoice;
            if (!isDefaultLabel) {
              group = {
                ...group,
                label: group[label],
              } as InputGroup;
            }

            this._addGroup(mapInputToChoice(group, true));
          } else {
            let choice = groupOrChoice;
            if (!isDefaultLabel || !isDefaultValue) {
              choice = {
                ...choice,
                value: choice[value],
                label: choice[label],
              } as InputChoice;
            }
            this._addChoice(mapInputToChoice(choice, false));
          }
        },
      );
    });

    return this;
  }

  refresh(
    withEvents: boolean = false,
    selectFirstOption: boolean = false,
    deselectAll: boolean = false,
  ): this {
    if (!this._isSelectElement) {
      if (!this.config.silent) {
        console.warn(
          'refresh method can only be used on choices backed by a <select> element',
        );
      }

      return this;
    }

    this._store.withDeferRendering(() => {
      const choicesFromOptions = (
        this.passedElement as WrappedSelect
      ).optionsAsChoices();

      const { items } = this._store;
      // Build the list of items which require preserving
      const existingItems = {};
      if (!deselectAll) {
        items.forEach((choice) => {
          if (
            choice.id &&
            choice.active &&
            choice.selected &&
            !choice.disabled
          ) {
            existingItems[choice.value] = true;
          }
        });
      }

      choicesFromOptions.forEach((groupOrChoice) => {
        if ('choices' in groupOrChoice) {
          return;
        }

        const choice = groupOrChoice;
        if (deselectAll) {
          choice.selected = false;
        } else if (existingItems[choice.value]) {
          choice.selected = true;
        }
      });

      this.clearStore();
      /* @todo only generate add events for the added options instead of all
      if (withEvents) {
        items.forEach((choice) => {
          if (existingItems[choice.value]) {
            this.passedElement.triggerEvent(
              EventType.removeItem,
              this._getChoiceForEvent(choice),
            );
          }
        });
      }
      */

      // load new choices & items
      this._addPredefinedChoices(
        choicesFromOptions,
        selectFirstOption,
        withEvents,
      );

      // re-do search if required
      if (this._isSearching) {
        this._searchChoices(this.input.value);
      }
    });

    return this;
  }

  removeChoice(value: string): this {
    const choice = this._store.choices.find((c) => c.value === value);
    if (!choice) {
      return this;
    }
    this._store.dispatch(removeChoice(choice));

    if (choice.selected) {
      this.passedElement.triggerEvent(
        EventType.removeItem,
        this._getChoiceForOutput(choice),
      );
    }

    return this;
  }

  clearChoices(): this {
    this._store.dispatch(clearChoices());

    return this;
  }

  clearStore(): this {
    this._store.dispatch(clearAll());
    this._lastAddedChoiceId = 0;
    this._lastAddedGroupId = 0;

    return this;
  }

  clearInput(): this {
    const shouldSetInputWidth = !this._isSelectOneElement;
    this.input.clear(shouldSetInputWidth);

    if (this._isSearching) {
      this._stopSearch();
    }

    return this;
  }

  _validateConfig(): void {
    const invalidConfigOptions = diff(this.config, DEFAULT_CONFIG);
    if (invalidConfigOptions.length) {
      console.warn(
        'Unknown config option(s) passed',
        invalidConfigOptions.join(', '),
      );
    }

    if (this.config.allowHTML && this.config.allowHtmlUserInput) {
      if (this.config.addItems) {
        console.warn(
          'Warning: allowHTML/allowHtmlUserInput/addItems all being true is strongly not recommended and may lead to XSS attacks',
        );
      }
      if (this.config.addChoices) {
        console.warn(
          'Warning: allowHTML/allowHtmlUserInput/addChoices all being true is strongly not recommended and may lead to XSS attacks',
        );
      }
    }
  }

  _render(): void {
    if (this._store.isLoading()) {
      return;
    }

    this._currentState = this._store.state;

    const shouldRenderItems =
      this._currentState.items !== this._prevState.items;
    const stateChanged =
      this._currentState.choices !== this._prevState.choices ||
      this._currentState.groups !== this._prevState.groups ||
      shouldRenderItems;

    if (!stateChanged) {
      return;
    }

    if (this._isSelectElement) {
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
          activeChoice.placeholder && activeChoice.groupId === -1,
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

    const { value } = this.input;
    const canAdd = this._canAddItem(this._store.items, value);

    if (
      choiceListFragment.childNodes &&
      choiceListFragment.childNodes.length > 0
    ) {
      let showNotice = !canAdd.response;
      // ...and we can select them
      if (canAdd.response) {
        // ...append them and highlight the first choice
        this.choiceList.append(choiceListFragment);
        this._highlightChoice();

        // for exact matches, do not prompt to add it as a custom choice
        if (this._canAddUserChoices && value && canAdd.notice) {
          showNotice = !activeChoices.find((choice) =>
            this.config.valueComparer(choice.value, value),
          );
        }
      }

      // when adding items, provide feedback while also displaying choices
      if (showNotice) {
        const notice = this._templates.notice(
          this.config,
          canAdd.notice,
          this._canAddUserChoices ? 'add-choice' : '',
        );
        this.choiceList.prepend(notice);
      }
    } else {
      // Otherwise show a notice
      let dropdownItem: Element | DocumentFragment;

      if (canAdd.response && this._canAddUserChoices && value) {
        dropdownItem = this._templates.notice(
          this.config,
          canAdd.notice,
          'add-choice',
        );
      } else if (this._isSearching) {
        const notice =
          typeof this.config.noResultsText === 'function'
            ? this.config.noResultsText()
            : this.config.noResultsText;

        dropdownItem = this._templates.notice(
          this.config,
          notice,
          'no-results',
        );
      } else {
        const notice =
          typeof this.config.noChoicesText === 'function'
            ? this.config.noChoicesText()
            : this.config.noChoicesText;

        dropdownItem = this._templates.notice(
          this.config,
          notice,
          'no-choices',
        );
      }

      this.choiceList.append(dropdownItem);
    }
  }

  _renderItems(): void {
    const items = this._store.items || [];
    this.itemList.clear();

    // Create a fragment to store our list items
    // (so we don't have to update the DOM for each item)
    const itemListFragment = this._createItemsFragment(items);

    // If we have items to add, append them
    if (itemListFragment.childNodes) {
      this.itemList.append(itemListFragment);
    }
  }

  _createGroupsFragment(
    groups: GroupFull[],
    choices: ChoiceFull[],
    fragment: DocumentFragment = document.createDocumentFragment(),
  ): DocumentFragment {
    const getGroupChoices = (group: GroupFull): ChoiceFull[] =>
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

    // Add Choices without group first, regardless of sort, otherwise they won't be distinguishable
    // from the last group
    const choicesWithoutGroup = choices.filter((c) => c.groupId === 0);
    if (choicesWithoutGroup.length > 0) {
      this._createChoicesFragment(choicesWithoutGroup, fragment, false);
    }

    groups.forEach((group) => {
      const groupChoices = getGroupChoices(group);
      if (groupChoices.length >= 1) {
        const dropdownGroup = this._templates.choiceGroup(this.config, group);
        fragment.appendChild(dropdownGroup);
        this._createChoicesFragment(groupChoices, fragment, true);
      }
    });

    return fragment;
  }

  _createChoicesFragment(
    choices: ChoiceFull[],
    fragment: DocumentFragment = document.createDocumentFragment(),
    withinGroup = false,
  ): DocumentFragment {
    // Create a fragment to store our list items (so we don't have to update the DOM for each item)
    const {
      renderSelectedChoices,
      searchResultLimit,
      renderChoiceLimit,
      appendGroupInSearch,
    } = this.config;
    const filter = this._isSearching ? sortByScore : this.config.sorter;
    const appendChoice = (choice: ChoiceFull): void => {
      const shouldRender =
        renderSelectedChoices === 'auto'
          ? this._isSelectOneElement || !choice.selected
          : true;

      if (shouldRender) {
        const dropdownItem = this._templates.choice(
          this.config,
          choice,
          this.config.itemSelectText,
        );
        if (appendGroupInSearch) {
          let groupName: string = '';
          this._store.groups.every((group) => {
            if (group.id === choice.groupId) {
              groupName = group.label;

              return false;
            }

            return true;
          });
          if (groupName && this._isSearching) {
            dropdownItem.innerHTML += ` (${groupName})`;
          }
        }
        fragment.appendChild(dropdownItem);
      }
    };

    let rendererableChoices = choices;

    if (renderSelectedChoices === 'auto' && !this._isSelectOneElement) {
      rendererableChoices = choices.filter((choice) => !choice.selected);
    }

    if (this._isSelectElement) {
      const backingOptions = choices.filter((choice) => !choice.element);
      if (backingOptions.length !== 0) {
        (this.passedElement as WrappedSelect).addOptions(backingOptions);
      }
    }

    // Split array into placeholders and "normal" choices
    const { placeholderChoices, normalChoices } = rendererableChoices.reduce(
      (acc, choice: ChoiceFull) => {
        if (choice.placeholder) {
          acc.placeholderChoices.push(choice);
        } else {
          acc.normalChoices.push(choice);
        }

        return acc;
      },
      {
        placeholderChoices: [] as ChoiceFull[],
        normalChoices: [] as ChoiceFull[],
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
    items: InputChoice[],
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
    }

    const addItemToFragment = (item: ChoiceFull): void => {
      // Create new list element
      const listItem = this._templates.item(
        this.config,
        item,
        removeItemButton,
      );
      // Append it to list
      fragment.appendChild(listItem);
    };

    // Add each list item to list
    items.forEach(addItemToFragment);

    if (
      this._isSelectOneElement &&
      this._hasNonChoicePlaceholder &&
      items.length === 0
    ) {
      addItemToFragment(
        mapInputToChoice<InputChoice>(
          {
            selected: true,
            value: '',
            label: this.config.placeholderValue || '',
            active: true,
            placeholder: true,
          },
          false,
        ),
      );
    }

    return fragment;
  }

  _getChoiceForOutput(
    choice?: ChoiceFull,
    keyCode?: number,
  ): EventChoice | undefined {
    if (!choice) {
      return undefined;
    }

    const group =
      choice.groupId > 0 ? this._store.getGroupById(choice.groupId) : null;

    return {
      id: choice.id,
      highlighted: choice.highlighted,
      labelClass: choice.labelClass,
      labelDescription: choice.labelDescription,
      customProperties: choice.customProperties,
      disabled: choice.disabled,
      active: choice.active,
      label: choice.label,
      placeholder: choice.placeholder,
      value: choice.value,
      groupValue: group && group.label ? group.label : undefined,
      element: choice.element,
      keyCode,
    };
  }

  _triggerChange(value): void {
    if (value === undefined || value === null) {
      return;
    }

    this.passedElement.triggerEvent(EventType.change, {
      value,
    });
  }

  _selectPlaceholderChoice(placeholderChoice: ChoiceFull): void {
    this._addItem(placeholderChoice);

    if (placeholderChoice.value) {
      this._triggerChange(placeholderChoice.value);
    }
  }

  _handleButtonAction(items: ChoiceFull[], element?: HTMLElement): void {
    if (
      items.length === 0 ||
      !this.config.removeItems ||
      !this.config.removeItemButton
    ) {
      return;
    }

    const id = element && parseDataSetId(element.parentNode as HTMLElement);
    const itemToRemove = id && items.find((item) => item.id === id);
    if (!itemToRemove) {
      return;
    }

    // Remove item associated with button
    this._removeItem(itemToRemove);
    this._triggerChange(itemToRemove.value);

    if (this._isSelectOneElement && !this._hasNonChoicePlaceholder) {
      const { placeholderChoice } = this._store;
      if (placeholderChoice) {
        this._selectPlaceholderChoice(placeholderChoice);
      }
    }
  }

  _handleItemAction(
    items: InputChoice[],
    element?: HTMLElement,
    hasShiftKey = false,
  ): void {
    if (
      items.length === 0 ||
      !this.config.removeItems ||
      this._isSelectOneElement
    ) {
      return;
    }

    const id = parseDataSetId(element);
    if (!id) {
      return;
    }

    // We only want to select one item with a click
    // so we deselect any items that aren't the target
    // unless shift is being pressed
    items.forEach((item) => {
      if (item.id === id && !item.highlighted) {
        this.highlightItem(item);
      } else if (!hasShiftKey && item.highlighted) {
        this.unhighlightItem(item);
      }
    });

    // Focus input as without focus, a user cannot do anything with a
    // highlighted item
    this.input.focus();
  }

  _handleChoiceAction(
    items: ChoiceFull[],
    element?: HTMLElement,
    keyCode?: number,
  ): boolean {
    // If we are clicking on an option
    const id = parseDataSetId(element);
    const choice = id && this._store.getChoiceById(id);
    if (!choice) {
      return false;
    }

    const hasActiveDropdown = this.dropdown.isActive;

    let addedItem = false;
    this._store.withDeferRendering(() => {
      if (!choice.selected && !choice.disabled) {
        const canAddItem = this._canAddItem(items, choice.value);

        if (canAddItem.response) {
          if (this.config.singleModeForMultiSelect) {
            if (items.length !== 0) {
              const lastItem = items[items.length - 1];
              this._removeItem(lastItem);
            }
          }

          this.passedElement.triggerEvent(
            EventType.choice,
            this._getChoiceForOutput(choice, keyCode),
          );

          this._addItem(choice);
          this.clearInput();
          addedItem = true;
        }
      }
    });
    if (!addedItem) {
      return false;
    }

    this._triggerChange(choice.value);

    // We want to close the dropdown if we are dealing with a single select box
    if (
      hasActiveDropdown &&
      (this.config.singleModeForMultiSelect || this._isSelectOneElement)
    ) {
      this.hideDropdown(true);
      this.containerOuter.focus();
    }

    return true;
  }

  _handleBackspace(items: ChoiceFull[]): void {
    if (!this.config.removeItems || items.length === 0) {
      return;
    }

    const lastItem = items[items.length - 1];
    const hasHighlightedItems = items.some((item) => item.highlighted);

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

  _loadChoices(): void {
    if (this._isTextElement) {
      // Assign preset items from passed object first
      this._presetItems = this.config.items.map((e: InputChoice | string) =>
        mapInputToChoice(e, false),
      );
      // Add any values passed from attribute
      const { value } = this.passedElement;
      if (value) {
        const elementItems: ChoiceFull[] = value
          .split(this.config.delimiter)
          .map((e: InputChoice | string) => mapInputToChoice(e, false));
        this._presetItems = this._presetItems.concat(elementItems);
      }
      this._presetItems.forEach((obj) => {
        // eslint-disable-next-line no-param-reassign
        obj.selected = true;
      });
    } else if (this._isSelectElement) {
      // Assign preset choices from passed object
      this._presetChoices = this.config.choices.map((e: InputChoice) =>
        mapInputToChoice(e, true),
      );
      // Create array of choices from option elements
      const choicesFromOptions = (
        this.passedElement as WrappedSelect
      ).optionsAsChoices();
      if (choicesFromOptions) {
        this._presetChoices.push(...choicesFromOptions);
      }
    }
  }

  // noinspection JSUnusedGlobalSymbols
  _startLoading(): void {
    this._store.startDeferRendering();
  }

  // noinspection JSUnusedGlobalSymbols
  _stopLoading(): void {
    this._store.stopDeferRendering();
  }

  _handleLoadingState(setLoading = true): void {
    let placeholderItem: HTMLElement | null =
      this.itemList.element.querySelector(
        getClassNamesSelector(this.config.classNames.placeholder),
      );

    if (setLoading) {
      this.disable();
      this.containerOuter.addLoadingState();

      if (this._isSelectOneElement) {
        if (!placeholderItem) {
          placeholderItem = this._templates.placeholder(
            this.config,
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

  _handleSearch(value?: string): void {
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
      if (resultCount !== null) {
        // Trigger search event
        this.passedElement.triggerEvent(EventType.search, {
          value,
          resultCount,
        });
      }
    } else if (hasUnactiveChoices) {
      this._stopSearch();
    }
  }

  _canAddItem(items: InputChoice[], value: string): Notice {
    let canAddItem = true;
    let notice = '';

    if (
      this.config.maxItemCount > 0 &&
      this.config.maxItemCount <= items.length
    ) {
      // If there is a max entry limit and we have reached that limit
      // don't update
      if (!this.config.singleModeForMultiSelect) {
        canAddItem = false;
        notice =
          typeof this.config.maxItemText === 'function'
            ? this.config.maxItemText(this.config.maxItemCount)
            : this.config.maxItemText;
      }
    }

    if (
      canAddItem &&
      this._canAddUserChoices &&
      value !== '' &&
      typeof this.config.addItemFilter === 'function' &&
      !this.config.addItemFilter(value)
    ) {
      canAddItem = false;
      notice =
        typeof this.config.customAddItemText === 'function'
          ? this.config.customAddItemText(sanitise(value), value)
          : this.config.customAddItemText;
    }

    if (
      canAddItem &&
      value !== '' &&
      (this._isSelectElement || !this.config.duplicateItemsAllowed)
    ) {
      const foundChoice = this._store.items.find((choice) =>
        this.config.valueComparer(choice.value, value),
      );
      if (foundChoice) {
        canAddItem = false;
        notice =
          typeof this.config.uniqueItemText === 'function'
            ? this.config.uniqueItemText(sanitise(value), value)
            : this.config.uniqueItemText;
      }
    }

    if (canAddItem) {
      notice =
        typeof this.config.addItemText === 'function'
          ? this.config.addItemText(sanitise(value), value)
          : this.config.addItemText;
    }

    return {
      response: canAddItem,
      notice: {
        trusted: notice,
      },
    };
  }

  _searchChoices(value: string): number | null {
    const newValue = value.trim().replace(/\s{2,}/, ' ');

    // signal input didn't change search
    if (newValue.length === 0 || newValue === this._currentValue) {
      return null;
    }

    // If new value matches the desired length and is not the same as the current value with a space
    const haystack = this._store.searchableChoices;
    const results = this._searchFn<ChoiceFull>(this.config, haystack, newValue);

    this._currentValue = newValue;
    this._highlightPosition = 0;
    this._isSearching = true;
    this._store.dispatch(filterChoices(results));

    return results.length;
  }

  _stopSearch(): void {
    const wasSearching = this._isSearching;
    this._currentValue = '';
    this._isSearching = false;
    if (wasSearching) {
      this._store.dispatch(activateChoices(true));
    }
  }

  _addEventListeners(): void {
    const documentElement = this.config.shadowRoot || document.documentElement;

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
    this.input.element.addEventListener('input', this._onInput, {
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
    const documentElement = this.config.shadowRoot || document.documentElement;

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
    this.input.element.removeEventListener('input', this._onInput);
    this.input.element.removeEventListener('focus', this._onFocus);
    this.input.element.removeEventListener('blur', this._onBlur);

    if (this.input.element.form) {
      this.input.element.form.removeEventListener('reset', this._onFormReset);
    }

    this.input.removeEventListeners();
  }

  _onKeyDown(event: KeyboardEvent): void {
    const { keyCode } = event;
    const { items } = this._store;
    const hasFocusedInput = this.input.isFocussed;
    const hasActiveDropdown = this.dropdown.isActive;
    const hasItems = this.itemList.hasChildren();
    /*
    See:
    https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
    https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
    https://en.wikipedia.org/wiki/UTF-16#Code_points_from_U+010000_to_U+10FFFF - UTF-16 surrogate pairs
    https://stackoverflow.com/a/70866532 - "Unidentified" for mobile
    http://www.unicode.org/versions/Unicode5.2.0/ch16.pdf#G19635 - U+FFFF is reserved (Section 16.7)

    Logic: when a key event is sent, `event.key` represents its printable value _or_ one
    of a large list of special values indicating meta keys/functionality. In addition,
    key events for compose functionality contain a value of `Dead` when mid-composition.

    I can't quite verify it, but non-English IMEs may also be able to generate key codes
    for code points in the surrogate-pair range, which could potentially be seen as having
    key.length > 1. Since `Fn` is one of the special keys, we can't distinguish by that
    alone.

    Here, key.length === 1 means we know for sure the input was printable and not a special
    `key` value. When the length is greater than 1, it could be either a printable surrogate
    pair or a special `key` value. We can tell the difference by checking if the _character
    code_ value (not code point!) is in the "surrogate pair" range or not.

    We don't use .codePointAt because an invalid code point would return 65535, which wouldn't
    pass the >= 0x10000 check we would otherwise use.

    > ...The Unicode Standard sets aside 66 noncharacter code points. The last two code points
    > of each plane are noncharacters: U+FFFE and U+FFFF on the BMP...
    */
    const wasPrintableChar =
      event.key.length === 1 ||
      (event.key.length === 2 && event.key.charCodeAt(0) >= 0xd800) ||
      event.key === 'Unidentified';

    if (!this._isTextElement && !hasActiveDropdown) {
      this.showDropdown();

      if (!this.input.isFocussed && wasPrintableChar) {
        /*
          We update the input value with the pressed key as
          the input was not focussed at the time of key press
          therefore does not have the value of the key.
        */
        this.input.value += event.key;
      }
    }

    switch (keyCode) {
      case KeyCodeMap.A_KEY:
        return this._onSelectKey(event, hasItems);
      case KeyCodeMap.ENTER_KEY:
        return this._onEnterKey(event, items, hasActiveDropdown);
      case KeyCodeMap.ESC_KEY:
        return this._onEscapeKey(event, hasActiveDropdown);
      case KeyCodeMap.UP_KEY:
      case KeyCodeMap.PAGE_UP_KEY:
      case KeyCodeMap.DOWN_KEY:
      case KeyCodeMap.PAGE_DOWN_KEY:
        return this._onDirectionKey(event, hasActiveDropdown);
      case KeyCodeMap.DELETE_KEY:
      case KeyCodeMap.BACK_KEY:
        return this._onDeleteKey(event, items, hasFocusedInput);
      default:
    }
  }

  _onKeyUp(/* event: KeyboardEvent */): void {
    this._canSearch = this.config.searchEnabled;
  }

  _onInput(/* event: InputEvent */): void {
    const { value } = this.input;
    if (!value) {
      if (this._isTextElement) {
        this.hideDropdown(true);
      } else {
        this._stopSearch();
      }

      return;
    }

    if (this._isTextElement) {
      const canAddItem = this._canAddItem(this._store.items, value);
      if (canAddItem.notice) {
        this._displayAddItemNotice(canAddItem);
        this.showDropdown(true);
      }
    }

    if (!this._canSearch) {
      return;
    }

    // do the search even if the entered text can not be added
    this._handleSearch(value);

    // determine if a notice needs to be displayed for why a search result can't be added
    const canAddItem = this._canAddItem(this._store.items, value);
    if (!canAddItem.response) {
      this._displayAddItemNotice(canAddItem);
    }
    if (this._canAddUserChoices) {
      // select the non-value so 'enter' doesn't select anything
      this._highlightPosition = 0;
      this._highlightChoice();
    }
  }

  _displayAddItemNotice(canAddItem: Notice): void {
    const dropdownItem = this._templates.notice(
      this.config,
      canAddItem.notice,
      'add-choice',
    );

    // only show the notice once!
    const selector = `${getClassNamesSelector(this.config.classNames.addChoice)}[data-choice-selectable]`;
    const noticeElement = this.choiceList.element.querySelector(selector);
    if (noticeElement) {
      noticeElement.outerHTML = dropdownItem.outerHTML;
    } else {
      this.choiceList.prepend(dropdownItem);
    }
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
    items: ChoiceFull[],
    hasActiveDropdown: boolean,
  ): void {
    const { value } = this.input;
    const target = event.target as HTMLElement | null;
    const targetWasRemoveButton = target && target.hasAttribute('data-button');
    let addedItem = false;

    if (targetWasRemoveButton) {
      event.preventDefault();
      this._handleButtonAction(items, target);

      return;
    }

    if (!hasActiveDropdown && this._isSelectOneElement) {
      event.preventDefault();
      this.showDropdown();

      return;
    }

    // add the highlighted item
    if (hasActiveDropdown) {
      const highlightedChoice: HTMLElement | null =
        this.dropdown.element.querySelector(
          getClassNamesSelector(this.config.classNames.highlightedState),
        );

      if (highlightedChoice) {
        addedItem = this._handleChoiceAction(
          items,
          highlightedChoice,
          KeyCodeMap.ENTER_KEY,
        );

        if (addedItem) {
          event.preventDefault();
          this.unhighlightAll();

          return;
        }
      }

      if (!value) {
        this.hideDropdown(true);
      }
    }

    if (!target || !value || !this._canAddUserChoices) {
      return;
    }

    const canAdd: Notice = this._canAddItem(items, value);
    if (!canAdd.response) {
      return;
    }
    this._store.withDeferRendering(() => {
      if (this._isSelectOneElement || this.config.singleModeForMultiSelect) {
        if (items.length !== 0) {
          const lastItem = items[items.length - 1];
          this._removeItem(lastItem);
        }
      }
      let choiceNotFound = true;
      if (this._isSelectElement || !this.config.duplicateItemsAllowed) {
        choiceNotFound = !this._findAndSelectChoiceByValue(value);
      }

      if (choiceNotFound) {
        const sanitisedValue = sanitise(value);
        const userValue =
          this.config.allowHtmlUserInput || sanitisedValue === value
            ? value
            : { escaped: sanitisedValue, raw: value };
        this._addChoice(
          mapInputToChoice(
            {
              value: userValue,
              label: userValue,
              selected: true,
            } as InputChoice,
            false,
          ),
        );
      }
      this.clearInput();
      this.unhighlightAll();

      this._triggerChange(value);
    });

    if (this._isTextElement || this._isSelectOneElement) {
      this.hideDropdown(true);
    }
  }

  _onEscapeKey(event: KeyboardEvent, hasActiveDropdown: boolean): void {
    if (hasActiveDropdown) {
      event.stopPropagation();
      this.hideDropdown(true);
      this.containerOuter.focus();
    }
  }

  _onDirectionKey(event: KeyboardEvent, hasActiveDropdown: boolean): void {
    const { keyCode, metaKey } = event;

    // If up or down key is pressed, traverse through options
    if (hasActiveDropdown || this._isSelectOneElement) {
      this.showDropdown();
      this._canSearch = false;

      const directionInt =
        keyCode === KeyCodeMap.DOWN_KEY || keyCode === KeyCodeMap.PAGE_DOWN_KEY
          ? 1
          : -1;
      const skipKey =
        metaKey ||
        keyCode === KeyCodeMap.PAGE_DOWN_KEY ||
        keyCode === KeyCodeMap.PAGE_UP_KEY;
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
          getClassNamesSelector(this.config.classNames.highlightedState),
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
    items: ChoiceFull[],
    hasFocusedInput: boolean,
  ): void {
    const { target } = event;
    // If backspace or delete key is pressed and the input has no value
    if (
      !this._isSelectOneElement &&
      !(target as HTMLInputElement).value &&
      hasFocusedInput
    ) {
      this._handleBackspace(items);
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

      this._isScrollingOnIe =
        this._direction === 'ltr'
          ? event.offsetX >= firstChoice.offsetWidth
          : event.offsetX < firstChoice.offsetLeft;
    }

    if (target === this.input.element) {
      return;
    }

    const item = target.closest('[data-button],[data-item],[data-choice]');
    if (item instanceof HTMLElement) {
      const hasShiftKey = event.shiftKey;
      const { items } = this._store;
      const { dataset } = item;

      if ('button' in dataset) {
        this._handleButtonAction(items, item);
      } else if ('item' in dataset) {
        this._handleItemAction(items, item, hasShiftKey);
      } else if ('choice' in dataset) {
        this._handleChoiceAction(items, item);
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

    focusActions[this._elementType]();
  }

  _onBlur({ target }: Pick<FocusEvent, 'target'>): void {
    const blurWasWithinContainer =
      target && this.containerOuter.element.contains(target as Node);

    if (blurWasWithinContainer && !this._isScrollingOnIe) {
      const { activeChoices } = this._store;
      const hasHighlightedItems = activeChoices.some(
        (item) => item.highlighted,
      );
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

      blurActions[this._elementType]();
    } else {
      // On IE11, clicking the scollbar blurs our input and thus
      // closes the dropdown. To stop this, we refocus our input
      // if we know we are on IE *and* are scrolling.
      this._isScrollingOnIe = false;
      this.input.element.focus();
    }
  }

  _onFormReset(): void {
    this._store.withDeferRendering(() => {
      this.clearInput();
      this.hideDropdown();
      this.refresh(false, false, true);

      if (this._initialItems.length !== 0) {
        this.setChoiceByValue(this._initialItems);
      }
    });
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
        getClassNamesSelector(this.config.classNames.highlightedState),
      ),
    );

    // Remove any highlighted choices
    highlightedChoices.forEach((choice) => {
      choice.classList.remove(
        ...getClassNames(this.config.classNames.highlightedState),
      );
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

    passedEl.classList.add(
      ...getClassNames(this.config.classNames.highlightedState),
    );
    passedEl.setAttribute('aria-selected', 'true');
    this.passedElement.triggerEvent(EventType.highlightChoice, {
      el: passedEl,
    });

    if (this.dropdown.isActive) {
      // IE11 ignores aria-label and blocks virtual keyboard
      // if aria-activedescendant is set without a dropdown
      this.input.setActiveDescendant(passedEl.id);
      this.containerOuter.setActiveDescendant(passedEl.id);
    }
  }

  _addItem(item: ChoiceFull, withEvents: boolean = true): void {
    const { id } = item;
    if (id === 0) {
      throw new TypeError(
        'item.id must be set before _addItem is called for a choice/item',
      );
    }

    this._store.dispatch(addItem(item));

    if (this._isSelectOneElement) {
      this.removeActiveItems(id);
    }

    if (withEvents) {
      this.passedElement.triggerEvent(
        EventType.addItem,
        this._getChoiceForOutput(item),
      );
    }
  }

  _removeItem(item: ChoiceFull): void {
    const { id } = item;
    if (!id) {
      return;
    }

    this._store.dispatch(removeItem(item));

    this.passedElement.triggerEvent(
      EventType.removeItem,
      this._getChoiceForOutput(item),
    );
  }

  _addChoice(choice: ChoiceFull, withEvents: boolean = true): void {
    if (choice.id !== 0) {
      throw new TypeError(
        'Can not re-add a choice which has already been added',
      );
    }

    // Generate unique id, in-place update is required so chaining _addItem works as expected
    const item = choice;
    this._lastAddedChoiceId++;
    item.id = this._lastAddedChoiceId;
    item.elementId = `${this._baseId}-${this._idNames.itemChoice}-${item.id}`;

    if (this.config.prependValue) {
      item.value = this.config.prependValue + item.value;
    }
    if (this.config.appendValue) {
      item.value += this.config.appendValue.toString();
    }
    if ((this.config.prependValue || this.config.appendValue) && item.element) {
      (item.element as HTMLOptionElement).value = item.value;
    }

    this._store.dispatch(addChoice(choice));

    if (choice.selected) {
      this._addItem(choice, withEvents);
    }
  }

  _addGroup(group: GroupFull, withEvents: boolean = true): void {
    if (group.id !== 0) {
      throw new TypeError(
        'Can not re-add a group which has already been added',
      );
    }

    this._store.dispatch(addGroup(group));

    if (!group.choices) {
      return;
    }

    // add unique id for the group(s), and do not store the full list of choices in this group
    const g = group;
    this._lastAddedGroupId++;
    g.id = this._lastAddedGroupId;
    const { id, choices } = group;
    g.choices = [];

    choices.forEach((choice: ChoiceFull) => {
      const item = choice;
      item.groupId = id;
      if (group.disabled) {
        item.disabled = true;
      }

      this._addChoice(item, withEvents);
    });
  }

  /**
   * @deprecated call this._templates.{template}(this.config, ...) instead
   * @param template
   * @param args
   */
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
      userTemplates = callbackOnCreateTemplates.call(
        this,
        strToEl,
        escapeForTemplate,
      );
    }

    const templating = {};
    Object.keys(templates).forEach((name) => {
      if (name in userTemplates) {
        templating[name] = userTemplates[name].bind(this);
      } else {
        templating[name] = templates[name].bind(this);
      }
    });

    this._templates = templating as Templates;
  }

  _createElements(): void {
    this.containerOuter = new Container({
      element: this._templates.containerOuter(
        this.config,
        this._direction,
        this._isSelectElement,
        this._isSelectOneElement,
        this.config.searchEnabled,
        this._elementType,
        this.config.labelId,
      ),
      classNames: this.config.classNames,
      type: this._elementType as PassedElement['type'],
      position: this.config.position,
    });

    this.containerInner = new Container({
      element: this._templates.containerInner(this.config),
      classNames: this.config.classNames,
      type: this._elementType as PassedElement['type'],
      position: this.config.position,
    });

    this.input = new Input({
      element: this._templates.input(this.config, this._placeholderValue),
      classNames: this.config.classNames,
      type: this._elementType as PassedElement['type'],
      preventPaste: !this.config.paste,
    });

    this.choiceList = new List({
      element: this._templates.choiceList(
        this.config,
        this._isSelectOneElement,
      ),
    });

    this.itemList = new List({
      element: this._templates.itemList(this.config, this._isSelectOneElement),
    });

    this.dropdown = new Dropdown({
      element: this._templates.dropdown(this.config),
      classNames: this.config.classNames,
      type: this._elementType as PassedElement['type'],
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
    } else {
      if (this._placeholderValue) {
        this.input.placeholder = this._placeholderValue;
      }
      this.input.setWidth();
    }

    this.containerOuter.element.appendChild(this.containerInner.element);
    this.containerOuter.element.appendChild(this.dropdown.element);
    this.containerInner.element.appendChild(this.itemList.element);
    this.dropdown.element.appendChild(this.choiceList.element);

    if (!this._isSelectOneElement) {
      this.containerInner.element.appendChild(this.input.element);
    } else if (this.config.searchEnabled) {
      this.dropdown.element.insertBefore(
        this.input.element,
        this.dropdown.element.firstChild,
      );
    }

    this._highlightPosition = 0;
    this._isSearching = false;
    this._store.withDeferRendering(() => {
      if (this._isSelectElement) {
        this._addPredefinedChoices(
          this._presetChoices,
          this._isSelectOneElement && !this._hasNonChoicePlaceholder,
        );
      } else if (this._isTextElement) {
        this._addPredefinedItems(this._presetItems);
      }
    });
  }

  _addPredefinedChoices(
    choices: (ChoiceFull | GroupFull)[],
    selectFirstOption: boolean = false,
    withEvents: boolean = true,
  ): void {
    // If sorting is enabled or the user is searching, filter choices
    if (this.config.shouldSort) {
      choices.sort(this.config.sorter);
    }

    if (selectFirstOption) {
      /**
       * If there is a selected choice already or the choice is not the first in
       * the array, add each choice normally.
       *
       * Otherwise we pre-select the first enabled choice in the array ("select-one" only)
       */
      const hasSelectedChoice =
        choices.findIndex(
          (choice) => !!(choice as Partial<InputChoice>).selected,
        ) === -1;
      if (hasSelectedChoice) {
        const i = choices.findIndex(
          (choice) => choice.disabled === undefined || !choice.disabled,
        );
        if (i !== -1) {
          const choice = choices[i] as InputChoice;
          choice.selected = true;
        }
      }
    }

    choices.forEach((item) => {
      if ('choices' in item) {
        if (this._isSelectElement) {
          this._addGroup(item, withEvents);
        }
      } else {
        this._addChoice(item, withEvents);
      }
    });
  }

  _addPredefinedItems(items: ChoiceFull[]): void {
    items.forEach((item) => {
      this._addChoice(item);
    });
  }

  _findAndSelectChoiceByValue(value: string): boolean {
    const { choices } = this._store;
    // Check 'value' property exists and the choice isn't already selected
    const foundChoice = choices.find((choice) =>
      this.config.valueComparer(choice.value, value),
    );

    if (foundChoice && !foundChoice.selected) {
      this._addItem(foundChoice);

      return true;
    }

    return false;
  }

  _generatePlaceholderValue(): string | null {
    if (!this.config.placeholder) {
      return null;
    }

    if (this._hasNonChoicePlaceholder) {
      return this.config.placeholderValue;
    }

    if (this._isSelectElement) {
      const { placeholderOption } = this.passedElement as WrappedSelect;

      return placeholderOption ? placeholderOption.text : null;
    }

    return null;
  }
}

export default Choices;
