import { sanitise } from '../lib/utils';
import { SELECT_ONE_TYPE } from '../constants';
import { ClassNames } from '../interfaces/class-names';
import { PassedElementType } from '../interfaces/passed-element-type';

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
    return sanitise(this.element.value);
  }

  set value(value: string) {
    this.element.value = value;
  }

  get rawValue(): string {
    return this.element.value;
  }

  addEventListeners(): void {
    this.element.addEventListener('paste', this._onPaste);
    this.element.addEventListener('input', this._onInput, {
      passive: true,
    });
    this.element.addEventListener('focus', this._onFocus, {
      passive: true,
    });
    this.element.addEventListener('blur', this._onBlur, {
      passive: true,
    });
  }

  removeEventListeners(): void {
    this.element.removeEventListener('input', this._onInput);
    this.element.removeEventListener('paste', this._onPaste);
    this.element.removeEventListener('focus', this._onFocus);
    this.element.removeEventListener('blur', this._onBlur);
  }

  enable(): void {
    this.element.removeAttribute('disabled');
    this.isDisabled = false;
  }

  disable(): void {
    this.element.setAttribute('disabled', '');
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
    if (this.element.value) {
      this.element.value = '';
    }

    if (setWidth) {
      this.setWidth();
    }

    return this;
  }

  /**
   * Set the correct input width based on placeholder
   * value or input value
   */
  setWidth(): void {
    // Resize input to contents or placeholder
    const { style, value, placeholder } = this.element;
    style.minWidth = `${placeholder.length + 1}ch`;
    style.width = `${value.length + 1}ch`;
  }

  setActiveDescendant(activeDescendantID: string): void {
    this.element.setAttribute('aria-activedescendant', activeDescendantID);
  }

  removeActiveDescendant(): void {
    this.element.removeAttribute('aria-activedescendant');
  }

  _onInput(): void {
    if (this.type !== SELECT_ONE_TYPE) {
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
