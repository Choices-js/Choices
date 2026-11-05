import { expect } from 'vitest';
import groups from '../../../src/scripts/reducers/groups';
import { cloneObject } from '../../../src/scripts/lib/utils';
import { GroupFull } from '../../../src/scripts/interfaces/group-full';
import { ActionType } from '../../../src';
import { StateUpdate } from '../../../src/scripts/interfaces/store';

describe('reducers/groups', () => {
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

        const expectedResponse: StateUpdate<GroupFull[]> = {
          update: true,
          state: [group],
        };

        const actualResponse = groups([], {
          type: ActionType.ADD_GROUP,
          group: cloneObject(group),
        });

        expect(actualResponse).to.deep.equal(expectedResponse);
      });
    });
  });
});
