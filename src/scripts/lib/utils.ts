/* eslint-disable @typescript-eslint/no-explicit-any */

import { EventType } from '../interfaces/event-type';
import { StringUntrusted } from '../interfaces/string-untrusted';
import { StringPreEscaped } from '../interfaces/string-pre-escaped';
import { ChoiceFull } from '../interfaces/choice-full';
import { Types } from '../interfaces/types';

const getRandomNumber = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min);

const generateChars = (length: number): string =>
  Array.from({ length }, () => getRandomNumber(0, 36).toString(36)).join('');

export const generateId = (
  element: HTMLInputElement | HTMLSelectElement,
  prefix: string,
): string => {
  let id =
    element.id ||
    (element.name && `${element.name}-${generateChars(2)}`) ||
    generateChars(4);
  id = id.replace(/(:|\.|\[|\]|,)/g, '');
  id = `${prefix}-${id}`;

  return id;
};

export const getAdjacentEl = (
  startEl: Element,
  selector: string,
  direction = 1,
): Element => {
  const prop = `${direction > 0 ? 'next' : 'previous'}ElementSibling`;

  let sibling = startEl[prop];
  while (sibling) {
    if (sibling.matches(selector)) {
      return sibling;
    }
    sibling = sibling[prop];
  }

  return sibling;
};

export const isScrolledIntoView = (
  element: HTMLElement,
  parent: HTMLElement,
  direction = 1,
): boolean => {
  if (!element) {
    return false;
  }

  let isVisible;

  if (direction > 0) {
    // In view from bottom
    isVisible =
      parent.scrollTop + parent.offsetHeight >=
      element.offsetTop + element.offsetHeight;
  } else {
    // In view from top
    isVisible = element.offsetTop >= parent.scrollTop;
  }

  return isVisible;
};

export const sanitise = <T>(
  value: T | StringUntrusted | StringPreEscaped | string,
): T | string => {
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
  const tmpEl = document.createElement('div');

  return (str): Element => {
    tmpEl.innerHTML = str.trim();
    const firldChild = tmpEl.children[0];

    while (tmpEl.firstChild) {
      tmpEl.removeChild(tmpEl.firstChild);
    }

    return firldChild;
  };
})();

export const unwrapStringForRaw = (
  s?: StringUntrusted | StringPreEscaped | string,
): string => {
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

export const unwrapStringForEscaped = (
  s?: StringUntrusted | StringPreEscaped | string,
): string => {
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

export const sortByAlpha = (
  { value, label = value }: Types.RecordToCompare,
  { value: value2, label: label2 = value2 }: Types.RecordToCompare,
): number =>
  unwrapStringForRaw(label).localeCompare(unwrapStringForRaw(label2), [], {
    sensitivity: 'base',
    ignorePunctuation: true,
    numeric: true,
  });

export const sortByScore = (
  a: Pick<ChoiceFull, 'score'>,
  b: Pick<ChoiceFull, 'score'>,
): number => {
  return a.score - b.score;
};

export const dispatchEvent = (
  element: HTMLElement,
  type: EventType,
  customArgs: object | null = null,
): boolean => {
  const event = new CustomEvent(type, {
    detail: customArgs,
    bubbles: true,
    cancelable: true,
  });

  return element.dispatchEvent(event);
};

export const cloneObject = <T>(obj: T): T =>
  obj !== undefined ? JSON.parse(JSON.stringify(obj)) : undefined;

/**
 * Returns an array of keys present on the first but missing on the second object
 */
export const diff = (
  a: Record<string, any>,
  b: Record<string, any>,
): string[] => {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();

  return aKeys.filter((i) => bKeys.indexOf(i) < 0);
};

export const getClassNames = (
  ClassNames: Array<string> | string,
): Array<string> => {
  return Array.isArray(ClassNames) ? ClassNames : [ClassNames];
};

export const getClassNamesSelector = (
  option: string | Array<string> | null,
) => {
  if (option && Array.isArray(option)) {
    return option
      .map((item) => {
        return `.${item}`;
      })
      .join('');
  }

  return `.${option}`;
};

export const parseCustomProperties = (
  customProperties?: string,
): object | string => {
  if (typeof customProperties !== 'undefined') {
    try {
      return JSON.parse(customProperties);
    } catch (e) {
      return customProperties;
    }
  }

  return {};
};
