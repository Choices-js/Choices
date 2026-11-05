import { StringUntrusted } from './string-untrusted';
import { StringPreEscaped } from './string-pre-escaped';
import { Types } from './types';
import { GroupFull } from './group-full';
export interface ChoiceFull {
    id: number;
    highlighted: boolean;
    element?: HTMLOptionElement | HTMLOptGroupElement;
    itemEl?: HTMLElement;
    choiceEl?: HTMLElement;
    labelClass?: Array<string>;
    labelDescription?: StringPreEscaped | StringUntrusted | string;
    customProperties?: Types.CustomProperties;
    disabled: boolean;
    active: boolean;
    elementId?: string;
    group: GroupFull | null;
    label: StringUntrusted | string;
    placeholder: boolean;
    selected: boolean;
    value: string;
    score: number;
    rank: number;
}
