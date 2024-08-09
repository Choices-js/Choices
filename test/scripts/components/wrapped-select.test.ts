import { expect } from 'chai';
import { stub, spy } from 'sinon';
import WrappedElement from '../../../src/scripts/components/wrapped-element';
import WrappedSelect from '../../../src/scripts/components/wrapped-select';
import Templates from '../../../src/scripts/templates';
import { DEFAULT_CLASSNAMES } from '../../../src';

describe('components/wrappedSelect', () => {
  let instance: WrappedSelect | null;
  let element: HTMLSelectElement;

  beforeEach(() => {
    element = document.createElement('select');
    element.id = 'target';
    for (let i = 0; i <= 4; i++) {
      const option = document.createElement('option');

      if (i === 0) {
        option.value = '';
        option.innerHTML = 'Placeholder label';
      } else {
        option.value = `Value ${i}`;
        option.innerHTML = `Label ${i}`;
      }

      if (i === 1) {
        option.setAttribute('placeholder', '');
      }

      element.appendChild(option);
    }
    document.body.appendChild(element);

    instance = new WrappedSelect({
      element: document.getElementById('target') as HTMLSelectElement,
      classNames: DEFAULT_CLASSNAMES,
      template: spy(Templates.option),
      extractPlaceholder: true,
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
      beforeEach(() => {
        stub(
          WrappedElement.prototype,
          method as keyof WrappedElement<HTMLSelectElement>,
        );
      });

      afterEach(() => {
        WrappedElement.prototype[method].restore();
      });

      describe(method, () => {
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

  describe('placeholderOption getter', () => {
    it('returns option element with empty value attribute', () => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      expect(instance.placeholderOption).to.be.instanceOf(HTMLOptionElement);
      if (instance.placeholderOption) {
        expect(instance.placeholderOption.value).to.equal('');
      }
    });

    it('returns option element with placeholder attribute as fallback', () => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      expect(instance.element.firstChild).to.not.be.null;
      if (instance.element.firstChild) {
        instance.element.removeChild(instance.element.firstChild);
      }

      expect(instance.placeholderOption).to.be.instanceOf(HTMLOptionElement);
      if (instance.placeholderOption) {
        expect(instance.placeholderOption.value).to.equal('Value 1');
      }
    });
  });

  describe('options getter', () => {
    it('returns all option elements', () => {
      expect(instance).to.not.be.null;
      if (!instance) {
        return;
      }
      const optionsAsChoices = instance.optionsAsChoices();
      expect(optionsAsChoices).to.be.an('array');
    });
  });
});
