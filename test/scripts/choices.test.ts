import { expect } from 'chai';
import { spy, stub } from 'sinon';

import sinonChai from 'sinon-chai';
import Choices, { DEFAULT_CONFIG, ActionType, EventType, KeyCodeMap, InputChoice, InputGroup } from '../../src';
import { WrappedSelect, WrappedInput } from '../../src/scripts/components/index';
import { removeItem } from '../../src/scripts/actions/items';
import templates from '../../src/scripts/templates';
import { ChoiceFull } from '../../src/scripts/interfaces/choice-full';
import { SearchByFuse } from '../../src/scripts/search/fuse';
import { SearchByKMP } from '../../src/scripts/search/kmp';
import { SearchByPrefixFilter } from '../../src/scripts/search/prefix-filter';

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

          expect(instance.config).to.deep.equal({
            ...DEFAULT_CONFIG,
            searchEnabled: false,
            closeDropdownOnSelect: true,
            renderSelectedChoices: false,
          });
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

          expect(instance.config).to.deep.equal({
            ...DEFAULT_CONFIG,
            searchEnabled: false,
            closeDropdownOnSelect: true,
            renderSelectedChoices: false,
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
                searchEnabled: true,
              });

              expect(instance.config.searchEnabled).to.equal(true);
            });
            it('sets searchEnabled to false', () => {
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

            expect(instance.config.renderSelectedChoices).to.equal(false);
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

        const inputs = document.querySelectorAll<HTMLElement>('[data-choice]');
        expect(inputs.length).to.equal(3);

        instance = new Choices(undefined, { allowHTML: true });

        expect(instance.passedElement.element.id).to.equal(inputs[0].id);
      });

      describe('when an element cannot be found in the DOM', () => {
        it('throws an error', () => {
          document.body.innerHTML = ``;
          expect(() => new Choices(undefined, { allowHTML: true })).to.throw(
            TypeError,
            'Selector [data-choice] failed to find an element',
          );
        });
      });

      describe('when an element is not of the expected type', () => {
        it('throws an error', () => {
          document.body.innerHTML = `<div [data-choice]></div>`;
          expect(() => new Choices(undefined, { allowHTML: true })).to.throw(
            TypeError,
            'Selector [data-choice] failed to find an element',
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
          expect(() => new Choices('[data-choice]', { allowHTML: true })).to.throw(
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
          instance.initialisedOK = undefined;
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

        it('fire initial render with no items or choices', () => {
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
          instance.initialisedOK = undefined;
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
          expect(containerOuterUnwrapSpy.lastCall.args[0]).to.equal(instance.passedElement.element);
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
          expect(output).to.deep.equal(instance);
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
          expect(output).to.deep.equal(instance);
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
          expect(output).to.deep.equal(instance);
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
          expect(output).to.deep.equal(instance);
        });

        it('opens containerOuter', () =>
          new Promise((done) => {
            requestAnimationFrame(() => {
              expect(containerOuterOpenSpy.called).to.equal(true);
              done(true);
            });
          }));

        it('shows dropdown with blurInput flag', () =>
          new Promise((done) => {
            requestAnimationFrame(() => {
              expect(dropdownShowSpy.called).to.equal(true);
              done(true);
            });
          }));

        it('triggers event on passedElement', () =>
          new Promise((done) => {
            requestAnimationFrame(() => {
              expect(passedElementTriggerEventStub.called).to.equal(true);
              expect(passedElementTriggerEventStub.lastCall.args[0]).to.deep.equal(EventType.showDropdown);
              expect(passedElementTriggerEventStub.lastCall.args[1]).to.undefined;
              done(true);
            });
          }));

        describe('passing true focusInput flag with canSearch set to true', () => {
          beforeEach(() => {
            instance.dropdown.isActive = false;
            instance._canSearch = true;
            output = instance.showDropdown(true);
          });

          it('focuses input', () =>
            new Promise((done) => {
              requestAnimationFrame(() => {
                expect(inputFocusSpy.called).to.equal(false);
                done(true);
              });
            }));
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
        inputRemoveActiveDescendantSpy = spy(instance.input, 'removeActiveDescendant');
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
          expect(output).to.deep.equal(instance);
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
          expect(output).to.deep.equal(instance);
        });

        it('closes containerOuter', () =>
          new Promise((done) => {
            requestAnimationFrame(() => {
              expect(containerOuterCloseSpy.called).to.equal(true);
              done(true);
            });
          }));

        it('hides dropdown with blurInput flag', () =>
          new Promise((done) => {
            requestAnimationFrame(() => {
              expect(dropdownHideSpy.called).to.equal(true);
              done(true);
            });
          }));

        it('triggers event on passedElement', () =>
          new Promise((done) => {
            requestAnimationFrame(() => {
              expect(passedElementTriggerEventStub.called).to.equal(true);
              expect(passedElementTriggerEventStub.lastCall.args[0]).to.deep.equal(EventType.hideDropdown);
              expect(passedElementTriggerEventStub.lastCall.args[1]).to.undefined;
              done(true);
            });
          }));

        describe('passing true blurInput flag with canSearch set to true', () => {
          beforeEach(() => {
            instance.dropdown.isActive = true;
            instance._canSearch = true;
            output = instance.hideDropdown(true);
          });

          it('removes active descendants', () =>
            new Promise((done) => {
              requestAnimationFrame(() => {
                expect(inputRemoveActiveDescendantSpy.called).to.equal(true);
                done(true);
              });
            }));

          it('blurs input', () =>
            new Promise((done) => {
              requestAnimationFrame(() => {
                expect(inputBlurSpy.called).to.equal(true);
                done(true);
              });
            }));
        });
      });
    });

    describe('highlightItem', () => {
      let passedElementTriggerEventStub;
      let storeDispatchSpy;
      let storeGetGroupByIdStub;
      let choicesStub;
      let itemsStub;
      const groupIdValue = 'Test';
      const item: ChoiceFull = {
        group: null,
        highlighted: false,
        active: false,
        disabled: false,
        placeholder: false,
        selected: false,
        id: 1234,
        value: 'Test',
        label: 'Test',
        score: 0,
        rank: 0,
      };

      beforeEach(() => {
        choicesStub = stub(instance._store, 'choices').get(() => [item]);
        itemsStub = stub(instance._store, 'items').get(() => [item]);
        passedElementTriggerEventStub = stub();
        storeGetGroupByIdStub = stub().returns({
          id: 4321,
          label: groupIdValue,
        });
        storeDispatchSpy = spy(instance._store, 'dispatch');

        instance._store.getGroupById = storeGetGroupByIdStub;
        instance.passedElement.triggerEvent = passedElementTriggerEventStub;
      });

      afterEach(() => {
        choicesStub.reset();
        itemsStub.reset();
        storeDispatchSpy.restore();
        instance._store.getGroupById.reset();
        instance.passedElement.triggerEvent.reset();
      });

      describe('no item passed', () => {
        beforeEach(() => {
          output = instance.highlightItem();
        });

        it('returns this', () => {
          expect(output).to.deep.equal(instance);
        });

        it('returns early', () => {
          expect(passedElementTriggerEventStub.called).to.equal(false);
          expect(storeDispatchSpy.called).to.equal(false);
          expect(storeGetGroupByIdStub.called).to.equal(false);
        });
      });

      describe('item passed', () => {
        describe('passing truthy second paremeter', () => {
          beforeEach(() => {
            output = instance.highlightItem(item, true);
          });

          it('returns this', () => {
            expect(output).to.deep.equal(instance);
          });

          it('dispatches highlightItem action with correct arguments', () => {
            expect(storeDispatchSpy.called).to.equal(true);
            expect(storeDispatchSpy.lastCall.args[0]).to.deep.equal({
              type: ActionType.HIGHLIGHT_ITEM,
              item,
              highlighted: true,
            });
          });
        });

        describe('item with no group', () => {
          beforeEach(() => {
            item.group = null;
            output = instance.highlightItem(item);
          });

          it('triggers event with null groupValue', () => {
            expect(passedElementTriggerEventStub.called).to.equal(true);
            expect(passedElementTriggerEventStub.lastCall.args[0]).to.equal(EventType.highlightItem);
            expect(passedElementTriggerEventStub.lastCall.args[1]).to.contains({
              id: item.id,
              value: item.value,
              label: item.label,
              groupValue: undefined,
            });
          });
        });

        describe('item with group', () => {
          beforeEach(() => {
            item.group = {
              active: true,
              choices: [],
              disabled: false,
              element: undefined,
              groupEl: undefined,
              id: 4321,
              label: groupIdValue,
            };
            output = instance.highlightItem(item);
          });

          it('triggers event with groupValue', () => {
            expect(passedElementTriggerEventStub.called).to.equal(true);
            expect(passedElementTriggerEventStub.lastCall.args[0]).to.equal(EventType.highlightItem);
            expect(passedElementTriggerEventStub.lastCall.args[1]).to.contains({
              id: item.id,
              value: item.value,
              label: item.label,
              groupValue: groupIdValue,
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
            expect(output).to.deep.equal(instance);
          });
        });
      });
    });

    describe('unhighlightItem', () => {
      let choicesStub;
      let itemsStub;
      let passedElementTriggerEventStub;
      let storeDispatchSpy;
      let storeGetGroupByIdStub;
      const groupIdValue = 'Test';
      const item: ChoiceFull = {
        group: null,
        highlighted: true,
        active: false,
        disabled: false,
        placeholder: false,
        selected: false,
        id: 1234,
        value: 'Test',
        label: 'Test',
        score: 0,
        rank: 0,
      };

      beforeEach(() => {
        choicesStub = stub(instance._store, 'choices').get(() => [item]);
        itemsStub = stub(instance._store, 'items').get(() => [item]);
        passedElementTriggerEventStub = stub();
        storeGetGroupByIdStub = stub().returns({
          id: 4321,
          label: groupIdValue,
        });
        storeDispatchSpy = spy(instance._store, 'dispatch');

        instance._store.getGroupById = storeGetGroupByIdStub;
        instance.passedElement.triggerEvent = passedElementTriggerEventStub;
      });

      afterEach(() => {
        choicesStub.reset();
        itemsStub.reset();
        storeDispatchSpy.restore();
        instance._store.getGroupById.reset();
        instance.passedElement.triggerEvent.reset();
      });

      describe('no item passed', () => {
        beforeEach(() => {
          output = instance.unhighlightItem();
        });

        it('returns this', () => {
          expect(output).to.deep.equal(instance);
        });

        it('returns early', () => {
          expect(passedElementTriggerEventStub.called).to.equal(false);
          expect(storeDispatchSpy.called).to.equal(false);
          expect(storeGetGroupByIdStub.called).to.equal(false);
        });
      });

      describe('item passed', () => {
        describe('passing truthy second paremeter', () => {
          beforeEach(() => {
            output = instance.unhighlightItem(item, true);
          });

          it('returns this', () => {
            expect(output).to.deep.equal(instance);
          });

          it('dispatches highlightItem action with correct arguments', () => {
            expect(storeDispatchSpy.called).to.equal(true);
            expect(storeDispatchSpy.lastCall.args[0]).to.deep.contains({
              type: ActionType.HIGHLIGHT_ITEM,
              item,
              highlighted: false,
            });
          });
        });

        describe('item without group', () => {
          beforeEach(() => {
            item.group = null;
            output = instance.unhighlightItem(item);
          });

          it('triggers event with null groupValue', () => {
            expect(passedElementTriggerEventStub.called).to.equal(true);
            expect(passedElementTriggerEventStub.lastCall.args[0]).to.equal(EventType.unhighlightItem);
            expect(passedElementTriggerEventStub.lastCall.args[1]).to.contains({
              value: item.value,
              label: item.label,
              groupValue: undefined,
            });
          });
        });

        describe('item with group', () => {
          beforeEach(() => {
            item.group = {
              active: true,
              choices: [],
              disabled: false,
              element: undefined,
              groupEl: undefined,
              id: 4321,
              label: groupIdValue,
            };
            output = instance.unhighlightItem(item);
          });

          it('triggers event with groupValue', () => {
            expect(passedElementTriggerEventStub.called).to.equal(true);
            expect(passedElementTriggerEventStub.lastCall.args[0]).to.equal(EventType.unhighlightItem);
            expect(passedElementTriggerEventStub.lastCall.args[1]).to.contains({
              value: item.value,
              label: item.label,
              groupValue: groupIdValue,
            });
          });
        });

        describe('passing falsey second paremeter', () => {
          beforeEach(() => {
            output = instance.unhighlightItem(item, false);
          });

          it("doesn't trigger event", () => {
            expect(passedElementTriggerEventStub.called).to.equal(false);
          });

          it('returns this', () => {
            expect(output).to.deep.equal(instance);
          });
        });
      });
    });

    describe('highlightAll', () => {
      let choicesStub;
      let itemsStub;
      let storeDispatchSpy;

      const items: ChoiceFull[] = [
        {
          id: 1,
          value: 'Test 1',
          highlighted: false,
          disabled: false,
          active: false,
          group: null,
          label: '',
          placeholder: false,
          selected: false,
          score: 0,
          rank: 0,
        },
        {
          id: 2,
          value: 'Test 2',
          highlighted: false,
          disabled: false,
          active: false,
          group: null,
          label: '',
          placeholder: false,
          selected: false,
          score: 0,
          rank: 0,
        },
      ];

      beforeEach(() => {
        choicesStub = stub(instance._store, 'choices').get(() => items);
        itemsStub = stub(instance._store, 'items').get(() => items);
        storeDispatchSpy = spy(instance._store, 'dispatch');

        output = instance.highlightAll();
      });

      afterEach(() => {
        storeDispatchSpy.restore();
        choicesStub.reset();
        itemsStub.reset();
      });

      it('returns this', () => {
        expect(output).to.deep.equal(instance);
      });

      it('highlights each item in store', () => {
        expect(storeDispatchSpy.callCount).to.equal(items.length);
        expect(storeDispatchSpy.firstCall.args[0]).to.deep.contains({
          type: ActionType.HIGHLIGHT_ITEM,
          item: items[0],
          highlighted: true,
        });
        expect(storeDispatchSpy.lastCall.args[0]).to.deep.contains({
          type: ActionType.HIGHLIGHT_ITEM,
          item: items[1],
          highlighted: true,
        });
      });
    });

    describe('unhighlightAll', () => {
      let choicesStub;
      let itemsStub;
      let storeDispatchSpy;

      const items: ChoiceFull[] = [
        {
          id: 1,
          value: 'Test 1',
          highlighted: true,
          disabled: false,
          active: false,
          group: null,
          label: '',
          placeholder: false,
          selected: false,
          score: 0,
          rank: 0,
        },
        {
          id: 2,
          value: 'Test 2',
          highlighted: true,
          disabled: false,
          active: false,
          group: null,
          label: '',
          placeholder: false,
          selected: false,
          score: 0,
          rank: 0,
        },
      ];

      beforeEach(() => {
        choicesStub = stub(instance._store, 'choices').get(() => items);
        itemsStub = stub(instance._store, 'items').get(() => items);
        storeDispatchSpy = spy(instance._store, 'dispatch');

        output = instance.unhighlightAll();
      });

      afterEach(() => {
        storeDispatchSpy.restore();
        choicesStub.reset();
        itemsStub.reset();
      });

      it('returns this', () => {
        expect(output).to.deep.equal(instance);
      });

      it('unhighlights each item in store', () => {
        expect(storeDispatchSpy.callCount).to.equal(items.length);
        expect(storeDispatchSpy.firstCall.args[0]).to.deep.contains({
          type: ActionType.HIGHLIGHT_ITEM,
          item: items[0],
          highlighted: false,
        });
        expect(storeDispatchSpy.lastCall.args[0]).to.deep.contains({
          type: ActionType.HIGHLIGHT_ITEM,
          item: items[1],
          highlighted: false,
        });
      });
    });

    describe('clearChoices', () => {
      let storeResetStub;

      beforeEach(() => {
        storeResetStub = stub();
        instance._store.reset = storeResetStub;

        output = instance.clearChoices();
      });

      afterEach(() => {
        instance._store.reset.reset();
      });

      it('returns this', () => {
        expect(output).to.deep.equal(instance);
      });

      it('dispatches clearChoices action', () => {
        expect(storeResetStub.callCount).to.be.eq(1);
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
        expect(output).to.deep.equal(instance);
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
          instance._isSearching = true;

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
          expect(storeDispatchStub.lastCall.args[0]).to.deep.equal({
            type: ActionType.ACTIVATE_CHOICES,
            active: true,
          });
        });
      });
    });

    describe('setChoices with callback/Promise', () => {
      describe('not initialised', () => {
        beforeEach(() => {
          instance.initialised = false;
          instance.initialisedOK = undefined;
        });

        it('should throw', () => {
          expect(() => instance.setChoices(null)).Throw(TypeError);
        });
      });

      describe('initialised twice', () => {
        it('throws', () => {
          instance.initialised = true;
          instance.initialisedOK = false;
          expect(() => instance.setChoices(null)).to.throw(
            TypeError,
            'setChoices called for an element which has multiple instances of Choices initialised on it',
          );
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
          expect(() => instance.setChoices(() => 'boo')).to.throw(TypeError, /promise/i);
        });
      });

      describe('select element', () => {
        it('fetches and sets choices', async () => {
          document.body.innerHTML = '<select id="test" />';
          const choice = new Choices('#test', { allowHTML: true });
          const handleLoadingStateSpy = spy(choice, '_handleLoadingState');

          let fetcherCalled = false;
          const fetcher = async (inst): Promise<InputChoice[]> => {
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
      let _addChoiceStub;
      const value1 = 'Value 1';
      const value2 = {
        value: 'Value 2',
      };
      const values = [value1, value2];

      beforeEach(() => {
        _addChoiceStub = stub();
        instance._addChoice = _addChoiceStub;
      });

      afterEach(() => {
        instance._addChoice.reset();
      });

      describe('not already initialised', () => {
        it('throws', () => {
          instance.initialised = false;
          instance.initialisedOK = undefined;
          expect(() => instance.setValue(values)).to.throw(
            TypeError,
            'setValue called on a non-initialised instance of Choices',
          );
        });
      });

      describe('initialised twice', () => {
        it('throws', () => {
          instance.initialised = true;
          instance.initialisedOK = false;
          expect(() => instance.setValue(values)).to.throw(
            TypeError,
            'setValue called for an element which has multiple instances of Choices initialised on it',
          );
        });
      });

      describe('when already initialised', () => {
        beforeEach(() => {
          instance.initialised = true;
          output = instance.setValue(values);
        });

        it('returns this', () => {
          expect(output).to.deep.equal(instance);
        });

        it('sets each value', () => {
          expect(_addChoiceStub.callCount).to.equal(2);
          expect(_addChoiceStub.firstCall.args[0]).to.be.a('object');
          expect(_addChoiceStub.secondCall.args[0]).to.be.a('object');
          expect(value1).to.equal(_addChoiceStub.firstCall.args[0].value);
          expect(value2.value).to.equal(_addChoiceStub.secondCall.args[0].value);
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
        it('throws', () => {
          instance.initialised = false;
          instance.initialisedOK = undefined;
          expect(() => instance.setChoiceByValue([])).to.throw(
            TypeError,
            'setChoiceByValue called on a non-initialised instance of Choices',
          );
        });
      });

      describe('initialised twice', () => {
        it('throws', () => {
          instance.initialised = true;
          instance.initialisedOK = false;
          expect(() => instance.setChoiceByValue([])).to.throw(
            TypeError,
            'setChoiceByValue called for an element which has multiple instances of Choices initialised on it',
          );
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
            expect(output).to.deep.equal(instance);
          });

          it('sets each choice with same value', () => {
            expect(findAndSelectChoiceByValueStub.called).to.equal(true);
            expect(findAndSelectChoiceByValueStub.firstCall.args[0]).to.equal(value);
          });
        });

        describe('passing an array of values', () => {
          const values = ['Value 1', 'Value 2'];

          beforeEach(() => {
            output = instance.setChoiceByValue(values);
          });

          it('returns this', () => {
            expect(output).to.deep.equal(instance);
          });

          it('sets each choice with same value', () => {
            expect(findAndSelectChoiceByValueStub.callCount).to.equal(2);
            expect(findAndSelectChoiceByValueStub.firstCall.args[0]).to.equal(values[0]);
            expect(findAndSelectChoiceByValueStub.secondCall.args[0]).to.equal(values[1]);
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
        activeItemsStub = stub(instance._store, 'items').get(() => items);
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
            expect(output).to.deep.equal(items.map((item) => item.value));
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
            expect(output).to.contain.keys(Object.keys(items[0]));
          });
        });

        describe('non select one input', () => {
          beforeEach(() => {
            instance._isSelectOneElement = false;
            output = instance.getValue(false);
          });

          it('returns all active items', () => {
            output.forEach((choice) => {
              expect(choice).to.contain.keys(Object.keys(items[0])).all;
            });
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
        activeItemsStub = stub(instance._store, 'items').get(() => items);
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
        activeItemsStub = stub(instance._store, 'items').get(() => items);
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

    describe('removeChoice', () => {
      let choicesStub;
      let itemsStub;
      let dispatchStub;
      let triggerEventStub;

      const items = [
        {
          id: 1,
          value: 'Test 1',
          selected: true,
        },
        {
          id: 2,
          value: 'Test 2',
          selected: false,
        },
      ];

      beforeEach(() => {
        choicesStub = stub(instance._store, 'choices').get(() => items);
        itemsStub = stub(instance._store, 'items').get(() => items);
        triggerEventStub = stub();
        dispatchStub = stub();

        instance._store.dispatch = dispatchStub;
        instance.passedElement.triggerEvent = triggerEventStub;
      });

      afterEach(() => {
        choicesStub.reset();
        itemsStub.reset();
        instance._store.dispatch.reset();
        instance.passedElement.triggerEvent.reset();
      });

      describe('remove a selected choice from the store', () => {
        beforeEach(() => {
          output = instance.removeChoice('Test 1');
        });

        it('returns this', () => {
          expect(output).to.deep.equal(instance);
        });

        it('removes an active item in store', () => {
          expect(instance._store.dispatch).callCount(1);
          expect(instance.passedElement.triggerEvent).callCount(1);
        });
      });

      describe('remove a non-selected choice from the store', () => {
        beforeEach(() => {
          output = instance.removeChoice('Test 2');
        });

        it('returns this', () => {
          expect(output).to.deep.equal(instance);
        });

        it('removes a choice in store', () => {
          expect(instance._store.dispatch).callCount(1);
          expect(instance.passedElement.triggerEvent).callCount(0);
        });
      });

      describe('remove an non-existent choice from the store', () => {
        beforeEach(() => {
          output = instance.removeChoice('xxxx');
        });

        it('returns this', () => {
          expect(output).to.deep.equal(instance);
        });

        it('removes no choices from store', () => {
          expect(instance._store.dispatch).callCount(0);
          expect(instance.passedElement.triggerEvent).callCount(0);
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
        highlightedActiveItemsStub = stub(instance._store, 'highlightedActiveItems').get(() => items);
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
          expect(output).to.deep.equal(instance);
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
          expect(output).to.deep.equal(instance);
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
      const choices: InputChoice[] = [
        {
          value: '1',
          label: 'Test 1',
          selected: false,
          disabled: false,
        },
        {
          value: '2',
          label: 'Test 2',
          selected: false,
          disabled: true,
        },
      ];
      const groups: InputGroup[] = [
        {
          ...choices[0],
          choices,
        },
        {
          ...choices[1],
          choices: [],
        },
      ];

      beforeEach(() => {
        clearChoicesStub = stub();
        addGroupStub = stub();
        addChoiceStub = stub();
        containerOuterRemoveLoadingStateStub = stub();

        instance.clearChoices = clearChoicesStub;
        instance._addGroup = addGroupStub;
        instance._addChoice = addChoiceStub;
        instance.containerOuter.removeLoadingState = containerOuterRemoveLoadingStateStub;
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
          expect(() => instance.setChoices(choices, value, label, false)).to.throw(TypeError, /input/i);
        });
      });

      describe('passing invalid arguments', () => {
        describe('passing no value', () => {
          beforeEach(() => {
            instance._isSelectElement = true;
          });

          it('throws', () => {
            expect(() => instance.setChoices(choices, null, 'label', false)).to.throw(TypeError, /value/i);
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
            expect(addGroupStub.callCount).to.equal(2);
            expect(addGroupStub.firstCall.args[0]).to.contain({
              label: groups[0].label,
            });
          });
        });

        const coerceBool = (arg: unknown, defaultValue: boolean = true) =>
          typeof arg === 'undefined' ? defaultValue : !!arg;

        describe('passing choices without children choices', () => {
          it('adds passed choices', () => {
            instance.setChoices(choices, value, label, false);
            expect(addChoiceStub.callCount).to.equal(2);
            addChoiceStub.getCalls().forEach((call, index) => {
              expect(call.args[0]).to.deep.contain({
                value: choices[index][value],
                label: choices[index][label],
                active: coerceBool(choices[index].active),
                selected: coerceBool(choices[index].selected, false),
                disabled: coerceBool(choices[index].disabled, false),
                customProperties: choices[index].customProperties,
                placeholder: coerceBool(choices[index].placeholder, false),
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
      const choices: InputChoice[] = [
        {
          value: '1',
          label: 'Test 1',
          selected: false,
          disabled: false,
        },
        {
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

      describe('fuse', () => {
        beforeEach(() => {
          process.env.CHOICES_SEARCH_FUSE = 'full';
          instance._searcher = new SearchByFuse(instance.config);
        });
        it('details are passed', () =>
          new Promise((done) => {
            const query = 'This is a <search> query & a "test" with characters that should not be sanitised.';

            instance.input.value = query;
            instance.input.focus();
            instance.passedElement.element.addEventListener(
              'search',
              (event) => {
                expect(event.detail).to.contains({
                  value: query,
                  resultCount: 0,
                });
                done(true);
              },
              { once: true },
            );

            instance._onKeyUp({ target: null, keyCode: null });
            instance._onInput({ target: null });
          }));

        it('uses Fuse options', () =>
          new Promise((done) => {
            instance.config.fuseOptions.isCaseSensitive = true;
            instance.config.fuseOptions.minMatchCharLength = 4;
            instance._searcher = new SearchByFuse(instance.config);

            instance.input.value = 'test';
            instance.input.focus();
            instance.passedElement.element.addEventListener(
              'search',
              (event) => {
                expect(event.detail.resultCount).to.eql(0);
                done(true);
              },
              { once: true },
            );

            instance._onKeyUp({ target: null, keyCode: null });
            instance._onInput({ target: null });
          }));

        it('is fired with a searchFloor of 0', () =>
          new Promise((done) => {
            instance.config.searchFloor = 0;
            instance.input.value = 'qwerty';
            instance.input.focus();
            instance.passedElement.element.addEventListener('search', (event) => {
              expect(event.detail).to.contains({
                value: instance.input.value,
                resultCount: 0,
              });
              done(true);
            });

            instance._onKeyUp({ target: null, keyCode: null });
            instance._onInput({ target: null });
          }));
      });

      describe('kmp', () => {
        beforeEach(() => {
          instance._searcher = new SearchByKMP(instance.config);
        });
        it('details are passed', () =>
          new Promise((done) => {
            const query = 'This is a <search> query & a "test" with characters that should not be sanitised.';

            instance.input.value = query;
            instance.input.focus();
            instance.passedElement.element.addEventListener(
              'search',
              (event) => {
                expect(event.detail).to.contains({
                  value: query,
                  resultCount: 0,
                });
                done(true);
              },
              { once: true },
            );

            instance._onKeyUp({ target: null, keyCode: null });
            instance._onInput({ target: null });
          }));

        it('is fired with a searchFloor of 0', () =>
          new Promise((done) => {
            instance.config.searchFloor = 0;
            instance.input.value = 'qwerty';
            instance.input.focus();
            instance.passedElement.element.addEventListener('search', (event) => {
              expect(event.detail).to.contains({
                value: instance.input.value,
                resultCount: 0,
              });
              done(true);
            });

            instance._onKeyUp({ target: null, keyCode: null });
            instance._onInput({ target: null });
          }));
      });

      describe('prefix-filter', () => {
        beforeEach(() => {
          instance._searcher = new SearchByPrefixFilter(instance.config);
        });
        it('details are passed', () =>
          new Promise((done) => {
            const query = 'This is a <search> query & a "test" with characters that should not be sanitised.';

            instance.input.value = query;
            instance.input.focus();
            instance.passedElement.element.addEventListener(
              'search',
              (event) => {
                expect(event.detail).to.contains({
                  value: query,
                  resultCount: 0,
                });
                done(true);
              },
              { once: true },
            );

            instance._onKeyUp({ target: null, keyCode: null });
            instance._onInput({ target: null });
          }));

        it('is fired with a searchFloor of 0', () =>
          new Promise((done) => {
            instance.config.searchFloor = 0;
            instance.input.value = 'qwerty';
            instance.input.focus();
            instance.passedElement.element.addEventListener('search', (event) => {
              expect(event.detail).to.contains({
                value: instance.input.value,
                resultCount: 0,
              });
              done(true);
            });

            instance._onKeyUp({ target: null, keyCode: null });
            instance._onInput({ target: null });
          }));
      });
    });
  });

  describe('private methods', () => {
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
              instance._hasNonChoicePlaceholder = true;

              const value = instance._generatePlaceholderValue();
              expect(value).to.equal(placeholderValue);
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

    describe('_onKeyDown', () => {
      let items;
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

        ({ items } = instance._store);
        hasItems = instance.itemList.element.hasChildNodes();
        hasActiveDropdown = instance.dropdown.isActive;
        hasFocussedInput = instance.input.isFocussed;
      });

      describe('direction key', () => {
        const keyCodes = [
          [KeyCodeMap.UP_KEY, 'ArrowUp'],
          [KeyCodeMap.DOWN_KEY, 'ArrowDown'],
          [KeyCodeMap.PAGE_UP_KEY, 'PageUp'],
          [KeyCodeMap.PAGE_DOWN_KEY, 'PageDown'],
        ];

        keyCodes.forEach(([keyCode, key]) => {
          it(`calls _onDirectionKey with the expected arguments`, () => {
            const event = {
              keyCode,
              key,
            };

            instance._onKeyDown(event);

            expect(instance._onDirectionKey).to.have.been.calledWith(event, hasActiveDropdown);
          });
        });
      });

      describe('select key', () => {
        it(`calls _onSelectKey with the expected arguments`, () => {
          const event = {
            keyCode: KeyCodeMap.A_KEY,
            key: 'A',
          };

          instance._onKeyDown(event);

          expect(instance._onSelectKey).to.have.been.calledWith(event, hasItems);
        });
      });

      describe('enter key', () => {
        it(`calls _onEnterKey with the expected arguments`, () => {
          const event = {
            keyCode: KeyCodeMap.ENTER_KEY,
            key: 'Enter',
          };

          instance._onKeyDown(event);

          expect(instance._onEnterKey).to.have.been.calledWith(event, hasActiveDropdown);
        });
      });

      describe('delete key', () => {
        // this is not an error; the constants are named the reverse of their assigned key names, according
        // to their actual values, which appear to conform to the Windows VK mappings:
        // 0x08 = 'Backspace', 0x2E = 'Delete'
        // https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#editing_keys
        const keyCodes = [
          [KeyCodeMap.DELETE_KEY, 'Backspace'],
          [KeyCodeMap.BACK_KEY, 'Delete'],
        ];

        keyCodes.forEach(([keyCode, key]) => {
          it(`calls _onDeleteKey with the expected arguments`, () => {
            const event = {
              keyCode,
              key,
            };

            instance._onKeyDown(event);

            expect(instance._onDeleteKey).to.have.been.calledWith(event, items, hasFocussedInput);
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
        const item: ChoiceFull = {
          highlighted: false,
          active: false,
          disabled: false,
          placeholder: false,
          selected: false,
          id: 1111,
          value: 'test value',
          label: 'test label',
          group: null,
          customProperties: {},
          score: 0,
          rank: 0,
        };

        it('dispatches a REMOVE_ITEM action to the store', () => {
          instance._removeItem(item);

          expect(instance._store.dispatch).to.have.been.calledWith(removeItem(item));
        });

        it('triggers a REMOVE_ITEM event on the passed element', () =>
          new Promise((done) => {
            passedElement.addEventListener(
              'removeItem',
              (event) => {
                expect(event.detail).to.contains({
                  id: item.id,
                  value: item.value,
                  label: item.label,
                  customProperties: item.customProperties,
                  groupValue: undefined,
                });
                done(true);
              },
              false,
            );

            instance._removeItem(item);
          }));

        describe('when the item belongs to a group', () => {
          const group = {
            id: 1,
            label: 'testing',
          };
          const itemWithGroup = {
            ...item,
            value: 'testing',
            group,
          };

          beforeEach(() => {
            instance._store.getGroupById = stub();
            instance._store.getGroupById.returns(group);
          });

          afterEach(() => {
            instance._store.getGroupById.reset();
          });

          it("includes the group's value in the triggered event", () =>
            new Promise((done) => {
              passedElement.addEventListener(
                'removeItem',
                (event) => {
                  expect(event.detail).to.contains({
                    id: itemWithGroup.id,
                    value: itemWithGroup.value,
                    label: itemWithGroup.label,
                    customProperties: itemWithGroup.customProperties,
                    groupValue: group.label,
                  });

                  done(true);
                },
                false,
              );

              instance._removeItem(itemWithGroup);
            }));
        });
      });
    });
  });
});
