/* eslint-disable no-new-wrappers */
import { expect } from 'chai';
import { stub } from 'sinon';

import {
  cloneObject,
  diff,
  dispatchEvent,
  existsInArray,
  generateChars,
  generateId,
  getRandomNumber,
  getType,
  isType,
  sanitise,
  sortByAlpha,
  sortByScore,
} from './utils';

describe('utils', () => {
  describe('getRandomNumber', () => {
    it('returns random number between range', () => {
      for (let index = 0; index < 10; index++) {
        const output = getRandomNumber(1, 10);
        expect(output).to.be.a('number');
        expect(output).to.be.within(1, 10);
      }
    });
  });

  describe('generateChars', () => {
    it('generates a string of random chars with given length', () => {
      const output = generateChars(10);
      expect(output).to.be.a('string');
      expect(output).to.have.length(10);
    });
  });

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

  describe('getType', () => {
    it('returns type of given object', () => {
      expect(getType({})).to.equal('Object');
      expect(getType(1)).to.equal('Number');
      expect(getType(true)).to.equal('Boolean');
      expect(getType([])).to.equal('Array');
      expect(getType(() => {})).to.equal('Function');
      expect(getType(new Error())).to.equal('Error');
      expect(getType(/''/g)).to.equal('RegExp');
      expect(getType(new String())).to.equal('String'); // eslint-disable-line
      expect(getType('')).to.equal('String');
    });
  });

  describe('isType', () => {
    it('checks with given object type equals given type', () => {
      expect(isType('Object', {})).to.equal(true);
      expect(isType('String', {})).to.equal(false);
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

        expect(output).to.eql([
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

        expect(output).to.eql([
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

        expect(output).to.eql([
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
      const eventType = 'addItem';
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

  describe('existsInArray', () => {
    it('determines whether a value exists within given array', () => {
      const values = [
        { value: 'The Strokes' },
        { value: 'Arctic Monkeys' },
        { value: 'Oasis' },
        { value: 'Tame Impala' },
      ];

      expect(existsInArray(values, 'Oasis', 'value')).to.equal(true);
      expect(existsInArray(values, 'The Beatles', 'value')).to.equal(false);
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
      expect(output).to.eql(object);
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
});
