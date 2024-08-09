import { expect } from 'chai';
import * as actions from '../../../src/scripts/actions/items';
import { cloneObject } from '../../../src/scripts/lib/utils';
import { ChoiceFull } from '../../../src/scripts/interfaces/choice-full';
import { ActionType } from '../../../src';

describe('actions/items', () => {
  const item: ChoiceFull = {
    highlighted: false,
    active: false,
    disabled: false,
    selected: false,
    value: 'test',
    label: 'test',
    id: 1,
    groupId: 1,
    score: 0,
    customProperties: { test: true },
    placeholder: true,
  };

  describe('addItem action', () => {
    it('returns ADD_ITEM action', () => {
      const expectedAction: actions.AddItemAction = {
        type: ActionType.ADD_ITEM,
        item,
      };

      expect(actions.addItem(cloneObject(item))).to.deep.equal(expectedAction);
    });
  });

  describe('removeItem action', () => {
    it('returns REMOVE_ITEM action', () => {
      const expectedAction: actions.RemoveItemAction = {
        type: ActionType.REMOVE_ITEM,
        item,
      };

      expect(actions.removeItem(cloneObject(item))).to.deep.equal(
        expectedAction,
      );
    });
  });

  describe('highlightItem action', () => {
    it('returns HIGHLIGHT_ITEM action', () => {
      const highlighted = true;
      const expectedAction: actions.HighlightItemAction = {
        type: ActionType.HIGHLIGHT_ITEM,
        item,
        highlighted,
      };

      expect(
        actions.highlightItem(cloneObject(item), highlighted),
      ).to.deep.equal(expectedAction);
    });
  });
});
