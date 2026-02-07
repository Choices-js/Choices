import { StateChangeSet, State } from './state';
import { ChoiceFull } from './choice-full';
import { GroupFull } from './group-full';
import { ActionTypes } from './action-type';

export interface AnyAction<A extends ActionTypes = ActionTypes> {
  type: A;
}

export interface StateUpdate<T> {
  update: boolean;
  state: T;
}

export type Reducer<T> = (state: T, action: AnyAction, context?: unknown) => StateUpdate<T>;

export type StoreListener = (changes: StateChangeSet) => void;

export interface Store {
  dispatch(action: AnyAction): void;

  subscribe(onChange: StoreListener): void;

  withTxn(func: () => void): void;

  reset(): void;

  get defaultState(): State;

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
   * Get choices that can be searched (excluding placeholders,
   * optionally excluding disabled based on config)
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

  /**
   * Get loading state from store
   */
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
