import { ClassNames } from '../interfaces/class-names';
import { PassedElementType, PassedElementTypes } from '../interfaces/passed-element-type';
import { addClassesToElement } from '../lib/utils';

export default class Input {
  element: HTMLInputElement;

  type: PassedElementType;

  classNames: ClassNames;

  preventPaste: boolean;

  isFocussed: boolean;

  isDisabled: boolean;

  constructor({
    element,
    type,
    classNames,
    preventPaste,
  }: {
    element: HTMLInputElement;
    type: PassedElementType;
    classNames: ClassNames;
    preventPaste: boolean;
  }) {
    this.element = element;
    this.type = type;
    this.classNames = classNames;
    this.preventPaste = preventPaste;

    this.isFocussed = this.element.isEqualNode(document.activeElement);
    this.isDisabled = element.disabled;
    this._onPaste = this._onPaste.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }

  set placeholder(placeholder: string) {
    this.element.placeholder = placeholder;
  }

  get value(): string {
    return this.element.value;
  }

  set value(value: string) {
    this.element.value = value;
  }

  addEventListeners(): void {
    const el = this.element;
    el.addEventListener('paste', this._onPaste);
    el.addEventListener('input', this._onInput, {
      passive: true,
    });
    el.addEventListener('focus', this._onFocus, {
      passive: true,
    });
    el.addEventListener('blur', this._onBlur, {
      passive: true,
    });
  }

  removeEventListeners(): void {
    const el = this.element;
    el.removeEventListener('input', this._onInput);
    el.removeEventListener('paste', this._onPaste);
    el.removeEventListener('focus', this._onFocus);
    el.removeEventListener('blur', this._onBlur);
  }

  enable(): void {
    const el = this.element;
    el.removeAttribute('disabled');
    this.isDisabled = false;
  }

  disable(): void {
    const el = this.element;
    el.setAttribute('disabled', '');
    this.isDisabled = true;
  }

  focus(): void {
    if (!this.isFocussed) {
      this.element.focus();
    }
  }

  blur(): void {
    if (this.isFocussed) {
      this.element.blur();
    }
  }

  clear(setWidth = true): this {
    this.element.value = '';
    if (setWidth) {
      this.setWidth();
    }

    return this;
  }

  /**
   * Set the correct input width based on placeholder value or input value.
   * Renders text into a hidden off-screen span that inherits the input's
   * CSS classes and measures its pixel width, then converts to `ch` units.
   * This correctly handles CJK, Hangul, fullwidth forms, emoji, and any
   * font — no hard-coded code-point ranges required.
   */
  setWidth(): void {
    const { element } = this;
    const { value, placeholder } = element;
    let minWidth = 0;
    let width = 0;

    if (value || placeholder) {
      const e = document.createElement('span');
      e.style.position = 'absolute';
      e.style.visibility = 'hidden';
      e.style.whiteSpace = 'pre';
      e.style.height = 'auto';
      e.style.width = 'auto';
      e.style.minWidth = '1ch';
      addClassesToElement(e, Array.from(element.classList));
      element.after(e);
      const chInPx = parseFloat(getComputedStyle(e).width);
      if (Number.isNaN(chInPx)) {
        minWidth = placeholder.length;
        width = value.length;
      } else {
        if (placeholder) {
          e.innerText = placeholder;
          minWidth = parseFloat(getComputedStyle(e).width) / chInPx;
        }

        if (value) {
          e.innerText = value;
          width = parseFloat(getComputedStyle(e).width) / chInPx;
        }
      }

      e.remove();
    }

    element.style.minWidth = `${Math.ceil(minWidth) + 1}ch`;
    element.style.width = `${Math.ceil(width) + 1}ch`;
  }

  setActiveDescendant(activeDescendantID: string): void {
    this.element.setAttribute('aria-activedescendant', activeDescendantID);
  }

  removeActiveDescendant(): void {
    this.element.removeAttribute('aria-activedescendant');
  }

  _onInput(): void {
    if (this.type !== PassedElementTypes.SelectOne) {
      this.setWidth();
    }
  }

  _onPaste(event: ClipboardEvent): void {
    if (this.preventPaste) {
      event.preventDefault();
    }
  }

  _onFocus(): void {
    this.isFocussed = true;
  }

  _onBlur(): void {
    this.isFocussed = false;
  }
}
