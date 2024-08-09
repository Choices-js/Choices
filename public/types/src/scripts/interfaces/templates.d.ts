import { PassedElementType } from './passed-element-type';
import { StringPreEscaped } from './string-pre-escaped';
import { ChoiceFull } from './choice-full';
import { GroupFull } from './group-full';
import { StringUntrusted } from './string-untrusted';
import { Options } from './options';
export type TemplateOptions = Pick<Options, 'classNames' | 'allowHTML' | 'removeItemButtonAlignLeft'>;
export type NoticeType = 'no-choices' | 'no-results' | 'add-choice' | '';
export interface Templates {
    containerOuter({ classNames: { containerOuter }, }: TemplateOptions, dir: HTMLElement['dir'], isSelectElement: boolean, isSelectOneElement: boolean, searchEnabled: boolean, passedElementType: PassedElementType, labelId: string): HTMLDivElement;
    containerInner({ classNames: { containerInner }, }: TemplateOptions): HTMLDivElement;
    itemList({ classNames: { list, listSingle, listItems }, }: TemplateOptions, isSelectOneElement: boolean): HTMLDivElement;
    placeholder({ allowHTML, classNames: { placeholder }, }: TemplateOptions, value: StringPreEscaped | string): HTMLDivElement;
    item({ allowHTML, removeItemButtonAlignLeft, classNames: { item, button, highlightedState, itemSelectable, placeholder, }, }: TemplateOptions, choice: ChoiceFull, removeItemButton: boolean): HTMLDivElement;
    choiceList({ classNames: { list }, }: TemplateOptions, isSelectOneElement: boolean): HTMLDivElement;
    choiceGroup({ allowHTML, classNames: { group, groupHeading, itemDisabled }, }: TemplateOptions, { id, label, disabled }: GroupFull): HTMLDivElement;
    choice({ allowHTML, classNames: { item, itemChoice, itemSelectable, selectedState, itemDisabled, description, placeholder, }, }: TemplateOptions, choice: ChoiceFull, selectText: string): HTMLDivElement;
    input({ classNames: { input, inputCloned }, }: TemplateOptions, placeholderValue: string | null): HTMLInputElement;
    dropdown({ classNames: { list, listDropdown }, }: TemplateOptions): HTMLDivElement;
    notice({ allowHTML, classNames: { item, itemChoice, addChoice, noResults, noChoices }, }: TemplateOptions, innerText: StringUntrusted | StringPreEscaped | string, type: NoticeType): HTMLDivElement;
    option(choice: ChoiceFull): HTMLOptionElement;
}
