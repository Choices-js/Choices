import { expect } from 'chai';
import items from '../../../src/scripts/reducers/items';
import { RemoveItemAction } from '../../../src/scripts/actions/items';
import { cloneObject } from '../../../src/scripts/lib/utils';
import { ChoiceFull } from '../../../src/scripts/interfaces/choice-full';
import { ActionType } from '../../../src';
import { defaultState } from '../../../src/scripts/reducers';

describe('reducers/items', () => {
  it('should return same state when no action matches', () => {
    expect(items(defaultState.items, {} as any)).to.deep.equal(
      defaultState.items,
    );
  });

  describe('when items do not exist', () => {
    describe('ADD_ITEM', () => {
      const choice: ChoiceFull = {
        value: 'Item one',
        label: 'Item one',
        id: 1234,
        groupId: 1,
        score: 0,
        customProperties: {
          property: 'value',
        },
        placeholder: true,
        active: true,
        disabled: false,
        selected: true,
        highlighted: false,
      };

      describe('passing expected values', () => {
        let actualResponse: ChoiceFull[];

        beforeEach(() => {
          actualResponse = items(undefined, {
            type: ActionType.ADD_ITEM,
            item: cloneObject(choice),
          });
        });

        it('adds item', () => {
          const expectedResponse = [choice];

          expect(actualResponse).to.deep.equal(expectedResponse);
        });

        it('unhighlights all highlighted items', () => {
          actualResponse.forEach((item) => {
            expect(item.highlighted).to.equal(false);
          });
        });
      });

      describe('fallback values', () => {
        describe('passing no placeholder value', () => {
          const item = Object.assign(cloneObject(choice), {
            placeholder: false,
          });
          it('adds item with placeholder set to false', () => {
            const expectedResponse = [item];

            const actualResponse = items(undefined, {
              type: ActionType.ADD_ITEM,
              item: cloneObject(item),
            });

            expect(actualResponse).to.deep.equal(expectedResponse);
          });
        });
      });
    });
  });

  describe('when items exist', () => {
    let state: ChoiceFull[];

    beforeEach(() => {
      state = [
        {
          id: 1,
          groupId: -1,
          score: 0,
          value: 'Item one',
          label: 'Item one',
          active: false,
          highlighted: false,
          customProperties: {},
          placeholder: false,
          disabled: false,
          selected: false,
        },
        {
          id: 2,
          groupId: -1,
          score: 0,
          value: 'Item one',
          label: 'Item one',
          active: true,
          highlighted: false,
          customProperties: {},
          placeholder: false,
          disabled: false,
          selected: false,
        },
      ];
    });

    describe('REMOVE_ITEM', () => {
      it('sets an item to be inactive based on passed ID', () => {
        const expectedResponse = [
          {
            ...state[0],
          },
        ] as ChoiceFull[];

        const actualResponse = items(cloneObject(state), {
          type: ActionType.REMOVE_ITEM,
          item: cloneObject(state[1]),
        } as RemoveItemAction);

        expect(actualResponse).to.deep.equal(expectedResponse);
      });
    });

    describe('REMOVE_CHOICE', () => {
      it('the item is removed', () => {
        const choice = state[0];
        const expectedResponse = state.filter((s) => s.id !== choice.id);

        const actualResponse = items(cloneObject(state), {
          type: ActionType.REMOVE_CHOICE,
          choice: cloneObject(choice),
        });

        expect(actualResponse).to.deep.equal(expectedResponse);
      });
    });

    describe('HIGHLIGHT_ITEM', () => {
      it('sets an item to be inactive based on passed ID', () => {
        const expectedResponse = [
          {
            ...state[0],
          },
          {
            ...state[1],
            highlighted: true,
          },
        ] as ChoiceFull[];

        const actualResponse = items(cloneObject(state), {
          type: ActionType.HIGHLIGHT_ITEM,
          item: cloneObject(state[1]),
          highlighted: true,
        });

        expect(actualResponse).to.deep.equal(expectedResponse);
      });
    });
  });
});
