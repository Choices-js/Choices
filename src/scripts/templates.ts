/**
 * Helpers to create HTML elements used by Choices
 * Can be overridden by providing `callbackOnCreateTemplates` option
 */

import { Choice } from './interfaces/choice';
import { ClassNames } from './interfaces/class-names';
import { Group } from './interfaces/group';
import { Item } from './interfaces/item';
import { PassedElementType } from './interfaces/passed-element-type';

const templates = {
  containerOuter(
    { containerOuter }: Pick<ClassNames, 'containerOuter'>,
    dir: HTMLElement['dir'],
    isSelectElement: boolean,
    isSelectOneElement: boolean,
    searchEnabled: boolean,
    passedElementType: PassedElementType,
  ): HTMLDivElement {
    const div = Object.assign(document.createElement('div'), {
      className: containerOuter,
    });

    div.dataset.type = passedElementType;

    if (dir) {
      div.dir = dir;
    }

    if (isSelectOneElement) {
      div.tabIndex = 0;
    }

    if (isSelectElement) {
      div.setAttribute('role', searchEnabled ? 'combobox' : 'listbox');
      if (searchEnabled) {
        div.setAttribute('aria-autocomplete', 'list');
      }
    }

    div.setAttribute('aria-haspopup', 'true');
    div.setAttribute('aria-expanded', 'false');

    return div;
  },

  containerInner({
    containerInner,
  }: Pick<ClassNames, 'containerInner'>): HTMLDivElement {
    return Object.assign(document.createElement('div'), {
      className: containerInner,
    });
  },

  itemList(
    {
      list,
      listSingle,
      listItems,
    }: Pick<ClassNames, 'list' | 'listSingle' | 'listItems'>,
    isSelectOneElement: boolean,
  ): HTMLDivElement {
    return Object.assign(document.createElement('div'), {
      className: `${list} ${isSelectOneElement ? listSingle : listItems}`,
    });
  },

  placeholder(
    { placeholder }: Pick<ClassNames, 'placeholder'>,
    value: string,
  ): HTMLDivElement {
    return Object.assign(document.createElement('div'), {
      className: placeholder,
      innerHTML: value,
    });
  },

  item(
    {
      item,
      button,
      highlightedState,
      itemSelectable,
      placeholder,
    }: Pick<
      ClassNames,
      'item' | 'button' | 'highlightedState' | 'itemSelectable' | 'placeholder'
    >,
    {
      id,
      value,
      label,
      customProperties,
      active,
      disabled,
      highlighted,
      placeholder: isPlaceholder,
    }: Item,
    removeItemButton: boolean,
  ): HTMLDivElement {
    const div = Object.assign(document.createElement('div'), {
      className: item,
      innerHTML: label,
    });

    Object.assign(div.dataset, {
      item: '',
      id,
      value,
      customProperties,
    });

    if (active) {
      div.setAttribute('aria-selected', 'true');
    }

    if (disabled) {
      div.setAttribute('aria-disabled', 'true');
    }

    if (isPlaceholder) {
      div.classList.add(placeholder);
    }

    div.classList.add(highlighted ? highlightedState : itemSelectable);

    if (removeItemButton) {
      if (disabled) {
        div.classList.remove(itemSelectable);
      }
      div.dataset.deletable = '';
      /** @todo This MUST be localizable, not hardcoded! */
      const REMOVE_ITEM_TEXT = 'Remove item';
      const removeButton = Object.assign(document.createElement('button'), {
        type: 'button',
        className: button,
        innerHTML: REMOVE_ITEM_TEXT,
      });
      removeButton.setAttribute(
        'aria-label',
        `${REMOVE_ITEM_TEXT}: '${value}'`,
      );
      removeButton.dataset.button = '';
      div.appendChild(removeButton);
    }

    return div;
  },

  choiceList(
    { list }: Pick<ClassNames, 'list'>,
    isSelectOneElement: boolean,
  ): HTMLDivElement {
    const div = Object.assign(document.createElement('div'), {
      className: list,
    });

    if (!isSelectOneElement) {
      div.setAttribute('aria-multiselectable', 'true');
    }
    div.setAttribute('role', 'listbox');

    return div;
  },

  choiceGroup(
    {
      group,
      groupHeading,
      itemDisabled,
    }: Pick<ClassNames, 'group' | 'groupHeading' | 'itemDisabled'>,
    { id, value, disabled }: Group,
  ): HTMLDivElement {
    const div = Object.assign(document.createElement('div'), {
      className: `${group} ${disabled ? itemDisabled : ''}`,
    });

    div.setAttribute('role', 'group');

    Object.assign(div.dataset, {
      group: '',
      id,
      value,
    });

    if (disabled) {
      div.setAttribute('aria-disabled', 'true');
    }

    div.appendChild(
      Object.assign(document.createElement('div'), {
        className: groupHeading,
        innerHTML: value,
      }),
    );

    return div;
  },

  choice(
    {
      item,
      itemChoice,
      itemSelectable,
      selectedState,
      itemDisabled,
      placeholder,
    }: Pick<
      ClassNames,
      | 'item'
      | 'itemChoice'
      | 'itemSelectable'
      | 'selectedState'
      | 'itemDisabled'
      | 'placeholder'
    >,
    {
      id,
      value,
      label,
      groupId,
      elementId,
      disabled: isDisabled,
      selected: isSelected,
      placeholder: isPlaceholder,
    }: Choice,
    selectText: string,
  ): HTMLDivElement {
    const div = Object.assign(document.createElement('div'), {
      id: elementId,
      innerHTML: label,
      className: `${item} ${itemChoice}`,
    });

    if (isSelected) {
      div.classList.add(selectedState);
    }

    if (isPlaceholder) {
      div.classList.add(placeholder);
    }

    div.setAttribute('role', groupId && groupId > 0 ? 'treeitem' : 'option');

    Object.assign(div.dataset, {
      choice: '',
      id,
      value,
      selectText,
    });

    if (isDisabled) {
      div.classList.add(itemDisabled);
      div.dataset.choiceDisabled = '';
      div.setAttribute('aria-disabled', 'true');
    } else {
      div.classList.add(itemSelectable);
      div.dataset.choiceSelectable = '';
    }

    return div;
  },

  input(
    { input, inputCloned }: Pick<ClassNames, 'input' | 'inputCloned'>,
    placeholderValue: string,
  ): HTMLInputElement {
    const inp = Object.assign(document.createElement('input'), {
      type: 'search',
      name: 'search_terms',
      className: `${input} ${inputCloned}`,
      autocomplete: 'off',
      autocapitalize: 'off',
      spellcheck: false,
    });

    inp.setAttribute('role', 'textbox');
    inp.setAttribute('aria-autocomplete', 'list');
    inp.setAttribute('aria-label', placeholderValue);

    return inp;
  },

  dropdown({
    list,
    listDropdown,
  }: Pick<ClassNames, 'list' | 'listDropdown'>): HTMLDivElement {
    const div = document.createElement('div');

    div.classList.add(list, listDropdown);
    div.setAttribute('aria-expanded', 'false');

    return div;
  },

  notice(
    {
      item,
      itemChoice,
      noResults,
      noChoices,
    }: Pick<ClassNames, 'item' | 'itemChoice' | 'noResults' | 'noChoices'>,
    innerHTML: string,
    type: 'no-choices' | 'no-results' | '' = '',
  ): HTMLDivElement {
    const classes = [item, itemChoice];

    if (type === 'no-choices') {
      classes.push(noChoices);
    } else if (type === 'no-results') {
      classes.push(noResults);
    }

    return Object.assign(document.createElement('div'), {
      innerHTML,
      className: classes.join(' '),
    });
  },

  option({
    label,
    value,
    customProperties,
    active,
    disabled,
  }: Item): HTMLOptionElement {
    const opt = new Option(label, value, false, active);

    if (customProperties) {
      opt.dataset.customProperties = `${customProperties}`;
    }

    opt.disabled = !!disabled;

    return opt;
  },
};

export default templates;
