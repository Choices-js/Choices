import { expect } from 'chai';
import sinon from 'sinon';
import { beforeEach } from 'vitest';
import Store from '../../../src/scripts/store/store';
// eslint-disable-next-line import/no-named-default
import { ActionType, State, default as Choices } from '../../../src';
import { cloneObject } from '../../../src/scripts/lib/utils';
import { AnyAction, StoreListener } from '../../../src/scripts/interfaces/store';
import { Options } from '../../../src/scripts/interfaces/options';

function shimStore() {
  return new Store(Choices.defaults.allOptions);
}

describe('reducers/store', () => {
  let instance: Store<Options>;
  let subscribeStub: sinon.SinonStub<[listener: StoreListener], Store<Options>>;
  let dispatchStub: sinon.SinonStub<[action: AnyAction], void>;
  let getStateStub: sinon.SinonStub<any[], State>;
  let emptyState: State;
  let state: State;

  beforeEach(() => {
    instance = shimStore();
    subscribeStub = sinon.stub(instance, 'subscribe');
    dispatchStub = sinon.stub(instance, 'dispatch');
    getStateStub = sinon.stub(instance, 'state');
    emptyState = instance.defaultState;
    state = {
      items: [
        {
          id: 1,
          group: null,
          value: 'Item one',
          label: 'Item one',
          active: false,
          highlighted: false,
          customProperties: {},
          placeholder: false,
          disabled: false,
          selected: false,
          score: 0,
          rank: 0,
        },
        {
          id: 2,
          group: null,
          value: 'Item two',
          label: 'Item two',
          active: true,
          highlighted: false,
          customProperties: {},
          placeholder: false,
          disabled: false,
          selected: false,
          score: 0,
          rank: 0,
        },
        {
          id: 3,
          group: null,
          value: 'Item three',
          label: 'Item three',
          active: true,
          highlighted: true,
          customProperties: {},
          placeholder: false,
          disabled: false,
          selected: false,
          score: 0,
          rank: 0,
        },
      ],
      choices: [
        {
          id: 1,
          elementId: 'choices-test-1',
          group: null,
          value: 'Choice 1',
          label: 'Choice 1',
          disabled: false,
          selected: false,
          active: true,
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
          rank: 9998,
          customProperties: {},
          placeholder: false,
          highlighted: false,
        },
      ],
      groups: [
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
      ],
    };
  });

  afterEach(() => {
    subscribeStub.restore();
    dispatchStub.restore();
    getStateStub.restore();
  });

  describe('constructor', () => {
    it('creates redux-like store', () => {
      expect(instance).to.contain.keys(['_state', '_listeners', '_txn']);
    });
  });

  describe('subscribe', () => {
    it('wraps redux-like subscribe method', () => {
      const onChange = (): void => {};
      expect(subscribeStub.callCount).to.equal(0);
      instance.subscribe(onChange);
      expect(subscribeStub.callCount).to.equal(1);
      expect(subscribeStub.firstCall.args[0]).to.equal(onChange);
    });
  });

  describe('dispatch', () => {
    it('wraps redux-like dispatch method', () => {
      const action: AnyAction = { type: ActionType.CLEAR_CHOICES };
      expect(dispatchStub.callCount).to.equal(0);
      instance.dispatch(action);
      expect(dispatchStub.callCount).to.equal(1);
      expect(dispatchStub.firstCall.args[0]).to.equal(action);
    });
  });

  describe('state getter', () => {
    it('returns state', () => {
      getStateStub.value(cloneObject(emptyState));

      expect(instance.state).to.deep.equal(emptyState);
    });
  });

  describe('txn', () => {
    let listenerStub: sinon.SinonStub;

    beforeEach(() => {
      subscribeStub.restore();
      dispatchStub.restore();
      getStateStub.restore();

      instance._state = cloneObject(state);
      listenerStub = sinon.stub();
      instance.subscribe(listenerStub);
    });

    it('coalesce listener events', () => {
      const emptyChoicesState = cloneObject(state);
      emptyChoicesState.choices = [];
      emptyChoicesState.groups = [];

      instance.withTxn(() => {
        const action: AnyAction = { type: ActionType.CLEAR_CHOICES };
        instance.dispatch(action);
        instance.dispatch(action);
      });

      expect(listenerStub.callCount).eq(1);
      expect(instance.state).to.deep.equal(emptyChoicesState);
    });

    it('coalesce listener events with reset', () => {
      instance.withTxn(() => {
        const action: AnyAction = { type: ActionType.CLEAR_CHOICES };
        instance.dispatch(action);
        instance.dispatch(action);
        instance.reset();
      });

      expect(listenerStub.callCount).eq(1);
      expect(instance.state).to.deep.equal(emptyState);
    });
  });

  describe('without txn', () => {
    let listenerStub: sinon.SinonStub;

    beforeEach(() => {
      subscribeStub.restore();
      dispatchStub.restore();
      getStateStub.restore();

      instance._state = cloneObject(state);
      listenerStub = sinon.stub();
      instance.subscribe(listenerStub);
    });

    it('multiple listener events', () => {
      const emptyChoicesState = cloneObject(state);
      emptyChoicesState.choices = [];
      emptyChoicesState.groups = [];

      const action: AnyAction = { type: ActionType.CLEAR_CHOICES };
      instance.dispatch(action);
      instance.dispatch(action);

      expect(listenerStub.callCount).eq(2);
      expect(instance.state).to.deep.equal(emptyChoicesState);
    });

    it('multiple listener events with reset', () => {
      const action: AnyAction = { type: ActionType.CLEAR_CHOICES };
      instance.dispatch(action);
      instance.dispatch(action);
      instance.reset();

      expect(listenerStub.callCount).eq(3);
      expect(instance.state).to.deep.equal(emptyState);
    });
  });

  describe('store selectors', () => {
    beforeEach(() => {
      getStateStub.value(cloneObject(state));
    });

    describe('items getter', () => {
      it('returns items', () => {
        const expectedResponse = state.items;
        expect(instance.items).to.deep.equal(expectedResponse);
      });
    });

    describe('highlightedActiveItems getter', () => {
      it('returns items that are active and highlighted', () => {
        const expectedResponse = state.items.filter((item) => item.highlighted && item.active);
        expect(instance.highlightedActiveItems).to.deep.equal(expectedResponse);
      });
    });

    describe('choices getter', () => {
      it('returns choices', () => {
        const expectedResponse = state.choices;
        expect(instance.choices).to.deep.equal(expectedResponse);
      });
    });

    describe('activeChoices getter', () => {
      it('returns choices that are active', () => {
        const expectedResponse = state.choices.filter((choice) => choice.active);
        expect(instance.activeChoices).to.deep.equal(expectedResponse);
      });
    });

    describe('searchableChoices getter', () => {
      it('returns choices that are not placeholders and are selectable', () => {
        const expectedResponse = state.choices.filter((choice) => !choice.disabled && !choice.placeholder);
        expect(instance.searchableChoices).to.deep.equal(expectedResponse);
      });

      it('includes disabled choices when searchDisabledChoices is true', () => {
        const configWithDisabled = { ...Choices.defaults.allOptions, searchDisabledChoices: true };
        const instanceWithConfig = new Store(configWithDisabled);
        instanceWithConfig._state = state;

        const expectedResponse = state.choices.filter((choice) => !choice.placeholder);
        expect(instanceWithConfig.searchableChoices).to.deep.equal(expectedResponse);
      });
    });

    describe('getChoiceById', () => {
      describe('passing id', () => {
        it('returns active choice by passed id', () => {
          const id: number = 1;
          const expectedResponse = state.choices.find((choice) => choice.id === id);
          const actualResponse = instance.getChoiceById(id);
          expect(actualResponse).to.deep.equal(expectedResponse);
        });
      });
    });

    describe('groups getter', () => {
      it('returns groups', () => {
        const expectedResponse = state.groups;
        expect(instance.groups).to.deep.equal(expectedResponse);
      });
    });

    describe('activeGroups getter', () => {
      it('returns active groups', () => {
        const expectedResponse = state.groups.filter((group) => group.active);
        expect(instance.activeGroups).to.deep.equal(expectedResponse);
      });
    });

    describe('getGroupById', () => {
      it('returns group by id', () => {
        const id = 1;
        const expectedResponse = state.groups.find((group) => group.id === id);
        const actualResponse = instance.getGroupById(id);
        expect(actualResponse).to.deep.equal(expectedResponse);
      });
    });
  });
});
