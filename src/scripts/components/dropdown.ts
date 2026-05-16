import { ClassNames } from '../interfaces/class-names';
import { PassedElementType } from '../interfaces/passed-element-type';
import { addClassesToElement, removeClassesFromElement } from '../lib/utils';

export default class Dropdown {
  element: HTMLElement;

  type: PassedElementType;

  classNames: ClassNames;

  isActive: boolean;

  constructor({
    element,
    type,
    classNames,
  }: {
    element: HTMLElement;
    type: PassedElementType;
    classNames: ClassNames;
  }) {
    this.element = element;
    this.classNames = classNames;
    this.type = type;
    this.isActive = false;
  }

  /**
   * Show dropdown to user by adding active state class
   */
  show(): this {
    addClassesToElement(this.element, this.classNames.activeState);
    this.isActive = true;

    return this;
  }

  /**
   * Hide dropdown from user
   */
  hide(): this {
    removeClassesFromElement(this.element, this.classNames.activeState);
    this.isActive = false;

    return this;
  }
}
