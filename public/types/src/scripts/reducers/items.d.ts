import { AddItemAction, RemoveItemAction, HighlightItemAction } from '../actions/items';
import { State } from '../interfaces/state';
import { RemoveChoiceAction } from '../actions/choices';
import { ChoiceFull } from '../interfaces/choice-full';
type ActionTypes = AddItemAction | RemoveChoiceAction | RemoveItemAction | HighlightItemAction | Record<string, never>;
export default function items(state?: ChoiceFull[], action?: ActionTypes): State['items'];
export {};
