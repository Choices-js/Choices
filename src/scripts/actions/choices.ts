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

export const addChoice = ({
  value,
  label,
  id,
  groupId,
  disabled,
  elementId,
  customProperties,
  placeholder,
  keyCode,
}): AddChoiceAction => ({
  type: ACTION_TYPES.ADD_CHOICE,
  value,
  label,
  id,
  groupId,
  disabled,
  elementId,
  customProperties,
  placeholder,
  keyCode,
});

export const filterChoices = (
  results: Result<Choice>[],
): FilterChoicesAction => ({
  type: ACTION_TYPES.FILTER_CHOICES,
  results,
});

export const activateChoices = (active = true): ActivateChoicesAction => ({
  type: ACTION_TYPES.ACTIVATE_CHOICES,
  active,
});

export const clearChoices = (): ClearChoicesAction => ({
  type: ACTION_TYPES.CLEAR_CHOICES,
});
