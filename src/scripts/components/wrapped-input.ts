import { ClassNames } from '../interfaces/class-names';
import WrappedElement from './wrapped-element';

export default class WrappedInput extends WrappedElement {
  element: HTMLInputElement;

  delimiter: string;

  constructor({
    element,
    classNames,
    delimiter,
  }: {
    element: HTMLInputElement;
    classNames: ClassNames;
    delimiter: string;
  }) {
    super({ element, classNames });
    this.delimiter = delimiter;
  }

  get value(): string {
    return this.element.value;
  }

  set value(value: string) {
    this.element.setAttribute('value', value);
    this.element.value = value;
  }
}
