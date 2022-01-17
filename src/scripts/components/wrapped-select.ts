import { ClassNames } from '../interfaces/class-names';
import { Item } from '../interfaces/item';
import WrappedElement from './wrapped-element';

export default class WrappedSelect extends WrappedElement {
  element: HTMLSelectElement;

  classNames: ClassNames;

  template: (data: object) => HTMLOptionElement;

  constructor({
    element,
    classNames,
    template,
  }: {
    element: HTMLSelectElement;
    classNames: ClassNames;
    template: (data: object) => HTMLOptionElement;
  }) {
    super({ element, classNames });
    this.template = template;
  }

  get placeholderOption(): HTMLOptionElement | null {
    return (
      this.element.querySelector('option[value=""]') ||
      // Backward compatibility layer for the non-standard placeholder attribute supported in older versions.
      this.element.querySelector('option[placeholder]')
    );
  }

  get optionGroups(): Element[] {
    return Array.from(this.element.getElementsByTagName('OPTGROUP'));
  }

  get options(): Item[] | HTMLOptionElement[] {
    return Array.from(this.element.options);
  }

  set options(options: Item[] | HTMLOptionElement[]) {
    const fragment = document.createDocumentFragment();
    const addOptionToFragment = (data): void => {
      // Create a standard select option
      const option = this.template(data);
      // Append it to fragment
      fragment.appendChild(option);
    };

    // Add each list item to list
    options.forEach((optionData) => addOptionToFragment(optionData));

    this.appendDocFragment(fragment);
  }

  appendDocFragment(fragment: DocumentFragment): void {
    this.element.innerHTML = '';
    this.element.appendChild(fragment);
  }
}
