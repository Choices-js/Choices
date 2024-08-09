import { expect } from 'chai';
import * as actions from '../../../src/scripts/actions/misc';
import { ActionType } from '../../../src';

describe('actions/misc', () => {
  describe('clearAll action', () => {
    it('returns CLEAR_ALL action', () => {
      const expectedAction: actions.ClearAllAction = {
        type: ActionType.CLEAR_ALL,
      };

      expect(actions.clearAll()).to.deep.equal(expectedAction);
    });
  });

  describe('setIsLoading action', () => {
    describe('setting loading state to true', () => {
      it('returns expected action', () => {
        const expectedAction: actions.SetIsLoadingAction = {
          type: ActionType.SET_IS_LOADING,
          isLoading: true,
        };

        expect(actions.setIsLoading(true)).to.deep.equal(expectedAction);
      });
    });

    describe('setting loading state to false', () => {
      it('returns expected action', () => {
        const expectedAction: actions.SetIsLoadingAction = {
          type: ActionType.SET_IS_LOADING,
          isLoading: false,
        };

        expect(actions.setIsLoading(false)).to.deep.equal(expectedAction);
      });
    });
  });
});
