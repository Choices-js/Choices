/* eslint-disable no-new-wrappers */
import { expect } from 'chai';
import { stub } from 'sinon';

import {
  cloneObject,
  diff,
  dispatchEvent,
  generateId,
  sanitise,
  parseCustomProperties,
  sortByAlpha,
  sortByScore,
} from '../../../src/scripts/lib/utils';
import { EventType } from '../../../src';

describe('utils', () => {
  describe('generateId', () => {
    describe('when given element has id value', () => {
      it('generates a unique prefixed id based on given elements id', () => {
        const element = document.createElement('select');
        element.id = 'test-id';
        const prefix = 'test-prefix';

        const output = generateId(element, prefix);

        expect(output).to.equal(`${prefix}-${element.id}`);
      });
    });

    describe('when given element has no id value but name value', () => {
      it('generates a unique prefixed id based on given elements name plus 2 random characters', () => {
        const element = document.createElement('select');
        element.name = 'test-name';
        const prefix = 'test-prefix';

        const output = generateId(element, prefix);
        const expectedOutput = `${prefix}-${element.name}-`;

        expect(output).to.contain(expectedOutput);
        expect(output).to.have.length(expectedOutput.length + 2);
      });
    });

    describe('when given element has no id value and no name value', () => {
      it('generates a unique prefixed id based on 4 random characters', () => {
        const element = document.createElement('select');
        const prefix = 'test-prefix';

        const output = generateId(element, prefix);
        const expectedOutput = `${prefix}-`;

        expect(output).to.contain(expectedOutput);
        expect(output).to.have.length(expectedOutput.length + 4);
      });
    });
  });

  describe('sanitise', () => {
    describe('when passing a parameter that is not a string', () => {
      it('returns the passed argument', () => {
        const value = {
          test: true,
        };
        const output = sanitise(value);
        expect(output).to.equal(value);
      });
    });

    describe('when passing a string', () => {
      it('strips HTML from value', () => {
        const value = '<script>somethingMalicious();</script>';
        const output = sanitise(value);
        expect(output).to.equal(
          '&lt;script&gt;somethingMalicious();&lt;/script&gt;',
        );
      });
    });
  });

  describe('sortByAlpha', () => {
    describe('sorting an array', () => {
      it('sorts by value alphabetically', () => {
        const values = [
          { value: 'The Strokes' },
          { value: 'Arctic Monkeys' },
          { value: 'Oasis' },
          { value: 'Tame Impala' },
        ];

        const output = values.sort(sortByAlpha);

        expect(output).to.deep.equal([
          { value: 'Arctic Monkeys' },
          { value: 'Oasis' },
          { value: 'Tame Impala' },
          { value: 'The Strokes' },
        ]);
      });

      it('sorts by label alphabetically', () => {
        const values = [
          { value: '0', label: 'The Strokes' },
          { value: '0', label: 'Arctic Monkeys' },
          { value: '0', label: 'Oasis' },
          { value: '0', label: 'Tame Impala' },
        ];

        const output = values.sort(sortByAlpha);

        expect(output).to.deep.equal([
          { value: '0', label: 'Arctic Monkeys' },
          { value: '0', label: 'Oasis' },
          { value: '0', label: 'Tame Impala' },
          { value: '0', label: 'The Strokes' },
        ]);
      });
    });
  });

  describe('sortByScore', () => {
    describe('sorting an array', () => {
      it('sorts by score ascending', () => {
        const values = [
          { score: 10 },
          { score: 3001 },
          { score: 124 },
          { score: 400 },
        ];

        const output = values.sort(sortByScore);

        expect(output).to.deep.equal([
          { score: 10 },
          { score: 124 },
          { score: 400 },
          { score: 3001 },
        ]);
      });
    });
  });

  describe('dispatchEvent', () => {
    it('dispatches custom event of given type on given element', () => {
      const fakeElement = {
        dispatchEvent: stub(),
      };
      const eventType = EventType.addItem;
      const customArgs = {
        testing: true,
      };

      dispatchEvent(fakeElement as any, eventType, customArgs);

      expect(fakeElement.dispatchEvent.called).to.equal(true);
      const event = fakeElement.dispatchEvent.lastCall.args[0];
      expect(event).to.be.instanceof(CustomEvent);
      expect(event.bubbles).to.equal(true);
      expect(event.cancelable).to.equal(true);
      expect(event.detail).to.equal(customArgs);
    });
  });

  describe('cloneObject', () => {
    it('deeply clones a given object', () => {
      const object = {
        levelOne: {
          id: 1,
          levelTwo: {
            id: 2,
            levelThree: {
              id: 3,
              levelFour: {
                id: 4,
              },
            },
          },
        },
      };

      const output = cloneObject(object);

      expect(output).to.not.equal(object);
      expect(output).to.deep.equal(object);
    });
  });

  describe('diff', () => {
    it('returns an array of keys present on the first but missing on the second object', () => {
      const obj1 = {
        foo: 'bar',
        baz: 'foo',
      };
      const obj2 = {
        foo: 'bar',
      };

      const output = diff(obj1, obj2);

      expect(output).to.deep.equal(['baz']);
    });
  });

  describe('_parseCustomProperties', () => {
    describe('when custom properties are valid json', () => {
      it('returns the properties as object', () => {
        const customProperties = '{"description": "foo", "bar": "foo"}';
        const result = { description: 'foo', bar: 'foo' };

        const value = parseCustomProperties(customProperties);
        expect(value).to.deep.equal(result);
      });
    });
    describe('when custom properties are undefined', () => {
      it('returns an empty object', () => {
        const customProperties = undefined;
        const result = {};

        const value = parseCustomProperties(customProperties);
        expect(value).to.deep.equal(result);
      });
    });
  });
});
