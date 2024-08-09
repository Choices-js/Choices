import { Store as ReduxStore, AnyAction } from 'redux';
import { Store as IStore } from '../interfaces/store';
import { State } from '../interfaces/state';
import { ChoiceFull } from '../interfaces/choice-full';
import { GroupFull } from '../interfaces/group-full';
export default class Store implements IStore {
    _store: ReduxStore;
    constructor();
    /**
     * Subscribe store to function call (wrapped Redux method)
     */
    subscribe(onChange: () => void): void;
    /**
     * Dispatch event to store (wrapped Redux method)
     */
    dispatch(action: AnyAction): void;
    startDeferRendering(): void;
    stopDeferRendering(): void;
    withDeferRendering(func: () => void): void;
    /**
     * Get store object (wrapping Redux method)
     */
    get state(): State;
    /**
     * Get items from store
     */
    get items(): ChoiceFull[];
    /**
     * Get highlighted items from store
     */
    get highlightedActiveItems(): ChoiceFull[];
    /**
     * Get choices from store
     */
    get choices(): ChoiceFull[];
    /**
     * Get active choices from store
     */
    get activeChoices(): ChoiceFull[];
    /**
     * Get choices that can be searched (excluding placeholders)
     */
    get searchableChoices(): ChoiceFull[];
    /**
     * Get placeholder choice from store
     */
    get placeholderChoice(): ChoiceFull | undefined;
    /**
     * Get groups from store
     */
    get groups(): GroupFull[];
    /**
     * Get active groups from store
     */
    get activeGroups(): GroupFull[];
    /**
     * Get loading state from store
     */
    isLoading(): boolean;
    /**
     * Get single choice by it's ID
     */
    getChoiceById(id: number): ChoiceFull | undefined;
    /**
     * Get group by group id
     */
    getGroupById(id: number): GroupFull | undefined;
}
