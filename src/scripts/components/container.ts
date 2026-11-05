import { addClassesToElement, removeClassesFromElement } from '../lib/utils';
import { ClassNames } from '../interfaces/class-names';
import { PositionOptionsType } from '../interfaces/position-options-type';
import { PassedElementType, PassedElementTypes } from '../interfaces/passed-element-type';

export default class Container {
  element: HTMLElement;

  type: PassedElementType;

  classNames: ClassNames;

  position: PositionOptionsType;

  isOpen: boolean;

  isFlipped: boolean;

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
    this.isDisabled = false;
    this.isLoading = false;
  }

  /**
   * Determine whether container should be flipped based on passed
   * dropdown position
   */
  shouldFlip(dropdownPos: number, dropdownHeight: number): boolean {
    // If flip is enabled and the dropdown bottom position is
    // greater than the window height flip the dropdown.
    let shouldFlip = false;
    if (this.position === 'auto') {
      shouldFlip =
        this.element.getBoundingClientRect().top - dropdownHeight >= 0 &&
        !window.matchMedia(`(min-height: ${dropdownPos + 1}px)`).matches;
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

  open(dropdownPos: number, dropdownHeight: number): void {
    addClassesToElement(this.element, this.classNames.openState);
    this.element.setAttribute('aria-expanded', 'true');
    this.isOpen = true;

    if (this.shouldFlip(dropdownPos, dropdownHeight)) {
      addClassesToElement(this.element, this.classNames.flippedState);
      this.isFlipped = true;
    }
  }

  close(): void {
    removeClassesFromElement(this.element, this.classNames.openState);
    this.element.setAttribute('aria-expanded', 'false');
    this.removeActiveDescendant();
    this.isOpen = false;

    // A dropdown flips if it does not have space within the page
    if (this.isFlipped) {
      removeClassesFromElement(this.element, this.classNames.flippedState);
      this.isFlipped = false;
    }
  }

  addFocusState(): void {
    addClassesToElement(this.element, this.classNames.focusState);
  }

  removeFocusState(): void {
    removeClassesFromElement(this.element, this.classNames.focusState);
  }

  addInvalidState(): void {
    addClassesToElement(this.element, this.classNames.invalidState);
  }

  removeInvalidState(): void {
    removeClassesFromElement(this.element, this.classNames.invalidState);
  }

  enable(): void {
    removeClassesFromElement(this.element, this.classNames.disabledState);
    this.element.removeAttribute('aria-disabled');
    if (this.type === PassedElementTypes.SelectOne) {
      this.element.setAttribute('tabindex', '0');
    }
    this.isDisabled = false;
  }

  disable(): void {
    addClassesToElement(this.element, this.classNames.disabledState);
    this.element.setAttribute('aria-disabled', 'true');
    if (this.type === PassedElementTypes.SelectOne) {
      this.element.setAttribute('tabindex', '-1');
    }
    this.isDisabled = true;
  }

  wrap(element: HTMLElement): void {
    const el = this.element;
    const { parentNode } = element;
    if (parentNode) {
      if (element.nextSibling) {
        parentNode.insertBefore(el, element.nextSibling);
      } else {
        parentNode.appendChild(el);
      }
    }

    el.appendChild(element);
  }

  unwrap(element: HTMLElement): void {
    const el = this.element;
    const { parentNode } = el;
    if (parentNode) {
      // Move passed element outside this element
      parentNode.insertBefore(element, el);
      // Remove this element
      parentNode.removeChild(el);
    }
  }

  addLoadingState(): void {
    addClassesToElement(this.element, this.classNames.loadingState);
    this.element.setAttribute('aria-busy', 'true');
    this.isLoading = true;
  }

  removeLoadingState(): void {
    removeClassesFromElement(this.element, this.classNames.loadingState);
    this.element.removeAttribute('aria-busy');
    this.isLoading = false;
  }
}
