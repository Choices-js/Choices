import {
  AddChoiceAction,
  FilterChoicesAction,
  ActivateChoicesAction,
  ClearChoicesAction,
} from '../actions/choices';
import { AddItemAction, RemoveItemAction } from '../actions/items';
import { Choice } from '../interfaces/choice';

export const defaultState = [];

type ActionTypes =
  | AddChoiceAction
  | FilterChoicesAction
  | ActivateChoicesAction
  | ClearChoicesAction
  | AddItemAction
  | RemoveItemAction
  | Record<string, never>;

export default function choices(
  state: Choice[] = defaultState,
  action: ActionTypes = {},
): Choice[] {
  switch (action.type) {
    case 'ADD_CHOICE': {
      const addChoiceAction = action as AddChoiceAction;
      const choice = {
        id: addChoiceAction.id,
        elementId: addChoiceAction.elementId,
        groupId: addChoiceAction.groupId,
        value: addChoiceAction.value,
        label: addChoiceAction.label || addChoiceAction.value,
        disabled: addChoiceAction.disabled || false,
        selected: false,
        active: true,
        score: 9999,
        customProperties: addChoiceAction.customProperties,
        placeholder: addChoiceAction.placeholder || false,
      };

      /*
        A disabled choice appears in the choice dropdown but cannot be selected
        A selected choice has been added to the passed input's value (added as an item)
        An active choice appears within the choice dropdown
      */
      return [...state, choice as Choice];
    }

    case 'ADD_ITEM': {
      const addItemAction = action as AddItemAction;

      // When an item is added and it has an associated choice,
      // we want to disable it so it can't be chosen again
      if (addItemAction.choiceId > -1) {
        return state.map((obj) => {
          const choice = obj;
          if (choice.id === parseInt(`${addItemAction.choiceId}`, 10)) {
            choice.selected = true;
          }

          return choice;
        });
      }

      return state;
    }

    case 'REMOVE_ITEM': {
      const removeItemAction = action as RemoveItemAction;

      // When an item is removed and it has an associated choice,
      // we want to re-enable it so it can be chosen again
      if (removeItemAction.choiceId && removeItemAction.choiceId > -1) {
        return state.map((obj) => {
          const choice = obj;
          if (choice.id === parseInt(`${removeItemAction.choiceId}`, 10)) {
            choice.selected = false;
          }

          return choice;
        });
      }

      return state;
    }

    case 'FILTER_CHOICES': {
      const filterChoicesAction = action as FilterChoicesAction;

      return state.map((obj) => {
        const choice = obj;
        // Set active state based on whether choice is
        // within filtered results
        choice.active = filterChoicesAction.results.some(({ item, score }) => {
          if (item.id === choice.id) {
            choice.score = score;

            return true;
          }

          return false;
        });

        return choice;
      });
    }

    case 'ACTIVATE_CHOICES': {
      const activateChoicesAction = action as ActivateChoicesAction;

      return state.map((obj) => {
        const choice = obj;
        choice.active = activateChoicesAction.active;

        return choice;
      });
    }

    case 'CLEAR_CHOICES': {
      return defaultState;
    }

    default: {
      return state;
    }
  }
}
