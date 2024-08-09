import {
  AddChoiceAction,
  RemoveChoiceAction,
  FilterChoicesAction,
  ActivateChoicesAction,
  ClearChoicesAction,
} from '../actions/choices';
import { AddItemAction, RemoveItemAction } from '../actions/items';
import { ChoiceFull } from '../interfaces/choice-full';
import { ActionType } from '../interfaces';

type ActionTypes =
  | AddChoiceAction
  | RemoveChoiceAction
  | FilterChoicesAction
  | ActivateChoicesAction
  | ClearChoicesAction
  | AddItemAction
  | RemoveItemAction
  | Record<string, never>;

export default function choices(
  state: ChoiceFull[] = [],
  action: ActionTypes = {},
): ChoiceFull[] {
  switch (action.type) {
    case ActionType.ADD_CHOICE: {
      const { choice } = action as AddChoiceAction;

      /*
        A disabled choice appears in the choice dropdown but cannot be selected
        A selected choice has been added to the passed input's value (added as an item)
        An active choice appears within the choice dropdown
      */
      return [...state, choice];
    }

    case ActionType.REMOVE_CHOICE: {
      const { choice } = action as RemoveChoiceAction;

      return state.filter((obj) => obj.id !== choice.id);
    }

    case ActionType.ADD_ITEM: {
      const { item } = action as AddItemAction;
      // trigger a rebuild of the choices list as the item can not be added multiple times
      if (item.id && item.selected) {
        return [...state];
      }

      return state;
    }

    case ActionType.REMOVE_ITEM: {
      const { item } = action as RemoveItemAction;
      // trigger a rebuild of the choices list as the item can be added
      if (item.id && !item.selected) {
        return [...state];
      }

      return state;
    }

    case ActionType.FILTER_CHOICES: {
      const { results } = action as FilterChoicesAction;

      return state.map((obj) => {
        const choice = obj;
        // Set active state based on whether choice is
        // within filtered results
        choice.active = results.some(({ item, score }) => {
          if (item.id === choice.id) {
            choice.score = score;

            return true;
          }

          return false;
        });

        return choice;
      });
    }

    case ActionType.ACTIVATE_CHOICES: {
      const { active } = action as ActivateChoicesAction;

      return state.map((obj) => {
        const choice = obj;
        choice.active = active;

        return choice;
      });
    }

    case ActionType.CLEAR_CHOICES: {
      return [];
    }

    default: {
      return state;
    }
  }
}
