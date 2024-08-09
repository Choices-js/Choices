import { ClassNames } from '../interfaces/class-names';
import WrappedElement from './wrapped-element';
import { GroupFull } from '../interfaces/group-full';
import { ChoiceFull } from '../interfaces/choice-full';
export default class WrappedSelect extends WrappedElement<HTMLSelectElement> {
    classNames: ClassNames;
    template: (data: object) => HTMLOptionElement;
    extractPlaceholder: boolean;
    constructor({ element, classNames, template, extractPlaceholder, }: {
        element: HTMLSelectElement;
        classNames: ClassNames;
        template: (data: object) => HTMLOptionElement;
        extractPlaceholder: boolean;
    });
    get placeholderOption(): HTMLOptionElement | null;
    addOptions(choices: ChoiceFull[]): void;
    optionsAsChoices(): (ChoiceFull | GroupFull)[];
    _optionToChoice(option: HTMLOptionElement): ChoiceFull;
    _optgroupToChoice(optgroup: HTMLOptGroupElement): GroupFull;
}
