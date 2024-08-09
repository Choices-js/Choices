import { SetIsLoadingAction } from '../actions/misc';
import { State } from '../interfaces/state';
import { ActionType } from '../interfaces';

type ActionTypes = SetIsLoadingAction | Record<string, never>;

const general = (
  state: number = 0,
  action: ActionTypes = {},
): State['loading'] => {
  switch (action.type) {
    case ActionType.SET_IS_LOADING: {
      if (action.isLoading) {
        return state + 1;
      }

      return Math.max(0, state - 1);
    }

    default: {
      return state;
    }
  }
};

export default general;
