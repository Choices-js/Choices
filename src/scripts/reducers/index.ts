import { combineReducers } from 'redux';
import items from './items';
import groups from './groups';
import choices from './choices';
import loading from './loading';
import { cloneObject } from '../lib/utils';
import { ActionType, State } from '../interfaces';

export const defaultState: State = {
  groups: [],
  items: [],
  choices: [],
  loading: 0,
};

const appReducer = combineReducers({
  items,
  groups,
  choices,
  loading,
});

const rootReducer = (passedState, action): object => {
  let state = passedState;
  // If we are clearing all items, groups and options we reassign
  // state and then pass that state to our proper reducer. This isn't
  // mutating our actual state
  // See: http://stackoverflow.com/a/35641992
  if (action.type === ActionType.CLEAR_ALL) {
    // preserve the loading state as to allow withDeferRendering to work
    const isLoading = state.loading;
    state = cloneObject(defaultState);
    state.loading = isLoading;
  }

  return appReducer(state, action);
};

export default rootReducer;
