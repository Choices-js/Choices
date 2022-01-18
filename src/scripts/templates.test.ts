import { expect } from 'chai';
import templates from './templates';
import { strToEl } from './lib/utils';
import { DEFAULT_CLASSNAMES, DEFAULT_CONFIG } from './defaults';
import { Options } from './interfaces/options';
import { ClassNames } from './interfaces/class-names';

/**
 * @param {HTMLElement} element1
 * @param {HTMLElement} element2
 */
function expectEqualElements(element1, element2): void {
  expect(element1.tagName).to.equal(element2.tagName);
  expect(element1.attributes.length).to.equal(element2.attributes.length);
  expect(Object.keys(element1.dataset)).to.have.members(
    Object.keys(element2.dataset),
  );
  expect(element1.classList).to.include(element2.classList);
  // compare attributes values
  for (const attribute of Object.values(element1.attributes)) {
    expect(element1.getAttribute(attribute)).to.equal(
      element2.getAttribute(attribute),
    );
  }
}

function createOptionsWithPartialClasses(
  classNames: Partial<ClassNames>,
  options: Partial<Options> = {},
): Options {
  return {
    ...DEFAULT_CONFIG,
    ...options,
    classNames: {
      ...DEFAULT_CLASSNAMES,
      ...classNames,
    },
  };
}

