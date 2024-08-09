import { expect } from 'chai';
import sinon from 'sinon';
import { AnyAction, Unsubscribe } from 'redux';
import Store from '../../../src/scripts/store/store';
import { State } from '../../../src';
import { cloneObject } from '../../../src/scripts/lib/utils';

describe('reducers/store', () => {
  let instance: Store;
  let subscribeStub: sinon.SinonStub<[listener: () => void], Unsubscribe>;
  let dispatchStub: sinon.SinonStub<[action: AnyAction], AnyAction>;
  let getStateStub: sinon.SinonStub<[], State>;

  beforeEach(() => {
    instance = new Store();
    subscribeStub = sinon.stub(instance._store, 'subscribe');
    dispatchStub = sinon.stub(instance._store, 'dispatch');
    getStateStub = sinon.stub(instance._store, 'getState');
  });

  afterEach(() => {
    subscribeStub.restore();
    dispatchStub.restore();
    getStateStub.restore();
  });

  describe('constructor', () => {
    it('creates redux store', () => {
      expect(instance._store).to.contain.keys([
        'subscribe',
        'dispatch',
        'getState',
      ]);
    });
  });

  describe('subscribe', () => {
    it('wraps redux subscribe method', () => {
      const onChange = (): void => {};
      expect(subscribeStub.callCount).to.equal(0);
      instance.subscribe(onChange);
      expect(subscribeStub.callCount).to.equal(1);
      expect(subscribeStub.firstCall.args[0]).to.equal(onChange);
    });
  });

  describe('dispatch', () => {
    it('wraps redux dispatch method', () => {
      const action = { type: 'TEST_ACTION' };
      expect(dispatchStub.callCount).to.equal(0);
      instance.dispatch(action);
      expect(dispatchStub.callCount).to.equal(1);
      expect(dispatchStub.firstCall.args[0]).to.equal(action);
    });
  });

  describe('state getter', () => {
    it('returns state', () => {
      const state: State = { items: [], choices: [], groups: [], loading: 0 };
      getStateStub.returns(cloneObject(state));

      expect(instance.state).to.deep.equal(state);
    });
  });

  describe('store selectors', () => {
    let state: State;

    beforeEach(() => {
      state = {
        loading: 0,
        items: [
          {
            id: 1,
            groupId: -1,
            value: 'Item one',
            label: 'Item one',
            active: false,
            highlighted: false,
            customProperties: undefined,
            placeholder: false,
            disabled: false,
            selected: false,
            score: 0,
          },
          {
            id: 2,
            groupId: -1,
            value: 'Item two',
            label: 'Item two',
            active: true,
            highlighted: false,
            customProperties: undefined,
            placeholder: false,
            disabled: false,
            selected: false,
            score: 0,
          },
          {
            id: 3,
            groupId: -1,
            value: 'Item three',
            label: 'Item three',
            active: true,
            highlighted: true,
            customProperties: undefined,
            placeholder: false,
            disabled: false,
            selected: false,
            score: 0,
          },
        ],
        choices: [
          {
            id: 1,
            elementId: 'choices-test-1',
            groupId: -1,
            value: 'Choice 1',
            label: 'Choice 1',
            disabled: false,
            selected: false,
            active: true,
            score: 9999,
            customProperties: undefined,
            placeholder: false,
            highlighted: false,
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
            customProperties: undefined,
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

      getStateStub.returns(state);
    });

    describe('items getter', () => {
      it('returns items', () => {
        const expectedResponse = state.items;
        expect(instance.items).to.deep.equal(expectedResponse);
      });
    });

    describe('highlightedActiveItems getter', () => {
      it('returns items that are active and highlighted', () => {
        const expectedResponse = state.items.filter(
          (item) => item.highlighted && item.active,
        );
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
        const expectedResponse = state.choices.filter(
          (choice) => choice.active,
        );
        expect(instance.activeChoices).to.deep.equal(expectedResponse);
      });
    });

    describe('searchableChoices getter', () => {
      it('returns choices that are not placeholders and are selectable', () => {
        const expectedResponse = state.choices.filter(
          (choice) => !choice.disabled && !choice.placeholder,
        );
        expect(instance.searchableChoices).to.deep.equal(expectedResponse);
      });
    });

    describe('getChoiceById', () => {
      describe('passing id', () => {
        it('returns active choice by passed id', () => {
          const id: number = 1;
          const expectedResponse = state.choices.find(
            (choice) => choice.id === id,
          );
          const actualResponse = instance.getChoiceById(id);
          expect(actualResponse).to.deep.equal(expectedResponse);
        });
      });
    });

    describe('placeholderChoice getter', () => {
      it('returns placeholder choice', () => {
        const expectedResponse = state.choices
          .reverse()
          .find((choice) => choice.placeholder);
        expect(instance.placeholderChoice).to.deep.equal(expectedResponse);
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
