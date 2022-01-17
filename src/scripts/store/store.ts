/* eslint-disable @typescript-eslint/no-explicit-any */
import { createStore, Store as IStore, AnyAction } from 'redux';
import { Choice } from '../interfaces/choice';
import { Group } from '../interfaces/group';
import { Item } from '../interfaces/item';
import { State } from '../interfaces/state';
import rootReducer from '../reducers/index';

export default class Store {
  _store: IStore;

  constructor() {
    this._store = createStore(
      rootReducer,
      (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
        (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
    );
  }

  /**
   * Subscribe store to function call (wrapped Redux method)
   */
  subscribe(onChange: () => void): void {
    this._store.subscribe(onChange);
  }

  /**
   * Dispatch event to store (wrapped Redux method)
   */
  dispatch(action: AnyAction): void {
    this._store.dispatch(action);
  }

  /**
   * Get store object (wrapping Redux method)
   */
  get state(): State {
    return this._store.getState();
  }

  /**
   * Get items from store
   */
  get items(): Item[] {
    return this.state.items;
  }

  /**
   * Get active items from store
   */
  get activeItems(): Item[] {
    return this.items.filter((item) => item.active === true);
  }

  /**
   * Get highlighted items from store
   */
  get highlightedActiveItems(): Item[] {
    return this.items.filter((item) => item.active && item.highlighted);
  }

  /**
   * Get choices from store
   */
  get choices(): Choice[] {
    return this.state.choices;
  }

  /**
   * Get active choices from store
   */
  get activeChoices(): Choice[] {
    return this.choices.filter((choice) => choice.active === true);
  }

  /**
   * Get selectable choices from store
   */
  get selectableChoices(): Choice[] {
    return this.choices.filter((choice) => choice.disabled !== true);
  }

  /**
   * Get choices that can be searched (excluding placeholders)
   */
  get searchableChoices(): Choice[] {
    return this.selectableChoices.filter(
      (choice) => choice.placeholder !== true,
    );
  }

  /**
   * Get placeholder choice from store
   */
  get placeholderChoice(): Choice | undefined {
    return [...this.choices]
      .reverse()
      .find((choice) => choice.placeholder === true);
  }

  /**
   * Get groups from store
   */
  get groups(): Group[] {
    return this.state.groups;
  }

  /**
   * Get active groups from store
   */
  get activeGroups(): Group[] {
    const { groups, choices } = this;

    return groups.filter((group) => {
      const isActive = group.active === true && group.disabled === false;
      const hasActiveOptions = choices.some(
        (choice) => choice.active === true && choice.disabled === false,
      );

      return isActive && hasActiveOptions;
    }, []);
  }

  /**
   * Get loading state from store
   */
  isLoading(): boolean {
    return this.state.loading;
  }

  /**
   * Get single choice by it's ID
   */
  getChoiceById(id: string): Choice | undefined {
    return this.activeChoices.find((choice) => choice.id === parseInt(id, 10));
  }

  /**
   * Get group by group id
   */
  getGroupById(id: number): Group | undefined {
    return this.groups.find((group) => group.id === id);
  }
}
