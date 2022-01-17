import { wrap } from '../lib/utils';
import { SELECT_ONE_TYPE } from '../constants';
import { ClassNames } from '../interfaces/class-names';
import { PositionOptionsType } from '../interfaces/position-options-type';
import { PassedElementType } from '../interfaces/passed-element-type';

export default class Container {
  element: HTMLElement;

  type: PassedElementType;

  classNames: ClassNames;

  position: PositionOptionsType;

  isOpen: boolean;

  isFlipped: boolean;

  isFocussed: boolean;

  isDisabled: boolean;

  isLoading: boolean;

  constructor({
    element,
    type,
    classNames,
    position,
  }: {
    element: HTMLElement;
    type: PassedElementType;
    classNames: ClassNames;
    position: PositionOptionsType;
  }) {
    this.element = element;
    this.classNames = classNames;
    this.type = type;
    this.position = position;
    this.isOpen = false;
    this.isFlipped = false;
    this.isFocussed = false;
    this.isDisabled = false;
    this.isLoading = false;
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
  }

  addEventListeners(): void {
    this.element.addEventListener('focus', this._onFocus);
    this.element.addEventListener('blur', this._onBlur);
  }

  removeEventListeners(): void {
    this.element.removeEventListener('focus', this._onFocus);
    this.element.removeEventListener('blur', this._onBlur);
  }

  /**
   * Determine whether container should be flipped based on passed
   * dropdown position
   */
  shouldFlip(dropdownPos: number): boolean {
    if (typeof dropdownPos !== 'number') {
      return false;
    }

    // If flip is enabled and the dropdown bottom position is
    // greater than the window height flip the dropdown.
    let shouldFlip = false;
    if (this.position === 'auto') {
      shouldFlip = !window.matchMedia(`(min-height: ${dropdownPos + 1}px)`)
        .matches;
    } else if (this.position === 'top') {
      shouldFlip = true;
    }

    return shouldFlip;
  }

  setActiveDescendant(activeDescendantID: string): void {
    this.element.setAttribute('aria-activedescendant', activeDescendantID);
  }

  removeActiveDescendant(): void {
    this.element.removeAttribute('aria-activedescendant');
  }

  open(dropdownPos: number): void {
    this.element.classList.add(this.classNames.openState);
    this.element.setAttribute('aria-expanded', 'true');
    this.isOpen = true;

    if (this.shouldFlip(dropdownPos)) {
      this.element.classList.add(this.classNames.flippedState);
      this.isFlipped = true;
    }
  }

  close(): void {
    this.element.classList.remove(this.classNames.openState);
    this.element.setAttribute('aria-expanded', 'false');
    this.removeActiveDescendant();
    this.isOpen = false;

    // A dropdown flips if it does not have space within the page
    if (this.isFlipped) {
      this.element.classList.remove(this.classNames.flippedState);
      this.isFlipped = false;
    }
  }

  focus(): void {
    if (!this.isFocussed) {
      this.element.focus();
    }
  }

  addFocusState(): void {
    this.element.classList.add(this.classNames.focusState);
  }

  removeFocusState(): void {
    this.element.classList.remove(this.classNames.focusState);
  }

  enable(): void {
    this.element.classList.remove(this.classNames.disabledState);
    this.element.removeAttribute('aria-disabled');
    if (this.type === SELECT_ONE_TYPE) {
      this.element.setAttribute('tabindex', '0');
    }
    this.isDisabled = false;
  }

  disable(): void {
    this.element.classList.add(this.classNames.disabledState);
    this.element.setAttribute('aria-disabled', 'true');
    if (this.type === SELECT_ONE_TYPE) {
      this.element.setAttribute('tabindex', '-1');
    }
    this.isDisabled = true;
  }

  wrap(element: HTMLSelectElement | HTMLInputElement | HTMLElement): void {
    wrap(element, this.element);
  }

  unwrap(element: HTMLElement): void {
    if (this.element.parentNode) {
      // Move passed element outside this element
      this.element.parentNode.insertBefore(element, this.element);
      // Remove this element
      this.element.parentNode.removeChild(this.element);
    }
  }

  addLoadingState(): void {
    this.element.classList.add(this.classNames.loadingState);
    this.element.setAttribute('aria-busy', 'true');
    this.isLoading = true;
  }

  removeLoadingState(): void {
    this.element.classList.remove(this.classNames.loadingState);
    this.element.removeAttribute('aria-busy');
    this.isLoading = false;
  }

  _onFocus(): void {
    this.isFocussed = true;
  }

  _onBlur(): void {
    this.isFocussed = false;
  }
}
