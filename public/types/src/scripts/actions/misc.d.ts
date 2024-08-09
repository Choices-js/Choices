import { ActionType } from '../interfaces';
export interface ClearAllAction {
    type: ActionType.CLEAR_ALL;
}
export interface SetIsLoadingAction {
    type: ActionType.SET_IS_LOADING;
    isLoading: boolean;
}
export declare const clearAll: () => ClearAllAction;
export declare const setIsLoading: (isLoading: boolean) => SetIsLoadingAction;
