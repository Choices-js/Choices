import { ActionType } from './interfaces/action-type';
import { EventType } from './interfaces/event-type';
import { KeyCodeMap } from './interfaces/keycode-map';

export const EVENTS: Record<EventType, EventType> = {
  showDropdown: 'showDropdown',
  hideDropdown: 'hideDropdown',
  change: 'change',
  choice: 'choice',
  search: 'search',
  addItem: 'addItem',
  removeItem: 'removeItem',
  highlightItem: 'highlightItem',
  highlightChoice: 'highlightChoice',
  unhighlightItem: 'unhighlightItem',
};

export const ACTION_TYPES: Record<ActionType, ActionType> = {
  ADD_CHOICE: 'ADD_CHOICE',
  FILTER_CHOICES: 'FILTER_CHOICES',
  ACTIVATE_CHOICES: 'ACTIVATE_CHOICES',
  CLEAR_CHOICES: 'CLEAR_CHOICES',
  ADD_GROUP: 'ADD_GROUP',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  HIGHLIGHT_ITEM: 'HIGHLIGHT_ITEM',
  CLEAR_ALL: 'CLEAR_ALL',
  RESET_TO: 'RESET_TO',
  SET_IS_LOADING: 'SET_IS_LOADING',
};

export const KEY_CODES: KeyCodeMap = {
  BACK_KEY: 46,
  DELETE_KEY: 8,
  ENTER_KEY: 13,
  A_KEY: 65,
  ESC_KEY: 27,
  UP_KEY: 38,
  DOWN_KEY: 40,
  PAGE_UP_KEY: 33,
  PAGE_DOWN_KEY: 34,
};

export const TEXT_TYPE: HTMLInputElement['type'] = 'text';
export const SELECT_ONE_TYPE: HTMLSelectElement['type'] = 'select-one';
export const SELECT_MULTIPLE_TYPE: HTMLSelectElement['type'] =
  'select-multiple';

export const SCROLLING_SPEED = 4;
