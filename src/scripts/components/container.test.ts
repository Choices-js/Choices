import { expect } from 'chai';
import { stub } from 'sinon';
import { DEFAULT_CLASSNAMES } from '../defaults';
import Container from './container';

describe('components/container', () => {
  let instance;
  let element;

  beforeEach(() => {
    element = document.createElement('div');
    element.id = 'container';

    document.body.appendChild(element);
    instance = new Container({
      element: document.getElementById('container') as HTMLElement,
      classNames: DEFAULT_CLASSNAMES,
      position: 'auto',
      type: 'text',
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    element = null;
    instance = null;
  });

  describe('constructor', () => {
    it('assigns choices element to class', () => {
      expect(instance.element).to.eql(element);
    });

    it('assigns classnames to class', () => {
      expect(instance.classNames).to.eql(DEFAULT_CLASSNAMES);
    });
  });

  describe('addEventListeners', () => {
    let addEventListenerStub;

    beforeEach(() => {
      addEventListenerStub = stub(instance.element, 'addEventListener');
    });

    afterEach(() => {
      addEventListenerStub.restore();
    });

    it('adds event listeners', () => {
      instance.addEventListeners();
      expect(addEventListenerStub.callCount).to.equal(2);
      expect(addEventListenerStub.getCall(0).args[0]).to.equal('focus');
      expect(addEventListenerStub.getCall(1).args[0]).to.equal('blur');
    });
  });

  describe('removeEventListeners', () => {
    let removeEventListenerStub;

    beforeEach(() => {
      removeEventListenerStub = stub(instance.element, 'removeEventListener');
    });

    afterEach(() => {
      removeEventListenerStub.restore();
    });

    it('removes event listeners', () => {
      instance.removeEventListeners();
      expect(removeEventListenerStub.callCount).to.equal(2);
      expect(removeEventListenerStub.getCall(0).args[0]).to.equal('focus');
      expect(removeEventListenerStub.getCall(1).args[0]).to.equal('blur');
    });
  });

  describe('onFocus', () => {
    it('sets isFocussed flag to true', () => {
      expect(instance.isFocussed).to.equal(false);
      instance._onFocus();
      expect(instance.isFocussed).to.equal(true);
    });
  });

  describe('onBlur', () => {
    it('sets isFocussed flag to false', () => {
      instance.isFocussed = true;
      instance._onBlur();
      expect(instance.isFocussed).to.equal(false);
    });
  });

  describe('shouldFlip', () => {
    describe('not passing dropdownPos', () => {
      it('returns false', () => {
        expect(instance.shouldFlip()).to.equal(false);
      });
    });

    describe('passing dropdownPos', () => {
      describe('position config option set to "auto"', () => {
        beforeEach(() => {
          instance.position = 'auto';
        });
      });

      describe('position config option set to "top"', () => {
        beforeEach(() => {
          instance.position = 'top';
        });

        it('returns true', () => {
          expect(instance.shouldFlip(100)).to.equal(true);
        });
      });

      describe('position config option set to "bottom"', () => {
        beforeEach(() => {
          instance.position = 'bottom';
        });

        it('returns false', () => {
          expect(instance.shouldFlip(100)).to.equal(false);
        });
      });
    });
  });

  describe('setActiveDescendant', () => {
    it("sets element's aria-activedescendant attribute with passed descendant ID", () => {
      const activeDescendantID = '1234';
      expect(instance.element.getAttribute('aria-activedescendant')).to.equal(
        null,
      );
      instance.setActiveDescendant(activeDescendantID);
      expect(instance.element.getAttribute('aria-activedescendant')).to.equal(
        activeDescendantID,
      );
    });
  });

  describe('removeActiveDescendant', () => {
    it("remove elememnt's aria-activedescendant attribute", () => {
      const activeDescendantID = '1234';
      instance.element.setAttribute(
        'aria-activedescendant',
        activeDescendantID,
      );
      expect(instance.element.getAttribute('aria-activedescendant')).to.equal(
        activeDescendantID,
      );
      instance.removeActiveDescendant();
      expect(instance.element.getAttribute('aria-activedescendant')).to.equal(
        null,
      );
    });
  });

  describe('open', () => {
    beforeEach(() => {
      instance.open();
    });

    it('adds open state class', () => {
      expect(
        instance.element.classList.contains(DEFAULT_CLASSNAMES.openState),
      ).to.equal(true);
    });

    it('sets aria-expanded attribute to true', () => {
      expect(instance.element.getAttribute('aria-expanded')).to.equal('true');
    });

    it('sets isOpen flag to true', () => {
      expect(instance.isOpen).to.equal(true);
    });

    describe('flipping dropdown', () => {
      let shouldFlipStub;
      beforeEach(() => {
        shouldFlipStub = stub().returns(true);

        instance.shouldFlip = shouldFlipStub;
        instance.open();
      });

      afterEach(() => {
        instance.shouldFlip.reset();
      });

      it('adds adds flipped state class', () => {
        expect(
          instance.element.classList.contains(DEFAULT_CLASSNAMES.flippedState),
        ).to.equal(true);
      });

      it('sets isFlipped flag to true', () => {
        expect(instance.isFlipped).to.equal(true);
      });
    });
  });

  describe('close', () => {
    beforeEach(() => {
      instance.close();
    });

    it('adds open state class', () => {
      expect(
        instance.element.classList.contains(DEFAULT_CLASSNAMES.openState),
      ).to.equal(false);
    });

    it('sets aria-expanded attribute to true', () => {
      expect(instance.element.getAttribute('aria-expanded')).to.equal('false');
    });

    it('sets isOpen flag to true', () => {
      expect(instance.isOpen).to.equal(false);
    });

    describe('flipped dropdown', () => {
      beforeEach(() => {
        instance.isFlipped = true;
        instance.close();
      });

      it('removes adds flipped state class', () => {
        expect(
          instance.element.classList.contains(DEFAULT_CLASSNAMES.flippedState),
        ).to.equal(false);
      });

      it('sets isFlipped flag to false', () => {
        expect(instance.isFlipped).to.equal(false);
      });
    });
  });

  describe('focus', () => {
    let focusStub;

    beforeEach(() => {
      focusStub = stub(instance.element, 'focus');
    });

    afterEach(() => {
      focusStub.restore();
    });

    describe('isFocussed flag being set to false', () => {
      it('focuses element', () => {
        instance.isFocussed = false;
        instance.focus();
        expect(focusStub.called).to.equal(true);
      });
    });

    describe('isFocussed flag being set to true', () => {
      it('does not focus element', () => {
        instance.isFocussed = true;
        instance.focus();
        expect(focusStub.called).to.equal(false);
      });
    });
  });

  describe('addFocusState', () => {
    beforeEach(() => {
      instance.removeLoadingState();
    });

    it('adds focus state class', () => {
      expect(
        instance.element.classList.contains(DEFAULT_CLASSNAMES.focusState),
      ).to.equal(false);
      instance.addFocusState();
      expect(
        instance.element.classList.contains(DEFAULT_CLASSNAMES.focusState),
      ).to.equal(true);
    });
  });

  describe('removeFocusState', () => {
    beforeEach(() => {
      instance.addFocusState();
    });

    it('removes focus state class', () => {
      expect(
        instance.element.classList.contains(DEFAULT_CLASSNAMES.focusState),
      ).to.equal(true);
      instance.removeFocusState();
      expect(
        instance.element.classList.contains(DEFAULT_CLASSNAMES.focusState),
      ).to.equal(false);
    });
  });

  describe('enable', () => {
    beforeEach(() => {
      instance.disable();
    });

    it('removes disabled state class', () => {
      expect(
        instance.element.classList.contains(DEFAULT_CLASSNAMES.disabledState),
      ).to.equal(true);
      instance.enable();
      expect(
        instance.element.classList.contains(DEFAULT_CLASSNAMES.disabledState),
      ).to.equal(false);
    });

    it('removes aria-disabled attribute', () => {
      expect(instance.element.getAttribute('aria-disabled')).to.equal('true');
      instance.enable();
      expect(instance.element.getAttribute('aria-disabled')).to.equal(null);
    });

    it('sets isDisabled flag to true', () => {
      instance.enable();
      expect(instance.isDisabled).to.equal(false);
    });

    describe('select one element', () => {
      beforeEach(() => {
        instance.type = 'select-one';
        instance.enable();
      });

      it('sets tabindex attribute', () => {
        expect(instance.element.getAttribute('tabindex')).to.equal('0');
      });
    });
  });

  describe('disable', () => {
    beforeEach(() => {
      instance.enable();
    });

    it('removes disabled state class', () => {
      expect(
        instance.element.classList.contains(DEFAULT_CLASSNAMES.disabledState),
      ).to.equal(false);
      instance.disable();
      expect(
        instance.element.classList.contains(DEFAULT_CLASSNAMES.disabledState),
      ).to.equal(true);
    });

    it('removes aria-disabled attribute', () => {
      expect(instance.element.getAttribute('aria-disabled')).to.equal(null);
      instance.disable();
      expect(instance.element.getAttribute('aria-disabled')).to.equal('true');
    });

    it('sets isDisabled flag to true', () => {
      instance.disable();
      expect(instance.isDisabled).to.equal(true);
    });

    describe('select one element', () => {
      beforeEach(() => {
        instance.type = 'select-one';
        instance.disable();
      });

      it('sets tabindex attribute', () => {
        expect(instance.element.getAttribute('tabindex')).to.equal('-1');
      });
    });
  });

  describe('wrap', () => {
    let elementToWrap;

    beforeEach(() => {
      elementToWrap = document.createElement('div');
      elementToWrap.id = 'wrap-test';
      document.body.appendChild(elementToWrap);
    });

    afterEach(() => {
      document.getElementById('wrap-test')!.remove();
    });

    it('wraps passed element inside element', () => {
      expect(instance.element.querySelector('div#wrap-test')).to.equal(null);
      instance.wrap(document.querySelector('div#wrap-test'));
      expect(instance.element.querySelector('div#wrap-test')).to.equal(
        elementToWrap,
      );
    });
  });

  describe('unwrap', () => {
    let elementToUnwrap;

    beforeEach(() => {
      elementToUnwrap = document.createElement('div');
      elementToUnwrap.id = 'unwrap-test';
      document.body.appendChild(elementToUnwrap);
      instance.wrap(document.getElementById('unwrap-test'));
    });

    afterEach(() => {
      document.body.removeChild(document.getElementById('unwrap-test') as Node);
    });

    it('moves wrapped element outside of element', () => {
      expect(
        instance.element.querySelector('div#unwrap-test'),
      ).to.be.instanceof(HTMLElement);
      instance.unwrap(elementToUnwrap);
      expect(instance.element.querySelector('div#unwrap-test')).to.equal(null);
      expect(document.querySelector('div#unwrap-test')).to.be.instanceof(
        HTMLElement,
      );
    });

    it('removes element from DOM', () => {
      expect(document.getElementById('container')).to.not.equal(null);
      instance.unwrap(elementToUnwrap);
      expect(document.getElementById('container')).to.equal(null);
    });
  });

  describe('addLoadingState', () => {
    beforeEach(() => {
      instance.removeLoadingState();
    });

    it('adds loading state class', () => {
      expect(
        instance.element.classList.contains(DEFAULT_CLASSNAMES.loadingState),
      ).to.equal(false);
      instance.addLoadingState();
      expect(
        instance.element.classList.contains(DEFAULT_CLASSNAMES.loadingState),
      ).to.equal(true);
    });

    it('sets aria-busy attribute to true', () => {
      expect(instance.element.getAttribute('aria-busy')).to.equal(null);
      instance.addLoadingState();
      expect(instance.element.getAttribute('aria-busy')).to.equal('true');
    });

    it('sets isLoading flag to false', () => {
      expect(instance.isLoading).to.equal(false);
      instance.addLoadingState();
      expect(instance.isLoading).to.equal(true);
    });
  });

  describe('removeLoadingState', () => {
    beforeEach(() => {
      instance.addLoadingState();
    });

    it('removes loading state class', () => {
      expect(
        instance.element.classList.contains(DEFAULT_CLASSNAMES.loadingState),
      ).to.equal(true);
      instance.removeLoadingState();
      expect(
        instance.element.classList.contains(DEFAULT_CLASSNAMES.loadingState),
      ).to.equal(false);
    });

    it('removes aria-busy attribute', () => {
      expect(instance.element.getAttribute('aria-busy')).to.equal('true');
      instance.removeLoadingState();
      expect(instance.element.getAttribute('aria-busy')).to.equal(null);
    });

    it('sets isLoading flag to true', () => {
      expect(instance.isLoading).to.equal(true);
      instance.removeLoadingState();
      expect(instance.isLoading).to.equal(false);
    });
  });
});
