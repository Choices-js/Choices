import { EventType } from '../interfaces/event-type';
import { StringUntrusted } from '../interfaces/string-untrusted';
import { StringPreEscaped } from '../interfaces/string-pre-escaped';
import { ChoiceFull } from '../interfaces/choice-full';
import { Types } from '../interfaces/types';
export declare const generateId: (element: HTMLInputElement | HTMLSelectElement, prefix: string) => string;
export declare const getAdjacentEl: (startEl: Element, selector: string, direction?: number) => Element;
export declare const isScrolledIntoView: (element: HTMLElement, parent: HTMLElement, direction?: number) => boolean;
export declare const sanitise: <T>(value: T | StringUntrusted | StringPreEscaped | string) => T | string;
export declare const strToEl: (str: string) => Element;
export declare const unwrapStringForRaw: (s?: StringUntrusted | StringPreEscaped | string) => string;
export declare const unwrapStringForEscaped: (s?: StringUntrusted | StringPreEscaped | string) => string;
export declare const sortByAlpha: ({ value, label }: Types.RecordToCompare, { value: value2, label: label2 }: Types.RecordToCompare) => number;
export declare const sortByScore: (a: Pick<ChoiceFull, "score">, b: Pick<ChoiceFull, "score">) => number;
export declare const dispatchEvent: (element: HTMLElement, type: EventType, customArgs?: object | null) => boolean;
export declare const cloneObject: <T>(obj: T) => T;
/**
 * Returns an array of keys present on the first but missing on the second object
 */
export declare const diff: (a: Record<string, any>, b: Record<string, any>) => string[];
export declare const getClassNames: (ClassNames: Array<string> | string) => Array<string>;
export declare const getClassNamesSelector: (option: string | Array<string> | null) => string;
export declare const parseCustomProperties: (customProperties?: string) => object | string;
