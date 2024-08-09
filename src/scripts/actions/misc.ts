import { ActionType } from '../interfaces';

export interface ClearAllAction {
  type: ActionType.CLEAR_ALL;
}

export interface SetIsLoadingAction {
  type: ActionType.SET_IS_LOADING;
  isLoading: boolean;
}

export const clearAll = (): ClearAllAction => ({
  type: ActionType.CLEAR_ALL,
});

export const setIsLoading = (isLoading: boolean): SetIsLoadingAction => ({
  type: ActionType.SET_IS_LOADING,
  isLoading,
});
