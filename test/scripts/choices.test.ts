import { expect, Mock, vi } from 'vitest';
import Choices, {
  DEFAULT_CONFIG,
  ActionType,
  EventType,
  KeyCodeMap,
  InputChoice,
  InputGroup,
  Options,
} from '../../src';
import { WrappedSelect, WrappedInput, Dropdown, Input } from '../../src/scripts/components/index';
import { removeItem } from '../../src/scripts/actions/items';
import templates from '../../src/scripts/templates';
import { ChoiceFull } from '../../src/scripts/interfaces/choice-full';
import { SearchByFuse } from '../../src/scripts/search/fuse';
import { SearchByKMP } from '../../src/scripts/search/kmp';
import { SearchByPrefixFilter } from '../../src/scripts/search/prefix-filter';
import { AnyAction, StoreListener } from '../../src/scripts/interfaces/store';
import Store from '../../src/scripts/store/store';
import { GroupFull } from '../../src/scripts/interfaces/group-full';
import { mapInputToChoice } from '../../src/scripts/lib/choice-input';

describe('choices', () => {
  let instance: Choices;
  let output: any;
  let passedElement: HTMLInputElement;

  beforeEach(() => {
    passedElement = document.createElement('input');
    passedElement.type = 'text';
    passedElement.className = 'js-choices';
    document.body.appendChild(passedElement);

    instance = new Choices(passedElement, { allowHTML: true });
  });

  afterEach(() => {
    output = null;
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
            searchRenderSelectedChoices: true,
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
            searchRenderSelectedChoices: true,
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

              expect(instance.config.searchEnabled).to.equal(false);
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

        describe('passing the searchRenderSelectedChoices config option with false', () => {
          it('keeps searchRenderSelectedChoices as false', () => {
            document.body.innerHTML = `
            <select data-choice multiple></select>
            `;

            instance = new Choices('[data-choice]', {
              allowHTML: true,
              searchRenderSelectedChoices: false,
            });

            expect(instance.config.searchRenderSelectedChoices).to.equal(false);
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
          const initSpy = vi.fn();
          // initialise with the same element
          instance = new Choices('#input-1', {
            allowHTML: true,
            silent: true,
            callbackOnInit: initSpy,
          });

          expect(initSpy).toHaveBeenCalled();
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
          const initSpy = vi.fn();
          // initialise with the same element
          instance = new Choices('#input-1', {
            allowHTML: true,
            silent: true,
            callbackOnInit: initSpy,
          });

          expect(initSpy).not.toHaveBeenCalled();
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
      const callbackOnInitSpy = vi.fn();

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

        it('do not set initialise flag', () => {
          expect(instance.initialised).to.not.equal(false);
        });
      });

      describe('not already initialised', () => {
        let createTemplatesSpy: Mock<() => void>;
        let createInputSpy: Mock<() => void>;
        let storeSubscribeSpy: Mock<(onChange: StoreListener) => Store<Options>>;
        let renderSpy: Mock<() => void>;
        let addEventListenersSpy: Mock<() => void>;

        beforeEach(() => {
          createTemplatesSpy = vi.spyOn(instance, '_createTemplates');
          createInputSpy = vi.spyOn(instance, '_createStructure');
          storeSubscribeSpy = vi.spyOn(instance._store, 'subscribe');
          renderSpy = vi.spyOn(instance, '_render');
          addEventListenersSpy = vi.spyOn(instance, '_addEventListeners');

          instance.initialised = false;
          instance.initialisedOK = undefined;
          instance.init();
        });

        afterEach(() => {
          vi.restoreAllMocks();
        });

        it('sets initialise flag', () => {
          expect(instance.initialised).to.equal(true);
        });

        it('creates templates', () => {
          expect(createTemplatesSpy).toHaveBeenCalled();
        });

        it('creates input', () => {
          expect(createInputSpy).toHaveBeenCalled();
        });

        it('subscribes to store with render method', () => {
          expect(storeSubscribeSpy).toHaveBeenCalled();
          expect(storeSubscribeSpy).lastCalledWith(instance._render);
        });

        it('fire initial render with no items or choices', () => {
          expect(renderSpy).toHaveBeenCalled();
        });

        it('adds event listeners', () => {
          expect(addEventListenersSpy).toHaveBeenCalled();
        });

        it('fires callback', () => {
          expect(callbackOnInitSpy).toHaveBeenCalled();
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

        it('do not set initialise flag', () => {
          expect(instance.initialised).to.not.equal(true);
        });
      });

      describe('when already initialised', () => {
        let removeEventListenersSpy: Mock<() => void>;
        let passedElementRevealSpy: Mock<() => void>;
        let containerOuterUnwrapSpy: Mock<(element: HTMLElement) => void>;
        let clearStoreSpy: Mock<(clearOptions?: boolean) => Choices>;

        beforeEach(() => {
          removeEventListenersSpy = vi.spyOn(instance, '_removeEventListeners');
          passedElementRevealSpy = vi.spyOn(instance.passedElement, 'reveal');
          containerOuterUnwrapSpy = vi.spyOn(instance.containerOuter, 'unwrap');
          clearStoreSpy = vi.spyOn(instance, 'clearStore');

          instance.initialised = true;
          instance.destroy();
        });

        afterEach(() => {
          vi.restoreAllMocks();
        });

        it('removes event listeners', () => {
          expect(removeEventListenersSpy).toHaveBeenCalled();
        });

        it('reveals passed element', () => {
          expect(passedElementRevealSpy).toHaveBeenCalled();
        });

        it('reverts outer container', () => {
          expect(containerOuterUnwrapSpy).toHaveBeenCalled();
          expect(containerOuterUnwrapSpy).lastCalledWith(instance.passedElement.element);
        });

        it('clears store', () => {
          expect(clearStoreSpy).toHaveBeenCalled();
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
      let passedElementEnableSpy: Mock<() => void>;
      let addEventListenersSpy: Mock<() => void>;
      let containerOuterEnableSpy: Mock<() => void>;
      let inputEnableSpy: Mock<() => void>;

      beforeEach(() => {
        addEventListenersSpy = vi.spyOn(instance, '_addEventListeners');
        passedElementEnableSpy = vi.spyOn(instance.passedElement, 'enable');
        containerOuterEnableSpy = vi.spyOn(instance.containerOuter, 'enable');
        inputEnableSpy = vi.spyOn(instance.input, 'enable');
      });

      afterEach(() => {
        vi.restoreAllMocks();
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
          expect(passedElementEnableSpy).not.toHaveBeenCalled();
          expect(addEventListenersSpy).not.toHaveBeenCalled();
          expect(inputEnableSpy).not.toHaveBeenCalled();
          expect(containerOuterEnableSpy).not.toHaveBeenCalled();
        });
      });

      describe('when not already enabled', () => {
        beforeEach(() => {
          instance.passedElement.isDisabled = true;
          instance.containerOuter.isDisabled = true;
          instance.enable();
        });

        it('adds event listeners', () => {
          expect(addEventListenersSpy).toHaveBeenCalled();
        });

        it('enables input', () => {
          expect(inputEnableSpy).toHaveBeenCalled();
        });

        it('enables containerOuter', () => {
          expect(containerOuterEnableSpy).toHaveBeenCalled();
        });
      });
    });

    describe('disable', () => {
      let removeEventListenersSpy: Mock<() => void>;
      let passedElementDisableSpy: Mock<() => void>;
      let containerOuterDisableSpy: Mock<() => void>;
      let inputDisableSpy: Mock<() => void>;

      beforeEach(() => {
        removeEventListenersSpy = vi.spyOn(instance, '_removeEventListeners');
        passedElementDisableSpy = vi.spyOn(instance.passedElement, 'disable');
        containerOuterDisableSpy = vi.spyOn(instance.containerOuter, 'disable');
        inputDisableSpy = vi.spyOn(instance.input, 'disable');
      });

      afterEach(() => {
        vi.restoreAllMocks();
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
          expect(removeEventListenersSpy).not.toHaveBeenCalled();
          expect(passedElementDisableSpy).not.toHaveBeenCalled();
          expect(containerOuterDisableSpy).not.toHaveBeenCalled();
          expect(inputDisableSpy).not.toHaveBeenCalled();
        });
      });

      describe('when not already disabled', () => {
        beforeEach(() => {
          instance.passedElement.isDisabled = false;
          instance.containerOuter.isDisabled = false;
          output = instance.disable();
        });

        it('removes event listeners', () => {
          expect(removeEventListenersSpy).toHaveBeenCalled();
        });

        it('disables input', () => {
          expect(inputDisableSpy).toHaveBeenCalled();
        });

        it('enables containerOuter', () => {
          expect(containerOuterDisableSpy).toHaveBeenCalled();
        });
      });
    });

    describe('showDropdown', () => {
      let containerOuterOpenSpy: Mock<(dropdownPos: number, dropdownHeight: number) => void>;
      let dropdownShowSpy: Mock<() => Dropdown>;
      let inputFocusSpy: Mock<() => void>;
      let passedElementTriggerEventStub: Mock;

      beforeEach(() => {
        containerOuterOpenSpy = vi.spyOn(instance.containerOuter, 'open');
        dropdownShowSpy = vi.spyOn(instance.dropdown, 'show');
        inputFocusSpy = vi.spyOn(instance.input, 'focus');
        passedElementTriggerEventStub = vi.fn();

        instance.passedElement.triggerEvent = passedElementTriggerEventStub;
      });

      afterEach(() => {
        vi.restoreAllMocks();
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
          expect(containerOuterOpenSpy).not.toHaveBeenCalled();
          expect(dropdownShowSpy).not.toHaveBeenCalled();
          expect(inputFocusSpy).not.toHaveBeenCalled();
          expect(passedElementTriggerEventStub).not.toHaveBeenCalled();
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

        it('focuses input synchronously when input focus is allowed', () => {
          instance.dropdown.isActive = false;
          instance.showDropdown(false);

          expect(inputFocusSpy).toHaveBeenCalledOnce();
        });

        it('opens containerOuter', () =>
          new Promise((done) => {
            requestAnimationFrame(() => {
              expect(containerOuterOpenSpy).toHaveBeenCalled();
              done(true);
            });
          }));

        it('shows dropdown with blurInput flag', () =>
          new Promise((done) => {
            requestAnimationFrame(() => {
              expect(dropdownShowSpy).toHaveBeenCalled();
              done(true);
            });
          }));

        it('triggers event on passedElement', () =>
          new Promise((done) => {
            requestAnimationFrame(() => {
              expect(passedElementTriggerEventStub).toHaveBeenCalled();
              expect(passedElementTriggerEventStub).lastCalledWith(EventType.showDropdown);
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
                expect(inputFocusSpy).not.toHaveBeenCalled();
                done(true);
              });
            }));
        });
      });
    });

    describe('hideDropdown', () => {
      let containerOuterCloseSpy: Mock<() => void>;
      let dropdownHideSpy: Mock<() => Dropdown>;
      let inputBlurSpy: Mock<() => void>;
      let inputRemoveActiveDescendantSpy: Mock<() => void>;
      let passedElementTriggerEventStub: Mock;

      beforeEach(() => {
        containerOuterCloseSpy = vi.spyOn(instance.containerOuter, 'close');
        dropdownHideSpy = vi.spyOn(instance.dropdown, 'hide');
        inputBlurSpy = vi.spyOn(instance.input, 'blur');
        inputRemoveActiveDescendantSpy = vi.spyOn(instance.input, 'removeActiveDescendant');
        passedElementTriggerEventStub = vi.fn();

        instance.passedElement.triggerEvent = passedElementTriggerEventStub;
      });

      afterEach(() => {
        vi.restoreAllMocks();
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
          expect(containerOuterCloseSpy).not.toHaveBeenCalled();
          expect(dropdownHideSpy).not.toHaveBeenCalled();
          expect(inputBlurSpy).not.toHaveBeenCalled();
          expect(passedElementTriggerEventStub).not.toHaveBeenCalled();
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
              expect(containerOuterCloseSpy).toHaveBeenCalled();
              done(true);
            });
          }));

        it('hides dropdown with blurInput flag', () =>
          new Promise((done) => {
            requestAnimationFrame(() => {
              expect(dropdownHideSpy).toHaveBeenCalled();
              done(true);
            });
          }));

        it('triggers event on passedElement', () =>
          new Promise((done) => {
            requestAnimationFrame(() => {
              expect(passedElementTriggerEventStub).toHaveBeenCalled();
              expect(passedElementTriggerEventStub).lastCalledWith(EventType.hideDropdown);
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
                expect(inputRemoveActiveDescendantSpy).toHaveBeenCalled();
                done(true);
              });
            }));

          it('blurs input', () =>
            new Promise((done) => {
              requestAnimationFrame(() => {
                expect(inputBlurSpy).toHaveBeenCalled();
                done(true);
              });
            }));
        });
      });
    });

    describe('highlightItem', () => {
      let passedElementTriggerEventStub: Mock;
      let storeDispatchSpy: Mock<(action: AnyAction) => void>;
      let storeGetGroupByIdStub: Mock;
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
        vi.spyOn(instance._store, 'choices', 'get').mockImplementation(() => [item]);
        vi.spyOn(instance._store, 'items', 'get').mockImplementation(() => [item]);
        passedElementTriggerEventStub = vi.fn();
        storeGetGroupByIdStub = vi.fn().mockImplementation(() => {
          return {
            id: 4321,
            label: groupIdValue,
          };
        });
        storeDispatchSpy = vi.spyOn(instance._store, 'dispatch');

        instance._store.getGroupById = storeGetGroupByIdStub;
        instance.passedElement.triggerEvent = passedElementTriggerEventStub;
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      describe('no item passed', () => {
        beforeEach(() => {
          output = instance.highlightItem(null);
        });

        it('returns this', () => {
          expect(output).to.deep.equal(instance);
        });

        it('returns early', () => {
          expect(passedElementTriggerEventStub).not.toHaveBeenCalled();
          expect(storeDispatchSpy).not.toHaveBeenCalled();
          expect(storeGetGroupByIdStub).not.toHaveBeenCalled();
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
            expect(storeDispatchSpy).toHaveBeenCalled();
            expect(storeDispatchSpy).lastCalledWith({
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
            expect(passedElementTriggerEventStub).toHaveBeenCalled();
            expect(passedElementTriggerEventStub).lastCalledWith(EventType.highlightItem, {
              active: false,
              customProperties: undefined,
              disabled: false,
              element: undefined,
              groupValue: undefined,
              highlighted: false,
              id: 1234,
              keyCode: undefined,
              label: 'Test',
              labelClass: undefined,
              labelDescription: '',
              placeholder: false,
              value: 'Test',
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
            expect(passedElementTriggerEventStub).toHaveBeenCalled();
            expect(passedElementTriggerEventStub).lastCalledWith(EventType.highlightItem, {
              active: false,
              customProperties: undefined,
              disabled: false,
              element: undefined,
              groupValue: 'Test',
              highlighted: false,
              id: 1234,
              keyCode: undefined,
              label: 'Test',
              labelClass: undefined,
              labelDescription: '',
              placeholder: false,
              value: 'Test',
            });
          });
        });

        describe('passing falsey second paremeter', () => {
          beforeEach(() => {
            output = instance.highlightItem(item, false);
          });

          it('do not trigger event', () => {
            expect(passedElementTriggerEventStub).not.toHaveBeenCalled();
          });

          it('returns this', () => {
            expect(output).to.deep.equal(instance);
          });
        });
      });
    });

    describe('unhighlightItem', () => {
      let passedElementTriggerEventStub: Mock;
      let storeDispatchSpy: Mock<(action: AnyAction) => void>;
      let storeGetGroupByIdStub: (id: number) => GroupFull | undefined;
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
        vi.spyOn(instance._store, 'choices', 'get').mockImplementation(() => [item]);
        vi.spyOn(instance._store, 'items', 'get').mockImplementation(() => [item]);
        passedElementTriggerEventStub = vi.fn();
        storeGetGroupByIdStub = vi.fn().mockImplementation(() => {
          return {
            id: 4321,
            label: groupIdValue,
          };
        });
        storeDispatchSpy = vi.spyOn(instance._store, 'dispatch');

        instance._store.getGroupById = storeGetGroupByIdStub;
        instance.passedElement.triggerEvent = passedElementTriggerEventStub;
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      describe('no item passed', () => {
        beforeEach(() => {
          output = instance.unhighlightItem(null);
        });

        it('returns this', () => {
          expect(output).to.deep.equal(instance);
        });

        it('returns early', () => {
          expect(passedElementTriggerEventStub).not.toHaveBeenCalled();
          expect(storeDispatchSpy).not.toHaveBeenCalled();
          expect(storeGetGroupByIdStub).not.toHaveBeenCalled();
        });
      });

      describe('item passed', () => {
        describe('passing truthy second parameter', () => {
          beforeEach(() => {
            output = instance.unhighlightItem(item, true);
          });

          it('returns this', () => {
            expect(output).to.deep.equal(instance);
          });

          it('dispatches highlightItem action with correct arguments', () => {
            expect(storeDispatchSpy).toHaveBeenCalled();
            expect(storeDispatchSpy).lastCalledWith({
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
            expect(passedElementTriggerEventStub).toHaveBeenCalled();
            expect(passedElementTriggerEventStub).lastCalledWith(EventType.unhighlightItem, {
              active: false,
              customProperties: undefined,
              disabled: false,
              element: undefined,
              groupValue: undefined,
              highlighted: true,
              id: 1234,
              keyCode: undefined,
              label: 'Test',
              labelClass: undefined,
              labelDescription: '',
              placeholder: false,
              value: 'Test',
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
            expect(passedElementTriggerEventStub).toHaveBeenCalled();
            expect(passedElementTriggerEventStub).lastCalledWith(EventType.unhighlightItem, {
              active: false,
              customProperties: undefined,
              disabled: false,
              element: undefined,
              groupValue: 'Test',
              highlighted: true,
              id: 1234,
              keyCode: undefined,
              label: 'Test',
              labelClass: undefined,
              labelDescription: '',
              placeholder: false,
              value: 'Test',
            });
          });
        });

        describe('passing falsey second paremeter', () => {
          beforeEach(() => {
            output = instance.unhighlightItem(item, false);
          });

          it('do not trigger event', () => {
            expect(passedElementTriggerEventStub).not.toHaveBeenCalled();
          });

          it('returns this', () => {
            expect(output).to.deep.equal(instance);
          });
        });
      });
    });

    describe('highlightAll', () => {
      let storeDispatchSpy: Mock<(action: AnyAction) => void>;

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
        vi.spyOn(instance._store, 'choices', 'get').mockImplementation(() => items);
        vi.spyOn(instance._store, 'items', 'get').mockImplementation(() => items);
        storeDispatchSpy = vi.spyOn(instance._store, 'dispatch');

        output = instance.highlightAll();
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      it('returns this', () => {
        expect(output).to.deep.equal(instance);
      });

      it('highlights each item in store', () => {
        expect(storeDispatchSpy).callCount(items.length);
        expect(storeDispatchSpy).toHaveBeenNthCalledWith(1, {
          type: ActionType.HIGHLIGHT_ITEM,
          item: items[0],
          highlighted: true,
        });
        expect(storeDispatchSpy).lastCalledWith({
          type: ActionType.HIGHLIGHT_ITEM,
          item: items[1],
          highlighted: true,
        });
      });
    });

    describe('unhighlightAll', () => {
      let storeDispatchSpy: Mock<(action: AnyAction) => void>;

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
        vi.spyOn(instance._store, 'choices', 'get').mockImplementation(() => items);
        vi.spyOn(instance._store, 'items', 'get').mockImplementation(() => items);
        storeDispatchSpy = vi.spyOn(instance._store, 'dispatch');

        output = instance.unhighlightAll();
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      it('returns this', () => {
        expect(output).to.deep.equal(instance);
      });

      it('unhighlights each item in store', () => {
        expect(storeDispatchSpy).callCount(items.length);
        expect(storeDispatchSpy).toHaveBeenNthCalledWith(1, {
          type: ActionType.HIGHLIGHT_ITEM,
          item: items[0],
          highlighted: false,
        });
        expect(storeDispatchSpy).lastCalledWith({
          type: ActionType.HIGHLIGHT_ITEM,
          item: items[1],
          highlighted: false,
        });
      });
    });

    describe('clearChoices', () => {
      let storeResetStub: Mock;

      beforeEach(() => {
        storeResetStub = vi.fn();
        instance._store.reset = storeResetStub;

        output = instance.clearChoices();
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      it('returns this', () => {
        expect(output).to.deep.equal(instance);
      });

      it('dispatches clearChoices action', () => {
        expect(storeResetStub).callCount(1);
      });
    });

    describe('clearInput', () => {
      let inputClearSpy: Mock<(setWidth?: boolean) => Input>;
      let storeDispatchStub: Mock;

      beforeEach(() => {
        inputClearSpy = vi.spyOn(instance.input, 'clear');
        storeDispatchStub = vi.fn();
        instance._store.dispatch = storeDispatchStub;
        output = instance.clearInput();
      });

      afterEach(() => {
        vi.restoreAllMocks();
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
          expect(inputClearSpy).toHaveBeenCalled();
          expect(inputClearSpy).lastCalledWith(true);
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
          expect(inputClearSpy).toHaveBeenCalled();
          expect(inputClearSpy).lastCalledWith(false);
        });

        it('resets search flag', () => {
          expect(instance._isSearching).to.equal(false);
        });

        it('dispatches activateChoices action', () => {
          expect(storeDispatchStub).toHaveBeenCalled();
          expect(storeDispatchStub).lastCalledWith({
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
          // @ts-expect-error expect type error
          expect(() => instance.setChoices(null)).Throw(TypeError);
        });
      });

      describe('initialised twice', () => {
        it('throws', () => {
          instance.initialised = true;
          instance.initialisedOK = false;
          // @ts-expect-error expect type error
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
          // @ts-expect-error expect type error
          expect(() => instance.setChoices(null)).Throw(TypeError);
        });
      });

      describe('passing invalid function', () => {
        beforeEach(() => {
          instance._isSelectElement = true;
        });

        it('should throw on non function', () => {
          // @ts-expect-error expect type error
          expect(() => instance.setChoices(null)).Throw(TypeError, /Promise/i);
        });

        it(`should throw on function that doesn't return promise`, () => {
          // @ts-expect-error expect type error
          expect(() => instance.setChoices(() => 'boo')).to.throw(TypeError, /promise/i);
        });
      });

      describe('select element', () => {
        it('fetches and sets choices', async () => {
          document.body.innerHTML = '<select id="test" />';
          const choice = new Choices('#test', { allowHTML: true });
          const handleLoadingStateSpy = vi.spyOn(choice, '_handleLoadingState');

          let fetcherCalled = false;
          const fetcher = async (inst: any): Promise<InputChoice[]> => {
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
          expect(fetcherCalled).toBe(true);
          const res = await promise;
          expect(res).to.equal(choice);
          expect(handleLoadingStateSpy).callCount(2);
          expect(choice._store.choices[1].value).to.equal('v2');
          expect(choice._store.choices[1].label).to.equal('l2');
          expect(choice._store.choices[1].customProperties).to.deep.equal({
            prop2: false,
          });
        });
      });
    });

    describe('setValue', () => {
      let _addChoiceStub: Mock;
      const value1 = 'Value 1';
      const value2 = {
        value: 'Value 2',
      };
      const values = [value1, value2];

      beforeEach(() => {
        _addChoiceStub = vi.fn();
        instance._addChoice = _addChoiceStub;
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      describe('not already initialised', () => {
        it('throws', () => {
          instance.initialised = false;
          instance.initialisedOK = undefined;
          expect(() => instance.setValue(values as ChoiceFull[])).to.throw(
            TypeError,
            'setValue called on a non-initialised instance of Choices',
          );
        });
      });

      describe('initialised twice', () => {
        it('throws', () => {
          instance.initialised = true;
          instance.initialisedOK = false;
          expect(() => instance.setValue(values as ChoiceFull[])).to.throw(
            TypeError,
            'setValue called for an element which has multiple instances of Choices initialised on it',
          );
        });
      });

      describe('when already initialised', () => {
        beforeEach(() => {
          instance.initialised = true;
          output = instance.setValue(values as ChoiceFull[]);
        });

        it('returns this', () => {
          expect(output).to.deep.equal(instance);
        });

        it('sets each value', () => {
          expect(_addChoiceStub).callCount(2);
          expect(_addChoiceStub).toHaveBeenNthCalledWith(1, mapInputToChoice(value1, false));
          expect(_addChoiceStub).toHaveBeenNthCalledWith(2, mapInputToChoice(value2 as ChoiceFull, false));
        });
      });
    });

    describe('setChoiceByValue', () => {
      let findAndSelectChoiceByValueStub: Mock;

      beforeEach(() => {
        findAndSelectChoiceByValueStub = vi.fn();
        instance._findAndSelectChoiceByValue = findAndSelectChoiceByValueStub;
      });

      afterEach(() => {
        vi.restoreAllMocks();
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
            expect(findAndSelectChoiceByValueStub).toHaveBeenCalled();
            expect(findAndSelectChoiceByValueStub).toHaveBeenNthCalledWith(1, value);
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
            expect(findAndSelectChoiceByValueStub).callCount(2);
            expect(findAndSelectChoiceByValueStub).toHaveBeenNthCalledWith(1, values[0]);
            expect(findAndSelectChoiceByValueStub).toHaveBeenNthCalledWith(2, values[1]);
          });
        });
      });
    });

    describe('getValue', () => {
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
        vi.spyOn(instance._store, 'items', 'get').mockImplementation(() => items as unknown as ChoiceFull[]);
      });

      afterEach(() => {
        vi.restoreAllMocks();
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
            output.forEach((choice: object) => {
              expect(choice).to.contain.keys(Object.keys(items[0])).all;
            });
          });
        });
      });
    });

    describe('removeActiveItemsByValue', () => {
      let removeItemStub: Mock;
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
        removeItemStub = vi.fn();
        vi.spyOn(instance._store, 'items', 'get').mockImplementation(() => items as unknown as ChoiceFull[]);
        instance._removeItem = removeItemStub;

        output = instance.removeActiveItemsByValue(value);
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      it('removes each active item in store with matching value', () => {
        expect(removeItemStub).callCount(2);
        expect(removeItemStub).toHaveBeenNthCalledWith(1, items[1]);
        expect(removeItemStub).toHaveBeenNthCalledWith(2, items[2]);
      });
    });

    describe('removeActiveItems', () => {
      let removeItemStub: Mock;
      const items = [
        {
          id: 1,
          value: 'Not removed',
        },
        {
          id: 2,
          value: 'Removed',
        },
        {
          id: 3,
          value: 'Removed',
        },
      ];

      beforeEach(() => {
        removeItemStub = vi.fn();
        vi.spyOn(instance._store, 'items', 'get').mockImplementation(() => items as unknown as ChoiceFull[]);
        instance._removeItem = removeItemStub;
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      describe('not passing id to exclude', () => {
        beforeEach(() => {
          output = instance.removeActiveItems();
        });

        it('removes all active items in store', () => {
          expect(removeItemStub).callCount(items.length);
          expect(removeItemStub).toHaveBeenNthCalledWith(1, items[0]);
          expect(removeItemStub).toHaveBeenNthCalledWith(2, items[1]);
          expect(removeItemStub).toHaveBeenNthCalledWith(3, items[2]);
        });
      });

      describe('passing id to exclude', () => {
        const idToExclude = 2;

        beforeEach(() => {
          output = instance.removeActiveItems(idToExclude);
        });

        it('removes all active items in store with id that does match excludedId', () => {
          expect(removeItemStub).callCount(2);
          expect(removeItemStub).toHaveBeenNthCalledWith(1, items[0]);
          expect(removeItemStub).toHaveBeenNthCalledWith(2, items[2]);
        });
      });
    });

    describe('removeChoice', () => {
      let dispatchStub: Mock;
      let triggerEventStub: Mock;

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
        vi.spyOn(instance._store, 'choices', 'get').mockImplementation(() => items as ChoiceFull[]);
        vi.spyOn(instance._store, 'items', 'get').mockImplementation(() => items as ChoiceFull[]);
        triggerEventStub = vi.fn();
        dispatchStub = vi.fn();

        instance._store.dispatch = dispatchStub;
        instance.passedElement.triggerEvent = triggerEventStub;
      });

      afterEach(() => {
        vi.restoreAllMocks();
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
      let removeItemStub: Mock;
      let triggerChangeStub: Mock;

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
        vi.spyOn(instance._store, 'highlightedActiveItems', 'get').mockImplementation(
          () => items as unknown as ChoiceFull[],
        );
        removeItemStub = vi.fn();
        triggerChangeStub = vi.fn();

        instance._removeItem = removeItemStub;
        instance._triggerChange = triggerChangeStub;
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      describe('runEvent parameter being passed', () => {
        beforeEach(() => {
          output = instance.removeHighlightedItems();
        });

        it('returns this', () => {
          expect(output).to.deep.equal(instance);
        });

        it('removes each highlighted item in store', () => {
          expect(removeItemStub).callCount(2);
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
          expect(triggerChangeStub).callCount(2);
          expect(triggerChangeStub).toHaveBeenNthCalledWith(1, items[0].value);
          expect(triggerChangeStub).toHaveBeenNthCalledWith(2, items[1].value);
        });
      });
    });

    describe('setChoices', () => {
      let clearChoicesStub: Mock;
      let addGroupStub: Mock;
      let addChoiceStub: Mock;
      let containerOuterRemoveLoadingStateStub: Mock;
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
        clearChoicesStub = vi.fn();
        addGroupStub = vi.fn();
        addChoiceStub = vi.fn();
        containerOuterRemoveLoadingStateStub = vi.fn();

        instance.clearChoices = clearChoicesStub;
        instance._addGroup = addGroupStub;
        instance._addChoice = addChoiceStub;
        instance.containerOuter.removeLoadingState = containerOuterRemoveLoadingStateStub;
      });

      afterEach(() => {
        vi.restoreAllMocks();
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
          expect(containerOuterRemoveLoadingStateStub).toHaveBeenCalled();
        });

        describe('passing choices with children choices', () => {
          it('adds groups', () => {
            instance.setChoices(groups, value, label, false);
            expect(addGroupStub).callCount(2);
            expect(addGroupStub).toHaveBeenNthCalledWith(1, {
              active: true,
              choices: [
                {
                  active: true,
                  customProperties: undefined,
                  disabled: false,
                  group: null,
                  highlighted: false,
                  id: 0,
                  label: 'Test 1',
                  labelClass: undefined,
                  labelDescription: undefined,
                  placeholder: false,
                  rank: 0,
                  score: 0,
                  selected: false,
                  value: '1',
                },
                {
                  active: true,
                  customProperties: undefined,
                  disabled: true,
                  group: null,
                  highlighted: false,
                  id: 0,
                  label: 'Test 2',
                  labelClass: undefined,
                  labelDescription: undefined,
                  placeholder: false,
                  rank: 0,
                  score: 0,
                  selected: false,
                  value: '2',
                },
              ],
              disabled: false,
              id: 0,
              label: 'Test 1',
            });
          });
        });

        const coerceBool = (arg: unknown, defaultValue: boolean = true) =>
          typeof arg === 'undefined' ? defaultValue : !!arg;

        describe('passing choices without children choices', () => {
          it('adds passed choices', () => {
            instance.setChoices(choices, value, label, false);
            expect(addChoiceStub).callCount(2);
            choices.forEach((_v, index) => {
              expect(addChoiceStub).toHaveBeenNthCalledWith(index + 1, {
                value: choices[index][value],
                label: choices[index][label],
                active: coerceBool(choices[index].active),
                selected: coerceBool(choices[index].selected, false),
                disabled: coerceBool(choices[index].disabled, false),
                customProperties: choices[index].customProperties,
                placeholder: coerceBool(choices[index].placeholder, false),
                group: null,
                highlighted: false,
                id: 0,
                labelClass: undefined,
                labelDescription: undefined,
                rank: 0,
                score: 0,
              });
            });
          });
        });

        describe('passing an empty array with a true replaceChoices flag', () => {
          it('choices are cleared', () => {
            instance._isSelectElement = true;
            instance.setChoices([], value, label, true);
            expect(clearChoicesStub).toHaveBeenCalled();
          });
        });

        describe('passing an empty array with a false replaceChoices flag', () => {
          it('choices stay the same', () => {
            instance._isSelectElement = true;
            instance.setChoices([], value, label, false);
            expect(clearChoicesStub).not.toHaveBeenCalled();
          });
        });

        describe('passing true replaceChoices flag', () => {
          it('choices are cleared', () => {
            instance.setChoices(choices, value, label, true);
            expect(clearChoicesStub).toHaveBeenCalled();
          });
        });

        describe('passing false replaceChoices flag', () => {
          it('choices are not cleared', () => {
            instance.setChoices(choices, value, label, false);
            expect(clearChoicesStub).not.toHaveBeenCalled();
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
              (event: CustomEvent) => {
                expect(event.detail).to.contains({
                  value: query,
                  resultCount: 0,
                });
                done(true);
              },
              { once: true },
            );

            instance._onKeyUp(/* { target: null, keyCode: null } */);
            instance._onInput(/* { target: null } */);
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
              (event: CustomEvent) => {
                expect(event.detail.resultCount).to.eql(0);
                done(true);
              },
              { once: true },
            );

            instance._onKeyUp(/* { target: null, keyCode: null } */);
            instance._onInput(/* { target: null } */);
          }));

        it('is fired with a searchFloor of 0', () =>
          new Promise((done) => {
            instance.config.searchFloor = 0;
            instance.input.value = 'qwerty';
            instance.input.focus();
            instance.passedElement.element.addEventListener('search', (event: CustomEvent) => {
              expect(event.detail).to.contains({
                value: instance.input.value,
                resultCount: 0,
              });
              done(true);
            });

            instance._onKeyUp(/* { target: null, keyCode: null } */);
            instance._onInput(/* { target: null } */);
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
              (event: CustomEvent) => {
                expect(event.detail).to.contains({
                  value: query,
                  resultCount: 0,
                });
                done(true);
              },
              { once: true },
            );

            instance._onKeyUp(/* { target: null, keyCode: null } */);
            instance._onInput(/* { target: null } */);
          }));

        it('is fired with a searchFloor of 0', () =>
          new Promise((done) => {
            instance.config.searchFloor = 0;
            instance.input.value = 'qwerty';
            instance.input.focus();
            instance.passedElement.element.addEventListener('search', (event: CustomEvent) => {
              expect(event.detail).to.contains({
                value: instance.input.value,
                resultCount: 0,
              });
              done(true);
            });

            instance._onKeyUp(/* { target: null, keyCode: null } */);
            instance._onInput(/* { target: null } */);
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
              (event: CustomEvent) => {
                expect(event.detail).to.contains({
                  value: query,
                  resultCount: 0,
                });
                done(true);
              },
              { once: true },
            );

            instance._onKeyUp(/* { target: null, keyCode: null } */);
            instance._onInput(/* { target: null } */);
          }));

        it('is fired with a searchFloor of 0', () =>
          new Promise((done) => {
            instance.config.searchFloor = 0;
            instance.input.value = 'qwerty';
            instance.input.focus();
            instance.passedElement.element.addEventListener('search', (event: CustomEvent) => {
              expect(event.detail).to.contains({
                value: instance.input.value,
                resultCount: 0,
              });
              done(true);
            });

            instance._onKeyUp(/* { target: null, keyCode: null } */);
            instance._onInput(/* { target: null } */);
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
            (instance.passedElement as WrappedSelect).placeholderOption = {
              text: placeholderValue,
            };

            const value = instance._generatePlaceholderValue();
            expect(value).to.equal(placeholderValue);
          });
        });

        describe('when a placeholder option is not defined', () => {
          it('returns null', () => {
            instance._isSelectElement = true;
            (instance.passedElement as WrappedSelect).placeholderOption = undefined;

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
        instance.showDropdown = vi.fn();
        instance._onSelectKey = vi.fn();
        instance._onEnterKey = vi.fn();
        instance._onEscapeKey = vi.fn();
        instance._onDirectionKey = vi.fn();
        instance._onDeleteKey = vi.fn();

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
            } as KeyboardEvent;

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
          } as KeyboardEvent;

          instance._onKeyDown(event);

          expect(instance._onSelectKey).to.have.been.calledWith(event, hasItems);
        });
      });

      describe('enter key', () => {
        it(`calls _onEnterKey with the expected arguments`, () => {
          const event = {
            keyCode: KeyCodeMap.ENTER_KEY,
            key: 'Enter',
          } as KeyboardEvent;

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
            } as KeyboardEvent;

            instance._onKeyDown(event);

            expect(instance._onDeleteKey).to.have.been.calledWith(event, items, hasFocussedInput);
          });
        });
      });
    });

    describe('_removeItem', () => {
      beforeEach(() => {
        instance._store.dispatch = vi.fn();
      });

      afterEach(() => {
        vi.restoreAllMocks();
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
              (event: CustomEvent) => {
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
          } as ChoiceFull;

          beforeEach(() => {
            instance._store.getGroupById = vi.fn().mockImplementation(() => group);
          });

          afterEach(() => {
            vi.restoreAllMocks();
          });

          it("includes the group's value in the triggered event", () =>
            new Promise((done) => {
              passedElement.addEventListener(
                'removeItem',
                (event: CustomEvent) => {
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
