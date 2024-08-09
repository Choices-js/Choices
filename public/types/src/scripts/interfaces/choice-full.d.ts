import { StringUntrusted } from './string-untrusted';
export type CustomProperties = Record<string, any> | string;
export interface ChoiceFull {
    id: number;
    highlighted: boolean;
    element?: HTMLOptionElement | HTMLOptGroupElement;
    labelClass?: Array<string>;
    labelDescription?: string;
    customProperties?: CustomProperties;
    disabled: boolean;
    active: boolean;
    elementId?: string;
    groupId: number;
    label: StringUntrusted | string;
    placeholder: boolean;
    selected: boolean;
    value: string;
    score: number;
}
