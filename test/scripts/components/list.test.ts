import { expect } from 'vitest';
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
