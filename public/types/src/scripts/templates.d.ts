/**
 * Helpers to create HTML elements used by Choices
 * Can be overridden by providing `callbackOnCreateTemplates` option
 */
import { Choice } from './interfaces/choice';
import { Group } from './interfaces/group';
import { Item } from './interfaces/item';
import { PassedElementType } from './interfaces/passed-element-type';
declare type TemplateOptions = Record<'classNames' | 'allowHTML', any>;
declare const templates: {
    containerOuter({ classNames: { containerOuter } }: TemplateOptions, dir: HTMLElement['dir'], isSelectElement: boolean, isSelectOneElement: boolean, searchEnabled: boolean, passedElementType: PassedElementType, labelId: string): HTMLDivElement;
    containerInner({ classNames: { containerInner }, }: TemplateOptions): HTMLDivElement;
    itemList({ classNames: { list, listSingle, listItems } }: TemplateOptions, isSelectOneElement: boolean): HTMLDivElement;
    placeholder({ allowHTML, classNames: { placeholder } }: TemplateOptions, value: string): HTMLDivElement;
    item({ allowHTML, classNames: { item, button, highlightedState, itemSelectable, placeholder, }, }: TemplateOptions, { id, value, label, customProperties, active, disabled, highlighted, placeholder: isPlaceholder, }: Item, removeItemButton: boolean): HTMLDivElement;
    choiceList({ classNames: { list } }: TemplateOptions, isSelectOneElement: boolean): HTMLDivElement;
    choiceGroup({ allowHTML, classNames: { group, groupHeading, itemDisabled }, }: TemplateOptions, { id, value, disabled }: Group): HTMLDivElement;
    choice({ allowHTML, classNames: { item, itemChoice, itemSelectable, selectedState, itemDisabled, placeholder, }, }: TemplateOptions, { id, value, label, groupId, elementId, disabled: isDisabled, selected: isSelected, placeholder: isPlaceholder, }: Choice, selectText: string): HTMLDivElement;
    input({ classNames: { input, inputCloned } }: TemplateOptions, placeholderValue: string): HTMLInputElement;
    dropdown({ classNames: { list, listDropdown }, }: TemplateOptions): HTMLDivElement;
    notice({ allowHTML, classNames: { item, itemChoice, noResults, noChoices }, }: TemplateOptions, innerText: string, type?: 'no-choices' | 'no-results' | ''): HTMLDivElement;
    option({ label, value, customProperties, active, disabled, }: Item): HTMLOptionElement;
};
export default templates;
//# sourceMappingURL=templates.d.ts.map