describe('templates', () => {
  describe('containerOuter', () => {
    const options = createOptionsWithPartialClasses({
      containerOuter: 'class-1',
    });
    const direction = 'rtl';

    describe('select element', () => {
      describe('search enabled', () => {
        it('returns expected html', () => {
          const isSelectElement = true;
          const isSelectOneElement = false;
          const searchEnabled = true;
          const passedElementType = 'select-multiple';
          const labelId = '';

          const expectedOutput = strToEl(`
            <div
              class="${options.classNames.containerOuter}"
              data-type="${passedElementType}"
              role="combobox"
              aria-autocomplete="list"
              aria-haspopup="true"
              aria-expanded="false"
              dir="${direction}"
              >
            </div>
          `);
          const actualOutput = templates.containerOuter(
            options,
            direction,
            isSelectElement,
            isSelectOneElement,
            searchEnabled,
            passedElementType,
            labelId,
          );
          expectEqualElements(actualOutput, expectedOutput);
        });
      });

      describe('with label id for a11y', () => {
        it('returns expected html', () => {
          const isSelectElement = true;
          const isSelectOneElement = true;
          const searchEnabled = false;
          const passedElementType = 'select-one';
          const labelId = 'testLabelId';

          const expectedOutput = strToEl(`
            <div
              class="${options.classNames.containerOuter}"
              data-type="${passedElementType}"
              role="listbox"
              tabindex="0"
              aria-haspopup="true"
              aria-expanded="false"
              aria-labeledby="${labelId}"
              dir="${direction}"
              >
            </div>
          `);
          const actualOutput = templates.containerOuter(
            options,
            direction,
            isSelectElement,
            isSelectOneElement,
            searchEnabled,
            passedElementType,
            labelId,
          );
          expectEqualElements(actualOutput, expectedOutput);
        });
      });

      describe('search disabled', () => {
        it('returns expected html', () => {
          const isSelectElement = true;
          const isSelectOneElement = false;
          const searchEnabled = false;
          const passedElementType = 'select-multiple';
          const labelId = '';

          const expectedOutput = strToEl(`
            <div
              class="${options.classNames.containerOuter}"
              data-type="${passedElementType}"
              role="listbox"
              aria-haspopup="true"
              aria-expanded="false"
              dir="${direction}"
              >
            </div>
          `);
          const actualOutput = templates.containerOuter(
            options,
            direction,
            isSelectElement,
            isSelectOneElement,
            searchEnabled,
            passedElementType,
            labelId,
          );

          expectEqualElements(actualOutput, expectedOutput);
        });
      });

      describe('select one element', () => {
        it('returns expected html', () => {
          const isSelectElement = true;
          const isSelectOneElement = true;
          const searchEnabled = false;
          const passedElementType = 'select-one';
          const labelId = '';

          const expectedOutput = strToEl(`
            <div
              class="${options.classNames.containerOuter}"
              data-type="${passedElementType}"
              role="listbox"
              tabindex="0"
              aria-haspopup="true"
              aria-expanded="false"
              dir="${direction}"
              >
            </div>
          `);
          const actualOutput = templates.containerOuter(
            options,
            direction,
            isSelectElement,
            isSelectOneElement,
            searchEnabled,
            passedElementType,
            labelId,
          );

          expectEqualElements(actualOutput, expectedOutput);
        });
      });
    });

    describe('non select element', () => {
      it('returns expected html', () => {
        const isSelectElement = false;
        const isSelectOneElement = false;
        const searchEnabled = false;
        const passedElementType = 'text';
        const labelId = '';

        const expectedOutput = strToEl(`
          <div
            class="${options.classNames.containerOuter}"
            data-type="${passedElementType}"
            aria-haspopup="true"
            aria-expanded="false"
            dir="${direction}"
            >
          </div>
        `);
        const actualOutput = templates.containerOuter(
          options,
          direction,
          isSelectElement,
          isSelectOneElement,
          searchEnabled,
          passedElementType,
          labelId,
        );

        expectEqualElements(actualOutput, expectedOutput);
      });
    });
  });

  describe('containerInner', () => {
    it('returns expected html', () => {
      const innerOptions = createOptionsWithPartialClasses({
        containerInner: 'class-1',
      });
      const expectedOutput = strToEl(
        `<div class="${innerOptions.classNames.containerInner}"></div>`,
      );
      const actualOutput = templates.containerInner(innerOptions);

      expectEqualElements(actualOutput, expectedOutput);
    });
  });

  describe('itemList', () => {
    const itemOptions = createOptionsWithPartialClasses({
      list: 'class-1',
      listSingle: 'class-2',
      listItems: 'class-3',
    });

    describe('select one element', () => {
      it('returns expected html', () => {
        const expectedOutput = strToEl(
          `<div class="${itemOptions.classNames.list} ${itemOptions.classNames.listSingle}"></div>`,
        );
        const actualOutput = templates.itemList(itemOptions, true);

        expectEqualElements(actualOutput, expectedOutput);
      });
    });

    describe('non select one element', () => {
      it('returns expected html', () => {
        const expectedOutput = strToEl(
          `<div class="${itemOptions.classNames.list} ${itemOptions.classNames.listItems}"></div>`,
        );
        const actualOutput = templates.itemList(itemOptions, false);

        expectEqualElements(actualOutput, expectedOutput);
      });
    });
  });

  describe('placeholder', () => {
    it('returns expected html', () => {
      const placeholderOptions = createOptionsWithPartialClasses({
        placeholder: 'class-1',
      });
      const value = 'test';
      const expectedOutput = strToEl(`
        <div class="${placeholderOptions.classNames.placeholder}">${value}</div>`);
      const actualOutput = templates.placeholder(placeholderOptions, value);

      expectEqualElements(actualOutput, expectedOutput);
    });
  });

  describe('choiceList', () => {
    const choiceListOptions = createOptionsWithPartialClasses({
      list: 'class-1',
    });

    describe('select one element', () => {
      it('returns expected html', () => {
        const expectedOutput = strToEl(`
          <div
            class="${choiceListOptions.classNames.list}"
            role="listbox"
            >
          </div>
        `);
        const actualOutput = templates.choiceList(choiceListOptions, true);

        expectEqualElements(actualOutput, expectedOutput);
      });
    });

    describe('non select one element', () => {
      it('returns expected html', () => {
        const expectedOutput = strToEl(`
          <div
            class="${choiceListOptions.classNames.list}"
            role="listbox"
            aria-multiselectable="true"
            >
          </div>
        `);
        const actualOutput = templates.choiceList(choiceListOptions, false);

        expectEqualElements(actualOutput, expectedOutput);
      });
    });
  });

  describe('choiceGroup', () => {
    const groupOptions = createOptionsWithPartialClasses({
      group: 'class-1',
      groupHeading: 'class-2',
      itemDisabled: 'class-3',
    });

    let data;

    beforeEach(() => {
      data = {
        id: 1,
        value: 'test',
        disabled: false,
      };
    });

    describe('enabled state', () => {
      it('returns expected html', () => {
        const expectedOutput = strToEl(`
          <div
          class="${groupOptions.classNames.group}"
            data-group
            data-id="${data.id}"
            data-value="${data.value}"
            role="group"
            >
            <div class="${groupOptions.classNames.groupHeading}">${data.value}</div>
          </div>
        `);
        const actualOutput = templates.choiceGroup(groupOptions, data);

        expectEqualElements(actualOutput, expectedOutput);
      });
    });

    describe('disabled state', () => {
      beforeEach(() => {
        data = {
          ...data,
          disabled: true,
        };
      });

      it('returns expected html', () => {
        const expectedOutput = strToEl(`
          <div
            class="${groupOptions.classNames.group} ${groupOptions.classNames.itemDisabled}"
            data-group
            data-id="${data.id}"
            data-value="${data.value}"
            role="group"
            aria-disabled="true"
            >
            <div class="${groupOptions.classNames.groupHeading}">${data.value}</div>
          </div>
        `);
        const actualOutput = templates.choiceGroup(groupOptions, data);

        expectEqualElements(actualOutput, expectedOutput);
      });
    });
  });

  describe('choice', () => {
    const choiceOptions = createOptionsWithPartialClasses({
      item: 'class-1',
      itemChoice: 'class-2',
      itemDisabled: 'class-3',
      itemSelectable: 'class-4',
      placeholder: 'class-5',
      selectedState: 'class-6',
    });

    const itemSelectText = 'test 6';

    let data;

    beforeEach(() => {
      data = {
        id: 1,
        groupId: -1,
        disabled: false,
        elementId: 'test',
        label: 'test',
        value: 'test',
        selected: false,
      };
    });

    describe('enabled state', () => {
      it('returns expected html', () => {
        const expectedOutput = strToEl(`
          <div
            class="${choiceOptions.classNames.item} ${choiceOptions.classNames.itemChoice} ${choiceOptions.classNames.itemSelectable}"
            data-select-text="${itemSelectText}"
            data-choice
            data-id="${data.id}"
            data-value="${data.value}"
            data-choice-selectable
            id="${data.elementId}"
            role="option"
            >
            ${data.label}
          </div>
        `);
        const actualOutput = templates.choice(
          choiceOptions,
          data,
          itemSelectText,
        );

        expectEqualElements(actualOutput, expectedOutput);
      });
    });

    describe('disabled state', () => {
      beforeEach(() => {
        data = {
          ...data,
          disabled: true,
        };
      });

      it('returns expected html', () => {
        const expectedOutput = strToEl(`
          <div
            class="${choiceOptions.classNames.item} ${choiceOptions.classNames.itemChoice} ${choiceOptions.classNames.itemDisabled}"
            data-select-text="${itemSelectText}"
            data-choice
            data-id="${data.id}"
            data-value="${data.value}"
            data-choice-disabled
            aria-disabled="true"
            id="${data.elementId}"
            role="option"
            >
            ${data.label}
          </div>
        `);
        const actualOutput = templates.choice(
          choiceOptions,
          data,
          itemSelectText,
        );

        expectEqualElements(actualOutput, expectedOutput);
      });
    });

    describe('selected state', () => {
      beforeEach(() => {
        data = {
          ...data,
          selected: true,
        };
      });

      it('returns expected html', () => {
        const expectedOutput = strToEl(`
          <div
            class="${choiceOptions.classNames.item} ${choiceOptions.classNames.itemChoice} ${choiceOptions.classNames.selectedState} ${choiceOptions.classNames.itemSelectable}"
            data-select-text="${itemSelectText}"
            data-choice
            data-id="${data.id}"
            data-value="${data.value}"
            data-choice-selectable
            id="${data.elementId}"
            role="option"
            >
            ${data.label}
          </div>
        `);
        const actualOutput = templates.choice(
          choiceOptions,
          data,
          itemSelectText,
        );

        expectEqualElements(actualOutput, expectedOutput);
      });
    });

    describe('placeholder', () => {
      beforeEach(() => {
        data = {
          ...data,
          placeholder: true,
        };
      });

      it('returns expected html', () => {
        const expectedOutput = strToEl(`
          <div
            class="${choiceOptions.classNames.item} ${choiceOptions.classNames.itemChoice} ${choiceOptions.classNames.placeholder} ${choiceOptions.classNames.itemSelectable}"
            data-select-text="${itemSelectText}"
            data-choice
            data-id="${data.id}"
            data-value="${data.value}"
            data-choice-selectable
            id="${data.elementId}"
            role="option"
            >
            ${data.label}
          </div>
        `);
        const actualOutput = templates.choice(
          choiceOptions,
          data,
          itemSelectText,
        );

        expectEqualElements(actualOutput, expectedOutput);
      });
    });

    describe('child of group', () => {
      beforeEach(() => {
        data = {
          ...data,
          groupId: 1,
        };
      });

      it('returns expected html', () => {
        const expectedOutput = strToEl(`
          <div
            class="${choiceOptions.classNames.item} ${choiceOptions.classNames.itemChoice} ${choiceOptions.classNames.itemSelectable}"
            data-select-text="${itemSelectText}"
            data-choice
            data-id="${data.id}"
            data-value="${data.value}"
            data-choice-selectable
            id="${data.elementId}"
            role="treeitem"
            >
            ${data.label}
          </div>
        `);
        const actualOutput = templates.choice(
          choiceOptions,
          data,
          itemSelectText,
        );

        expectEqualElements(actualOutput, expectedOutput);
      });
    });
  });

  describe('input', () => {
    const inputOptions = createOptionsWithPartialClasses({
      input: 'class-1',
      inputCloned: 'class-2',
    });

    it('returns expected html', () => {
      /*
        Following attributes are not supported by JSDOM, so, can't compare
          autocapitalize="off"
          spellcheck="false"
      */
      const expectedOutput = strToEl(`
        <input
          type="search"
          name="search_terms"
          class="${inputOptions.classNames.input} ${inputOptions.classNames.inputCloned}"
          autocomplete="off"
          role="textbox"
          aria-autocomplete="list"
          aria-label="test placeholder"
        >
      `);
      const actualOutput = templates.input(inputOptions, 'test placeholder');

      expectEqualElements(actualOutput, expectedOutput);
    });
  });

  describe('dropdown', () => {
    const dropdownOptions = createOptionsWithPartialClasses({
      list: 'class-1',
      listDropdown: 'class-2',
    });

    it('returns expected html', () => {
      const expectedOutput = strToEl(
        `<div class="${dropdownOptions.classNames.list} ${dropdownOptions.classNames.listDropdown}" aria-expanded="false"></div>`,
      );
      const actualOutput = templates.dropdown(dropdownOptions);

      expectEqualElements(actualOutput, expectedOutput);
    });
  });

  describe('notice', () => {
    const noticeOptions = createOptionsWithPartialClasses({
      item: 'class-1',
      itemChoice: 'class-2',
      noResults: 'class-3',
      noChoices: 'class-4',
    });

    const label = 'test';

    it('returns expected html', () => {
      const expectedOutput = strToEl(`
        <div class="${noticeOptions.classNames.item} ${noticeOptions.classNames.itemChoice}">
          ${label}
        </div>
      `);
      const actualOutput = templates.notice(noticeOptions, label);

      expectEqualElements(actualOutput, expectedOutput);
    });

    describe('passing a notice type', () => {
      describe('no results', () => {
        it('adds no results classname', () => {
          const expectedOutput = strToEl(`
            <div class="${noticeOptions.classNames.item} ${noticeOptions.classNames.itemChoice} ${noticeOptions.classNames.noResults}">
              ${label}
            </div>
          `);
          const actualOutput = templates.notice(
            noticeOptions,
            label,
            'no-results',
          );

          expectEqualElements(actualOutput, expectedOutput);
        });
      });

      describe('no choices', () => {
        it('adds no choices classname', () => {
          const expectedOutput = strToEl(`
            <div class="${noticeOptions.classNames.item} ${noticeOptions.classNames.itemChoice} ${noticeOptions.classNames.noChoices}">
              ${label}
            </div>
          `);
          const actualOutput = templates.notice(
            noticeOptions,
            label,
            'no-choices',
          );

          expectEqualElements(actualOutput, expectedOutput);
        });
      });
    });
  });

  describe('option', () => {
    let data;

    beforeEach(() => {
      data = {
        disabled: false,
        selected: false,
        value: 'test value',
        label: 'test label',
      };
    });

    it('returns expected html', () => {
      const expectedOutput = strToEl(
        `<option value="${data.value}" ${data.selected ? 'selected' : ''} ${
          data.disabled ? 'disabled' : ''
        }>${data.label}</option>`,
      );
      const actualOutput = templates.option(data);

      expectEqualElements(actualOutput, expectedOutput);
    });

    describe('when selected', () => {
      beforeEach(() => {
        data = {
          ...data,
          active: true,
        };
      });

      it('sets selected attr to true', () => {
        const output = templates.option(data);
        expect(output.selected).to.equal(true);
      });
    });

    describe('when disabled', () => {
      beforeEach(() => {
        data = {
          ...data,
          disabled: true,
        };
      });

      it('sets disabled attr to true', () => {
        const output = templates.option(data);
        expect(output.disabled).to.equal(true);
      });
    });
  });
});
