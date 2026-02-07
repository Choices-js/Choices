/**
 * Helpers to create HTML elements used by Choices
 * Can be overridden by providing `callbackOnCreateTemplates` option.
 * `Choices.defaults.templates` allows access to the default template methods from `callbackOnCreateTemplates`
 */

import { ChoiceFull } from './interfaces/choice-full';
import { GroupFull } from './interfaces/group-full';
import { PassedElementType } from './interfaces/passed-element-type';
import { StringPreEscaped } from './interfaces/string-pre-escaped';
import {
  getClassNames,
  unwrapStringForRaw,
  resolveNoticeFunction,
  setElementHtml,
  escapeForTemplate,
  addClassesToElement,
  removeClassesFromElement,
  getChoiceForOutput,
} from './lib/utils';
import { NoticeType, NoticeTypes, TemplateOptions, Templates as TemplatesInterface } from './interfaces/templates';
import { StringUntrusted } from './interfaces/string-untrusted';

const isEmptyObject = (obj: object): boolean => {
  // eslint-disable-next-line no-restricted-syntax
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return true;
};

const assignCustomProperties = (el: HTMLElement, choice: ChoiceFull, withCustomProperties: boolean): void => {
  const { dataset } = el;
  const { customProperties, labelClass, labelDescription } = choice;

  if (labelClass) {
    dataset.labelClass = getClassNames(labelClass).join(' ');
  }

  if (labelDescription) {
    dataset.labelDescription = unwrapStringForRaw(labelDescription);
  }

  if (withCustomProperties && customProperties) {
    if (typeof customProperties === 'string') {
      dataset.customProperties = customProperties;
    } else if (typeof customProperties === 'object' && !isEmptyObject(customProperties)) {
      dataset.customProperties = JSON.stringify(customProperties);
    }
  }
};

