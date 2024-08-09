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

export const addChoice = (choice: ChoiceFull): AddChoiceAction => ({
  type: ActionType.ADD_CHOICE,
  choice,
});

export const removeChoice = (choice: ChoiceFull): RemoveChoiceAction => ({
  type: ActionType.REMOVE_CHOICE,
  choice,
});

export const filterChoices = (
  results: SearchResult<ChoiceFull>[],
): FilterChoicesAction => ({
  type: ActionType.FILTER_CHOICES,
  results,
});

export const activateChoices = (active = true): ActivateChoicesAction => ({
  type: ActionType.ACTIVATE_CHOICES,
  active,
});

export const clearChoices = (): ClearChoicesAction => ({
  type: ActionType.CLEAR_CHOICES,
});
