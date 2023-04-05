export const isHTMLOption = (e: Element): e is HTMLOptionElement =>
  e.tagName === 'OPTION';

export const isHTMLOptgroup = (e: Element): e is HTMLOptGroupElement =>
  e.tagName === 'OPTGROUP';
