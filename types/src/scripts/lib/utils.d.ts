import { EventTypes } from '../interfaces/event-type';
import { StringUntrusted } from '../interfaces/string-untrusted';
import { StringPreEscaped } from '../interfaces/string-pre-escaped';
import { ChoiceFull } from '../interfaces/choice-full';
import { Types } from '../interfaces/types';
import { EventChoice } from '../interfaces';
export declare const generateId: (element: HTMLInputElement | HTMLSelectElement, prefix: string) => string;
export declare const getAdjacentEl: (startEl: HTMLElement, selector: string, direction?: number) => HTMLElement | null;
export declare const isScrolledIntoView: (element: HTMLElement, parent: HTMLElement, direction?: number) => boolean;
export declare const sanitise: <T>(value: T | StringUntrusted | StringPreEscaped | string) => T | string;
export declare const strToEl: (str: string) => Element;
export declare const resolveStringFunction: (fn: Types.StringFunction | string) => string;
export declare const unwrapStringForRaw: (s?: StringUntrusted | StringPreEscaped | string) => string;
export declare const unwrapStringForEscaped: (s?: StringUntrusted | StringPreEscaped | string) => string;
export declare const getChoiceForOutput: (choice: ChoiceFull, keyCode?: number) => EventChoice;
export declare const resolveNoticeFunction: (fn: Types.NoticeStringFunction | string, value: StringUntrusted | StringPreEscaped | string, item?: EventChoice) => string;
export declare const escapeForTemplate: (allowHTML: boolean, s: StringUntrusted | StringPreEscaped | string) => string;
export declare const setElementHtml: (el: HTMLElement, allowHtml: boolean, html: StringUntrusted | StringPreEscaped | string) => void;
export declare const sortByAlpha: ({ value, label }: Types.RecordToCompare, { value: value2, label: label2 }: Types.RecordToCompare) => number;
export declare const sortByScore: (a: Pick<ChoiceFull, "score">, b: Pick<ChoiceFull, "score">) => number;
export declare const sortByRank: (a: Pick<ChoiceFull, "rank">, b: Pick<ChoiceFull, "rank">) => number;
export declare const dispatchEvent: (element: HTMLElement, type: EventTypes, customArgs?: object | null) => boolean;
export declare const cloneObject: <T>(obj: T) => T;
/**
 * Returns an array of keys present on the first but missing on the second object
 */
export declare const diff: (a: Record<string, any>, b: Record<string, any>) => string[];
export declare const getClassNames: (ClassNames: Array<string> | string) => Array<string>;
export declare const getClassNamesSelector: (option: string | Array<string> | null) => string;
export declare const addClassesToElement: (element: HTMLElement, className: Array<string> | string) => void;
export declare const removeClassesFromElement: (element: HTMLElement, className: Array<string> | string) => void;
export declare const parseCustomProperties: (customProperties?: string) => object | string;
export declare const updateClassList: (item: ChoiceFull, add: string | string[], remove: string | string[]) => void;
