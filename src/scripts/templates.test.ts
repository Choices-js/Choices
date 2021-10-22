import { expect } from 'chai';
import templates from './templates';
import { strToEl } from './lib/utils';

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

describe('templates', () => {
  describe('containerOuter', () => {
    const classes = {
      containerOuter: 'class-1',
    };
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
              class="${classes.containerOuter}"
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
            classes,
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
              class="${classes.containerOuter}"
              data-type="${passedElementType}"
              role="listbox"
              aria-haspopup="true"
              aria-expanded="false"
              dir="${direction}"
              >
            </div>
          `);
          const actualOutput = templates.containerOuter(
            classes,
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
              class="${classes.containerOuter}"
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
            classes,
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
            class="${classes.containerOuter}"
            data-type="${passedElementType}"
            aria-haspopup="true"
            aria-expanded="false"
            dir="${direction}"
            >
          </div>
        `);
        const actualOutput = templates.containerOuter(
          classes,
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
      const classes = {
        containerInner: 'class-1',
      };
      const expectedOutput = strToEl(
        `<div class="${classes.containerInner}"></div>`,
      );
      const actualOutput = templates.containerInner(classes);

      expectEqualElements(actualOutput, expectedOutput);
    });
  });

  describe('itemList', () => {
    const classes = {
      list: 'class-1',
      listSingle: 'class-2',
      listItems: 'class-3',
    };

    describe('select one element', () => {
      it('returns expected html', () => {
        const expectedOutput = strToEl(
          `<div class="${classes.list} ${classes.listSingle}"></div>`,
        );
        const actualOutput = templates.itemList(classes, true);

        expectEqualElements(actualOutput, expectedOutput);
      });
    });

    describe('non select one element', () => {
      it('returns expected html', () => {
        const expectedOutput = strToEl(
          `<div class="${classes.list} ${classes.listItems}"></div>`,
        );
        const actualOutput = templates.itemList(classes, false);

        expectEqualElements(actualOutput, expectedOutput);
      });
    });
  });

  describe('placeholder', () => {
    it('returns expected html', () => {
      const classes = {
        placeholder: 'class-1',
      };
      const value = 'test';
      const expectedOutput = strToEl(`
        <div class="${classes.placeholder}">${value}</div>`);
      const actualOutput = templates.placeholder(classes, value);

      expectEqualElements(actualOutput, expectedOutput);
    });
  });

  describe('choiceList', () => {
    const classes = {
      list: 'class-1',
    };

    describe('select one element', () => {
      it('returns expected html', () => {
        const expectedOutput = strToEl(`
          <div
            class="${classes.list}"
            role="listbox"
            >
          </div>
        `);
        const actualOutput = templates.choiceList(classes, true);

        expectEqualElements(actualOutput, expectedOutput);
      });
    });

    describe('non select one element', () => {
      it('returns expected html', () => {
        const expectedOutput = strToEl(`
          <div
            class="${classes.list}"
            role="listbox"
            aria-multiselectable="true"
            >
          </div>
        `);
        const actualOutput = templates.choiceList(classes, false);

        expectEqualElements(actualOutput, expectedOutput);
      });
    });
  });

  describe('choiceGroup', () => {
    const classes = {
      group: 'class-1',
      groupHeading: 'class-2',
      itemDisabled: 'class-3',
    };

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
          class="${classes.group}"
            data-group
            data-id="${data.id}"
            data-value="${data.value}"
            role="group"
            >
            <div class="${classes.groupHeading}">${data.value}</div>
          </div>
        `);
        const actualOutput = templates.choiceGroup(classes, data);

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
            class="${classes.group} ${classes.itemDisabled}"
            data-group
            data-id="${data.id}"
            data-value="${data.value}"
            role="group"
            aria-disabled="true"
            >
            <div class="${classes.groupHeading}">${data.value}</div>
          </div>
        `);
        const actualOutput = templates.choiceGroup(classes, data);

        expectEqualElements(actualOutput, expectedOutput);
      });
    });
  });

  describe('choice', () => {
    const classes = {
      item: 'class-1',
      itemChoice: 'class-2',
      itemDisabled: 'class-3',
      itemSelectable: 'class-4',
      placeholder: 'class-5',
      selectedState: 'class-6',
    };

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
            class="${classes.item} ${classes.itemChoice} ${classes.itemSelectable}"
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
        const actualOutput = templates.choice(classes, data, itemSelectText);

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
            class="${classes.item} ${classes.itemChoice} ${classes.itemDisabled}"
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
        const actualOutput = templates.choice(classes, data, itemSelectText);

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
            class="${classes.item} ${classes.itemChoice} ${classes.selectedState} ${classes.itemSelectable}"
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
        const actualOutput = templates.choice(classes, data, itemSelectText);

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
            class="${classes.item} ${classes.itemChoice} ${classes.placeholder} ${classes.itemSelectable}"
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
        const actualOutput = templates.choice(classes, data, itemSelectText);

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
            class="${classes.item} ${classes.itemChoice} ${classes.itemSelectable}"
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
        const actualOutput = templates.choice(classes, data, itemSelectText);

        expectEqualElements(actualOutput, expectedOutput);
      });
    });
  });

  describe('input', () => {
    const classes = {
      input: 'class-1',
      inputCloned: 'class-2',
    };

    it('returns expected html', () => {
      /*
        Following attributes are not supported by JSDOM, so, can't compare
          autocapitalize="off"
          spellcheck="false"
      */
      const expectedOutput = strToEl(`
        <input
          type="text"
          class="${classes.input} ${classes.inputCloned}"
          autocomplete="off"
          role="textbox"
          aria-autocomplete="list"
          aria-label="test placeholder"
        >
      `);
      const actualOutput = templates.input(classes, 'test placeholder');

      expectEqualElements(actualOutput, expectedOutput);
    });
  });

  describe('dropdown', () => {
    const classes = {
      list: 'class-1',
      listDropdown: 'class-2',
    };

    it('returns expected html', () => {
      const expectedOutput = strToEl(
        `<div class="${classes.list} ${classes.listDropdown}" aria-expanded="false"></div>`,
      );
      const actualOutput = templates.dropdown(classes);

      expectEqualElements(actualOutput, expectedOutput);
    });
  });

  describe('notice', () => {
    const classes = {
      item: 'class-1',
      itemChoice: 'class-2',
      noResults: 'class-3',
      noChoices: 'class-4',
    };

    const label = 'test';

    it('returns expected html', () => {
      const expectedOutput = strToEl(`
        <div class="${classes.item} ${classes.itemChoice}">
          ${label}
        </div>
      `);
      const actualOutput = templates.notice(classes, label);

      expectEqualElements(actualOutput, expectedOutput);
    });

    describe('passing a notice type', () => {
      describe('no results', () => {
        it('adds no results classname', () => {
          const expectedOutput = strToEl(`
            <div class="${classes.item} ${classes.itemChoice} ${classes.noResults}">
              ${label}
            </div>
          `);
          const actualOutput = templates.notice(classes, label, 'no-results');

          expectEqualElements(actualOutput, expectedOutput);
        });
      });

      describe('no choices', () => {
        it('adds no choices classname', () => {
          const expectedOutput = strToEl(`
            <div class="${classes.item} ${classes.itemChoice} ${classes.noChoices}">
              ${label}
            </div>
          `);
          const actualOutput = templates.notice(classes, label, 'no-choices');

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
