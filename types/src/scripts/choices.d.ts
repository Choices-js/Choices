import { Container, Dropdown, Input, List, WrappedInput, WrappedSelect } from './components';
import { InputChoice } from './interfaces/input-choice';
import { InputGroup } from './interfaces/input-group';
import { Options } from './interfaces/options';
import { StateChangeSet } from './interfaces/state';
import Store from './store/store';
import { ChoiceFull } from './interfaces/choice-full';
import { GroupFull } from './interfaces/group-full';
import { EventChoiceValueType, PassedElementType } from './interfaces';
import { EventChoice } from './interfaces/event-choice';
import { NoticeType, Templates } from './interfaces/templates';
import { Searcher } from './interfaces/search';
/**
 * Choices
 * @author Josh Johnson<josh@joshuajohnson.co.uk>
 */
declare class Choices {
    static version: string;
    static get defaults(): {
        options: Partial<Options>;
        allOptions: Options;
        templates: Templates;
    };
    initialised: boolean;
    initialisedOK?: boolean;
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
    _hasNonChoicePlaceholder: boolean;
    _canAddUserChoices: boolean;
    _store: Store<Options>;
    _templates: Templates;
    _lastAddedChoiceId: number;
    _lastAddedGroupId: number;
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
    _initialItems: string[];
    _searcher: Searcher<ChoiceFull>;
    _notice?: {
        type: NoticeType;
        text: string;
    };
    _docRoot: ShadowRoot | HTMLElement;
    constructor(element?: string | Element | HTMLInputElement | HTMLSelectElement, userConfig?: Partial<Options>);
    init(): void;
    destroy(): void;
    enable(): this;
    disable(): this;
    highlightItem(item: InputChoice, runEvent?: boolean): this;
    unhighlightItem(item: InputChoice, runEvent?: boolean): this;
    highlightAll(): this;
    unhighlightAll(): this;
    removeActiveItemsByValue(value: string): this;
    removeActiveItems(excludedId?: number): this;
    removeHighlightedItems(runEvent?: boolean): this;
    showDropdown(preventInputFocus?: boolean): this;
    hideDropdown(preventInputBlur?: boolean): this;
    getValue<B extends boolean = false>(valueOnly?: B): EventChoiceValueType<B> | EventChoiceValueType<B>[];
    setValue(items: string[] | InputChoice[]): this;
    setChoiceByValue(value: string | string[]): this;
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
    setChoices(choicesArrayOrFetcher?: (InputChoice | InputGroup)[] | ((instance: Choices) => (InputChoice | InputGroup)[] | Promise<(InputChoice | InputGroup)[]>), value?: string | null, label?: string, replaceChoices?: boolean, clearSearchFlag?: boolean, replaceItems?: boolean): this | Promise<this>;
    refresh(withEvents?: boolean, selectFirstOption?: boolean, deselectAll?: boolean): this;
    removeChoice(value: string): this;
    clearChoices(clearOptions?: boolean, clearItems?: boolean): this;
    clearStore(clearOptions?: boolean): this;
    clearInput(): this;
    _validateConfig(): void;
    _render(changes?: StateChangeSet): void;
    _renderChoices(): void;
    _renderItems(): void;
    _displayNotice(text: string, type: NoticeType, openDropdown?: boolean): void;
    _clearNotice(): void;
    _renderNotice(fragment?: DocumentFragment): void;
    _getChoiceForOutput(choice: ChoiceFull, keyCode?: number): EventChoice;
    _triggerChange(value: any): void;
    _handleButtonAction(element: HTMLElement): void;
    _handleItemAction(element: HTMLElement, hasShiftKey?: boolean): void;
    _handleChoiceAction(element: HTMLElement): boolean;
    _handleBackspace(items: ChoiceFull[]): void;
    _loadChoices(): void;
    _handleLoadingState(setLoading?: boolean): void;
    _handleSearch(value?: string): void;
    _canAddItems(): boolean;
    _canCreateItem(value: string): boolean;
    _searchChoices(value: string): number | null;
    _stopSearch(): void;
    _addEventListeners(): void;
    _removeEventListeners(): void;
    _onKeyDown(event: KeyboardEvent): void;
    _onKeyUp(): void;
    _onInput(): void;
    _onSelectKey(event: KeyboardEvent, hasItems: boolean): void;
    _onEnterKey(event: KeyboardEvent, hasActiveDropdown: boolean): void;
    _onEscapeKey(event: KeyboardEvent, hasActiveDropdown: boolean): void;
    _onDirectionKey(event: KeyboardEvent, hasActiveDropdown: boolean): void;
    _onDeleteKey(event: KeyboardEvent, items: ChoiceFull[], hasFocusedInput: boolean): void;
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
    _addItem(item: ChoiceFull, withEvents?: boolean, userTriggered?: boolean): void;
    _removeItem(item: ChoiceFull): void;
    _addChoice(choice: ChoiceFull, withEvents?: boolean, userTriggered?: boolean): void;
    _addGroup(group: GroupFull, withEvents?: boolean): void;
    _createTemplates(): void;
    _createElements(): void;
    _createStructure(): void;
    _initStore(): void;
    _addPredefinedChoices(choices: (ChoiceFull | GroupFull)[], selectFirstOption?: boolean, withEvents?: boolean): void;
    _findAndSelectChoiceByValue(value: string, userTriggered?: boolean): boolean;
    _generatePlaceholderValue(): string | null;
    _warnChoicesInitFailed(caller: string): void;
}
export default Choices;
