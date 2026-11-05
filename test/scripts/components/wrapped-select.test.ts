import { expect, vi } from 'vitest';
import WrappedElement from '../../../src/scripts/components/wrapped-element';
import WrappedSelect from '../../../src/scripts/components/wrapped-select';
import { DEFAULT_CLASSNAMES } from '../../../src';
import Templates from '../../../src/scripts/templates';

describe('components/wrappedSelect', () => {
  let instance: WrappedSelect;
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
        if (i % 2 === 0) {
          option.innerHTML = `Label ${i}`;
        } else {
          option.label = `Label ${i}`;
        }
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
      template: Templates.option,
      extractPlaceholder: true,
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
      beforeEach(() => {
        WrappedElement.prototype[method] = vi.spyOn(WrappedElement.prototype, method as any);
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      describe(method, () => {
        it(`calls super.${method}`, () => {
          expect(WrappedElement.prototype[method]).not.toHaveBeenCalled();
          instance[method]();
          expect(WrappedElement.prototype[method]).toHaveBeenCalled();
        });
      });
    });
  });

  describe('placeholderOption getter', () => {
    it('returns option element with empty value attribute', () => {
      expect(instance.placeholderOption).to.be.instanceOf(HTMLOptionElement);
      if (instance.placeholderOption) {
        expect(instance.placeholderOption.value).to.equal('');
      }
    });

    it('returns option element with placeholder attribute as fallback', () => {
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
      const optionsAsChoices = instance.optionsAsChoices();
      expect(optionsAsChoices).to.be.an('array');
    });
  });
});
