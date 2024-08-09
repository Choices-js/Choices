import { expect } from 'chai';
import { getClassNames } from '../../../src/scripts/lib/utils';
import List from '../../../src/scripts/components/list';

describe('components/list', () => {
  let instance: List | null;
  let choicesElement: HTMLDivElement;

  beforeEach(() => {
    choicesElement = document.createElement('div');
    instance = new List({
      element: choicesElement,
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
    instance = null;
  });

  describe('constructor', () => {
    it('assigns choices element to class', () => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      expect(instance.element).to.equal(choicesElement);
    });

    it('sets the height of the element', () => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      expect(instance.height).to.deep.equal(choicesElement.scrollTop);
    });
  });

  describe('clear', () => {
    it("clears element's inner HTML", () => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      const innerHTML = 'test';
      instance.element.innerHTML = innerHTML;
      expect(instance.element.innerHTML).to.equal(innerHTML);
      instance.clear();
      expect(instance.element.innerHTML).to.equal('');
    });
  });

  describe('append', () => {
    it('appends passed node to element', () => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      const elementToAppend = document.createElement('span');
      const childClass = 'test-element';
      elementToAppend.classList.add(...getClassNames(childClass));
      expect(instance.element.querySelector(`.${childClass}`)).to.equal(null);
      instance.append(elementToAppend);
      expect(instance.element.querySelector(`.${childClass}`)).to.equal(
        elementToAppend,
      );
    });
  });

  describe('hasChildren', () => {
    describe('when list has children', () => {
      it('returns true', () => {
        expect(instance).to.not.be.null;
        if (!instance) {
          return;
        }
        const childElement = document.createElement('span');
        instance.element.appendChild(childElement);
        const response = instance.hasChildren();
        expect(response).to.equal(true);
      });
    });

    describe('when list does not have children', () => {
      it('returns false', () => {
        expect(instance).to.not.be.null;
        if (!instance) {
          return;
        }
        instance.element.innerHTML = '';
        const response = instance.hasChildren();
        expect(response).to.equal(false);
      });
    });
  });

  describe('scrollToTop', () => {
    it("sets the position's scroll position to 0", () => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      instance.element.scrollTop = 10;
      instance.scrollToTop();
      expect(instance.element.scrollTop).to.equal(0);
    });
  });
});
