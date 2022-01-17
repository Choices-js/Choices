import { expect } from 'chai';
import { stub } from 'sinon';
import { DEFAULT_CLASSNAMES } from '../defaults';
import WrappedElement from './wrapped-element';
import WrappedInput from './wrapped-input';

describe('components/wrappedInput', () => {
  let instance;
  let element;
  const delimiter = '-';

  beforeEach(() => {
    element = document.createElement('input');
    instance = new WrappedInput({
      element,
      classNames: DEFAULT_CLASSNAMES,
      delimiter,
    });
  });

  afterEach(() => {
    document.body.innerHTML = '';
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

  describe('inherited methods', () => {
    const methods: string[] = ['conceal', 'reveal', 'enable', 'disable'];

    methods.forEach((method) => {
      describe(method, () => {
        beforeEach(() => {
          stub(WrappedElement.prototype, method as keyof WrappedElement);
        });

        afterEach(() => {
          WrappedElement.prototype[method].restore();
        });

        it(`calls super.${method}`, () => {
          expect(WrappedElement.prototype[method].called).to.equal(false);
          instance[method]();
          expect(WrappedElement.prototype[method].called).to.equal(true);
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
