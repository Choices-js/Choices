import { expect } from 'chai';
import groups from '../../../src/scripts/reducers/groups';
import { cloneObject } from '../../../src/scripts/lib/utils';
import { GroupFull } from '../../../src/scripts/interfaces/group-full';
import { ActionType } from '../../../src';
import { defaultState } from '../../../src/scripts/reducers';

describe('reducers/groups', () => {
  it('should return same state when no action matches', () => {
    expect(groups(defaultState.groups, {} as any)).to.equal(
      defaultState.groups,
    );
  });

  describe('when groups do not exist', () => {
    describe('ADD_GROUP', () => {
      it('adds group', () => {
        const group: GroupFull = {
          active: true,
          disabled: false,
          id: 1,
          label: 'Group one',
          choices: [],
        };

        const expectedResponse = [group];

        const actualResponse = groups(undefined, {
          type: ActionType.ADD_GROUP,
          group: cloneObject(group),
        });

        expect(actualResponse).to.deep.equal(expectedResponse);
      });
    });
  });

  describe('when groups exist', () => {
    let state: GroupFull[];

    beforeEach(() => {
      state = [
        {
          id: 1,
          label: 'Group one',
          active: true,
          disabled: false,
          choices: [],
        },
        {
          id: 2,
          label: 'Group two',
          active: true,
          disabled: false,
          choices: [],
        },
      ];
    });

    describe('CLEAR_CHOICES', () => {
      it('restores to defaultState', () => {
        const expectedResponse = defaultState.groups;
        const actualResponse = groups(cloneObject(state), {
          type: ActionType.CLEAR_CHOICES,
        });

        expect(actualResponse).to.deep.equal(expectedResponse);
      });
    });
  });
});
