import { Container, Dropdown, Input, List, WrappedInput, WrappedSelect } from './components';
import { Choice } from './interfaces/choice';
import { Group } from './interfaces/group';
import { Item } from './interfaces/item';
import { Notice } from './interfaces/notice';
import { Options } from './interfaces/options';
import { State } from './interfaces/state';
import Store from './store/store';
import templates from './templates';
/**
 * Choices
 * @author Josh Johnson<josh@joshuajohnson.co.uk>
 */
declare class Choices implements Choices {
    static get defaults(): {
        options: Partial<Options>;
        templates: typeof templates;
    };
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
    constructor(element?: string | Element | HTMLInputElement | HTMLSelectElement, userConfig?: Partial<Options>);
    init(): void;
    destroy(): void;
    enable(): this;
    disable(): this;
    highlightItem(item: Item, runEvent?: boolean): this;
    unhighlightItem(item: Item): this;
    highlightAll(): this;
    unhighlightAll(): this;
    removeActiveItemsByValue(value: string): this;
    removeActiveItems(excludedId: number): this;
    removeHighlightedItems(runEvent?: boolean): this;
    showDropdown(preventInputFocus?: boolean): this;
    hideDropdown(preventInputBlur?: boolean): this;
    getValue(valueOnly?: boolean): string[] | Item[] | Item | string;
    setValue(items: string[] | Item[]): this;
    setChoiceByValue(value: string): this;
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
    setChoices(choicesArrayOrFetcher?: Choice[] | Group[] | ((instance: Choices) => Choice[] | Promise<Choice[]>), value?: string, label?: string, replaceChoices?: boolean): this | Promise<this>;
    clearChoices(): this;
    clearStore(): this;
    clearInput(): this;
    _render(): void;
    _renderChoices(): void;
    _renderItems(): void;
    _createGroupsFragment(groups: Group[], choices: Choice[], fragment?: DocumentFragment): DocumentFragment;
    _createChoicesFragment(choices: Choice[], fragment?: DocumentFragment, withinGroup?: boolean): DocumentFragment;
    _createItemsFragment(items: Item[], fragment?: DocumentFragment): DocumentFragment;
    _triggerChange(value: any): void;
    _selectPlaceholderChoice(placeholderChoice: Choice): void;
    _handleButtonAction(activeItems?: Item[], element?: HTMLElement): void;
    _handleItemAction(activeItems?: Item[], element?: HTMLElement, hasShiftKey?: boolean): void;
    _handleChoiceAction(activeItems?: Item[], element?: HTMLElement): void;
    _handleBackspace(activeItems?: Item[]): void;
    _startLoading(): void;
    _stopLoading(): void;
    _handleLoadingState(setLoading?: boolean): void;
    _handleSearch(value: string): void;
    _canAddItem(activeItems: Item[], value: string): Notice;
    _searchChoices(value: string): number;
    _addEventListeners(): void;
    _removeEventListeners(): void;
    _onKeyDown(event: KeyboardEvent): void;
    _onKeyUp({ target, keyCode, }: Pick<KeyboardEvent, 'target' | 'keyCode'>): void;
    _onSelectKey(event: KeyboardEvent, hasItems: boolean): void;
    _onEnterKey(event: KeyboardEvent, activeItems: Item[], hasActiveDropdown: boolean): void;
    _onEscapeKey(hasActiveDropdown: boolean): void;
    _onDirectionKey(event: KeyboardEvent, hasActiveDropdown: boolean): void;
    _onDeleteKey(event: KeyboardEvent, activeItems: Item[], hasFocusedInput: boolean): void;
    _onTouchMove(): void;
    _onTouchEnd(event: TouchEvent): void;
    /**
     * Handles mousedown event in capture mode for containetOuter.element
     */
    _onMouseDown(event: MouseEvent): void;
    /**
     * Handles mouseover event over this.dropdown
     * @param {MouseEvent} event
     */
    _onMouseOver({ target }: Pick<MouseEvent, 'target'>): void;
    _onClick({ target }: Pick<MouseEvent, 'target'>): void;
    _onFocus({ target }: Pick<FocusEvent, 'target'>): void;
    _onBlur({ target }: Pick<FocusEvent, 'target'>): void;
    _onFormReset(): void;
    _highlightChoice(el?: HTMLElement | null): void;
    _addItem({ value, label, choiceId, groupId, customProperties, placeholder, keyCode, }: {
        value: string;
        label?: string | null;
        choiceId?: number;
        groupId?: number;
        customProperties?: object;
        placeholder?: boolean;
        keyCode?: number;
    }): void;
    _removeItem(item: Item): void;
    _addChoice({ value, label, isSelected, isDisabled, groupId, customProperties, placeholder, keyCode, }: {
        value: string;
        label?: string | null;
        isSelected?: boolean;
        isDisabled?: boolean;
        groupId?: number;
        customProperties?: Record<string, any>;
        placeholder?: boolean;
        keyCode?: number;
    }): void;
    _addGroup({ group, id, valueKey, labelKey }: {
        group: any;
        id: any;
        valueKey?: string | undefined;
        labelKey?: string | undefined;
    }): void;
    _getTemplate(template: string, ...args: any): any;
    _createTemplates(): void;
    _createElements(): void;
    _createStructure(): void;
    _addPredefinedGroups(groups: Group[] | HTMLOptGroupElement[] | Element[]): void;
    _addPredefinedChoices(choices: Partial<Choice>[]): void;
    _addPredefinedItems(items: Item[] | string[]): void;
    _setChoiceOrItem(item: any): void;
    _findAndSelectChoiceByValue(value: string): void;
    _generatePlaceholderValue(): string | null;
}
export default Choices;
//# sourceMappingURL=choices.d.ts.map