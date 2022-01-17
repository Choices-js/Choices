import { AddChoiceAction, FilterChoicesAction, ActivateChoicesAction, ClearChoicesAction } from '../actions/choices';
import { AddItemAction, RemoveItemAction } from '../actions/items';
import { Choice } from '../interfaces/choice';
export declare const defaultState: never[];
declare type ActionTypes = AddChoiceAction | FilterChoicesAction | ActivateChoicesAction | ClearChoicesAction | AddItemAction | RemoveItemAction | Record<string, never>;
export default function choices(state?: Choice[], action?: ActionTypes): Choice[];
export {};
//# sourceMappingURL=choices.d.ts.map