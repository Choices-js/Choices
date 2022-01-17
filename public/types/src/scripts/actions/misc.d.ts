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
export declare const clearAll: () => ClearAllAction;
export declare const resetTo: (state: State) => ResetToAction;
export declare const setIsLoading: (isLoading: boolean) => SetIsLoadingAction;
//# sourceMappingURL=misc.d.ts.map