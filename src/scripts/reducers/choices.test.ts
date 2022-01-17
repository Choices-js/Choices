import { expect } from 'chai';
import { Choice } from '../interfaces/choice';
import choices, { defaultState } from './choices';

describe('reducers/choices', () => {
  it('should return same state when no action matches', () => {
    expect(choices(defaultState, {} as any)).to.equal(defaultState);
  });

  describe('when choices do not exist', () => {
    describe('ADD_CHOICE', () => {
      const value = 'test';
      const label = 'test';
      const id = 1;
      const groupId = 1;
      const disabled = false;
      const elementId = 1;
      const customProperties = { test: true };
      const placeholder = true;

      describe('passing expected values', () => {
        it('adds choice', () => {
          const expectedResponse = [
            {
              value,
              label,
              id,
              groupId,
              disabled,
              elementId,
              customProperties,
              placeholder,
              selected: false,
              active: true,
              score: 9999,
            },
          ];

          const actualResponse = choices(undefined, {
            type: 'ADD_CHOICE',
            value,
            label,
            id,
            groupId,
            disabled,
            elementId,
            customProperties,
            placeholder,
          });

          expect(actualResponse).to.eql(expectedResponse);
        });
      });

      describe('fallback values', () => {
        describe('passing no label', () => {
          it('adds choice using value as label', () => {
            const expectedResponse = [
              {
                value,
                label: value,
                id,
                groupId,
                disabled,
                elementId,
                customProperties,
                placeholder,
                selected: false,
                active: true,
                score: 9999,
              },
            ];

            const actualResponse = choices(undefined, {
              type: 'ADD_CHOICE',
              value,
              label: undefined,
              id,
              groupId,
              disabled,
              elementId,
              customProperties,
              placeholder,
            });

            expect(actualResponse).to.eql(expectedResponse);
          });
        });

        describe('passing no placeholder value', () => {
          it('adds choice with placeholder set to false', () => {
            const expectedResponse = [
              {
                value,
                label: value,
                id,
                groupId,
                disabled,
                elementId,
                customProperties,
                placeholder: false,
                selected: false,
                active: true,
                score: 9999,
              },
            ];

            const actualResponse = choices(undefined, {
              type: 'ADD_CHOICE',
              value,
              label: undefined,
              id,
              groupId,
              disabled,
              elementId,
              customProperties,
              placeholder: undefined,
            });

            expect(actualResponse).to.eql(expectedResponse);
          });
        });
      });
    });
  });

  describe('when choices exist', () => {
    let state;

    beforeEach(() => {
      state = [
        {
          id: 1,
          elementId: 'choices-test-1',
          groupId: -1,
          value: 'Choice 1',
          label: 'Choice 1',
          disabled: false,
          selected: false,
          active: false,
          score: 9999,
          customProperties: null,
          placeholder: false,
        },
        {
          id: 2,
          elementId: 'choices-test-2',
          groupId: -1,
          value: 'Choice 2',
          label: 'Choice 2',
          disabled: false,
          selected: true,
          active: false,
          score: 9999,
          customProperties: null,
          placeholder: false,
        },
      ];
    });

    describe('FILTER_CHOICES', () => {
      it('sets active flag based on whether choice is in passed results', () => {
        const id = 1;
        const score = 10;
        const active = true;

        const expectedResponse = {
          ...state[0],
          active,
          score,
        };

        const actualResponse = choices(state, {
          type: 'FILTER_CHOICES',
          results: [
            {
              item: { id } as Choice,
              score,
            },
          ],
        }).find((choice) => choice.id === id);

        expect(actualResponse).to.eql(expectedResponse);
      });
    });

    describe('ACTIVATE_CHOICES', () => {
      it('sets active flag to passed value', () => {
        const clonedState = state.slice(0);

        const expectedResponse = [
          {
            ...state[0],
            active: true,
          },
          {
            ...state[1],
            active: true,
          },
        ];

        const actualResponse = choices(clonedState, {
          type: 'ACTIVATE_CHOICES',
          active: true,
        });

        expect(actualResponse).to.eql(expectedResponse);
      });
    });

    describe('CLEAR_CHOICES', () => {
      it('restores to defaultState', () => {
        const clonedState = state.slice(0);
        const expectedResponse = defaultState;
        const actualResponse = choices(clonedState, {
          type: 'CLEAR_CHOICES',
        });

        expect(actualResponse).to.eql(expectedResponse);
      });
    });

    describe('ADD_ITEM', () => {
      describe('when action has a choice id', () => {
        it('disables choice corresponding with id', () => {
          const id = 2;
          const clonedState = state.slice(0);
          const expectedResponse = [
            {
              ...state[0],
            },
            {
              ...state[1],
              selected: true,
            },
          ];

          const actualResponse = choices(clonedState, {
            type: 'ADD_ITEM',
            choiceId: id,
          });

          expect(actualResponse).to.eql(expectedResponse);
        });
      });

      describe('when action has no choice id', () => {
        it('returns state', () => {
          const clonedState = state.slice(0);
          const actualResponse = choices(clonedState, {
            type: 'ADD_ITEM',
            choiceId: undefined,
          });

          expect(actualResponse).to.equal(clonedState);
        });
      });
    });

    describe('REMOVE_ITEM', () => {
      it('selects choice by passed id', () => {
        const id = 2;
        const clonedState = state.slice(0);
        const expectedResponse = [
          {
            ...state[0],
          },
          {
            ...state[1],
            selected: false,
          },
        ];

        const actualResponse = choices(clonedState, {
          type: 'REMOVE_ITEM',
          choiceId: id,
        });

        expect(actualResponse).to.eql(expectedResponse);
      });

      describe('passing no id', () => {
        it('returns state', () => {
          const clonedState = state.slice(0);
          const actualResponse = choices(clonedState, {
            type: 'REMOVE_ITEM',
            choiceId: undefined,
          });

          expect(actualResponse).to.equal(clonedState);
        });
      });
    });
  });
});
