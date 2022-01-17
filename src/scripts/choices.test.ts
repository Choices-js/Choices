import chai, { expect } from 'chai';
import { spy, stub } from 'sinon';
import sinonChai from 'sinon-chai';

import Choices from './choices';

import { EVENTS, ACTION_TYPES, KEY_CODES } from './constants';
import { WrappedSelect, WrappedInput } from './components/index';
import { removeItem } from './actions/items';
import templates from './templates';
import { Choice } from './interfaces/choice';
import { Group } from './interfaces/group';
import { Item } from './interfaces/item';
import { DEFAULT_CONFIG } from './defaults';

chai.use(sinonChai);

describe('choices', () => {
  let instance;
  let output;
  let passedElement;

  beforeEach(() => {
    passedElement = document.createElement('input');
    passedElement.type = 'text';
    passedElement.className = 'js-choices';
    document.body.appendChild(passedElement);

    instance = new Choices(passedElement, { allowHTML: true });
  });

  afterEach(() => {
    output = null;
    instance = null;
  });

  describe('constructor', () => {
    describe('config', () => {
      describe('not passing config options', () => {
        it('uses the default config', () => {
          document.body.innerHTML = `
          <input data-choice type="text" id="input-1" />
          `;

          instance = new Choices();

          expect(instance.config).to.eql(DEFAULT_CONFIG);
        });
      });

      describe('passing config options', () => {
        it('merges the passed config with the default config', () => {
          document.body.innerHTML = `
          <input data-choice type="text" id="input-1" />
          `;

          const config = {
            allowHTML: true,
            renderChoiceLimit: 5,
          };
          instance = new Choices('[data-choice]', config);

          expect(instance.config).to.eql({
            ...DEFAULT_CONFIG,
            ...config,
          });
        });

        describe('passing the searchEnabled config option with a value of false', () => {
          describe('passing a select-multiple element', () => {
            it('sets searchEnabled to true', () => {
              document.body.innerHTML = `
              <select data-choice multiple></select>
              `;

              instance = new Choices('[data-choice]', {
                allowHTML: true,
                searchEnabled: false,
              });

              expect(instance.config.searchEnabled).to.equal(true);
            });
          });
        });

        describe('passing the renderSelectedChoices config option with an unexpected value', () => {
          it('sets renderSelectedChoices to "auto"', () => {
            document.body.innerHTML = `
            <select data-choice multiple></select>
            `;

            instance = new Choices('[data-choice]', {
              allowHTML: true,
              renderSelectedChoices: 'test' as any,
            });

            expect(instance.config.renderSelectedChoices).to.equal('auto');
          });
        });
      });
    });

    describe('not passing an element', () => {
      it('returns a Choices instance for the first element with a "data-choice" attribute', () => {
        document.body.innerHTML = `
        <input data-choice type="text" id="input-1" />
        <input data-choice type="text" id="input-2" />
        <input data-choice type="text" id="input-3" />
        `;

        const inputs = document.querySelectorAll('[data-choice]');
        expect(inputs.length).to.equal(3);

        instance = new Choices(undefined, { allowHTML: true });

        expect(instance.passedElement.element.id).to.equal(inputs[0].id);
      });

      describe('when an element cannot be found in the DOM', () => {
        it('throws an error', () => {
          document.body.innerHTML = ``;
          expect(() => new Choices(undefined, { allowHTML: true })).to.throw(
            TypeError,
            'Expected one of the following types text|select-one|select-multiple',
          );
        });
      });
    });

    describe('passing an element', () => {
      describe('passing an element that has not been initialised with Choices', () => {
        beforeEach(() => {
          document.body.innerHTML = `
          <input type="text" id="input-1" />
          `;
        });

        it('sets the initialised flag to true', () => {
          instance = new Choices('#input-1', { allowHTML: true });
          expect(instance.initialised).to.equal(true);
        });

        it('intialises', () => {
          const initSpy = spy();
          // initialise with the same element
          instance = new Choices('#input-1', {
            allowHTML: true,
            silent: true,
            callbackOnInit: initSpy,
          });

          expect(initSpy.called).to.equal(true);
        });
      });

      describe('passing an element that has already be initialised with Choices', () => {
        beforeEach(() => {
          document.body.innerHTML = `
          <input type="text" id="input-1" />
          `;

          // initialise once
          new Choices('#input-1', { allowHTML: true, silent: true });
        });

        it('sets the initialised flag to true', () => {
          // initialise with the same element
          instance = new Choices('#input-1', { allowHTML: true, silent: true });

          expect(instance.initialised).to.equal(true);
        });

        it('does not reinitialise', () => {
          const initSpy = spy();
          // initialise with the same element
          instance = new Choices('#input-1', {
            allowHTML: true,
            silent: true,
            callbackOnInit: initSpy,
          });

          expect(initSpy.called).to.equal(false);
        });
      });

      describe(`passing an element as a DOMString`, () => {
        describe('passing a input element type', () => {
          it('sets the "passedElement" instance property as an instance of WrappedInput', () => {
            document.body.innerHTML = `
            <input data-choice type="text" id="input-1" />
            `;

            instance = new Choices('[data-choice]', { allowHTML: true });

            expect(instance.passedElement).to.be.an.instanceOf(WrappedInput);
          });
        });

        describe('passing a select element type', () => {
          it('sets the "passedElement" instance property as an instance of WrappedSelect', () => {
            document.body.innerHTML = `
            <select data-choice id="select-1"></select>
            `;

            instance = new Choices('[data-choice]', { allowHTML: true });

            expect(instance.passedElement).to.be.an.instanceOf(WrappedSelect);
          });
        });
      });

      describe(`passing an element as a HTMLElement`, () => {
        describe('passing a input element type', () => {
          it('sets the "passedElement" instance property as an instance of WrappedInput', () => {
            document.body.innerHTML = `
            <input data-choice type="text" id="input-1" />
            `;

            instance = new Choices('[data-choice]', { allowHTML: true });

            expect(instance.passedElement).to.be.an.instanceOf(WrappedInput);
          });
        });

        describe('passing a select element type', () => {
          it('sets the "passedElement" instance property as an instance of WrappedSelect', () => {
            document.body.innerHTML = `
            <select data-choice id="select-1"></select>
            `;

            instance = new Choices('[data-choice]', { allowHTML: true });

            expect(instance.passedElement).to.be.an.instanceOf(WrappedSelect);
          });
        });
      });

      describe('passing an invalid element type', () => {
        it('throws an TypeError', () => {
          document.body.innerHTML = `
          <div data-choice id="div-1"></div>
          `;
          expect(
            () => new Choices('[data-choice]', { allowHTML: true }),
          ).to.throw(
            TypeError,
            'Expected one of the following types text|select-one|select-multiple',
          );
        });
      });
    });
  });

  describe('public methods', () => {
    describe('init', () => {
      const callbackOnInitSpy = spy();

      beforeEach(() => {
        instance = new Choices(passedElement, {
          allowHTML: true,
          callbackOnInit: callbackOnInitSpy,
          silent: true,
        });
      });

      describe('when already initialised', () => {
        beforeEach(() => {
          instance.initialised = true;
          instance.init();
        });

        it("doesn't set initialise flag", () => {
          expect(instance.initialised).to.not.equal(false);
        });
      });

      describe('not already initialised', () => {
        let createTemplatesSpy;
        let createInputSpy;
        let storeSubscribeSpy;
        let renderSpy;
        let addEventListenersSpy;

        beforeEach(() => {
          createTemplatesSpy = spy(instance, '_createTemplates');
          createInputSpy = spy(instance, '_createStructure');
          storeSubscribeSpy = spy(instance._store, 'subscribe');
          renderSpy = spy(instance, '_render');
          addEventListenersSpy = spy(instance, '_addEventListeners');

          instance.initialised = false;
          instance.init();
        });

        afterEach(() => {
          createTemplatesSpy.restore();
          createInputSpy.restore();
          storeSubscribeSpy.restore();
          renderSpy.restore();
          addEventListenersSpy.restore();
        });

        it('sets initialise flag', () => {
          expect(instance.initialised).to.equal(true);
        });

        it('creates templates', () => {
          expect(createTemplatesSpy.called).to.equal(true);
        });

        it('creates input', () => {
          expect(createInputSpy.called).to.equal(true);
        });

        it('subscribes to store with render method', () => {
          expect(storeSubscribeSpy.called).to.equal(true);
          expect(storeSubscribeSpy.lastCall.args[0]).to.equal(instance._render);
        });

        it('fires initial render', () => {
          expect(renderSpy.called).to.equal(true);
        });

        it('adds event listeners', () => {
          expect(addEventListenersSpy.called).to.equal(true);
        });

        it('fires callback', () => {
          expect(callbackOnInitSpy.called).to.equal(true);
        });
      });
    });

    describe('destroy', () => {
      beforeEach(() => {
        passedElement = document.createElement('input');
        passedElement.type = 'text';
        passedElement.className = 'js-choices';
        document.body.appendChild(passedElement);

        instance = new Choices(passedElement, { allowHTML: true });
      });

      describe('not already initialised', () => {
        beforeEach(() => {
          instance.initialised = false;
          instance.destroy();
        });

        it("doesn't set initialise flag", () => {
          expect(instance.initialised).to.not.equal(true);
        });
      });

      describe('when already initialised', () => {
        let removeEventListenersSpy;
        let passedElementRevealSpy;
        let containerOuterUnwrapSpy;
        let clearStoreSpy;

        beforeEach(() => {
          removeEventListenersSpy = spy(instance, '_removeEventListeners');
          passedElementRevealSpy = spy(instance.passedElement, 'reveal');
          containerOuterUnwrapSpy = spy(instance.containerOuter, 'unwrap');
          clearStoreSpy = spy(instance, 'clearStore');

          instance.initialised = true;
          instance.destroy();
        });

        afterEach(() => {
          removeEventListenersSpy.restore();
          passedElementRevealSpy.restore();
          containerOuterUnwrapSpy.restore();
          clearStoreSpy.restore();
        });

        it('removes event listeners', () => {
          expect(removeEventListenersSpy.called).to.equal(true);
        });

        it('reveals passed element', () => {
          expect(passedElementRevealSpy.called).to.equal(true);
        });

        it('reverts outer container', () => {
          expect(containerOuterUnwrapSpy.called).to.equal(true);
          expect(containerOuterUnwrapSpy.lastCall.args[0]).to.equal(
            instance.passedElement.element,
          );
        });

        it('clears store', () => {
          expect(clearStoreSpy.called).to.equal(true);
        });

        it('restes templates config', () => {
          expect(instance._templates).to.deep.equal(templates);
        });

        it('resets initialise flag', () => {
          expect(instance.initialised).to.equal(false);
        });
      });
    });

    describe('enable', () => {
      let passedElementEnableSpy;
      let addEventListenersSpy;
      let containerOuterEnableSpy;
      let inputEnableSpy;

      beforeEach(() => {
        addEventListenersSpy = spy(instance, '_addEventListeners');
        passedElementEnableSpy = spy(instance.passedElement, 'enable');
        containerOuterEnableSpy = spy(instance.containerOuter, 'enable');
        inputEnableSpy = spy(instance.input, 'enable');
      });

      afterEach(() => {
        addEventListenersSpy.restore();
        passedElementEnableSpy.restore();
        containerOuterEnableSpy.restore();
        inputEnableSpy.restore();
      });

      describe('when already enabled', () => {
        beforeEach(() => {
          instance.passedElement.isDisabled = false;
          instance.containerOuter.isDisabled = false;
          output = instance.enable();
        });

        it('returns this', () => {
          expect(output).to.eql(instance);
        });

        it('returns early', () => {
          expect(passedElementEnableSpy.called).to.equal(false);
          expect(addEventListenersSpy.called).to.equal(false);
          expect(inputEnableSpy.called).to.equal(false);
          expect(containerOuterEnableSpy.called).to.equal(false);
        });
      });

      describe('when not already enabled', () => {
        beforeEach(() => {
          instance.passedElement.isDisabled = true;
          instance.containerOuter.isDisabled = true;
          instance.enable();
        });

        it('adds event listeners', () => {
          expect(addEventListenersSpy.called).to.equal(true);
        });

        it('enables input', () => {
          expect(inputEnableSpy.called).to.equal(true);
        });

        it('enables containerOuter', () => {
          expect(containerOuterEnableSpy.called).to.equal(true);
        });
      });
    });

    describe('disable', () => {
      let removeEventListenersSpy;
      let passedElementDisableSpy;
      let containerOuterDisableSpy;
      let inputDisableSpy;

      beforeEach(() => {
        removeEventListenersSpy = spy(instance, '_removeEventListeners');
        passedElementDisableSpy = spy(instance.passedElement, 'disable');
        containerOuterDisableSpy = spy(instance.containerOuter, 'disable');
        inputDisableSpy = spy(instance.input, 'disable');
      });

      afterEach(() => {
        removeEventListenersSpy.restore();
        passedElementDisableSpy.restore();
        containerOuterDisableSpy.restore();
        inputDisableSpy.restore();
      });

      describe('when already disabled', () => {
        beforeEach(() => {
          instance.passedElement.isDisabled = true;
          instance.containerOuter.isDisabled = true;
          output = instance.disable();
        });

        it('returns this', () => {
          expect(output).to.eql(instance);
        });

        it('returns early', () => {
          expect(removeEventListenersSpy.called).to.equal(false);
          expect(passedElementDisableSpy.called).to.equal(false);
          expect(containerOuterDisableSpy.called).to.equal(false);
          expect(inputDisableSpy.called).to.equal(false);
        });
      });

      describe('when not already disabled', () => {
        beforeEach(() => {
          instance.passedElement.isDisabled = false;
          instance.containerOuter.isDisabled = false;
          output = instance.disable();
        });

        it('removes event listeners', () => {
          expect(removeEventListenersSpy.called).to.equal(true);
        });

        it('disables input', () => {
          expect(inputDisableSpy.called).to.equal(true);
        });

        it('enables containerOuter', () => {
          expect(containerOuterDisableSpy.called).to.equal(true);
        });
      });
    });

    describe('showDropdown', () => {
      let containerOuterOpenSpy;
      let dropdownShowSpy;
      let inputFocusSpy;
      let passedElementTriggerEventStub;

      beforeEach(() => {
        containerOuterOpenSpy = spy(instance.containerOuter, 'open');
        dropdownShowSpy = spy(instance.dropdown, 'show');
        inputFocusSpy = spy(instance.input, 'focus');
        passedElementTriggerEventStub = stub();

        instance.passedElement.triggerEvent = passedElementTriggerEventStub;
      });

      afterEach(() => {
        containerOuterOpenSpy.restore();
        dropdownShowSpy.restore();
        inputFocusSpy.restore();
        instance.passedElement.triggerEvent.reset();
      });

      describe('dropdown active', () => {
        beforeEach(() => {
          instance.dropdown.isActive = true;
          output = instance.showDropdown();
        });

        it('returns this', () => {
          expect(output).to.eql(instance);
        });

        it('returns early', () => {
          expect(containerOuterOpenSpy.called).to.equal(false);
          expect(dropdownShowSpy.called).to.equal(false);
          expect(inputFocusSpy.called).to.equal(false);
          expect(passedElementTriggerEventStub.called).to.equal(false);
        });
      });

      describe('dropdown inactive', () => {
        beforeEach(() => {
          instance.dropdown.isActive = false;
          output = instance.showDropdown();
        });

        it('returns this', () => {
          expect(output).to.eql(instance);
        });

        it('opens containerOuter', (done) => {
          requestAnimationFrame(() => {
            expect(containerOuterOpenSpy.called).to.equal(true);
            done();
          });
        });

        it('shows dropdown with blurInput flag', (done) => {
          requestAnimationFrame(() => {
            expect(dropdownShowSpy.called).to.equal(true);
            done();
          });
        });

        it('triggers event on passedElement', (done) => {
          requestAnimationFrame(() => {
            expect(passedElementTriggerEventStub.called).to.equal(true);
            expect(passedElementTriggerEventStub.lastCall.args[0]).to.eql(
              EVENTS.showDropdown,
            );
            expect(passedElementTriggerEventStub.lastCall.args[1]).to.eql({});
            done();
          });
        });

        describe('passing true focusInput flag with canSearch set to true', () => {
          beforeEach(() => {
            instance.dropdown.isActive = false;
            instance._canSearch = true;
            output = instance.showDropdown(true);
          });

          it('focuses input', (done) => {
            requestAnimationFrame(() => {
              expect(inputFocusSpy.called).to.equal(true);
              done();
            });
          });
        });
      });
    });

    describe('hideDropdown', () => {
      let containerOuterCloseSpy;
      let dropdownHideSpy;
      let inputBlurSpy;
      let inputRemoveActiveDescendantSpy;
      let passedElementTriggerEventStub;

      beforeEach(() => {
        containerOuterCloseSpy = spy(instance.containerOuter, 'close');
        dropdownHideSpy = spy(instance.dropdown, 'hide');
        inputBlurSpy = spy(instance.input, 'blur');
        inputRemoveActiveDescendantSpy = spy(
          instance.input,
          'removeActiveDescendant',
        );
        passedElementTriggerEventStub = stub();

        instance.passedElement.triggerEvent = passedElementTriggerEventStub;
      });

      afterEach(() => {
        containerOuterCloseSpy.restore();
        dropdownHideSpy.restore();
        inputBlurSpy.restore();
        inputRemoveActiveDescendantSpy.restore();
        instance.passedElement.triggerEvent.reset();
      });

      describe('dropdown inactive', () => {
        beforeEach(() => {
          instance.dropdown.isActive = false;
          output = instance.hideDropdown();
        });

        it('returns this', () => {
          expect(output).to.eql(instance);
        });

        it('returns early', () => {
          expect(containerOuterCloseSpy.called).to.equal(false);
          expect(dropdownHideSpy.called).to.equal(false);
          expect(inputBlurSpy.called).to.equal(false);
          expect(passedElementTriggerEventStub.called).to.equal(false);
        });
      });

      describe('dropdown active', () => {
        beforeEach(() => {
          instance.dropdown.isActive = true;
          output = instance.hideDropdown();
        });

        it('returns this', () => {
          expect(output).to.eql(instance);
        });

        it('closes containerOuter', (done) => {
          requestAnimationFrame(() => {
            expect(containerOuterCloseSpy.called).to.equal(true);
            done();
          });
        });

        it('hides dropdown with blurInput flag', (done) => {
          requestAnimationFrame(() => {
            expect(dropdownHideSpy.called).to.equal(true);
            done();
          });
        });

        it('triggers event on passedElement', (done) => {
          requestAnimationFrame(() => {
            expect(passedElementTriggerEventStub.called).to.equal(true);
            expect(passedElementTriggerEventStub.lastCall.args[0]).to.eql(
              EVENTS.hideDropdown,
            );
            expect(passedElementTriggerEventStub.lastCall.args[1]).to.eql({});
            done();
          });
        });

        describe('passing true blurInput flag with canSearch set to true', () => {
          beforeEach(() => {
            instance.dropdown.isActive = true;
            instance._canSearch = true;
            output = instance.hideDropdown(true);
          });

          it('removes active descendants', (done) => {
            requestAnimationFrame(() => {
              expect(inputRemoveActiveDescendantSpy.called).to.equal(true);
              done();
            });
          });

          it('blurs input', (done) => {
            requestAnimationFrame(() => {
              expect(inputBlurSpy.called).to.equal(true);
              done();
            });
          });
        });
      });
    });

    describe('highlightItem', () => {
      let passedElementTriggerEventStub;
      let storeDispatchSpy;
      let storeGetGroupByIdStub;
      const groupIdValue = 'Test';

      beforeEach(() => {
        passedElementTriggerEventStub = stub();
        storeGetGroupByIdStub = stub().returns({
          value: groupIdValue,
        });
        storeDispatchSpy = spy(instance._store, 'dispatch');

        instance._store.getGroupById = storeGetGroupByIdStub;
        instance.passedElement.triggerEvent = passedElementTriggerEventStub;
      });

      afterEach(() => {
        storeDispatchSpy.restore();
        instance._store.getGroupById.reset();
        instance.passedElement.triggerEvent.reset();
      });

      describe('no item passed', () => {
        beforeEach(() => {
          output = instance.highlightItem();
        });

        it('returns this', () => {
          expect(output).to.eql(instance);
        });

        it('returns early', () => {
          expect(passedElementTriggerEventStub.called).to.equal(false);
          expect(storeDispatchSpy.called).to.equal(false);
          expect(storeGetGroupByIdStub.called).to.equal(false);
        });
      });

      describe('item passed', () => {
        const item: Item = {
          id: 1234,
          value: 'Test',
          label: 'Test',
        };

        describe('passing truthy second paremeter', () => {
          beforeEach(() => {
            output = instance.highlightItem(item, true);
          });

          it('returns this', () => {
            expect(output).to.eql(instance);
          });

          it('dispatches highlightItem action with correct arguments', () => {
            expect(storeDispatchSpy.called).to.equal(true);
            expect(storeDispatchSpy.lastCall.args[0]).to.eql({
              type: ACTION_TYPES.HIGHLIGHT_ITEM,
              id: item.id,
              highlighted: true,
            });
          });

          describe('item with negative groupId', () => {
            beforeEach(() => {
              item.groupId = -1;
              output = instance.highlightItem(item);
            });

            it('triggers event with null groupValue', () => {
              expect(passedElementTriggerEventStub.called).to.equal(true);
              expect(passedElementTriggerEventStub.lastCall.args[0]).to.equal(
                EVENTS.highlightItem,
              );
              expect(passedElementTriggerEventStub.lastCall.args[1]).to.eql({
                id: item.id,
                value: item.value,
                label: item.label,
                groupValue: null,
              });
            });
          });

          describe('item without groupId', () => {
            beforeEach(() => {
              item.groupId = 1;
              output = instance.highlightItem(item);
            });

            it('triggers event with groupValue', () => {
              expect(passedElementTriggerEventStub.called).to.equal(true);
              expect(passedElementTriggerEventStub.lastCall.args[0]).to.equal(
                EVENTS.highlightItem,
              );
              expect(passedElementTriggerEventStub.lastCall.args[1]).to.eql({
                id: item.id,
                value: item.value,
                label: item.label,
                groupValue: groupIdValue,
              });
            });
          });
        });

        describe('passing falsey second paremeter', () => {
          beforeEach(() => {
            output = instance.highlightItem(item, false);
          });

          it("doesn't trigger event", () => {
            expect(passedElementTriggerEventStub.called).to.equal(false);
          });

          it('returns this', () => {
            expect(output).to.eql(instance);
          });
        });
      });
    });

    describe('unhighlightItem', () => {
      let passedElementTriggerEventStub;
      let storeDispatchSpy;
      let storeGetGroupByIdStub;
      const groupIdValue = 'Test';

      beforeEach(() => {
        passedElementTriggerEventStub = stub();
        storeGetGroupByIdStub = stub().returns({
          value: groupIdValue,
        });
        storeDispatchSpy = spy(instance._store, 'dispatch');

        instance._store.getGroupById = storeGetGroupByIdStub;
        instance.passedElement.triggerEvent = passedElementTriggerEventStub;
      });

      afterEach(() => {
        storeDispatchSpy.restore();
        instance._store.getGroupById.reset();
        instance.passedElement.triggerEvent.reset();
      });

      describe('no item passed', () => {
        beforeEach(() => {
          output = instance.unhighlightItem();
        });

        it('returns this', () => {
          expect(output).to.eql(instance);
        });

        it('returns early', () => {
          expect(passedElementTriggerEventStub.called).to.equal(false);
          expect(storeDispatchSpy.called).to.equal(false);
          expect(storeGetGroupByIdStub.called).to.equal(false);
        });
      });

      describe('item passed', () => {
        const item: Item = {
          id: 1234,
          value: 'Test',
          label: 'Test',
        };

        describe('passing truthy second paremeter', () => {
          beforeEach(() => {
            output = instance.unhighlightItem(item, true);
          });

          it('returns this', () => {
            expect(output).to.eql(instance);
          });

          it('dispatches highlightItem action with correct arguments', () => {
            expect(storeDispatchSpy.called).to.equal(true);
            expect(storeDispatchSpy.lastCall.args[0]).to.eql({
              type: ACTION_TYPES.HIGHLIGHT_ITEM,
              id: item.id,
              highlighted: false,
            });
          });

          describe('item with negative groupId', () => {
            beforeEach(() => {
              item.groupId = -1;
              output = instance.unhighlightItem(item);
            });

            it('triggers event with null groupValue', () => {
              expect(passedElementTriggerEventStub.called).to.equal(true);
              expect(passedElementTriggerEventStub.lastCall.args[0]).to.equal(
                EVENTS.highlightItem,
              );
              expect(passedElementTriggerEventStub.lastCall.args[1]).to.eql({
                id: item.id,
                value: item.value,
                label: item.label,
                groupValue: null,
              });
            });
          });

          describe('item without groupId', () => {
            beforeEach(() => {
              item.groupId = 1;
              output = instance.highlightItem(item);
            });

            it('triggers event with groupValue', () => {
              expect(passedElementTriggerEventStub.called).to.equal(true);
              expect(passedElementTriggerEventStub.lastCall.args[0]).to.equal(
                EVENTS.highlightItem,
              );
              expect(passedElementTriggerEventStub.lastCall.args[1]).to.eql({
                id: item.id,
                value: item.value,
                label: item.label,
                groupValue: groupIdValue,
              });
            });
          });
        });

        describe('passing falsey second paremeter', () => {
          beforeEach(() => {
            output = instance.highlightItem(item, false);
          });

          it("doesn't trigger event", () => {
            expect(passedElementTriggerEventStub.called).to.equal(false);
          });

          it('returns this', () => {
            expect(output).to.eql(instance);
          });
        });
      });
    });

    describe('highlightAll', () => {
      let storeGetItemsStub;
      let highlightItemStub;

      const items = [
        {
          id: 1,
          value: 'Test 1',
        },
        {
          id: 2,
          value: 'Test 2',
        },
      ];

      beforeEach(() => {
        storeGetItemsStub = stub(instance._store, 'items').get(() => items);
        highlightItemStub = stub();

        instance.highlightItem = highlightItemStub;

        output = instance.highlightAll();
      });

      afterEach(() => {
        highlightItemStub.reset();
        storeGetItemsStub.reset();
      });

      it('returns this', () => {
        expect(output).to.eql(instance);
      });

      it('highlights each item in store', () => {
        expect(highlightItemStub.callCount).to.equal(items.length);
        expect(highlightItemStub.firstCall.args[0]).to.equal(items[0]);
        expect(highlightItemStub.lastCall.args[0]).to.equal(items[1]);
      });
    });

    describe('unhighlightAll', () => {
      let storeGetItemsStub;
      let unhighlightItemStub;

      const items = [
        {
          id: 1,
          value: 'Test 1',
        },
        {
          id: 2,
          value: 'Test 2',
        },
      ];

      beforeEach(() => {
        storeGetItemsStub = stub(instance._store, 'items').get(() => items);
        unhighlightItemStub = stub();

        instance.unhighlightItem = unhighlightItemStub;

        output = instance.unhighlightAll();
      });

      afterEach(() => {
        instance.unhighlightItem.reset();
        storeGetItemsStub.reset();
      });

      it('returns this', () => {
        expect(output).to.eql(instance);
      });

      it('unhighlights each item in store', () => {
        expect(unhighlightItemStub.callCount).to.equal(items.length);
        expect(unhighlightItemStub.firstCall.args[0]).to.equal(items[0]);
        expect(unhighlightItemStub.lastCall.args[0]).to.equal(items[1]);
      });
    });

    describe('clearChoices', () => {
      let storeDispatchStub;

      beforeEach(() => {
        storeDispatchStub = stub();
        instance._store.dispatch = storeDispatchStub;

        output = instance.clearChoices();
      });

      afterEach(() => {
        instance._store.dispatch.reset();
      });

      it('returns this', () => {
        expect(output).to.eql(instance);
      });

      it('dispatches clearChoices action', () => {
        expect(storeDispatchStub.lastCall.args[0]).to.eql({
          type: ACTION_TYPES.CLEAR_CHOICES,
        });
      });
    });

    describe('clearStore', () => {
      let storeDispatchStub;

      beforeEach(() => {
        storeDispatchStub = stub();
        instance._store.dispatch = storeDispatchStub;

        output = instance.clearStore();
      });

      afterEach(() => {
        instance._store.dispatch.reset();
      });

      it('returns this', () => {
        expect(output).to.eql(instance);
      });

      it('dispatches clearAll action', () => {
        expect(storeDispatchStub.lastCall.args[0]).to.eql({
          type: ACTION_TYPES.CLEAR_ALL,
        });
      });
    });

    describe('clearInput', () => {
      let inputClearSpy;
      let storeDispatchStub;

      beforeEach(() => {
        inputClearSpy = spy(instance.input, 'clear');
        storeDispatchStub = stub();
        instance._store.dispatch = storeDispatchStub;
        output = instance.clearInput();
      });

      afterEach(() => {
        inputClearSpy.restore();
        instance._store.dispatch.reset();
      });

      it('returns this', () => {
        expect(output).to.eql(instance);
      });

      describe('text element', () => {
        beforeEach(() => {
          instance._isSelectOneElement = false;
          instance._isTextElement = false;

          output = instance.clearInput();
        });

        it('clears input with correct arguments', () => {
          expect(inputClearSpy.called).to.equal(true);
          expect(inputClearSpy.lastCall.args[0]).to.equal(true);
        });
      });

      describe('select element with search enabled', () => {
        beforeEach(() => {
          instance._isSelectOneElement = true;
          instance._isTextElement = false;
          instance.config.searchEnabled = true;

          output = instance.clearInput();
        });

        it('clears input with correct arguments', () => {
          expect(inputClearSpy.called).to.equal(true);
          expect(inputClearSpy.lastCall.args[0]).to.equal(false);
        });

        it('resets search flag', () => {
          expect(instance._isSearching).to.equal(false);
        });

        it('dispatches activateChoices action', () => {
          expect(storeDispatchStub.called).to.equal(true);
          expect(storeDispatchStub.lastCall.args[0]).to.eql({
            type: ACTION_TYPES.ACTIVATE_CHOICES,
            active: true,
          });
        });
      });
    });

    describe('setChoices with callback/Promise', () => {
      describe('not initialised', () => {
        beforeEach(() => {
          instance.initialised = false;
        });

        it('should throw', () => {
          expect(() => instance.setChoices(null)).Throw(ReferenceError);
        });
      });

      describe('text element', () => {
        beforeEach(() => {
          instance._isSelectElement = false;
        });

        it('should throw', () => {
          expect(() => instance.setChoices(null)).Throw(TypeError);
        });
      });

      describe('passing invalid function', () => {
        beforeEach(() => {
          instance._isSelectElement = true;
        });

        it('should throw on non function', () => {
          expect(() => instance.setChoices(null)).Throw(TypeError, /Promise/i);
        });

        it(`should throw on function that doesn't return promise`, () => {
          expect(() => instance.setChoices(() => 'boo')).to.throw(
            TypeError,
            /promise/i,
          );
        });
      });

      describe('select element', () => {
        it('fetches and sets choices', async () => {
          document.body.innerHTML = '<select id="test" />';
          const choice = new Choices('#test', { allowHTML: true });
          const handleLoadingStateSpy = spy(choice, '_handleLoadingState');

          let fetcherCalled = false;
          const fetcher = async (inst): Promise<Choice[]> => {
            expect(inst).to.eq(choice);
            fetcherCalled = true;
            // eslint-disable-next-line no-promise-executor-return
            await new Promise((resolve) => setTimeout(resolve, 800));

            return [
              { label: 'l1', value: 'v1', customProperties: { prop1: true } },
              { label: 'l2', value: 'v2', customProperties: { prop2: false } },
            ];
          };
          expect(choice._store.choices.length).to.equal(0);
          const promise = choice.setChoices(fetcher);
          expect(fetcherCalled).to.be.true;
          const res = await promise;
          expect(res).to.equal(choice);
          expect(handleLoadingStateSpy.callCount).to.equal(2);
          expect(choice._store.choices[1].value).to.equal('v2');
          expect(choice._store.choices[1].label).to.equal('l2');
          expect(choice._store.choices[1].customProperties).to.deep.equal({
            prop2: false,
          });
        });
      });
    });

    describe('setValue', () => {
      let setChoiceOrItemStub;
      const values = [
        'Value 1',
        {
          value: 'Value 2',
        },
      ];

      beforeEach(() => {
        setChoiceOrItemStub = stub();
        instance._setChoiceOrItem = setChoiceOrItemStub;
      });

      afterEach(() => {
        instance._setChoiceOrItem.reset();
      });

      describe('not already initialised', () => {
        beforeEach(() => {
          instance.initialised = false;
          output = instance.setValue(values);
        });

        it('returns this', () => {
          expect(output).to.eql(instance);
        });

        it('returns early', () => {
          expect(setChoiceOrItemStub.called).to.equal(false);
        });
      });

      describe('when already initialised', () => {
        beforeEach(() => {
          instance.initialised = true;
          output = instance.setValue(values);
        });

        it('returns this', () => {
          expect(output).to.eql(instance);
        });

        it('sets each value', () => {
          expect(setChoiceOrItemStub.callCount).to.equal(2);
          expect(setChoiceOrItemStub.firstCall.args[0]).to.equal(values[0]);
          expect(setChoiceOrItemStub.secondCall.args[0]).to.equal(values[1]);
        });
      });
    });

    describe('setChoiceByValue', () => {
      let findAndSelectChoiceByValueStub;

      beforeEach(() => {
        findAndSelectChoiceByValueStub = stub();
        instance._findAndSelectChoiceByValue = findAndSelectChoiceByValueStub;
      });

      afterEach(() => {
        instance._findAndSelectChoiceByValue.reset();
      });

      describe('not already initialised', () => {
        beforeEach(() => {
          instance.initialised = false;
          output = instance.setChoiceByValue([]);
        });

        it('returns this', () => {
          expect(output).to.eql(instance);
        });

        it('returns early', () => {
          expect(findAndSelectChoiceByValueStub.called).to.equal(false);
        });
      });

      describe('when already initialised and not text element', () => {
        beforeEach(() => {
          instance.initialised = true;
          instance._isTextElement = false;
        });

        describe('passing a string value', () => {
          const value = 'Test value';

          beforeEach(() => {
            output = instance.setChoiceByValue(value);
          });

          it('returns this', () => {
            expect(output).to.eql(instance);
          });

          it('sets each choice with same value', () => {
            expect(findAndSelectChoiceByValueStub.called).to.equal(true);
            expect(findAndSelectChoiceByValueStub.firstCall.args[0]).to.equal(
              value,
            );
          });
        });

        describe('passing an array of values', () => {
          const values = ['Value 1', 'Value 2'];

          beforeEach(() => {
            output = instance.setChoiceByValue(values);
          });

          it('returns this', () => {
            expect(output).to.eql(instance);
          });

          it('sets each choice with same value', () => {
            expect(findAndSelectChoiceByValueStub.callCount).to.equal(2);
            expect(findAndSelectChoiceByValueStub.firstCall.args[0]).to.equal(
              values[0],
            );
            expect(findAndSelectChoiceByValueStub.secondCall.args[0]).to.equal(
              values[1],
            );
          });
        });
      });
    });

    describe('getValue', () => {
      let activeItemsStub;
      const items = [
        {
          id: '1',
          value: 'Test value 1',
        },
        {
          id: '2',
          value: 'Test value 2',
        },
      ];

      beforeEach(() => {
        activeItemsStub = stub(instance._store, 'activeItems').get(() => items);
      });

      afterEach(() => {
        activeItemsStub.reset();
      });

      describe('passing true valueOnly flag', () => {
        describe('select one input', () => {
          beforeEach(() => {
            instance._isSelectOneElement = true;
            output = instance.getValue(true);
          });

          it('returns a single action value', () => {
            expect(output).to.equal(items[0].value);
          });
        });

        describe('non select one input', () => {
          beforeEach(() => {
            instance._isSelectOneElement = false;
            output = instance.getValue(true);
          });

          it('returns all active item values', () => {
            expect(output).to.eql(items.map((item) => item.value));
          });
        });
      });

      describe('passing false valueOnly flag', () => {
        describe('select one input', () => {
          beforeEach(() => {
            instance._isSelectOneElement = true;
            output = instance.getValue(false);
          });

          it('returns a single active item', () => {
            expect(output).to.equal(items[0]);
          });
        });

        describe('non select one input', () => {
          beforeEach(() => {
            instance._isSelectOneElement = false;
            output = instance.getValue(false);
          });

          it('returns all active items', () => {
            expect(output).to.eql(items);
          });
        });
      });
    });

    describe('removeActiveItemsByValue', () => {
      let activeItemsStub;
      let removeItemStub;
      const value = 'Removed';
      const items = [
        {
          id: '1',
          value: 'Not removed',
        },
        {
          id: '2',
          value: 'Removed',
        },
        {
          id: '3',
          value: 'Removed',
        },
      ];

      beforeEach(() => {
        removeItemStub = stub();
        activeItemsStub = stub(instance._store, 'activeItems').get(() => items);
        instance._removeItem = removeItemStub;

        output = instance.removeActiveItemsByValue(value);
      });

      afterEach(() => {
        activeItemsStub.reset();
        instance._removeItem.reset();
      });

      it('removes each active item in store with matching value', () => {
        expect(removeItemStub.callCount).to.equal(2);
        expect(removeItemStub.firstCall.args[0]).to.equal(items[1]);
        expect(removeItemStub.secondCall.args[0]).to.equal(items[2]);
      });
    });

    describe('removeActiveItems', () => {
      let activeItemsStub;
      let removeItemStub;
      const items = [
        {
          id: '1',
          value: 'Not removed',
        },
        {
          id: '2',
          value: 'Removed',
        },
        {
          id: '3',
          value: 'Removed',
        },
      ];

      beforeEach(() => {
        removeItemStub = stub();
        activeItemsStub = stub(instance._store, 'activeItems').get(() => items);
        instance._removeItem = removeItemStub;
      });

      afterEach(() => {
        activeItemsStub.reset();
        instance._removeItem.reset();
      });

      describe('not passing id to exclude', () => {
        beforeEach(() => {
          output = instance.removeActiveItems();
        });

        it('removes all active items in store', () => {
          expect(removeItemStub.callCount).to.equal(items.length);
          expect(removeItemStub.firstCall.args[0]).to.equal(items[0]);
          expect(removeItemStub.secondCall.args[0]).to.equal(items[1]);
          expect(removeItemStub.thirdCall.args[0]).to.equal(items[2]);
        });
      });

      describe('passing id to exclude', () => {
        const idToExclude = '2';

        beforeEach(() => {
          output = instance.removeActiveItems(idToExclude);
        });

        it('removes all active items in store with id that does match excludedId', () => {
          expect(removeItemStub.callCount).to.equal(2);
          expect(removeItemStub.firstCall.args[0]).to.equal(items[0]);
          expect(removeItemStub.secondCall.args[0]).to.equal(items[2]);
        });
      });
    });

    describe('removeHighlightedItems', () => {
      let highlightedActiveItemsStub;
      let removeItemStub;
      let triggerChangeStub;

      const items = [
        {
          id: 1,
          value: 'Test 1',
        },
        {
          id: 2,
          value: 'Test 2',
        },
      ];

      beforeEach(() => {
        highlightedActiveItemsStub = stub(
          instance._store,
          'highlightedActiveItems',
        ).get(() => items);
        removeItemStub = stub();
        triggerChangeStub = stub();

        instance._removeItem = removeItemStub;
        instance._triggerChange = triggerChangeStub;
      });

      afterEach(() => {
        highlightedActiveItemsStub.reset();
        instance._removeItem.reset();
        instance._triggerChange.reset();
      });

      describe('runEvent parameter being passed', () => {
        beforeEach(() => {
          output = instance.removeHighlightedItems();
        });

        it('returns this', () => {
          expect(output).to.eql(instance);
        });

        it('removes each highlighted item in store', () => {
          expect(removeItemStub.callCount).to.equal(2);
        });
      });

      describe('runEvent parameter not being passed', () => {
        beforeEach(() => {
          output = instance.removeHighlightedItems(true);
        });

        it('returns this', () => {
          expect(output).to.eql(instance);
        });

        it('triggers event with item value', () => {
          expect(triggerChangeStub.callCount).to.equal(2);
          expect(triggerChangeStub.firstCall.args[0]).to.equal(items[0].value);
          expect(triggerChangeStub.secondCall.args[0]).to.equal(items[1].value);
        });
      });
    });

    describe('setChoices', () => {
      let clearChoicesStub;
      let addGroupStub;
      let addChoiceStub;
      let containerOuterRemoveLoadingStateStub;
      const value = 'value';
      const label = 'label';
      const choices: Choice[] = [
        {
          id: 1,
          value: '1',
          label: 'Test 1',
          selected: false,
          disabled: false,
        },
        {
          id: 2,
          value: '2',
          label: 'Test 2',
          selected: false,
          disabled: true,
        },
      ];
      const groups: Group[] = [
        {
          ...choices[0],
          choices,
        },
        choices[1],
      ];

      beforeEach(() => {
        clearChoicesStub = stub();
        addGroupStub = stub();
        addChoiceStub = stub();
        containerOuterRemoveLoadingStateStub = stub();

        instance.clearChoices = clearChoicesStub;
        instance._addGroup = addGroupStub;
        instance._addChoice = addChoiceStub;
        instance.containerOuter.removeLoadingState =
          containerOuterRemoveLoadingStateStub;
      });

      afterEach(() => {
        instance.clearChoices.reset();
        instance._addGroup.reset();
        instance._addChoice.reset();
        instance.containerOuter.removeLoadingState.reset();
      });

      describe('when element is not select element', () => {
        beforeEach(() => {
          instance._isSelectElement = false;
        });

        it('throws', () => {
          expect(() =>
            instance.setChoices(choices, value, label, false),
          ).to.throw(TypeError, /input/i);
        });
      });

      describe('passing invalid arguments', () => {
        describe('passing no value', () => {
          beforeEach(() => {
            instance._isSelectElement = true;
          });

          it('throws', () => {
            expect(() =>
              instance.setChoices(choices, null, 'label', false),
            ).to.throw(TypeError, /value/i);
          });
        });
      });

      describe('passing valid arguments', () => {
        beforeEach(() => {
          instance._isSelectElement = true;
        });

        it('removes loading state', () => {
          instance.setChoices(choices, value, label, false);
          expect(containerOuterRemoveLoadingStateStub.called).to.equal(true);
        });

        describe('passing choices with children choices', () => {
          it('adds groups', () => {
            instance.setChoices(groups, value, label, false);
            expect(addGroupStub.callCount).to.equal(1);
            expect(addGroupStub.firstCall.args[0]).to.eql({
              group: groups[0],
              id: groups[0].id,
              valueKey: value,
              labelKey: label,
            });
          });
        });

        describe('passing choices without children choices', () => {
          it('adds passed choices', () => {
            instance.setChoices(choices, value, label, false);
            expect(addChoiceStub.callCount).to.equal(2);
            addChoiceStub.getCalls().forEach((call, index) => {
              expect(call.args[0]).to.eql({
                value: choices[index][value],
                label: choices[index][label],
                isSelected: !!choices[index].selected,
                isDisabled: !!choices[index].disabled,
                customProperties: choices[index].customProperties,
                placeholder: !!choices[index].placeholder,
              });
            });
          });
        });

        describe('passing an empty array with a true replaceChoices flag', () => {
          it('choices are cleared', () => {
            instance._isSelectElement = true;
            instance.setChoices([], value, label, true);
            expect(clearChoicesStub.called).to.equal(true);
          });
        });

        describe('passing an empty array with a false replaceChoices flag', () => {
          it('choices stay the same', () => {
            instance._isSelectElement = true;
            instance.setChoices([], value, label, false);
            expect(clearChoicesStub.called).to.equal(false);
          });
        });

        describe('passing true replaceChoices flag', () => {
          it('choices are cleared', () => {
            instance.setChoices(choices, value, label, true);
            expect(clearChoicesStub.called).to.equal(true);
          });
        });

        describe('passing false replaceChoices flag', () => {
          it('choices are not cleared', () => {
            instance.setChoices(choices, value, label, false);
            expect(clearChoicesStub.called).to.equal(false);
          });
        });
      });
    });
  });

  describe('events', () => {
    describe('search', () => {
      const choices: Choice[] = [
        {
          id: 1,
          value: '1',
          label: 'Test 1',
          selected: false,
          disabled: false,
        },
        {
          id: 2,
          value: '2',
          label: 'Test 2',
          selected: false,
          disabled: false,
        },
      ];

      beforeEach(() => {
        document.body.innerHTML = `
        <select data-choice multiple></select>
        `;

        instance = new Choices('[data-choice]', {
          choices,
          allowHTML: false,
          searchEnabled: true,
        });
      });

      it('details are passed', (done) => {
        const query =
          'This is a <search> query & a "test" with characters that should not be sanitised.';

        instance.input.value = query;
        instance.input.focus();
        instance.passedElement.element.addEventListener(
          'search',
          (event) => {
            expect(event.detail).to.eql({
              value: query,
              resultCount: 0,
            });
            done();
          },
          { once: true },
        );

        instance._onKeyUp({ target: null, keyCode: null });
      });

      it('uses Fuse options', (done) => {
        instance.input.value = 'test';
        instance.input.focus();
        instance.passedElement.element.addEventListener(
          'search',
          (event) => {
            expect(event.detail.resultCount).to.eql(2);

            instance.config.fuseOptions.isCaseSensitive = true;
            instance.config.fuseOptions.minMatchCharLength = 4;
            instance.passedElement.element.addEventListener(
              'search',
              (eventCaseSensitive) => {
                expect(eventCaseSensitive.detail.resultCount).to.eql(0);
                done();
              },
              { once: true },
            );

            instance._onKeyUp({ target: null, keyCode: null });
          },
          { once: true },
        );

        instance._onKeyUp({ target: null, keyCode: null });
      });

      it('is fired with a searchFloor of 0', (done) => {
        instance.config.searchFloor = 0;
        instance.input.value = '';
        instance.input.focus();
        instance.passedElement.element.addEventListener('search', (event) => {
          expect(event.detail).to.eql({
            value: instance.input.value,
            resultCount: 0,
          });
          done();
        });

        instance._onKeyUp({ target: null, keyCode: null });
      });
    });
  });

  describe('private methods', () => {
    describe('_createGroupsFragment', () => {
      let _createChoicesFragmentStub;
      const choices: Choice[] = [
        {
          id: 1,
          selected: true,
          groupId: 1,
          value: 'Choice 1',
          label: 'Choice 1',
        },
        {
          id: 2,
          selected: false,
          groupId: 2,
          value: 'Choice 2',
          label: 'Choice 2',
        },
        {
          id: 3,
          selected: false,
          groupId: 1,
          value: 'Choice 3',
          label: 'Choice 3',
        },
      ];

      const groups: Group[] = [
        {
          id: 2,
          value: 'Group 2',
          active: true,
          disabled: false,
        },
        {
          id: 1,
          value: 'Group 1',
          active: true,
          disabled: false,
        },
      ];

      beforeEach(() => {
        _createChoicesFragmentStub = stub();
        instance._createChoicesFragment = _createChoicesFragmentStub;
      });

      afterEach(() => {
        instance._createChoicesFragment.reset();
      });

      describe('returning a fragment of groups', () => {
        describe('passing fragment argument', () => {
          it('updates fragment with groups', () => {
            const fragment = document.createDocumentFragment();
            const childElement = document.createElement('div');
            fragment.appendChild(childElement);

            output = instance._createGroupsFragment(groups, choices, fragment);
            const elementToWrapFragment = document.createElement('div');
            elementToWrapFragment.appendChild(output);

            expect(output).to.be.instanceOf(DocumentFragment);
            expect(elementToWrapFragment.children[0]).to.eql(childElement);
            expect(
              elementToWrapFragment.querySelectorAll('[data-group]').length,
            ).to.equal(2);
          });
        });

        describe('not passing fragment argument', () => {
          it('returns new groups fragment', () => {
            output = instance._createGroupsFragment(groups, choices);
            const elementToWrapFragment = document.createElement('div');
            elementToWrapFragment.appendChild(output);

            expect(output).to.be.instanceOf(DocumentFragment);
            expect(
              elementToWrapFragment.querySelectorAll('[data-group]').length,
            ).to.equal(2);
          });
        });

        describe('sorting groups', () => {
          let sortFnStub;

          beforeEach(() => {
            sortFnStub = stub();
            instance.config.sorter = sortFnStub;
            instance.config.shouldSort = true;
          });

          afterEach(() => {
            instance.config.sorter.reset();
          });

          it('sorts groups by config.sorter', () => {
            expect(sortFnStub.called).to.equal(false);
            instance._createGroupsFragment(groups, choices);
            expect(sortFnStub.called).to.equal(true);
          });
        });

        describe('not sorting groups', () => {
          let sortFnStub;

          beforeEach(() => {
            sortFnStub = stub();
            instance.config.sorter = sortFnStub;
            instance.config.shouldSort = false;
          });

          afterEach(() => {
            instance.config.sorter.reset();
          });

          it('does not sort groups', () => {
            instance._createGroupsFragment(groups, choices);
            expect(sortFnStub.called).to.equal(false);
          });
        });

        describe('select-one element', () => {
          beforeEach(() => {
            instance._isSelectOneElement = true;
          });

          it('calls _createChoicesFragment with choices that belong to each group', () => {
            expect(_createChoicesFragmentStub.called).to.equal(false);
            instance._createGroupsFragment(groups, choices);
            expect(_createChoicesFragmentStub.called).to.equal(true);
            expect(_createChoicesFragmentStub.firstCall.args[0]).to.eql([
              {
                id: 1,
                selected: true,
                groupId: 1,
                value: 'Choice 1',
                label: 'Choice 1',
              },
              {
                id: 3,
                selected: false,
                groupId: 1,
                value: 'Choice 3',
                label: 'Choice 3',
              },
            ]);
            expect(_createChoicesFragmentStub.secondCall.args[0]).to.eql([
              {
                id: 2,
                selected: false,
                groupId: 2,
                value: 'Choice 2',
                label: 'Choice 2',
              },
            ]);
          });
        });

        describe('text/select-multiple element', () => {
          describe('renderSelectedChoices set to "always"', () => {
            beforeEach(() => {
              instance._isSelectOneElement = false;
              instance.config.renderSelectedChoices = 'always';
            });

            it('calls _createChoicesFragment with choices that belong to each group', () => {
              expect(_createChoicesFragmentStub.called).to.equal(false);
              instance._createGroupsFragment(groups, choices);
              expect(_createChoicesFragmentStub.called).to.equal(true);
              expect(_createChoicesFragmentStub.firstCall.args[0]).to.eql([
                {
                  id: 1,
                  selected: true,
                  groupId: 1,
                  value: 'Choice 1',
                  label: 'Choice 1',
                },
                {
                  id: 3,
                  selected: false,
                  groupId: 1,
                  value: 'Choice 3',
                  label: 'Choice 3',
                },
              ]);
              expect(_createChoicesFragmentStub.secondCall.args[0]).to.eql([
                {
                  id: 2,
                  selected: false,
                  groupId: 2,
                  value: 'Choice 2',
                  label: 'Choice 2',
                },
              ]);
            });
          });

          describe('renderSelectedChoices not set to "always"', () => {
            beforeEach(() => {
              instance._isSelectOneElement = false;
              instance.config.renderSelectedChoices = false;
            });

            it('calls _createChoicesFragment with choices that belong to each group that are not already selected', () => {
              expect(_createChoicesFragmentStub.called).to.equal(false);
              instance._createGroupsFragment(groups, choices);
              expect(_createChoicesFragmentStub.called).to.equal(true);
              expect(_createChoicesFragmentStub.firstCall.args[0]).to.eql([
                {
                  id: 3,
                  selected: false,
                  groupId: 1,
                  value: 'Choice 3',
                  label: 'Choice 3',
                },
              ]);
              expect(_createChoicesFragmentStub.secondCall.args[0]).to.eql([
                {
                  id: 2,
                  selected: false,
                  groupId: 2,
                  value: 'Choice 2',
                  label: 'Choice 2',
                },
              ]);
            });
          });
        });
      });
    });

    describe('_generatePlaceholderValue', () => {
      describe('select element', () => {
        describe('when a placeholder option is defined', () => {
          it('returns the text value of the placeholder option', () => {
            const placeholderValue = 'I am a placeholder';

            instance._isSelectElement = true;
            instance.passedElement.placeholderOption = {
              text: placeholderValue,
            };

            const value = instance._generatePlaceholderValue();
            expect(value).to.equal(placeholderValue);
          });
        });

        describe('when a placeholder option is not defined', () => {
          it('returns null', () => {
            instance._isSelectElement = true;
            instance.passedElement.placeholderOption = undefined;

            const value = instance._generatePlaceholderValue();
            expect(value).to.equal(null);
          });
        });
      });

      describe('text input', () => {
        describe('when the placeholder config option is set to true', () => {
          describe('when the placeholderValue config option is defined', () => {
            it('returns placeholderValue', () => {
              const placeholderValue = 'I am a placeholder';

              instance._isSelectElement = false;
              instance.config.placeholder = true;
              instance.config.placeholderValue = placeholderValue;

              const value = instance._generatePlaceholderValue();
              expect(value).to.equal(placeholderValue);
            });
          });

          describe('when the placeholderValue config option is not defined', () => {
            describe('when the placeholder attribute is defined on the passed element', () => {
              it('returns the value of the placeholder attribute', () => {
                const placeholderValue = 'I am a placeholder';

                instance._isSelectElement = false;
                instance.config.placeholder = true;
                instance.config.placeholderValue = undefined;
                instance.passedElement.element = {
                  dataset: {
                    placeholder: placeholderValue,
                  },
                };

                const value = instance._generatePlaceholderValue();
                expect(value).to.equal(placeholderValue);
              });
            });

            describe('when the placeholder attribute is not defined on the passed element', () => {
              it('returns null', () => {
                instance._isSelectElement = false;
                instance.config.placeholder = true;
                instance.config.placeholderValue = undefined;
                instance.passedElement.element = {
                  dataset: {
                    placeholder: undefined,
                  },
                };

                const value = instance._generatePlaceholderValue();
                expect(value).to.equal(null);
              });
            });
          });
        });

        describe('when the placeholder config option is set to false', () => {
          it('returns null', () => {
            instance._isSelectElement = false;
            instance.config.placeholder = false;

            const value = instance._generatePlaceholderValue();
            expect(value).to.equal(null);
          });
        });
      });
    });

    describe('_getTemplate', () => {
      describe('when passing a template key', () => {
        it('returns the generated template for the given template key', () => {
          const templateKey = 'test';
          const element = document.createElement('div');
          const customArg = { test: true };

          instance._templates = {
            [templateKey]: stub().returns(element),
          };

          output = instance._getTemplate(templateKey, customArg);
          expect(output).to.deep.equal(element);
          expect(instance._templates[templateKey]).to.have.been.calledOnceWith(
            instance.config,
            customArg,
          );
        });
      });
    });

    describe('_onKeyDown', () => {
      let activeItems;
      let hasItems;
      let hasActiveDropdown;
      let hasFocussedInput;

      beforeEach(() => {
        instance.showDropdown = stub();
        instance._onSelectKey = stub();
        instance._onEnterKey = stub();
        instance._onEscapeKey = stub();
        instance._onDirectionKey = stub();
        instance._onDeleteKey = stub();

        ({ activeItems } = instance._store);
        hasItems = instance.itemList.hasChildren();
        hasActiveDropdown = instance.dropdown.isActive;
        hasFocussedInput = instance.input.isFocussed;
      });

      describe('direction key', () => {
        const keyCodes = [
          KEY_CODES.UP_KEY,
          KEY_CODES.DOWN_KEY,
          KEY_CODES.PAGE_UP_KEY,
          KEY_CODES.PAGE_DOWN_KEY,
        ];

        keyCodes.forEach((keyCode) => {
          it(`calls _onDirectionKey with the expected arguments`, () => {
            const event = {
              keyCode,
            };

            instance._onKeyDown(event);

            expect(instance._onDirectionKey).to.have.been.calledWith(
              event,
              hasActiveDropdown,
            );
          });
        });
      });

      describe('select key', () => {
        it(`calls _onSelectKey with the expected arguments`, () => {
          const event = {
            keyCode: KEY_CODES.A_KEY,
          };

          instance._onKeyDown(event);

          expect(instance._onSelectKey).to.have.been.calledWith(
            event,
            hasItems,
          );
        });
      });

      describe('enter key', () => {
        it(`calls _onEnterKey with the expected arguments`, () => {
          const event = {
            keyCode: KEY_CODES.ENTER_KEY,
          };

          instance._onKeyDown(event);

          expect(instance._onEnterKey).to.have.been.calledWith(
            event,
            activeItems,
            hasActiveDropdown,
          );
        });
      });

      describe('delete key', () => {
        const keyCodes = [KEY_CODES.DELETE_KEY, KEY_CODES.BACK_KEY];

        keyCodes.forEach((keyCode) => {
          it(`calls _onDeleteKey with the expected arguments`, () => {
            const event = {
              keyCode,
            };

            instance._onKeyDown(event);

            expect(instance._onDeleteKey).to.have.been.calledWith(
              event,
              activeItems,
              hasFocussedInput,
            );
          });
        });
      });
    });

    describe('_removeItem', () => {
      beforeEach(() => {
        instance._store.dispatch = stub();
      });

      afterEach(() => {
        instance._store.dispatch.reset();
      });

      describe('when given an item to remove', () => {
        const item = {
          id: 1111,
          value: 'test value',
          label: 'test label',
          choiceId: 2222,
          groupId: 3333,
          customProperties: {},
        };

        it('dispatches a REMOVE_ITEM action to the store', () => {
          instance._removeItem(item);

          expect(instance._store.dispatch).to.have.been.calledWith(
            removeItem(item.id, item.choiceId),
          );
        });

        it('triggers a REMOVE_ITEM event on the passed element', (done) => {
          passedElement.addEventListener(
            'removeItem',
            (event) => {
              expect(event.detail).to.eql({
                id: item.id,
                value: item.value,
                label: item.label,
                customProperties: item.customProperties,
                groupValue: null,
              });
              done();
            },
            false,
          );

          instance._removeItem(item);
        });

        describe('when the item belongs to a group', () => {
          const group = {
            id: 1,
            value: 'testing',
          };
          const itemWithGroup = {
            ...item,
            groupId: group.id,
          };

          beforeEach(() => {
            instance._store.getGroupById = stub();
            instance._store.getGroupById.returns(group);
          });

          afterEach(() => {
            instance._store.getGroupById.reset();
          });

          it("includes the group's value in the triggered event", (done) => {
            passedElement.addEventListener(
              'removeItem',
              (event) => {
                expect(event.detail).to.eql({
                  id: itemWithGroup.id,
                  value: itemWithGroup.value,
                  label: itemWithGroup.label,
                  customProperties: itemWithGroup.customProperties,
                  groupValue: group.value,
                });

                done();
              },
              false,
            );

            instance._removeItem(itemWithGroup);
          });
        });
      });
    });
  });
});
