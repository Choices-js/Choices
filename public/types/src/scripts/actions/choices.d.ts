import { ACTION_TYPES } from '../constants';
import { Choice } from '../interfaces/choice';
export interface AddChoiceAction {
    type: typeof ACTION_TYPES.ADD_CHOICE;
    id: number;
    value: string;
    label: string;
    groupId: number;
    disabled: boolean;
    elementId: number;
    customProperties: object;
    placeholder: boolean;
    keyCode: number;
}
export interface Result<T> {
    item: T;
    score: number;
}
export interface FilterChoicesAction {
    type: typeof ACTION_TYPES.FILTER_CHOICES;
    results: Result<Choice>[];
}
export interface ActivateChoicesAction {
    type: typeof ACTION_TYPES.ACTIVATE_CHOICES;
    active: boolean;
}
export interface ClearChoicesAction {
    type: typeof ACTION_TYPES.CLEAR_CHOICES;
}
export declare const addChoice: ({ value, label, id, groupId, disabled, elementId, customProperties, placeholder, keyCode, }: {
    value: any;
    label: any;
    id: any;
    groupId: any;
    disabled: any;
    elementId: any;
    customProperties: any;
    placeholder: any;
    keyCode: any;
}) => AddChoiceAction;
export declare const filterChoices: (results: Result<Choice>[]) => FilterChoicesAction;
export declare const activateChoices: (active?: boolean) => ActivateChoicesAction;
export declare const clearChoices: () => ClearChoicesAction;
//# sourceMappingURL=choices.d.ts.map