import { AddChoiceAction, RemoveChoiceAction, FilterChoicesAction, ActivateChoicesAction, ClearChoicesAction } from '../actions/choices';
import { AddItemAction, RemoveItemAction } from '../actions/items';
import { ChoiceFull } from '../interfaces/choice-full';
type ActionTypes = AddChoiceAction | RemoveChoiceAction | FilterChoicesAction | ActivateChoicesAction | ClearChoicesAction | AddItemAction | RemoveItemAction | Record<string, never>;
export default function choices(state?: ChoiceFull[], action?: ActionTypes): ChoiceFull[];
export {};
