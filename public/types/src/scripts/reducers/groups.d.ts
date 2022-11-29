import { AddGroupAction } from '../actions/groups';
import { ClearChoicesAction } from '../actions/choices';
import { Group } from '../interfaces/group';
import { State } from '../interfaces/state';
export declare const defaultState: never[];
type ActionTypes = AddGroupAction | ClearChoicesAction | Record<string, never>;
export default function groups(state?: Group[], action?: ActionTypes): State['groups'];
export {};
//# sourceMappingURL=groups.d.ts.map