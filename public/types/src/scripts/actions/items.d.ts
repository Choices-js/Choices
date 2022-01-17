import { ACTION_TYPES } from '../constants';
export interface AddItemAction {
    type: typeof ACTION_TYPES.ADD_ITEM;
    id: number;
    value: string;
    label: string;
    choiceId: number;
    groupId: number;
    customProperties: object;
    placeholder: boolean;
    keyCode: number;
}
export interface RemoveItemAction {
    type: typeof ACTION_TYPES.REMOVE_ITEM;
    id: number;
    choiceId: number;
}
export interface HighlightItemAction {
    type: typeof ACTION_TYPES.HIGHLIGHT_ITEM;
    id: number;
    highlighted: boolean;
}
export declare const addItem: ({ value, label, id, choiceId, groupId, customProperties, placeholder, keyCode, }: {
    id: number;
    value: string;
    label: string;
    choiceId: number;
    groupId: number;
    customProperties: object;
    placeholder: boolean;
    keyCode: number;
}) => AddItemAction;
export declare const removeItem: (id: number, choiceId: number) => RemoveItemAction;
export declare const highlightItem: (id: number, highlighted: boolean) => HighlightItemAction;
//# sourceMappingURL=items.d.ts.map