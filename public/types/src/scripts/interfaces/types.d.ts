import { StringUntrusted } from './string-untrusted';
import { StringPreEscaped } from './string-pre-escaped';
export declare namespace Types {
    type StrToEl = (str: string) => HTMLElement | HTMLInputElement | HTMLOptionElement;
    type EscapeForTemplateFn = (allowHTML: boolean, s: StringUntrusted | StringPreEscaped | string) => string;
    type StringFunction = () => string;
    type NoticeStringFunction = (value: string, valueRaw: string) => string;
    type NoticeLimitFunction = (maxItemCount: number) => string;
    type FilterFunction = (value: string) => boolean;
    type ValueCompareFunction = (value1: string, value2: string) => boolean;
    interface RecordToCompare {
        value?: StringUntrusted | string;
        label?: StringUntrusted | string;
    }
}
