import { StringUntrusted } from './string-untrusted';
import { StringPreEscaped } from './string-pre-escaped';

export namespace Types {
  export type StrToEl = (
    str: string,
  ) => HTMLElement | HTMLInputElement | HTMLOptionElement;
  export type EscapeForTemplateFn = (
    allowHTML: boolean,
    s: StringUntrusted | StringPreEscaped | string,
  ) => string;
  export type StringFunction = () => string;
  export type NoticeStringFunction = (
    value: string,
    valueRaw: string,
  ) => string;
  export type NoticeLimitFunction = (maxItemCount: number) => string;
  export type FilterFunction = (value: string) => boolean;
  export type ValueCompareFunction = (
    value1: string,
    value2: string,
  ) => boolean;

  export interface RecordToCompare {
    value?: StringUntrusted | string;
    label?: StringUntrusted | string;
  }
}
