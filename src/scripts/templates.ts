/**
 * Helpers to create HTML elements used by Choices
 * Can be overridden by providing `callbackOnCreateTemplates` option.
 * `Choices.defaults.templates` allows access to the default template methods from `callbackOnCreateTemplates`
 */

import { ChoiceFull, CustomProperties } from './interfaces/choice-full';
import { GroupFull } from './interfaces/group-full';
import { PassedElementType } from './interfaces/passed-element-type';
import { StringPreEscaped } from './interfaces/string-pre-escaped';
import { StringUntrusted } from './interfaces/string-untrusted';
import {
  getClassNames,
  sanitise,
  unwrapStringForRaw,
  unwrapStringForEscaped,
} from './lib/utils';
import {
  NoticeType,
  TemplateOptions,
  Templates as TemplatesInterface,
} from './interfaces/templates';

export const escapeForTemplate = (
  allowHTML: boolean,
  s: StringUntrusted | StringPreEscaped | string,
): string => (allowHTML ? unwrapStringForEscaped(s) : (sanitise(s) as string));

const isEmptyObject = (obj: object): boolean => {
  // eslint-disable-next-line no-restricted-syntax
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return true;
};

const assignCustomProperties = (
  el: HTMLElement,
  customProperties?: CustomProperties,
): void => {
  if (!customProperties) {
    return;
  }
  const { dataset } = el;

  if (typeof customProperties === 'string') {
    dataset.customProperties = customProperties;
  } else if (
    typeof customProperties === 'object' &&
    !isEmptyObject(customProperties)
  ) {
    dataset.customProperties = JSON.stringify(customProperties);
  }
};