const addAriaLabel = (docRoot: HTMLElement | ShadowRoot, id: string | undefined, element: HTMLElement): void => {
  const label = id && docRoot.querySelector<HTMLElement>(`label[for='${id}']`);
  const text = label && (label as HTMLElement).innerText;
  if (text) {
    element.setAttribute('aria-label', text);
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
    const div = document.createElement('div');
    addClassesToElement(div, containerOuter);

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
      } else if (!labelId) {
        addAriaLabel(this._docRoot, this.passedElement.element.id, div);
      }

      div.setAttribute('aria-haspopup', 'true');
      div.setAttribute('aria-expanded', 'false');
    }

    if (labelId) {
      div.setAttribute('aria-labelledby', labelId);
    }

    return div;
  },

  containerInner({ classNames: { containerInner } }: TemplateOptions): HTMLDivElement {
    const div = document.createElement('div');
    addClassesToElement(div, containerInner);

    return div;
  },

  itemList(
    { searchEnabled, classNames: { list, listSingle, listItems } }: TemplateOptions,
    isSelectOneElement: boolean,
  ): HTMLDivElement {
    const div = document.createElement('div');
    addClassesToElement(div, list);
    addClassesToElement(div, isSelectOneElement ? listSingle : listItems);

    if (this._isSelectElement && searchEnabled) {
      div.setAttribute('role', 'listbox');
    }

    return div;
  },

  placeholder(
    { allowHTML, classNames: { placeholder } }: TemplateOptions,
    value: StringPreEscaped | string,
  ): HTMLDivElement {
    const div = document.createElement('div');
    addClassesToElement(div, placeholder);
    setElementHtml(div, allowHTML, value);

    return div;
  },

  item(
    {
      allowHTML,
      removeItemButtonAlignLeft,
      removeItemIconText,
      removeItemLabelText,
      classNames: { item, button, highlightedState, itemSelectable, placeholder },
    }: TemplateOptions,
    choice: ChoiceFull,
    removeItemButton: boolean,
  ): HTMLDivElement {
    const rawValue = unwrapStringForRaw(choice.value);
    const div = document.createElement('div');
    addClassesToElement(div, item);

    if (choice.labelClass) {
      const spanLabel = document.createElement('span');
      setElementHtml(spanLabel, allowHTML, choice.label);
      addClassesToElement(spanLabel, choice.labelClass);
      div.appendChild(spanLabel);
    } else {
      setElementHtml(div, allowHTML, choice.label);
    }

    div.dataset.item = '';
    div.dataset.id = choice.id as unknown as string;
    div.dataset.value = rawValue;

    assignCustomProperties(div, choice, true);

    if (choice.disabled || this.containerOuter.isDisabled) {
      div.setAttribute('aria-disabled', 'true');
    }
    if (this._isSelectElement) {
      div.setAttribute('aria-selected', 'true');
      div.setAttribute('role', 'option');
    }

    if (choice.placeholder) {
      addClassesToElement(div, placeholder);
      div.dataset.placeholder = '';
    }

    addClassesToElement(div, choice.highlighted ? highlightedState : itemSelectable);

    if (removeItemButton) {
      if (choice.disabled) {
        removeClassesFromElement(div, itemSelectable);
      }
      div.dataset.deletable = '';

      const removeButton = document.createElement('button');
      removeButton.type = 'button';
      addClassesToElement(removeButton, button);
      const eventChoice = getChoiceForOutput(choice);
      setElementHtml(removeButton, true, resolveNoticeFunction(removeItemIconText, choice.value, eventChoice));

      const REMOVE_ITEM_LABEL = resolveNoticeFunction(removeItemLabelText, choice.value, eventChoice);
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

  choiceList({ classNames: { list } }: TemplateOptions, isSelectOneElement: boolean): HTMLDivElement {
    const div = document.createElement('div');
    addClassesToElement(div, list);

    if (!isSelectOneElement) {
      div.setAttribute('aria-multiselectable', 'true');
    }
    div.setAttribute('role', 'listbox');

    return div;
  },

  choiceGroup(
    { allowHTML, classNames: { group, groupHeading, itemDisabled } }: TemplateOptions,
    { id, label, disabled }: GroupFull,
  ): HTMLDivElement {
    const rawLabel = unwrapStringForRaw(label);
    const div = document.createElement('div');
    addClassesToElement(div, group);
    if (disabled) {
      addClassesToElement(div, itemDisabled);
    }

    div.setAttribute('role', 'group');

    div.dataset.group = '';
    div.dataset.id = id as unknown as string;
    div.dataset.value = rawLabel;

    if (disabled) {
      div.setAttribute('aria-disabled', 'true');
    }

    const heading = document.createElement('div');
    addClassesToElement(heading, groupHeading);
    setElementHtml(heading, allowHTML, label || '');
    div.appendChild(heading);

    return div;
  },

  choice(
    {
      allowHTML,
      classNames: { item, itemChoice, itemSelectable, selectedState, itemDisabled, description, placeholder },
    }: TemplateOptions,
    choice: ChoiceFull,
    selectText: string,
    groupName?: string,
  ): HTMLDivElement {
    // eslint-disable-next-line prefer-destructuring
    let label: string | StringUntrusted | StringPreEscaped = choice.label;
    const rawValue = unwrapStringForRaw(choice.value);
    const div = document.createElement('div');
    div.id = choice.elementId as string;
    addClassesToElement(div, item);
    addClassesToElement(div, itemChoice);

    if (groupName && typeof label === 'string') {
      label = escapeForTemplate(allowHTML, label);
      label += ` (${groupName})`;
      label = { trusted: label };
    }

    let describedBy: HTMLElement = div;
    if (choice.labelClass) {
      const spanLabel = document.createElement('span');
      setElementHtml(spanLabel, allowHTML, label);
      addClassesToElement(spanLabel, choice.labelClass);
      describedBy = spanLabel;
      div.appendChild(spanLabel);
    } else {
      setElementHtml(div, allowHTML, label);
    }

    if (choice.labelDescription) {
      const descId = `${choice.elementId}-description`;
      describedBy.setAttribute('aria-describedby', descId);
      const spanDesc = document.createElement('span');
      setElementHtml(spanDesc, allowHTML, choice.labelDescription);
      spanDesc.id = descId;
      addClassesToElement(spanDesc, description);
      div.appendChild(spanDesc);
    }

    if (choice.selected) {
      addClassesToElement(div, selectedState);
    }

    if (choice.placeholder) {
      addClassesToElement(div, placeholder);
    }

    div.setAttribute('role', choice.group ? 'treeitem' : 'option');

    div.dataset.choice = '';
    div.dataset.id = choice.id as unknown as string;
    div.dataset.value = rawValue;
    if (selectText) {
      div.dataset.selectText = selectText;
    }
    if (choice.group) {
      div.dataset.groupId = `${choice.group.id}`;
    }

    assignCustomProperties(div, choice, false);

    if (choice.disabled) {
      addClassesToElement(div, itemDisabled);
      div.dataset.choiceDisabled = '';
      div.setAttribute('aria-disabled', 'true');
    } else {
      addClassesToElement(div, itemSelectable);
      div.dataset.choiceSelectable = '';
      div.setAttribute('aria-selected', choice.selected ? 'true' : 'false');
    }

    return div;
  },

  input(
    { classNames: { input, inputCloned }, labelId }: TemplateOptions,
    placeholderValue: string | null,
  ): HTMLInputElement {
    const inp = document.createElement('input');
    inp.type = 'search';
    addClassesToElement(inp, input);
    addClassesToElement(inp, inputCloned);
    inp.autocomplete = 'off';
    inp.autocapitalize = 'off';
    inp.spellcheck = false;

    inp.setAttribute('aria-autocomplete', 'list');
    if (placeholderValue) {
      inp.setAttribute('aria-label', placeholderValue);
    } else if (!labelId) {
      addAriaLabel(this._docRoot, this.passedElement.element.id, inp);
    }

    return inp;
  },

  dropdown({ classNames: { list, listDropdown } }: TemplateOptions): HTMLDivElement {
    const div = document.createElement('div');

    addClassesToElement(div, list);
    addClassesToElement(div, listDropdown);
    div.setAttribute('aria-expanded', 'false');

    return div;
  },

  notice(
    { classNames: { item, itemChoice, addChoice, noResults, noChoices, notice: noticeItem } }: TemplateOptions,
    innerHTML: string,
    type: NoticeType = NoticeTypes.generic,
  ): HTMLDivElement {
    const notice = document.createElement('div');
    setElementHtml(notice, true, innerHTML);

    addClassesToElement(notice, item);
    addClassesToElement(notice, itemChoice);
    addClassesToElement(notice, noticeItem);

    // eslint-disable-next-line default-case
    switch (type) {
      case NoticeTypes.addChoice:
        addClassesToElement(notice, addChoice);
        break;
      case NoticeTypes.noResults:
        addClassesToElement(notice, noResults);
        break;
      case NoticeTypes.noChoices:
        addClassesToElement(notice, noChoices);
        break;
    }

    if (type === NoticeTypes.addChoice) {
      notice.dataset.choiceSelectable = '';
      notice.dataset.choice = '';
    }

    return notice;
  },

  option(choice: ChoiceFull): HTMLOptionElement {
    // HtmlOptionElement's label value does not support HTML, so the avoid double escaping unwrap the untrusted string.
    const labelValue = unwrapStringForRaw(choice.label);

    const opt = new Option(labelValue, choice.value, false, choice.selected);
    assignCustomProperties(opt, choice, true);

    opt.disabled = choice.disabled;
    if (choice.selected) {
      opt.setAttribute('selected', '');
    }

    return opt;
  },
};

export default templates;
