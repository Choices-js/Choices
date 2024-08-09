import { parseCustomProperties } from '../lib/utils';
import { ClassNames } from '../interfaces/class-names';
import WrappedElement from './wrapped-element';
import { GroupFull } from '../interfaces/group-full';
import { ChoiceFull } from '../interfaces/choice-full';
import { stringToHtmlClass } from '../lib/choice-input';
import { isHtmlOptgroup, isHtmlOption } from '../lib/html-guard-statements';

export default class WrappedSelect extends WrappedElement<HTMLSelectElement> {
  classNames: ClassNames;

  template: (data: object) => HTMLOptionElement;

  extractPlaceholder: boolean;

  constructor({
    element,
    classNames,
    template,
    extractPlaceholder,
  }: {
    element: HTMLSelectElement;
    classNames: ClassNames;
    template: (data: object) => HTMLOptionElement;
    extractPlaceholder: boolean;
  }) {
    super({ element, classNames });
    this.template = template;
    this.extractPlaceholder = extractPlaceholder;
  }

  get placeholderOption(): HTMLOptionElement | null {
    return (
      this.element.querySelector('option[value=""]') ||
      // Backward compatibility layer for the non-standard placeholder attribute supported in older versions.
      this.element.querySelector('option[placeholder]')
    );
  }

  addOptions(choices: ChoiceFull[]) {
    choices.forEach((obj) => {
      const choice = obj;
      if (choice.element) {
        return;
      }

      const option = this.template(choice);
      this.element.appendChild(option);
      choice.element = option;
    });
  }

  optionsAsChoices(): (ChoiceFull | GroupFull)[] {
    const choices: (ChoiceFull | GroupFull)[] = [];

    this.element
      .querySelectorAll(':scope > option, :scope > optgroup')
      .forEach((e) => {
        if (isHtmlOption(e)) {
          choices.push(this._optionToChoice(e));
        } else if (isHtmlOptgroup(e)) {
          choices.push(this._optgroupToChoice(e));
        }
        // todo: hr as empty optgroup, requires displaying empty opt-groups to be useful
      });

    return choices;
  }

  // eslint-disable-next-line class-methods-use-this
  _optionToChoice(option: HTMLOptionElement): ChoiceFull {
    return {
      id: 0,
      groupId: 0,
      score: 0,
      value: option.value,
      label: option.innerHTML,
      element: option,
      active: true,
      // this returns true if nothing is selected on initial load, which will break placeholder support
      selected: this.extractPlaceholder
        ? option.selected
        : option.hasAttribute('selected'),
      disabled: option.disabled,
      highlighted: false,
      placeholder:
        this.extractPlaceholder &&
        (option.value === '' || option.hasAttribute('placeholder')),
      labelClass:
        typeof option.dataset.labelClass !== 'undefined'
          ? stringToHtmlClass(option.dataset.labelClass)
          : undefined,
      labelDescription:
        typeof option.dataset.labelDescription !== 'undefined'
          ? option.dataset.labelDescription
          : undefined,
      customProperties: parseCustomProperties(option.dataset.customProperties),
    };
  }

  _optgroupToChoice(optgroup: HTMLOptGroupElement): GroupFull {
    const options = optgroup.querySelectorAll('option');
    const choices = Array.from(options).map((option) =>
      this._optionToChoice(option),
    );

    return {
      id: 0,
      label: optgroup.label || '',
      element: optgroup,
      active: choices.length !== 0,
      disabled: optgroup.disabled,
      choices,
    };
  }
}
