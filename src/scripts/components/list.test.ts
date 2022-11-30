import { expect } from 'chai';
import { getClassNames } from '../lib/utils';
import List from './list';

describe('components/list', () => {
  let instance;
  let choicesElement;

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
      expect(instance.element).to.eql(choicesElement);
    });

    it('sets the height of the element', () => {
      expect(instance.height).to.eql(choicesElement.scrollTop);
    });
  });

  describe('clear', () => {
    it("clears element's inner HTML", () => {
      const innerHTML = 'test';
      instance.element.innerHTML = innerHTML;
      expect(instance.element.innerHTML).to.equal(innerHTML);
      instance.clear();
      expect(instance.element.innerHTML).to.equal('');
    });
  });

  describe('append', () => {
    it('appends passed node to element', () => {
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

  describe('getChild', () => {
    let childElement;
    const childClass = 'test-element';

    beforeEach(() => {
      childElement = document.createElement('span');
      childElement.classList.add(...getClassNames(childClass));
      instance.element.appendChild(childElement);
    });

    it('returns child element', () => {
      const expectedResponse = childElement;
      const actualResponse = instance.getChild(`.${childClass}`);
      expect(expectedResponse).to.eql(actualResponse);
    });
  });

  describe('hasChildren', () => {
    describe('when list has children', () => {
      it('returns true', () => {
        const childElement = document.createElement('span');
        instance.element.appendChild(childElement);
        const response = instance.hasChildren();
        expect(response).to.equal(true);
      });
    });

    describe('when list does not have children', () => {
      it('returns false', () => {
        instance.element.innerHTML = '';
        const response = instance.hasChildren();
        expect(response).to.equal(false);
      });
    });
  });

  describe('scrollToTop', () => {
    it("sets the position's scroll position to 0", () => {
      instance.element.scrollTop = 10;
      instance.scrollToTop();
      expect(instance.element.scrollTop).to.equal(0);
    });
  });
});
