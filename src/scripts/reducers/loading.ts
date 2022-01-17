import { SetIsLoadingAction } from '../actions/misc';
import { State } from '../interfaces/state';

export const defaultState = false;

type ActionTypes = SetIsLoadingAction | Record<string, never>;

const general = (
  state = defaultState,
  action: ActionTypes = {},
): State['loading'] => {
  switch (action.type) {
    case 'SET_IS_LOADING': {
      return action.isLoading;
    }

    default: {
      return state;
    }
  }
};

export default general;
