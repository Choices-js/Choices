import { expect, vi } from 'vitest';
import { DEFAULT_CLASSNAMES } from '../../../src';
import WrappedElement from '../../../src/scripts/components/wrapped-element';
import WrappedInput from '../../../src/scripts/components/wrapped-input';

describe('components/wrappedInput', () => {
  let instance: WrappedInput;
  let element: HTMLInputElement;

  beforeEach(() => {
    element = document.createElement('input');
    instance = new WrappedInput({
      element,
      classNames: DEFAULT_CLASSNAMES,
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('constructor', () => {
    it('assigns choices element to class', () => {
      expect(instance.element).to.equal(element);
    });

    it('assigns classnames to class', () => {
      expect(instance.classNames).to.deep.equal(DEFAULT_CLASSNAMES);
    });
  });

  describe('inherited methods', () => {
    const methods: string[] = ['conceal', 'reveal', 'enable', 'disable'];

    methods.forEach((method) => {
      describe(method, () => {
        beforeEach(() => {
          WrappedElement.prototype[method] = vi.spyOn(WrappedElement.prototype, method as any);
        });

        afterEach(() => {
          vi.restoreAllMocks();
        });

        it(`calls super.${method}`, () => {
          expect(WrappedElement.prototype[method]).not.toHaveBeenCalled();
          instance[method]();
          expect(WrappedElement.prototype[method]).toHaveBeenCalled();
        });
      });
    });
  });

  describe('value setter', () => {
    it('sets the value of the input to the given value', () => {
      const newValue = 'Value 1, Value 2, Value 3';
      expect(instance.element.value).to.equal('');
      instance.value = newValue;
      expect(instance.value).to.equal(newValue);
    });
  });
});
