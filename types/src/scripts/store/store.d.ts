import { AnyAction, Store as IStore, StoreListener } from '../interfaces/store';
import { StateChangeSet, State } from '../interfaces/state';
import { ChoiceFull } from '../interfaces/choice-full';
import { GroupFull } from '../interfaces/group-full';
export default class Store<T> implements IStore {
    _state: State;
    _listeners: StoreListener[];
    _txn: number;
    _changeSet?: StateChangeSet;
    _context: T;
    constructor(context: T);
    get defaultState(): State;
    changeSet(init: boolean): StateChangeSet;
    reset(): void;
    subscribe(onChange: StoreListener): this;
    dispatch(action: AnyAction): void;
    withTxn(func: () => void): void;
    /**
     * Get store object
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
     * Get choices that can be searched (excluding placeholders or disabled choices)
     */
    get searchableChoices(): ChoiceFull[];
    /**
     * Get groups from store
     */
    get groups(): GroupFull[];
    /**
     * Get active groups from store
     */
    get activeGroups(): GroupFull[];
    inTxn(): boolean;
    /**
     * Get single choice by it's ID
     */
    getChoiceById(id: number): ChoiceFull | undefined;
    /**
     * Get group by group id
     */
    getGroupById(id: number): GroupFull | undefined;
}
