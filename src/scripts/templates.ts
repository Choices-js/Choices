/**
 * Helpers to create HTML elements used by Choices
 * Can be overridden by providing `callbackOnCreateTemplates` option
 */

import { Choice } from './interfaces/choice';
import { Group } from './interfaces/group';
import { Item } from './interfaces/item';
import { PassedElementType } from './interfaces/passed-element-type';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TemplateOptions = Record<'classNames' | 'allowHTML', any>;

const templates = {
  containerOuter(
    { classNames: { containerOuter } }: TemplateOptions,
    dir: HTMLElement['dir'],
    isSelectElement: boolean,
    isSelectOneElement: boolean,
    searchEnabled: boolean,
    passedElementType: PassedElementType,
    labelId: string,
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
    if (labelId) {
      div.setAttribute('aria-labeledby', labelId);
    }

    return div;
  },

  containerInner({
    classNames: { containerInner },
  }: TemplateOptions): HTMLDivElement {
    return Object.assign(document.createElement('div'), {
      className: containerInner,
    });
  },

  itemList(
    { classNames: { list, listSingle, listItems } }: TemplateOptions,
    isSelectOneElement: boolean,
  ): HTMLDivElement {
    return Object.assign(document.createElement('div'), {
      className: `${list} ${isSelectOneElement ? listSingle : listItems}`,
    });
  },

  placeholder(
    { allowHTML, classNames: { placeholder } }: TemplateOptions,
    value: string,
  ): HTMLDivElement {
    return Object.assign(document.createElement('div'), {
      className: placeholder,
      [allowHTML ? 'innerHTML' : 'innerText']: value,
    });
  },

  item(
    {
      allowHTML,
      classNames: {
        item,
        button,
        highlightedState,
        itemSelectable,
        placeholder,
      },
    }: TemplateOptions,
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
      [allowHTML ? 'innerHTML' : 'innerText']: label,
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
        [allowHTML ? 'innerHTML' : 'innerText']: REMOVE_ITEM_TEXT,
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
    { classNames: { list } }: TemplateOptions,
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
      allowHTML,
      classNames: { group, groupHeading, itemDisabled },
    }: TemplateOptions,
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
        [allowHTML ? 'innerHTML' : 'innerText']: value,
      }),
    );

    return div;
  },

  choice(
    {
      allowHTML,
      classNames: {
        item,
        itemChoice,
        itemSelectable,
        selectedState,
        itemDisabled,
        placeholder,
      },
    }: TemplateOptions,
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
      [allowHTML ? 'innerHTML' : 'innerText']: label,
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
    { classNames: { input, inputCloned } }: TemplateOptions,
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
    classNames: { list, listDropdown },
  }: TemplateOptions): HTMLDivElement {
    const div = document.createElement('div');

    div.classList.add(list, listDropdown);
    div.setAttribute('aria-expanded', 'false');

    return div;
  },

  notice(
    {
      allowHTML,
      classNames: { item, itemChoice, noResults, noChoices },
    }: TemplateOptions,
    innerText: string,
    type: 'no-choices' | 'no-results' | '' = '',
  ): HTMLDivElement {
    const classes = [item, itemChoice];

    if (type === 'no-choices') {
      classes.push(noChoices);
    } else if (type === 'no-results') {
      classes.push(noResults);
    }

    return Object.assign(document.createElement('div'), {
      [allowHTML ? 'innerHTML' : 'innerText']: innerText,
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
