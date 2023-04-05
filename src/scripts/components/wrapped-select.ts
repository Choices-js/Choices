import { Choice } from '../interfaces/choice';
import { parseCustomProperties } from '../lib/utils';
import { ClassNames } from '../interfaces/class-names';
import { Item } from '../interfaces/item';
import WrappedElement from './wrapped-element';
import { isHTMLOptgroup } from '../lib/htmlElementGuards';
import { isHTMLOption } from '../lib/htmlElementGuards';

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

  optionsAsChoices(): Partial<Choice>[] {
    const choices: Partial<Choice>[] = [];

    for (const e of Array.from(this.element.querySelectorAll(':scope > *'))) {
      if (isHTMLOption(e)) {
        choices.push(this._optionToChoice(e as HTMLOptionElement));
      } else if (isHTMLOptgroup(e)) {
        choices.push(this._optgroupToChoice(e as HTMLOptGroupElement));
      }
      // There should only be those two in a <select> and we wouldn't care about others anyways
    }

    return choices;
  }

  _optionToChoice(option: HTMLOptionElement): Choice {
    return {
      value: option.value,
      label: option.innerHTML,
      selected: !!option.selected,
      disabled: option.disabled || this.element.disabled,
      placeholder: option.value === '' || option.hasAttribute('placeholder'),
      customProperties: parseCustomProperties(option.dataset.customProperties),
    };
  }

  _optgroupToChoice(optgroup: HTMLOptGroupElement): Partial<Choice> {
    return {
      label: optgroup.label || '',
      disabled: !!optgroup.disabled,
      choices: Array.from(optgroup.querySelectorAll('option')).map((option) =>
        this._optionToChoice(option),
      ),
    };
  }

  appendDocFragment(fragment: DocumentFragment): void {
    this.element.innerHTML = '';
    this.element.appendChild(fragment);
  }
}
