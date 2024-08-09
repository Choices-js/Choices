import { expect } from 'chai';
import sinon from 'sinon';
import { DEFAULT_CLASSNAMES } from '../../../src';
import Dropdown from '../../../src/scripts/components/dropdown';
import { getClassNames } from '../../../src/scripts/lib/utils';

describe('components/dropdown', () => {
  let instance: Dropdown | null;
  let choicesElement: HTMLDivElement;

  beforeEach(() => {
    choicesElement = document.createElement('div');
    document.body.appendChild(choicesElement);
    instance = new Dropdown({
      element: choicesElement,
      type: 'text',
      classNames: DEFAULT_CLASSNAMES,
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    instance = null;
  });

  describe('constructor', () => {
    it('assigns choices element to instance', () => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      expect(instance.element).to.equal(choicesElement);
    });

    it('assigns classnames to instance', () => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      expect(instance.classNames).to.deep.equal(DEFAULT_CLASSNAMES);
    });
  });

  describe('distanceFromTopWindow', () => {
    let top: number;
    let dimensions;
    let getBoundingClientRectStub;

    beforeEach(() => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }

      top = 100;
      dimensions = {
        bottom: 121,
        height: 0,
        left: 0,
        right: 0,
        top,
        width: 0,
      };

      getBoundingClientRectStub = sinon
        .stub(instance.element, 'getBoundingClientRect')
        .returns(dimensions);
    });

    afterEach(() => {
      getBoundingClientRectStub.restore();
    });

    it('determines how far the top of our element is from the top of the viewport', () => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      const expectedResponse = dimensions.bottom;
      const actualResponse = instance.distanceFromTopWindow;
      expect(actualResponse).to.equal(expectedResponse);
    });
  });

  describe('show', () => {
    let actualResponse;

    beforeEach(() => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      actualResponse = instance.show();
    });

    afterEach(() => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      instance.hide();
    });

    it('adds active class', () => {
      getClassNames(DEFAULT_CLASSNAMES.activeState).forEach((c) => {
        expect(instance).to.not.be.null;
        if (!instance) {
          return;
        }
        expect(instance.element.classList.contains(c)).to.equal(true);
      });
    });

    it('sets expanded attribute', () => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      expect(instance.element.getAttribute('aria-expanded')).to.equal('true');
    });

    it('sets isActive instance flag', () => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      expect(instance.isActive).to.equal(true);
    });

    it('returns instance', () => {
      expect(actualResponse).to.deep.equal(instance);
    });
  });

  describe('hide', () => {
    let actualResponse;

    beforeEach(() => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      actualResponse = instance.hide();
    });

    afterEach(() => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      instance.show();
    });

    it('adds active class', () => {
      getClassNames(DEFAULT_CLASSNAMES.activeState).forEach((c) => {
        expect(instance).to.not.be.null;
        if (!instance) {
          return;
        }
        expect(instance.element.classList.contains(c)).to.equal(false);
      });
    });

    it('sets expanded attribute', () => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      expect(instance.element.getAttribute('aria-expanded')).to.equal('false');
    });

    it('sets isActive instance flag', () => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      expect(instance.isActive).to.equal(false);
    });

    it('returns instance', () => {
      expect(actualResponse).to.deep.equal(instance);
    });
  });
});
