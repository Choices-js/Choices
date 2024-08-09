import { ChoiceFull } from '../interfaces/choice-full';
import { ActionType } from '../interfaces';
import { SearchResult } from '../interfaces/search';
export interface AddChoiceAction {
    type: ActionType.ADD_CHOICE;
    choice: ChoiceFull;
}
export interface RemoveChoiceAction {
    type: ActionType.REMOVE_CHOICE;
    choice: ChoiceFull;
}
export interface FilterChoicesAction {
    type: ActionType.FILTER_CHOICES;
    results: SearchResult<ChoiceFull>[];
}
export interface ActivateChoicesAction {
    type: ActionType.ACTIVATE_CHOICES;
    active: boolean;
}
export interface ClearChoicesAction {
    type: ActionType.CLEAR_CHOICES;
}
export declare const addChoice: (choice: ChoiceFull) => AddChoiceAction;
export declare const removeChoice: (choice: ChoiceFull) => RemoveChoiceAction;
export declare const filterChoices: (results: SearchResult<ChoiceFull>[]) => FilterChoicesAction;
export declare const activateChoices: (active?: boolean) => ActivateChoicesAction;
export declare const clearChoices: () => ClearChoicesAction;
