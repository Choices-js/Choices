import { expect } from 'chai';
import { EVENTS, ACTION_TYPES, KEY_CODES, SCROLLING_SPEED } from './constants';
import { DEFAULT_CLASSNAMES, DEFAULT_CONFIG } from './defaults';

describe('constants', () => {
  describe('type checks', () => {
    describe('DEFAULT_CLASSNAMES', () => {
      it('exports as an object with expected keys', () => {
        expect(DEFAULT_CLASSNAMES).to.be.an('object');
        expect(Object.keys(DEFAULT_CLASSNAMES)).to.eql([
          'containerOuter',
          'containerInner',
          'input',
          'inputCloned',
          'list',
          'listItems',
          'listSingle',
          'listDropdown',
          'item',
          'itemSelectable',
          'itemDisabled',
          'itemChoice',
          'placeholder',
          'group',
          'groupHeading',
          'button',
          'activeState',
          'focusState',
          'openState',
          'disabledState',
          'highlightedState',
          'selectedState',
          'flippedState',
          'loadingState',
          'noResults',
          'noChoices',
        ]);
      });
    });

    describe('DEFAULT_CONFIG', () => {
      it('exports as an object', () => {
        expect(DEFAULT_CONFIG).to.be.an('object');
      });

      it('has expected config options', () => {
        expect(DEFAULT_CONFIG.items).to.be.an('array');
        expect(DEFAULT_CONFIG.choices).to.be.an('array');
        expect(DEFAULT_CONFIG.silent).to.be.a('boolean');
        expect(DEFAULT_CONFIG.renderChoiceLimit).to.be.a('number');
        expect(DEFAULT_CONFIG.maxItemCount).to.be.a('number');
        expect(DEFAULT_CONFIG.addItems).to.be.a('boolean');
        expect(DEFAULT_CONFIG.addItemFilter).to.equal(null);
        expect(DEFAULT_CONFIG.removeItems).to.be.a('boolean');
        expect(DEFAULT_CONFIG.removeItemButton).to.be.a('boolean');
        expect(DEFAULT_CONFIG.editItems).to.be.a('boolean');
        expect(DEFAULT_CONFIG.allowHTML).to.be.a('boolean');
        expect(DEFAULT_CONFIG.duplicateItemsAllowed).to.be.a('boolean');
        expect(DEFAULT_CONFIG.delimiter).to.be.a('string');
        expect(DEFAULT_CONFIG.paste).to.be.a('boolean');
        expect(DEFAULT_CONFIG.searchEnabled).to.be.a('boolean');
        expect(DEFAULT_CONFIG.searchChoices).to.be.a('boolean');
        expect(DEFAULT_CONFIG.searchFloor).to.be.a('number');
        expect(DEFAULT_CONFIG.searchResultLimit).to.be.a('number');
        expect(DEFAULT_CONFIG.searchFields).to.be.an('array');
        expect(DEFAULT_CONFIG.position).to.be.a('string');
        expect(DEFAULT_CONFIG.shouldSort).to.be.a('boolean');
        expect(DEFAULT_CONFIG.shouldSortItems).to.be.a('boolean');
        expect(DEFAULT_CONFIG.placeholder).to.be.a('boolean');
        expect(DEFAULT_CONFIG.placeholderValue).to.equal(null);
        expect(DEFAULT_CONFIG.searchPlaceholderValue).to.equal(null);
        expect(DEFAULT_CONFIG.prependValue).to.equal(null);
        expect(DEFAULT_CONFIG.appendValue).to.equal(null);
        expect(DEFAULT_CONFIG.renderSelectedChoices).to.be.a('string');
        expect(DEFAULT_CONFIG.loadingText).to.be.a('string');
        expect(DEFAULT_CONFIG.noResultsText).to.be.a('string');
        expect(DEFAULT_CONFIG.noChoicesText).to.be.a('string');
        expect(DEFAULT_CONFIG.itemSelectText).to.be.a('string');
        expect(DEFAULT_CONFIG.uniqueItemText).to.be.a('string');
        expect(DEFAULT_CONFIG.customAddItemText).to.be.a('string');
        expect(DEFAULT_CONFIG.addItemText).to.be.a('function');
        expect(DEFAULT_CONFIG.maxItemText).to.be.a('function');
        expect(DEFAULT_CONFIG.fuseOptions).to.be.an('object');
        expect(DEFAULT_CONFIG.callbackOnInit).to.equal(null);
        expect(DEFAULT_CONFIG.callbackOnCreateTemplates).to.equal(null);
      });
    });

    describe('EVENTS', () => {
      it('exports as an object with expected keys', () => {
        expect(EVENTS).to.be.an('object');
        expect(Object.keys(EVENTS)).to.eql([
          'showDropdown',
          'hideDropdown',
          'change',
          'choice',
          'search',
          'addItem',
          'removeItem',
          'highlightItem',
          'highlightChoice',
          'unhighlightItem',
        ]);
      });
    });

    describe('ACTION_TYPES', () => {
      it('exports as an object with expected keys', () => {
        expect(ACTION_TYPES).to.be.an('object');
        expect(Object.keys(ACTION_TYPES)).to.eql([
          'ADD_CHOICE',
          'FILTER_CHOICES',
          'ACTIVATE_CHOICES',
          'CLEAR_CHOICES',
          'ADD_GROUP',
          'ADD_ITEM',
          'REMOVE_ITEM',
          'HIGHLIGHT_ITEM',
          'CLEAR_ALL',
          'RESET_TO',
          'SET_IS_LOADING',
        ]);
      });
    });

    describe('KEY_CODES', () => {
      it('exports as an object with expected keys', () => {
        expect(KEY_CODES).to.be.an('object');
        expect(Object.keys(KEY_CODES)).to.eql([
          'BACK_KEY',
          'DELETE_KEY',
          'ENTER_KEY',
          'A_KEY',
          'ESC_KEY',
          'UP_KEY',
          'DOWN_KEY',
          'PAGE_UP_KEY',
          'PAGE_DOWN_KEY',
        ]);
      });

      it('exports each value as a number', () => {
        Object.keys(KEY_CODES).forEach((key) => {
          expect(KEY_CODES[key]).to.be.a('number');
        });
      });
    });

    describe('SCROLLING_SPEED', () => {
      it('exports as an number', () => {
        expect(SCROLLING_SPEED).to.be.a('number');
      });
    });
  });
});
