import { expect } from 'chai';
import { SCROLLING_SPEED, DEFAULT_CLASSNAMES, DEFAULT_CONFIG } from '../../src';

describe('constants', () => {
  describe('type checks', () => {
    describe('DEFAULT_CLASSNAMES', () => {
      it('exports as an object with expected keys', () => {
        expect(DEFAULT_CLASSNAMES).to.be.an('object');
        expect(Object.keys(DEFAULT_CLASSNAMES)).to.deep.equal([
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
          'description',
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
          'addChoice',
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
        expect(DEFAULT_CONFIG.addItemFilter).to.a('function');
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

    describe('SCROLLING_SPEED', () => {
      it('exports as an number', () => {
        expect(SCROLLING_SPEED).to.be.a('number');
      });
    });
  });
});
