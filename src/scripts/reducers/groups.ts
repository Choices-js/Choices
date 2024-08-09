import { AddGroupAction } from '../actions/groups';
import { ClearChoicesAction } from '../actions/choices';
import { State } from '../interfaces/state';
import { GroupFull } from '../interfaces/group-full';
import { ActionType } from '../interfaces';

type ActionTypes = AddGroupAction | ClearChoicesAction | Record<string, never>;

export default function groups(
  state: GroupFull[] = [],
  action: ActionTypes = {},
): State['groups'] {
  switch (action.type) {
    case ActionType.ADD_GROUP: {
      const addGroupAction = action as AddGroupAction;

      return [...state, addGroupAction.group];
    }

    case ActionType.CLEAR_CHOICES: {
      return [];
    }

    default: {
      return state;
    }
  }
}
