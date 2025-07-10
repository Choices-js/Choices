import { PassedElementType } from './passed-element-type';
import { StringPreEscaped } from './string-pre-escaped';
import { ChoiceFull } from './choice-full';
import { GroupFull } from './group-full';
// eslint-disable-next-line import/no-cycle
import { Options } from './options';
import { Types } from './types';

export type TemplateOptions = Pick<
  Options,
  | 'classNames'
  | 'allowHTML'
  | 'removeItemButtonAlignLeft'
  | 'removeItemIconText'
  | 'removeItemLabelText'
  | 'searchEnabled'
  | 'labelId'
  | 'itemDeselectText'
>;

export const NoticeTypes = {
  noChoices: 'no-choices',
  noResults: 'no-results',
  addChoice: 'add-choice',
  generic: '',
} as const;
export type NoticeType = Types.ValueOf<typeof NoticeTypes>;

export type CallbackOnCreateTemplatesFn = (
  template: Types.StrToEl,
  escapeForTemplate: Types.EscapeForTemplateFn,
  getClassNames: Types.GetClassNamesFn,
) => Partial<Templates>;

export interface Templates {
  containerOuter(
    options: TemplateOptions,
    dir: HTMLElement['dir'],
    isSelectElement: boolean,
    isSelectOneElement: boolean,
    searchEnabled: boolean,
    passedElementType: PassedElementType,
    labelId: string,
  ): HTMLDivElement;

  containerInner({ classNames: { containerInner } }: TemplateOptions): HTMLDivElement;

  itemList(options: TemplateOptions, isSelectOneElement: boolean): HTMLDivElement;

  placeholder(options: TemplateOptions, value: StringPreEscaped | string): HTMLDivElement;

  item(options: TemplateOptions, choice: ChoiceFull, removeItemButton: boolean): HTMLDivElement;

  choiceList(options: TemplateOptions, isSelectOneElement: boolean): HTMLDivElement;

  choiceGroup(options: TemplateOptions, group: GroupFull): HTMLDivElement;

  choice(options: TemplateOptions, choice: ChoiceFull, selectText: string, groupText?: string): HTMLDivElement;

  input(options: TemplateOptions, placeholderValue: string | null): HTMLInputElement;

  dropdown(options: TemplateOptions): HTMLDivElement;

  notice(options: TemplateOptions, innerText: string, type: NoticeType): HTMLDivElement;

  option(choice: ChoiceFull): HTMLOptionElement;
}
