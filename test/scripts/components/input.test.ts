import { expect, vi } from 'vitest';
import { DEFAULT_CLASSNAMES } from '../../../src';
import Input from '../../../src/scripts/components/input';

describe('components/input', () => {
  let instance: Input;
  let choicesElement: HTMLInputElement;

  beforeEach(() => {
    choicesElement = document.createElement('input');
    instance = new Input({
      element: choicesElement,
      type: 'text',
      classNames: DEFAULT_CLASSNAMES,
      preventPaste: false,
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('constructor', () => {
    it('assigns choices element to class', () => {
      expect(instance.element).to.equal(choicesElement);
    });

    it('assigns classnames to class', () => {
      expect(instance.classNames).to.deep.equal(DEFAULT_CLASSNAMES);
    });
  });

  describe('addEventListeners', () => {
    let addEventListenerStub;

    beforeEach(() => {
      addEventListenerStub = vi.spyOn(instance.element, 'addEventListener');
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('adds event listeners', () => {
      instance.addEventListeners();
      expect(addEventListenerStub).toHaveBeenNthCalledWith(2, 'input', instance._onInput, {
        passive: true,
      });
      expect(addEventListenerStub).toHaveBeenNthCalledWith(1, 'paste', instance._onPaste);
      expect(addEventListenerStub).toHaveBeenNthCalledWith(3, 'focus', instance._onFocus, {
        passive: true,
      });
      expect(addEventListenerStub).toHaveBeenNthCalledWith(4, 'blur', instance._onBlur, {
        passive: true,
      });
    });
  });

  describe('removeEventListeners', () => {
    let removeEventListenerStub;

    beforeEach(() => {
      removeEventListenerStub = vi.spyOn(instance.element, 'removeEventListener');
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('removes event listeners', () => {
      instance.removeEventListeners();
      expect(removeEventListenerStub).callCount(4);
      expect(removeEventListenerStub).toHaveBeenNthCalledWith(1, 'input', instance._onInput);
      expect(removeEventListenerStub).toHaveBeenNthCalledWith(2, 'paste', instance._onPaste);
      expect(removeEventListenerStub).toHaveBeenNthCalledWith(3, 'focus', instance._onFocus);
      expect(removeEventListenerStub).toHaveBeenNthCalledWith(4, 'blur', instance._onBlur);
    });
  });

  describe('_onInput', () => {
    let setWidthStub;

    beforeEach(() => {
      setWidthStub = vi.spyOn(instance, 'setWidth');
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    describe('when element is select one', () => {
      it('sets input width', () => {
        instance.type = 'select-one';
        instance._onInput();
        expect(setWidthStub).not.toHaveBeenCalled();
      });
    });

    describe('when element is not a select one', () => {
      it('sets input width', () => {
        instance.type = 'text';
        instance._onInput();
        expect(setWidthStub).toHaveBeenCalled();
      });
    });
  });

  describe('_onPaste', () => {
    let eventMock;

    beforeEach(() => {
      eventMock = {
        preventDefault: vi.fn(),
        target: instance.element,
      };
    });

    describe('when pasting is disabled and target is the element', () => {
      it('prevents default pasting behaviour', () => {
        instance.preventPaste = true;
        instance._onPaste(eventMock);
        expect(eventMock.preventDefault).toHaveBeenCalled();
      });
    });

    describe('when pasting is enabled', () => {
      it('does not prevent default pasting behaviour', () => {
        instance.preventPaste = false;
        instance._onPaste(eventMock);
        expect(eventMock.preventDefault).not.toHaveBeenCalled();
      });
    });
  });

  describe('_onFocus', () => {
    it('sets isFocussed flag to true', () => {
      expect(instance.isFocussed).to.equal(false);
      instance._onFocus();
      expect(instance.isFocussed).to.equal(true);
    });
  });

  describe('_onBlur', () => {
    it('sets isFocussed flag to false', () => {
      instance.isFocussed = true;
      instance._onBlur();
      expect(instance.isFocussed).to.equal(false);
    });
  });

  describe('enable', () => {
    beforeEach(() => {
      instance.element.setAttribute('disabled', '');
      instance.isDisabled = true;
      instance.enable();
    });

    it('removes disabled attribute', () => {
      expect(instance.element.getAttribute('disabled')).to.equal(null);
    });

    it('sets isDisabled flag to false', () => {
      expect(instance.isDisabled).to.equal(false);
    });
  });

  describe('disable', () => {
    beforeEach(() => {
      instance.element.removeAttribute('disabled', '');
      instance.isDisabled = false;
      instance.disable();
    });

    it('removes disabled attribute', () => {
      expect(instance.element.getAttribute('disabled')).to.equal('');
    });

    it('sets isDisabled flag to false', () => {
      expect(instance.isDisabled).to.equal(true);
    });
  });

  describe('focus', () => {
    let focusStub;

    beforeEach(() => {
      focusStub = vi.spyOn(instance.element, 'focus');
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    describe('when element is not focussed', () => {
      it('focuses element if isFocussed flag is set to false', () => {
        instance.isFocussed = true;
        instance.focus();
        expect(focusStub).not.toHaveBeenCalled();
      });
    });

    describe('when element is focussed', () => {
      it('focuses element if isFocussed flag is set to false', () => {
        instance.isFocussed = false;
        instance.focus();
        expect(focusStub).toHaveBeenCalled();
      });
    });
  });

  describe('blur', () => {
    let blurStub;

    beforeEach(() => {
      blurStub = vi.spyOn(instance.element, 'blur');
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    describe('when element is not focussed', () => {
      it("doesn't blur element", () => {
        instance.isFocussed = false;
        instance.blur();
        expect(blurStub).not.toHaveBeenCalled();
      });
    });

    describe('when element is focussed', () => {
      it('blurs element', () => {
        instance.isFocussed = true;
        instance.blur();
        expect(blurStub).toHaveBeenCalled();
      });
    });
  });

  describe('clear', () => {
    let setWidthStub;

    beforeEach(() => {
      setWidthStub = vi.spyOn(instance, 'setWidth');
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("removes the element's value if it has one", () => {
      instance.element.value = 'test';
      expect(instance.element.value).to.equal('test');
      instance.clear();
      expect(instance.element.value).to.equal('');
    });

    it("sets the element's width if flag passed", () => {
      expect(setWidthStub).not.toHaveBeenCalled();
      instance.clear(true);
      expect(setWidthStub).toHaveBeenCalled();
    });

    it('returns instance', () => {
      const response = instance.clear();
      expect(response).to.deep.equal(instance);
    });
  });

  describe('placeholder setter', () => {
    it('sets value of element to passed placeholder', () => {
      const placeholder = 'test';
      expect(instance.element.placeholder).to.equal('');
      instance.placeholder = placeholder;
      expect(instance.element.placeholder).to.equal(placeholder);
    });
  });

  describe('value setter', () => {
    it('sets value of element to passed value', () => {
      const value = 'test';
      expect(instance.element.value).to.equal('');
      instance.value = value;
      expect(instance.element.value).to.equal(value);
    });

    it('casts value to string', () => {
      const value = 1234;
      instance.value = value;
      expect(instance.element.value).to.equal(`${value}`);
    });
  });

  describe('value getter', () => {
    it('sets value of element to passed value', () => {
      const value = 'test';
      instance.element.value = value;
      expect(instance.value).to.equal(value);
    });
  });

  describe('setActiveDescendant', () => {
    it("sets element's aria-activedescendant attribute with passed descendant ID", () => {
      const activeDescendantID = '1234';
      expect(instance.element.getAttribute('aria-activedescendant')).to.equal(null);
      instance.setActiveDescendant(activeDescendantID);
      expect(instance.element.getAttribute('aria-activedescendant')).to.equal(activeDescendantID);
    });
  });

  describe('removeActiveDescendant', () => {
    it("remove elememnt's aria-activedescendant attribute", () => {
      const activeDescendantID = '1234';
      instance.element.setAttribute('aria-activedescendant', activeDescendantID);
      expect(instance.element.getAttribute('aria-activedescendant')).to.equal(activeDescendantID);
      instance.removeActiveDescendant();
      expect(instance.element.getAttribute('aria-activedescendant')).to.equal(null);
    });
  });
});
