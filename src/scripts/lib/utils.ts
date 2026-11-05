import { EventTypes } from '../interfaces/event-type';
import { StringUntrusted } from '../interfaces/string-untrusted';
import { StringPreEscaped } from '../interfaces/string-pre-escaped';
import { ChoiceFull } from '../interfaces/choice-full';
import { Types } from '../interfaces/types';
import { canUseDom } from '../interfaces/build-flags';
import { EventChoice } from '../interfaces';

const getRandomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max - min) + min);

const generateChars = (length: number): string =>
  Array.from({ length }, () => getRandomNumber(0, 36).toString(36)).join('');

export const generateId = (element: HTMLInputElement | HTMLSelectElement, prefix: string): string => {
  let id = element.id || (element.name && `${element.name}-${generateChars(2)}`) || generateChars(4);
  id = id.replace(/(:|\.|\[|\]|,)/g, '');
  id = `${prefix}-${id}`;

  return id;
};

export const getAdjacentEl = (startEl: HTMLElement, selector: string, direction = 1): HTMLElement | null => {
  const prop = `${direction > 0 ? 'next' : 'previous'}ElementSibling`;

  let sibling = startEl[prop];
  while (sibling) {
    if (sibling.matches(selector)) {
      return sibling;
    }
    sibling = sibling[prop];
  }

  return null;
};

export const isScrolledIntoView = (element: HTMLElement, parent: HTMLElement, direction = 1): boolean => {
  let isVisible: boolean;

  if (direction > 0) {
    // In view from bottom
    isVisible = parent.scrollTop + parent.offsetHeight >= element.offsetTop + element.offsetHeight;
  } else {
    // In view from top
    isVisible = element.offsetTop >= parent.scrollTop;
  }

  return isVisible;
};

export const sanitise = <T>(value: T | StringUntrusted | StringPreEscaped | string): T | string => {
  if (typeof value !== 'string') {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'object') {
      if ('raw' in value) {
        return sanitise(value.raw);
      }
      if ('trusted' in value) {
        return value.trusted;
      }
    }

    return value;
  }

  return value
    .replace(/&/g, '&amp;')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;')
    .replace(/'/g, '&#039;')
    .replace(/"/g, '&quot;');
};

export const strToEl = ((): ((str: string) => Element) => {
  if (!canUseDom) {
    // @ts-expect-error Do not run strToEl in non-browser environment
    return (): void => {};
  }
  const tmpEl = document.createElement('div');

  return (str): Element => {
    tmpEl.innerHTML = str.trim();
    const firstChild = tmpEl.children[0];

    while (tmpEl.firstChild) {
      tmpEl.removeChild(tmpEl.firstChild);
    }

    return firstChild;
  };
})();

export const resolveStringFunction = (fn: Types.StringFunction | string): string => {
  return typeof fn === 'function' ? fn() : fn;
};

export const unwrapStringForRaw = (s?: StringUntrusted | StringPreEscaped | string): string => {
  if (typeof s === 'string') {
    return s;
  }

  if (typeof s === 'object') {
    if ('trusted' in s) {
      return s.trusted;
    }
    if ('raw' in s) {
      return s.raw;
    }
  }

  return '';
};

export const unwrapStringForEscaped = (s?: StringUntrusted | StringPreEscaped | string): string => {
  if (typeof s === 'string') {
    return s;
  }

  if (typeof s === 'object') {
    if ('escaped' in s) {
      return s.escaped;
    }
    if ('trusted' in s) {
      return s.trusted;
    }
  }

  return '';
};

export const getChoiceForOutput = (choice: ChoiceFull, keyCode?: number): EventChoice => {
  return {
    id: choice.id,
    highlighted: choice.highlighted,
    labelClass: choice.labelClass,
    labelDescription: unwrapStringForRaw(choice.labelDescription),
    customProperties: choice.customProperties,
    disabled: choice.disabled,
    active: choice.active,
    label: choice.label,
    placeholder: choice.placeholder,
    value: choice.value,
    groupValue: choice.group ? choice.group.label : undefined,
    element: choice.element,
    keyCode,
  };
};

export const resolveNoticeFunction = (
  fn: Types.NoticeStringFunction | string,
  value: StringUntrusted | StringPreEscaped | string,
  item?: EventChoice,
): string => {
  return typeof fn === 'function' ? fn(sanitise<string>(value), unwrapStringForRaw(value), item) : fn;
};

export const escapeForTemplate = (allowHTML: boolean, s: StringUntrusted | StringPreEscaped | string): string =>
  allowHTML ? unwrapStringForEscaped(s) : (sanitise(s) as string);

export const setElementHtml = (
  el: HTMLElement,
  allowHtml: boolean,
  html: StringUntrusted | StringPreEscaped | string,
): void => {
  el.innerHTML = escapeForTemplate(allowHtml, html);
};

export const sortByAlpha = (
  { value, label = value }: Types.RecordToCompare,
  { value: value2, label: label2 = value2 }: Types.RecordToCompare,
): number =>
  unwrapStringForRaw(label).localeCompare(unwrapStringForRaw(label2), [], {
    sensitivity: 'base',
    ignorePunctuation: true,
    numeric: true,
  });

export const sortByScore = (a: Pick<ChoiceFull, 'score'>, b: Pick<ChoiceFull, 'score'>): number => {
  return a.score - b.score;
};

export const sortByRank = (a: Pick<ChoiceFull, 'rank'>, b: Pick<ChoiceFull, 'rank'>): number => {
  return a.rank - b.rank;
};

export const dispatchEvent = (element: HTMLElement, type: EventTypes, customArgs: object | null = null): boolean => {
  const event = new CustomEvent(type, {
    detail: customArgs,
    bubbles: true,
    cancelable: true,
  });

  return element.dispatchEvent(event);
};

export const cloneObject = <T>(obj: T): T => (obj !== undefined ? JSON.parse(JSON.stringify(obj)) : undefined);

/**
 * Returns an array of keys present on the first but missing on the second object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const diff = (a: Record<string, any>, b: Record<string, any>): string[] => {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();

  return aKeys.filter((i) => bKeys.indexOf(i) < 0);
};

export const getClassNames = (ClassNames: Array<string> | string): Array<string> => {
  return Array.isArray(ClassNames) ? ClassNames : [ClassNames];
};

export const getClassNamesSelector = (option: string | Array<string> | null): string => {
  if (option && Array.isArray(option)) {
    return option
      .map((item) => {
        return `.${item}`;
      })
      .join('');
  }

  return `.${option}`;
};

export const addClassesToElement = (element: HTMLElement, className: Array<string> | string): void => {
  element.classList.add(...getClassNames(className));
};

export const removeClassesFromElement = (element: HTMLElement, className: Array<string> | string): void => {
  element.classList.remove(...getClassNames(className));
};

export const parseCustomProperties = (customProperties?: string): object | string => {
  if (typeof customProperties !== 'undefined') {
    try {
      return JSON.parse(customProperties);
    } catch (e) {
      return customProperties;
    }
  }

  return {};
};

export const updateClassList = (item: ChoiceFull, add: string | string[], remove: string | string[]): void => {
  const { itemEl } = item;
  if (itemEl) {
    removeClassesFromElement(itemEl, remove);
    addClassesToElement(itemEl, add);
  }
};
