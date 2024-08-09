import { expect } from 'chai';
import { stub } from 'sinon';
import { DEFAULT_CLASSNAMES } from '../../../src';
import WrappedElement from '../../../src/scripts/components/wrapped-element';
import WrappedInput from '../../../src/scripts/components/wrapped-input';

describe('components/wrappedInput', () => {
  let instance: WrappedInput | null;
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
    instance = null;
  });

  describe('constructor', () => {
    it('assigns choices element to class', () => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      expect(instance.element).to.equal(element);
    });

    it('assigns classnames to class', () => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      expect(instance.classNames).to.deep.equal(DEFAULT_CLASSNAMES);
    });
  });

  describe('inherited methods', () => {
    const methods: string[] = ['conceal', 'reveal', 'enable', 'disable'];

    methods.forEach((method) => {
      describe(method, () => {
        beforeEach(() => {
          stub(
            WrappedElement.prototype,
            method as keyof WrappedElement<HTMLInputElement>,
          );
        });

        afterEach(() => {
          WrappedElement.prototype[method].restore();
        });

        it(`calls super.${method}`, () => {
          expect(instance).to.not.be.null;
          if (!instance) {
            return;
          }
          expect(WrappedElement.prototype[method].called).to.equal(false);
          instance[method]();
          expect(WrappedElement.prototype[method].called).to.equal(true);
        });
      });
    });
  });

  describe('value setter', () => {
    it('sets the value of the input to the given value', () => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      const newValue = 'Value 1, Value 2, Value 3';
      expect(instance.element.value).to.equal('');
      instance.value = newValue;
      expect(instance.value).to.equal(newValue);
    });
  });
});
