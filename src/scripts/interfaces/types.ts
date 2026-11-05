import { StringUntrusted } from './string-untrusted';
import { StringPreEscaped } from './string-pre-escaped';
// eslint-disable-next-line import/no-cycle
import { EventChoice } from './event-choice';

export namespace Types {
  export type StrToEl = (str: string) => HTMLElement | HTMLInputElement | HTMLOptionElement;
  export type EscapeForTemplateFn = (allowHTML: boolean, s: StringUntrusted | StringPreEscaped | string) => string;
  export type GetClassNamesFn = (s: string | Array<string>) => string;
  export type StringFunction = () => string;
  export type NoticeStringFunction = (value: string, valueRaw: string, item?: EventChoice) => string;
  export type NoticeLimitFunction = (maxItemCount: number) => string;
  export type FilterFunction = (value: string) => boolean;
  export type ValueCompareFunction = (value1: string, value2: string) => boolean;

  export interface RecordToCompare {
    value?: StringUntrusted | string;
    label?: StringUntrusted | string;
  }
  export type ValueOf<T extends object> = T[keyof T];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type CustomProperties = Record<string, any> | string;
}
