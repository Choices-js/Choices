import { createStore } from 'redux';
import { expect } from 'chai';
import rootReducer from '../../../src/scripts/reducers';
import groups from '../../../src/scripts/reducers/groups';
import choices from '../../../src/scripts/reducers/choices';
import items from '../../../src/scripts/reducers/items';
import loading from '../../../src/scripts/reducers/loading';
import { ActionType } from '../../../src';

describe('reducers/rootReducer', () => {
  const store = createStore(rootReducer);

  it('returns expected reducers', () => {
    const state = store.getState();

    expect(state.groups).to.deep.equal(groups(undefined, {} as any));
    expect(state.choices).to.deep.equal(choices(undefined, {} as any));
    expect(state.items).to.deep.equal(items(undefined, {} as any));
    expect(state.loading).to.deep.equal(loading(undefined, {} as any));
  });

  describe('CLEAR_ALL', () => {
    it('resets state', () => {
      const output = rootReducer(
        {
          items: [1, 2, 3],
          groups: [1, 2, 3],
          choices: [1, 2, 3],
        },
        {
          type: ActionType.CLEAR_ALL,
        },
      );

      expect(output).to.deep.equal({
        items: [],
        groups: [],
        choices: [],
        loading: 0,
      });
    });
  });
});
