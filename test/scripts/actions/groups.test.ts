import { expect } from 'chai';
import * as actions from '../../../src/scripts/actions/groups';
import { GroupFull } from '../../../src/scripts/interfaces/group-full';
import { cloneObject } from '../../../src/scripts/lib/utils';
import { ActionType } from '../../../src';

describe('actions/groups', () => {
  describe('addGroup action', () => {
    it('returns ADD_GROUP action', () => {
      const group: GroupFull = {
        label: 'test',
        id: 1,
        active: false,
        disabled: false,
        choices: [],
      };

      const expectedAction: actions.AddGroupAction = {
        type: ActionType.ADD_GROUP,
        group: cloneObject(group),
      };

      expect(actions.addGroup(group)).to.deep.equal(expectedAction);
    });
  });
});
