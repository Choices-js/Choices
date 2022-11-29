import { Choice } from '../interfaces/choice';
import { EventType } from '../interfaces/event-type';
export declare const getRandomNumber: (min: number, max: number) => number;
export declare const generateChars: (length: number) => string;
export declare const generateId: (element: HTMLInputElement | HTMLSelectElement, prefix: string) => string;
export declare const getType: (obj: any) => string;
export declare const isType: (type: string, obj: any) => boolean;
export declare const wrap: (element: HTMLElement, wrapper?: HTMLElement) => HTMLElement;
export declare const getAdjacentEl: (startEl: Element, selector: string, direction?: number) => Element;
export declare const isScrolledIntoView: (element: HTMLElement, parent: HTMLElement, direction?: number) => boolean;
export declare const sanitise: <T>(value: string | T) => string | T;
export declare const strToEl: (str: string) => Element;
interface RecordToCompare {
    value: string;
    label?: string;
}
export declare const sortByAlpha: ({ value, label }: RecordToCompare, { value: value2, label: label2 }: RecordToCompare) => number;
export declare const sortByScore: (a: Pick<Choice, 'score'>, b: Pick<Choice, 'score'>) => number;
export declare const dispatchEvent: (element: HTMLElement, type: EventType, customArgs?: object | null) => boolean;
export declare const existsInArray: (array: any[], value: string, key?: string) => boolean;
export declare const cloneObject: (obj: object) => object;
/**
 * Returns an array of keys present on the first but missing on the second object
 */
export declare const diff: (a: Record<string, any>, b: Record<string, any>) => string[];
export declare const parseCustomProperties: (customProperties: any) => any;
export {};
//# sourceMappingURL=utils.d.ts.map