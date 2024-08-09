export const isHtmlInputElement = (e: Element): e is HTMLInputElement =>
  e.tagName === 'INPUT';

export const isHtmlSelectElement = (e: Element): e is HTMLSelectElement =>
  e.tagName === 'SELECT';

export const isHtmlOption = (e: Element): e is HTMLOptionElement =>
  e.tagName === 'OPTION';

export const isHtmlOptgroup = (e: Element): e is HTMLOptGroupElement =>
  e.tagName === 'OPTGROUP';
