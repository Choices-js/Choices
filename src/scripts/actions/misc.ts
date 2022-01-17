import { ACTION_TYPES } from '../constants';
import { State } from '../interfaces/state';

export interface ClearAllAction {
  type: typeof ACTION_TYPES.CLEAR_ALL;
}

export interface ResetToAction {
  type: typeof ACTION_TYPES.RESET_TO;
  state: State;
}

export interface SetIsLoadingAction {
  type: typeof ACTION_TYPES.SET_IS_LOADING;
  isLoading: boolean;
}

export const clearAll = (): ClearAllAction => ({
  type: ACTION_TYPES.CLEAR_ALL,
});

export const resetTo = (state: State): ResetToAction => ({
  type: ACTION_TYPES.RESET_TO,
  state,
});

export const setIsLoading = (isLoading: boolean): SetIsLoadingAction => ({
  type: ACTION_TYPES.SET_IS_LOADING,
  isLoading,
});