const templates: TemplatesInterface = {
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
      className: getClassNames(containerOuter).join(' '),
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
      div.setAttribute('aria-labelledby', labelId);
    }

    return div;
  },

  containerInner({
    classNames: { containerInner },
  }: TemplateOptions): HTMLDivElement {
    return Object.assign(document.createElement('div'), {
      className: getClassNames(containerInner).join(' '),
    });
  },

  itemList(
    { classNames: { list, listSingle, listItems } }: TemplateOptions,
    isSelectOneElement: boolean,
  ): HTMLDivElement {
    return Object.assign(document.createElement('div'), {
      className: `${getClassNames(list).join(' ')} ${
        isSelectOneElement
          ? getClassNames(listSingle).join(' ')
          : getClassNames(listItems).join(' ')
      }`,
    });
  },

  placeholder(
    { allowHTML, classNames: { placeholder } }: TemplateOptions,
    value: StringPreEscaped | string,
  ): HTMLDivElement {
    return Object.assign(document.createElement('div'), {
      className: getClassNames(placeholder).join(' '),
      innerHTML: escapeForTemplate(allowHTML, value),
    });
  },

  item(
    {
      allowHTML,
      removeItemButtonAlignLeft,
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
      labelClass,
      labelDescription,
      customProperties,
      active,
      disabled,
      highlighted,
      placeholder: isPlaceholder,
    }: ChoiceFull,
    removeItemButton: boolean,
  ): HTMLDivElement {
    const div = Object.assign(document.createElement('div'), {
      className: getClassNames(item).join(' '),
    });

    if (labelClass) {
      const spanLabel = Object.assign(document.createElement('span'), {
        innerHTML: escapeForTemplate(allowHTML, label),
        className: getClassNames(labelClass).join(' '),
      });
      div.appendChild(spanLabel);
    } else {
      div.innerHTML = escapeForTemplate(allowHTML, label);
    }

    Object.assign(div.dataset, {
      item: '',
      id,
      value,
    });
    if (labelClass) {
      div.dataset.labelClass = getClassNames(labelClass).join(' ');
    }
    if (labelDescription) {
      div.dataset.labelDescription = labelDescription;
    }

    assignCustomProperties(div, customProperties);

    if (active) {
      div.setAttribute('aria-selected', 'true');
    }

    if (disabled) {
      div.setAttribute('aria-disabled', 'true');
    }

    if (isPlaceholder) {
      div.classList.add(...getClassNames(placeholder));
      div.dataset.placeholder = '';
    }

    div.classList.add(
      ...(highlighted
        ? getClassNames(highlightedState)
        : getClassNames(itemSelectable)),
    );

    if (removeItemButton) {
      if (disabled) {
        div.classList.remove(...getClassNames(itemSelectable));
      }
      div.dataset.deletable = '';

      const REMOVE_ITEM_ICON =
        typeof this.config.removeItemIconText === 'function'
          ? this.config.removeItemIconText(sanitise(value), value)
          : this.config.removeItemIconText;
      const REMOVE_ITEM_LABEL =
        typeof this.config.removeItemLabelText === 'function'
          ? this.config.removeItemLabelText(sanitise(value), value)
          : this.config.removeItemLabelText;
      const removeButton = Object.assign(document.createElement('button'), {
        type: 'button',
        className: getClassNames(button).join(' '),
        innerHTML: REMOVE_ITEM_ICON,
      });
      if (REMOVE_ITEM_LABEL) {
        removeButton.setAttribute('aria-label', REMOVE_ITEM_LABEL);
      }
      removeButton.dataset.button = '';
      if (removeItemButtonAlignLeft) {
        div.insertAdjacentElement('afterbegin', removeButton);
      } else {
        div.appendChild(removeButton);
      }
    }

    return div;
  },

  choiceList(
    { classNames: { list } }: TemplateOptions,
    isSelectOneElement: boolean,
  ): HTMLDivElement {
    const div = Object.assign(document.createElement('div'), {
      className: getClassNames(list).join(' '),
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
    { id, label, disabled }: GroupFull,
  ): HTMLDivElement {
    const div = Object.assign(document.createElement('div'), {
      className: `${getClassNames(group).join(' ')} ${
        disabled ? getClassNames(itemDisabled).join(' ') : ''
      }`,
    });

    div.setAttribute('role', 'group');

    Object.assign(div.dataset, {
      group: '',
      id,
      value: label,
    });

    if (disabled) {
      div.setAttribute('aria-disabled', 'true');
    }

    div.appendChild(
      Object.assign(document.createElement('div'), {
        className: getClassNames(groupHeading).join(' '),
        innerHTML: escapeForTemplate(allowHTML, label),
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
        description,
        placeholder,
      },
    }: TemplateOptions,
    {
      id,
      value,
      label,
      groupId,
      elementId,
      labelClass,
      labelDescription,
      disabled: isDisabled,
      selected: isSelected,
      placeholder: isPlaceholder,
    }: ChoiceFull,
    selectText: string,
  ): HTMLDivElement {
    const div = Object.assign(document.createElement('div'), {
      id: elementId,
      className: `${getClassNames(item).join(' ')} ${getClassNames(
        itemChoice,
      ).join(' ')}`,
    });

    let describedBy: HTMLElement = div;
    if (labelClass) {
      const spanLabel = Object.assign(document.createElement('span'), {
        innerHTML: escapeForTemplate(allowHTML, label),
        className: getClassNames(labelClass).join(' '),
      });
      describedBy = spanLabel;
      div.appendChild(spanLabel);
    } else {
      div.innerHTML = escapeForTemplate(allowHTML, label);
    }

    if (labelDescription) {
      const descId = `${elementId}-description`;
      describedBy.setAttribute('aria-describedby', descId);
      const spanDesc = Object.assign(document.createElement('span'), {
        innerHTML: escapeForTemplate(allowHTML, labelDescription),
        id: descId,
      });
      spanDesc.classList.add(...getClassNames(description));
      div.appendChild(spanDesc);
    }

    if (isSelected) {
      div.classList.add(...getClassNames(selectedState));
    }

    if (isPlaceholder) {
      div.classList.add(...getClassNames(placeholder));
    }

    div.setAttribute('role', groupId && groupId > 0 ? 'treeitem' : 'option');

    Object.assign(div.dataset, {
      choice: '',
      id,
      value,
      selectText,
    });
    if (labelClass) {
      div.dataset.labelClass = getClassNames(labelClass).join(' ');
    }
    if (labelDescription) {
      div.dataset.labelDescription = labelDescription;
    }

    if (isDisabled) {
      div.classList.add(...getClassNames(itemDisabled));
      div.dataset.choiceDisabled = '';
      div.setAttribute('aria-disabled', 'true');
    } else {
      div.classList.add(...getClassNames(itemSelectable));
      div.dataset.choiceSelectable = '';
    }

    return div;
  },

  input(
    { classNames: { input, inputCloned } }: TemplateOptions,
    placeholderValue: string | null,
  ): HTMLInputElement {
    const inp = Object.assign(document.createElement('input'), {
      type: 'search',
      className: `${getClassNames(input).join(' ')} ${getClassNames(
        inputCloned,
      ).join(' ')}`,
      autocomplete: 'off',
      autocapitalize: 'off',
      spellcheck: false,
    });

    inp.setAttribute('role', 'textbox');
    inp.setAttribute('aria-autocomplete', 'list');
    if (placeholderValue) {
      inp.setAttribute('aria-label', placeholderValue);
    }

    return inp;
  },

  dropdown({
    classNames: { list, listDropdown },
  }: TemplateOptions): HTMLDivElement {
    const div = document.createElement('div');

    div.classList.add(...getClassNames(list));
    div.classList.add(...getClassNames(listDropdown));
    div.setAttribute('aria-expanded', 'false');

    return div;
  },

  notice(
    {
      allowHTML,
      classNames: { item, itemChoice, addChoice, noResults, noChoices },
    }: TemplateOptions,
    innerText: StringUntrusted | StringPreEscaped | string,
    type: NoticeType = '',
  ): HTMLDivElement {
    const classes = [...getClassNames(item), ...getClassNames(itemChoice)];

    // eslint-disable-next-line default-case
    switch (type) {
      case 'add-choice':
        classes.push(...getClassNames(addChoice));
        break;
      case 'no-results':
        classes.push(...getClassNames(noResults));
        break;
      case 'no-choices':
        classes.push(...getClassNames(noChoices));
        break;
    }

    const notice = Object.assign(document.createElement('div'), {
      innerHTML: escapeForTemplate(allowHTML, innerText),
      className: classes.join(' '),
    });

    if (type === 'add-choice') {
      notice.dataset.choiceSelectable = '';
      notice.dataset.choice = '';
    }

    return notice;
  },

  option({
    label,
    value,
    labelClass,
    labelDescription,
    customProperties,
    active,
    disabled,
  }: ChoiceFull): HTMLOptionElement {
    // HtmlOptionElement's label value does not support HTML, so the avoid double escaping unwrap the untrusted string.
    const labelValue = unwrapStringForRaw(label);

    const opt = new Option(labelValue, value, false, active);
    if (labelClass) {
      opt.dataset.labelClass = getClassNames(labelClass).join(' ');
    }
    if (labelDescription) {
      opt.dataset.labelDescription = labelDescription;
    }

    assignCustomProperties(opt, customProperties);

    opt.disabled = disabled;

    return opt;
  },
};

export default templates;
