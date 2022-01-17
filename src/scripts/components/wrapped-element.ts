import { ClassNames } from '../interfaces/class-names';
import { EventType } from '../interfaces/event-type';
import { dispatchEvent } from '../lib/utils';

export default class WrappedElement {
  element: HTMLInputElement | HTMLSelectElement;

  classNames: ClassNames;

  isDisabled: boolean;

  constructor({ element, classNames }) {
    this.element = element;
    this.classNames = classNames;

    if (
      !(element instanceof HTMLInputElement) &&
      !(element instanceof HTMLSelectElement)
    ) {
      throw new TypeError('Invalid element passed');
    }

    this.isDisabled = false;
  }

  get isActive(): boolean {
    return this.element.dataset.choice === 'active';
  }

  get dir(): string {
    return this.element.dir;
  }

  get value(): string {
    return this.element.value;
  }

  set value(value: string) {
    // you must define setter here otherwise it will be readonly property
    this.element.value = value;
  }

  conceal(): void {
    // Hide passed input
    this.element.classList.add(this.classNames.input);
    this.element.hidden = true;

    // Remove element from tab index
    this.element.tabIndex = -1;

    // Backup original styles if any
    const origStyle = this.element.getAttribute('style');

    if (origStyle) {
      this.element.setAttribute('data-choice-orig-style', origStyle);
    }

    this.element.setAttribute('data-choice', 'active');
  }

  reveal(): void {
    // Reinstate passed element
    this.element.classList.remove(this.classNames.input);
    this.element.hidden = false;
    this.element.removeAttribute('tabindex');

    // Recover original styles if any
    const origStyle = this.element.getAttribute('data-choice-orig-style');

    if (origStyle) {
      this.element.removeAttribute('data-choice-orig-style');
      this.element.setAttribute('style', origStyle);
    } else {
      this.element.removeAttribute('style');
    }
    this.element.removeAttribute('data-choice');

    // Re-assign values - this is weird, I know
    // @todo Figure out why we need to do this
    this.element.value = this.element.value; // eslint-disable-line no-self-assign
  }

  enable(): void {
    this.element.removeAttribute('disabled');
    this.element.disabled = false;
    this.isDisabled = false;
  }

  disable(): void {
    this.element.setAttribute('disabled', '');
    this.element.disabled = true;
    this.isDisabled = true;
  }

  triggerEvent(eventType: EventType, data?: object): void {
    dispatchEvent(this.element, eventType, data);
  }
}
