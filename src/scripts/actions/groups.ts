import { GroupFull } from '../interfaces/group-full';
import { ActionType } from '../interfaces';

export interface AddGroupAction {
  type: ActionType.ADD_GROUP;
  group: GroupFull;
}

export const addGroup = (group: GroupFull): AddGroupAction => ({
  type: ActionType.ADD_GROUP,
  group,
});
