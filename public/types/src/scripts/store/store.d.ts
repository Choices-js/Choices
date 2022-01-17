import { Store as IStore, AnyAction } from 'redux';
import { Choice } from '../interfaces/choice';
import { Group } from '../interfaces/group';
import { Item } from '../interfaces/item';
import { State } from '../interfaces/state';
export default class Store {
    _store: IStore;
    constructor();
    /**
     * Subscribe store to function call (wrapped Redux method)
     */
    subscribe(onChange: () => void): void;
    /**
     * Dispatch event to store (wrapped Redux method)
     */
    dispatch(action: AnyAction): void;
    /**
     * Get store object (wrapping Redux method)
     */
    get state(): State;
    /**
     * Get items from store
     */
    get items(): Item[];
    /**
     * Get active items from store
     */
    get activeItems(): Item[];
    /**
     * Get highlighted items from store
     */
    get highlightedActiveItems(): Item[];
    /**
     * Get choices from store
     */
    get choices(): Choice[];
    /**
     * Get active choices from store
     */
    get activeChoices(): Choice[];
    /**
     * Get selectable choices from store
     */
    get selectableChoices(): Choice[];
    /**
     * Get choices that can be searched (excluding placeholders)
     */
    get searchableChoices(): Choice[];
    /**
     * Get placeholder choice from store
     */
    get placeholderChoice(): Choice | undefined;
    /**
     * Get groups from store
     */
    get groups(): Group[];
    /**
     * Get active groups from store
     */
    get activeGroups(): Group[];
    /**
     * Get loading state from store
     */
    isLoading(): boolean;
    /**
     * Get single choice by it's ID
     */
    getChoiceById(id: string): Choice | undefined;
    /**
     * Get group by group id
     */
    getGroupById(id: number): Group | undefined;
}
//# sourceMappingURL=store.d.ts.map