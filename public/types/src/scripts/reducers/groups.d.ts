import { AddGroupAction } from '../actions/groups';
import { ClearChoicesAction } from '../actions/choices';
import { State } from '../interfaces/state';
import { GroupFull } from '../interfaces/group-full';
type ActionTypes = AddGroupAction | ClearChoicesAction | Record<string, never>;
export default function groups(state?: GroupFull[], action?: ActionTypes): State['groups'];
export {};
