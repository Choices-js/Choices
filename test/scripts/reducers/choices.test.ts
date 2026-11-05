import { expect } from 'vitest';
import choices from '../../../src/scripts/reducers/choices';
import { cloneObject } from '../../../src/scripts/lib/utils';
import { ChoiceFull } from '../../../src/scripts/interfaces/choice-full';
import { ActionType } from '../../../src';
import { StateUpdate } from '../../../src/scripts/interfaces/store';

describe('reducers/choices', () => {
  describe('when choices do not exist', () => {
    describe('ADD_CHOICE', () => {
      const choice: ChoiceFull = {
        highlighted: false,
        value: 'test',
        label: 'test',
        id: 1,
        elementId: '1',
        group: null,
        active: false,
        disabled: false,
        placeholder: true,
        selected: false,
        customProperties: {
          test: true,
        },
        score: 0,
        rank: 0,
      };

      describe('passing expected values', () => {
        it('adds choice', () => {
          const expectedResponse: StateUpdate<ChoiceFull[]> = {
            update: true,
            state: [choice],
          };

          const actualResponse = choices([], {
            type: ActionType.ADD_CHOICE,
            choice: cloneObject(choice),
          });

          expect(actualResponse).to.deep.equal(expectedResponse);
        });
      });

      describe('fallback values', () => {
        describe('passing no placeholder value', () => {
          it('adds choice with placeholder set to false', () => {
            const item = Object.assign(cloneObject(choice), {
              placeholder: false,
            });
            const expectedResponse: StateUpdate<ChoiceFull[]> = {
              update: true,
              state: [item],
            };

            const actualResponse = choices([], {
              type: ActionType.ADD_CHOICE,
              choice: cloneObject(item),
            });

            expect(actualResponse).to.deep.equal(expectedResponse);
          });
        });
      });
    });
  });

  describe('when choices exist', () => {
    let state: ChoiceFull[];

    beforeEach(() => {
      state = [
        {
          id: 1,
          elementId: 'choices-test-1',
          group: null,
          value: 'Choice 1',
          label: 'Choice 1',
          disabled: false,
          selected: false,
          active: false,
          score: 9999,
          rank: 9999,
          customProperties: {},
          placeholder: false,
          highlighted: false,
        },
        {
          id: 2,
          elementId: 'choices-test-2',
          group: null,
          value: 'Choice 2',
          label: 'Choice 2',
          disabled: false,
          selected: true,
          active: false,
          score: 9999,
          rank: 9999,
          customProperties: {},
          placeholder: false,
          highlighted: false,
        },
      ];
    });

    describe('FILTER_CHOICES', () => {
      it('sets active flag based on whether choice is in passed results', () => {
        const id = 1;
        const score = 10;
        const rank = 10;
        const active = true;

        const expectedResponse = {
          ...state[0],
          active,
          score,
          rank,
        } as ChoiceFull;

        const actualResponse = choices(cloneObject(state), {
          type: ActionType.FILTER_CHOICES,
          results: [
            {
              item: { id } as ChoiceFull,
              score,
              rank,
            },
          ],
        }).state.find((choice) => choice.id === id);

        expect(actualResponse).to.deep.equal(expectedResponse);
      });
    });

    describe('ACTIVATE_CHOICES', () => {
      it('sets active flag to passed value', () => {
        const expectedResponse: StateUpdate<ChoiceFull[]> = {
          update: true,
          state: [
            {
              ...state[0],
              active: true,
            },
            {
              ...state[1],
              active: true,
            },
          ],
        };

        const actualResponse = choices(cloneObject(state), {
          type: ActionType.ACTIVATE_CHOICES,
          active: true,
        });

        expect(actualResponse).to.deep.equal(expectedResponse);
      });
    });

    describe('ADD_ITEM', () => {
      describe('when action has a choice id', () => {
        it('disables choice corresponding with id', () => {
          const expectedResponse: StateUpdate<ChoiceFull[]> = {
            update: true,
            state: [
              {
                ...state[0],
              },
              {
                ...state[1],
                selected: true,
              },
            ],
          };

          const actualResponse = choices(cloneObject(state), {
            type: ActionType.ADD_ITEM,
            item: cloneObject(state[1]),
          });

          expect(actualResponse).to.deep.equal(expectedResponse);
        });
      });
    });
  });
});
