import { expect } from '@playwright/test';
import { test } from '../bundle-test';
import { SelectTestSuit } from '../select-test-suit';
import { sanitise } from '../../src/scripts/lib/utils';

const { describe } = test;

const testUrl = '/test/select-one/index.html';

describe(`Choices - select one`, () => {
  describe('scenarios', () => {
    describe('basic', () => {
      const testId = 'basic';
      const inputValue = 'test';

      describe('focusing on container', () => {
        describe('pressing enter key', () => {
          test('toggles the dropdown', async ({ page, bundle }) => {
            const suite = new SelectTestSuit(page, bundle, testUrl, testId);
            await suite.start();
            await suite.wrapper.focus();
            await suite.enterKey();
            await suite.expectVisibleDropdown();
            await suite.escapeKey();
            await suite.expectHiddenDropdown();
          });
        });

        describe('click selected element', () => {
          test('toggles the dropdown', async ({ page, bundle }) => {
            const suite = new SelectTestSuit(page, bundle, testUrl, testId);
            await suite.startWithClick();

            const box = (await suite.itemList.locator('[data-item]').boundingBox())!;
            await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await page.mouse.down();
            await suite.advanceClock();
            await suite.expectVisibleDropdown();

            await page.mouse.up();
            await suite.advanceClock();
            await suite.expectHiddenDropdown();

            await page.mouse.down();
            await suite.advanceClock();
            await suite.expectHiddenDropdown();

            await page.mouse.up();
            await suite.advanceClock();
            await suite.expectVisibleDropdown();
          });
        });

        describe('pressing an alpha-numeric key', () => {
          test('opens the dropdown and the input value', async ({ page, bundle }) => {
            const suite = new SelectTestSuit(page, bundle, testUrl, testId);
            await suite.start();
            await suite.selectByKeyPress(inputValue);
            await expect(suite.input).toHaveValue(inputValue);
          });
        });
      });

      describe('selecting choices', () => {
        const selectedChoiceText = 'Choice 1';

        test('allows selecting choices from dropdown', async ({ page, bundle }) => {
          const suite = new SelectTestSuit(page, bundle, testUrl, testId);
          await suite.startWithClick();

          await suite.choices.first().click();
          await expect(suite.items.last()).toHaveText(selectedChoiceText);
          await expect(suite.items.last()).not.toHaveText('!--');
        });

        test('does not remove selected choice from dropdown list', async ({ page, bundle }) => {
          const suite = new SelectTestSuit(page, bundle, testUrl, testId);
          await suite.startWithClick();

          await suite.choices.first().click();
          await expect(suite.choices.first()).toHaveText(selectedChoiceText);
          await expect(suite.items.last()).toHaveText(selectedChoiceText);
        });
      });

      describe('keys for choice', () => {
        test('up/down arrows for selection', async ({ page, bundle }) => {
          const suite = new SelectTestSuit(page, bundle, testUrl, testId);
          await suite.startWithClick();

          await suite.input.press('ArrowDown');
          await expect(suite.choices.first()).not.toHaveClass(/is-highlighted/);
          await expect(suite.choices.nth(1)).toHaveClass(/is-highlighted/);

          await suite.input.press('ArrowUp');
          await expect(suite.choices.first()).toHaveClass(/is-highlighted/);
          await expect(suite.choices.nth(1)).not.toHaveClass(/is-highlighted/);
        });

        test('page-up/page-down arrows for selection', async ({ page, bundle }) => {
          const suite = new SelectTestSuit(page, bundle, testUrl, testId);
          await suite.startWithClick();

          await suite.input.press('PageDown');
          await expect(suite.choices.first()).not.toHaveClass(/is-highlighted/);
          await expect(suite.choices.last()).toHaveClass(/is-highlighted/);

          await suite.input.press('PageUp');
          await expect(suite.choices.first()).toHaveClass(/is-highlighted/);
          await expect(suite.choices.last()).not.toHaveClass(/is-highlighted/);
        });
      });

      describe('searching choices', () => {
        const validValue = 'item2';
        const validLabelForValue = 'Choice 2';
        const validLabel = 'Choice 3';
        const invalidLabel = 'faergge';

        describe('on input', () => {
          describe('searching by label', () => {
            test('displays choices filtered by inputted value', async ({ page, bundle }) => {
              const suite = new SelectTestSuit(page, bundle, testUrl, testId);
              await suite.startWithClick();
              await suite.typeText(validValue);

              await suite.expectVisibleDropdownWithItem(validLabelForValue);
            });
          });

          describe('searching by value', () => {
            test('displays choices filtered by inputted value', async ({ page, bundle }) => {
              const suite = new SelectTestSuit(page, bundle, testUrl, testId);
              await suite.startWithClick();
              await suite.typeText(validLabel);

              await suite.expectVisibleDropdownWithItem(validLabel);
            });
          });

          describe('no results found', () => {
            test('displays "no results found" prompt', async ({ page, bundle }) => {
              const suite = new SelectTestSuit(page, bundle, testUrl, testId);
              await suite.startWithClick();
              await suite.typeText(invalidLabel);

              await suite.expectVisibleNoticeHtml('No results found', true);
            });
          });
        });
        describe('on paste', () => {
          // playwright lacks clipboard isolation, so use serial mode to try to work around it.
          // https://github.com/microsoft/playwright/issues/13097
          describe.configure({ mode: 'serial', timeout: 30000 });

          describe('searching by label', () => {
            test('displays choices filtered by inputted value', async ({ page, bundle }) => {
              const suite = new SelectTestSuit(page, bundle, testUrl, testId);
              await suite.startWithClick();

              await suite.pasteText(validValue);

              await suite.expectVisibleDropdownWithItem(validLabelForValue);
            });
          });

          describe('searching by value', () => {
            test('displays choices filtered by inputted value', async ({ page, bundle }) => {
              const suite = new SelectTestSuit(page, bundle, testUrl, testId);
              await suite.startWithClick();

              await suite.pasteText(validLabel);

              await suite.expectVisibleDropdownWithItem(validLabel);
            });
          });

          describe('no results found', () => {
            test('displays "no results found" prompt', async ({ page, bundle }) => {
              const suite = new SelectTestSuit(page, bundle, testUrl, testId);
              await suite.startWithClick();

              await suite.pasteText(invalidLabel);

              await suite.expectVisibleNoticeHtml('No results found', true);
            });
          });
        });
      });

      describe('disabling', () => {
        describe('on disable', () => {
          test('disables the search input', async ({ page, bundle }) => {
            const suite = new SelectTestSuit(page, bundle, testUrl, testId);
            await suite.startWithClick();
            await suite.group.locator('button.disable').click();
            await expect(suite.wrapper).toBeDisabled();
            await expect(suite.input).toBeDisabled();
          });
        });
      });

      describe('enabling', () => {
        describe('on enable', () => {
          test('enables the search input', async ({ page, bundle }) => {
            const suite = new SelectTestSuit(page, bundle, testUrl, testId);
            await suite.startWithClick();
            await suite.group.locator('button.disable').click();
            await suite.group.locator('button.enable').click();
            await expect(suite.wrapper).toBeEnabled();
            await expect(suite.input).toBeEnabled();
          });
        });
      });
    });

    describe('selected choice highlighted in dropdown', () => {
      const selectedChoice = 'Choice 3';
      test('on', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, 'selected-choice-in-dropdown');
        await suite.startWithClick();

        await suite.expectedItemCount(1);
        await suite.expectedValue(selectedChoice);

        await expect(suite.choices.nth(2)).toHaveClass(/is-highlighted/);
      });
    });

    describe('remove button', () => {
      const testId = 'remove-button';
      describe('on click', () => {
        test('removes default', async ({ page, bundle }) => {
          const suite = new SelectTestSuit(page, bundle, testUrl, testId);
          await suite.start();
          await suite.expectHiddenDropdown();

          await suite.expectedItemCount(1);
          await suite.expectedValue('Choice 1');

          await suite.items.getByRole('button', { name: 'Remove item' }).last().click();
          await suite.advanceClock();

          await suite.expectedItemCount(0);
          await suite.expectedValue('');
          await suite.expectHiddenDropdown();
        });

        test('removes selected choice', async ({ page, bundle }) => {
          const defaultChoice = 'Choice 1';
          const selectedChoice = 'Choice 4';
          const suite = new SelectTestSuit(page, bundle, testUrl, testId);
          await suite.startWithClick();

          await suite.expectedItemCount(1);
          await suite.expectedValue(defaultChoice);

          const choice = suite.choices.last();
          await expect(choice).toHaveText(selectedChoice);
          await choice.click();

          await suite.expectedItemCount(1);
          await suite.expectedValue(selectedChoice);

          await suite.items.getByRole('button', { name: 'Remove item' }).last().click();

          await suite.expectedItemCount(0);
          await suite.expectedValue('');
          await suite.expectHiddenDropdown();
        });

        describe('with should sort', () => {
          test('on', async ({ page, bundle }) => {
            const suite = new SelectTestSuit(page, bundle, testUrl, 'remove-button-with-sorting-on');
            await suite.startWithClick();
            await suite.expectVisibleDropdown();

            await suite.items.getByRole('button', { name: 'Remove item' }).last().click();
            await suite.advanceClock();

            const firstChoice = suite.choices.first();
            await expect(firstChoice).toHaveText('Choice 1');
            const lastChoice = suite.choices.last();
            await expect(lastChoice).toHaveText('Choice 4');

            await suite.escapeKey();
            await suite.expectHiddenDropdown();
          });

          test('off', async ({ page, bundle }) => {
            const suite = new SelectTestSuit(page, bundle, testUrl, 'remove-button-with-sorting-off');
            await suite.startWithClick();
            await suite.expectVisibleDropdown();

            await suite.items.getByRole('button', { name: 'Remove item' }).last().click();
            await suite.advanceClock();

            const firstChoice = suite.choices.first();
            await expect(firstChoice).toHaveText('Choice 4');
            const lastChoice = suite.choices.last();
            await expect(lastChoice).toHaveText('Choice 1');

            await suite.escapeKey();
            await suite.expectHiddenDropdown();
          });
        });
      });
    });

    describe('duplicate-items', () => {
      test('shows all duplicate items', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, 'duplicate-items-allowed');
        await suite.startWithClick();

        await expect(suite.selectableChoices).toHaveCount(5);
      });
      test('shows unique items', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, 'duplicate-items-disallowed');
        await suite.startWithClick();

        await expect(suite.selectableChoices).toHaveCount(3);
      });
    });

    describe('no choices', () => {
      const testId = 'no-choices';
      test('shows no choices banner', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.startWithClick();

        await expect(suite.selectableChoices).toHaveCount(0);
        await suite.expectVisibleNoticeHtml('No choices to choose from', true);
      });
    });

    describe('Selected choices rendering', () => {
      test('Skip render selected choices', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, 'renderSelectedChoices-true');
        await suite.startWithClick();

        await expect(suite.selectableChoices).toHaveCount(1);
      });
    });

    describe('No choices (besides selected)', () => {
      const testId = 'no-choices2';
      test('shows no choices banner', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.startWithClick();

        await expect(suite.selectableChoices).toHaveCount(0);
        await suite.expectVisibleNoticeHtml('No choices to choose from', true);
      });

      test('shows no results banner and then no choices banner', async ({ page, bundle }) => {
        const invalidLabel = 'faergge';
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.startWithClick();

        await suite.typeText(invalidLabel);
        await expect(suite.selectableChoices).toHaveCount(0);
        await suite.expectVisibleNoticeHtml('No results found', true);

        await suite.typeText('');
        await expect(suite.selectableChoices).toHaveCount(0);
        await suite.expectVisibleNoticeHtml('No choices to choose from', true);
      });
    });

    describe('disabled choice', () => {
      const testId = 'disabled-choice';
      const firstChoice = 'Choice 1';
      test('does not change selected choice', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.startWithClick();

        await suite.expectedItemCount(1);
        await suite.expectedValue(firstChoice);

        const choice = suite.choices.last();
        await expect(choice).toBeDisabled();
        await choice.click({ force: true });

        await suite.expectedItemCount(1);
        await suite.expectedValue(firstChoice);
      });
    });

    describe('Disabled first choice by options', () => {
      const testId = 'disabled-first-choice-via-options';
      const firstChoice = 'Choice 2';
      test('does not change selected choice', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.startWithClick();

        await suite.expectedItemCount(1);
        await suite.expectedValue(firstChoice);

        const choice = suite.choices.first();
        await expect(choice).toBeDisabled();
        await choice.click({ force: true });

        await suite.expectedItemCount(1);
        await suite.expectedValue(firstChoice);
      });
    });

    describe('disabled via attribute', () => {
      const testId = 'disabled-via-attr';
      test('disables the search input', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.start();
        await suite.wrapper.click({ force: true });

        await expect(suite.wrapper).toBeDisabled();
        await suite.expectHiddenDropdown();
      });
    });

    describe('disabled via fieldset', () => {
      const testId = 'disabled-via-fieldset';
      test('disables the search input', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.start();
        await suite.wrapper.click({ force: true });

        await expect(suite.wrapper).toBeDisabled();
        await suite.expectHiddenDropdown();
      });
    });

    describe('prepend/append', () => {
      const testId = 'prepend-append';
      const textInput = 'Choice 1';
      test('prepends and appends value to inputted value', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.startWithClick();

        const item = suite.items.first();
        await expect(item).toHaveText(textInput);
        await expect(item).toHaveAttribute('data-value', `before-${textInput}-after`);
      });
    });

    describe('render choice limit', () => {
      const testId = 'render-choice-limit';
      test('only displays given number of choices in the dropdown', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.startWithClick();

        expect(await suite.choices.count()).toEqual(1);
      });
    });

    describe('search disabled', () => {
      const testId = 'search-disabled';
      test('does not display a search input', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.startWithClick();

        await expect(suite.input).toHaveCount(0);
      });

      test('allows selecting choices from dropdown', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.startWithClick();

        const choice = suite.choices.last();
        const text = await choice.innerText();
        await expect(choice).toBeEnabled();
        await choice.click();

        await suite.expectedItemCount(1);
        await suite.expectedValue(text);
        await suite.expectHiddenDropdown();
      });
    });

    describe('search floor', () => {
      const testId = 'search-floor';
      describe('on input', () => {
        describe('search floor not reached', () => {
          test('displays choices not filtered by inputted value', async ({ page, bundle }) => {
            const suite = new SelectTestSuit(page, bundle, testUrl, testId);
            await suite.startWithClick();

            const searchTerm = 'item 2';
            await suite.typeText(searchTerm);
            await suite.expectVisibleDropdown();
            await expect(suite.choices.first()).not.toHaveText(searchTerm);
          });
        });

        describe('search floor reached', () => {
          test('displays choices filtered by inputted value', async ({ page, bundle }) => {
            const suite = new SelectTestSuit(page, bundle, testUrl, testId);
            await suite.startWithClick();

            const searchTerm = 'Choice 2';

            await suite.typeText(searchTerm);
            await suite.expectVisibleDropdown();
            await expect(suite.choices.first()).toHaveText(searchTerm);
          });
        });
      });
    });

    [
      {
        name: 'empty option value',
        testId: 'placeholder-via-option-value',
      },
      {
        name: 'option attribute',
        testId: 'placeholder-via-option-attr',
      },
      {
        name: 'data attribute',
        testId: 'placeholder-via-data-attr',
      },
    ].forEach((arg) => {
      const { testId } = arg;
      describe(`Placeholder via ${arg.name}`, () => {
        describe('when no choice has been selected', () => {
          test('displays a placeholder', async ({ page, bundle }) => {
            const suite = new SelectTestSuit(page, bundle, testUrl, testId);
            await suite.startWithClick();

            await suite.expectedItemCount(0);
            await suite.expectedValue('');

            const item = suite.itemsWithPlaceholder.first();
            await expect(item).toHaveClass(/choices__placeholder/);
            await expect(item).toHaveText('I am a placeholder');
          });
        });

        describe('when a choice has been selected', () => {
          test('does not display a placeholder', async ({ page, bundle }) => {
            const suite = new SelectTestSuit(page, bundle, testUrl, testId);
            await suite.startWithClick();

            const choice = suite.selectableChoices.first();
            await choice.click();

            const item = suite.itemsWithPlaceholder.first();
            await expect(item).not.toHaveClass(/choices__placeholder/);
            await expect(item).not.toHaveText('I am a placeholder');
            await suite.expectHiddenDropdown();
          });
        });

        describe('when choice list is open', () => {
          if (testId === 'placeholder-via-data-attr') {
            test('does not displays the placeholder choice first', async ({ page, bundle }) => {
              const suite = new SelectTestSuit(page, bundle, testUrl, testId);
              await suite.startWithClick();

              const choice = suite.choices.first();
              await expect(choice).not.toHaveClass(/choices__placeholder/);
              await expect(choice).not.toHaveText('I am a placeholder');
            });
          } else {
            test('displays the placeholder choice first', async ({ page, bundle }) => {
              const suite = new SelectTestSuit(page, bundle, testUrl, testId);
              await suite.startWithClick();

              const choice = suite.choices.first();
              await expect(choice).toHaveClass(/choices__placeholder/);
              await expect(choice).toHaveText('I am a placeholder');
            });
          }
        });
      });
    });

    describe('remote data', () => {
      const testId = 'remote-data';
      test('checking placeholder values', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);

        const jsonLoad = page.waitForResponse('**/data.json');
        const stopJsonWaiting = await suite.delayData();
        await suite.start();

        await expect(suite.itemList.first()).toHaveText('Loading...');

        stopJsonWaiting();
        await jsonLoad;
        await suite.selectByClick();

        const firstItem = suite.itemsWithPlaceholder.first();
        await expect(firstItem).toHaveClass(/choices__placeholder/);
        await expect(firstItem).toHaveText('I am a placeholder');
        await expect(suite.selectableChoices).toHaveCount(10);
      });

      const testIdForDisabled = 'remote-disabled-data';
      test('checking disabled items are shown in dropdown', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testIdForDisabled);

        const jsonLoad = page.waitForResponse('**/disabled-data.json');
        const stopJsonWaiting = await suite.delayDisaabledData();
        await suite.start();

        await expect(suite.itemList.first()).toHaveText('Loading...');

        stopJsonWaiting();
        await jsonLoad;
        await suite.selectByClick();

        const firstItem = suite.itemsWithPlaceholder.first();
        await expect(firstItem).toHaveClass(/choices__placeholder/);
        await expect(firstItem).toHaveText('I am a placeholder');

        const lastChoice = suite.selectableChoices.last();
        await expect(lastChoice).toHaveClass(/choices__item--disabled/);
        await expect(lastChoice).toHaveText('Disabled Label 10');

        await expect(suite.selectableChoices.locator(':not(.choices__item--disabled)')).toHaveCount(0);
        await expect(suite.selectableChoices.locator('+ .choices__item--disabled')).toHaveCount(9);
      });
    });

    describe('scrolling dropdown', () => {
      const testId = 'scrolling-dropdown';
      test('shows partial choices list', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.startWithClick();

        await expect(suite.selectableChoices).toHaveCount(15);
        // @todo determine how to assert items
        // await expect(suite.selectableChoices.filter({ has: page.locator(':scope:visible') })).toHaveCount(8);
      });
    });

    describe('choice groups', () => {
      describe('just groups', () => {
        const testId = 'groups';
        test('displays', async ({ page, bundle }) => {
          const suite = new SelectTestSuit(page, bundle, testUrl, testId);
          await suite.startWithClick();

          await expect(suite.dropdown.locator('.choices__group[data-group]')).toHaveCount(2);
        });
      });

      describe('groups and choices', () => {
        const testId = 'mixed-groups';
        test('displays', async ({ page, bundle }) => {
          const suite = new SelectTestSuit(page, bundle, testUrl, testId);
          await suite.startWithClick();

          await expect(suite.dropdown.locator('.choices__group[data-group]')).toHaveCount(1);
          expect(await suite.dropdown.locator('.choices__item--choice[data-group-id]').count()).toEqual(1);
          expect(await suite.dropdown.locator('.choices__item--choice:not([data-group-id])').count()).toBeGreaterThan(
            1,
          );
        });
      });
    });

    describe('parent/child', () => {
      const testId = 'parent-child';
      describe('selecting "Parent choice 2"', () => {
        test('enables/disables the child Choices instance', async ({ page, bundle }) => {
          const suite = new SelectTestSuit(page, bundle, testUrl, testId);
          await suite.start();

          const parent = suite.group.locator('.choices').nth(0);
          const child = suite.group.locator('.choices').nth(1);
          await expect(parent).toBeEnabled();
          await expect(child).toBeDisabled();

          await parent.click();
          await expect(suite.dropdown.first()).toBeVisible();
          const parentChoices = parent.locator('.choices__item:not(.choices__placeholder)');

          await parentChoices.filter({ hasText: 'Parent choice 2' }).click();

          await expect(child).toBeEnabled();

          await parent.click();
          await expect(suite.dropdown.first()).toBeVisible();
          const choice = parentChoices.filter({ hasText: 'Parent choice 3' });
          await choice.click();

          await expect(child).toBeDisabled();
        });
      });
    });

    describe('custom properties via config', () => {
      const testId = 'custom-properties';
      const cities = [
        {
          country: 'Germany',
          city: 'Berlin',
        },
        {
          country: 'United Kingdom',
          city: 'London',
        },
        {
          country: 'Portugal',
          city: 'Lisbon',
        },
      ];
      describe('on input', () => {
        cities.forEach(({ country, city }) => {
          test(`filters choices - ${country} = ${city}`, async ({ page, bundle }) => {
            const suite = new SelectTestSuit(page, bundle, testUrl, testId);
            await suite.startWithClick();
            await suite.typeText(country);
            await suite.expectVisibleDropdown();

            const choice = suite.selectableChoices.first();
            await expect(choice).toHaveText(city);
          });

          test(`filters choices - ${city}`, async ({ page, bundle }) => {
            const suite = new SelectTestSuit(page, bundle, testUrl, testId);
            await suite.startWithClick();
            await suite.typeText(city);
            await suite.expectVisibleDropdown();

            const choice = suite.selectableChoices.first();
            await expect(choice).toHaveText(city);
          });
        });
      });

      describe('on paste', () => {
        // playwright lacks clipboard isolation, so use serial mode to try to work around it.
        // https://github.com/microsoft/playwright/issues/13097
        describe.configure({ mode: 'serial', timeout: 30000 });

        cities.forEach(({ country, city }) => {
          test(`filters choices - ${country} = ${city}`, async ({ page, bundle }) => {
            const suite = new SelectTestSuit(page, bundle, testUrl, testId);
            await suite.startWithClick();

            await suite.pasteText(country);

            const choice = suite.selectableChoices.first();
            await expect(choice).toHaveText(city);
          });

          test(`filters choices - ${city}`, async ({ page, bundle }) => {
            const suite = new SelectTestSuit(page, bundle, testUrl, testId);
            await suite.startWithClick();

            await suite.pasteText(city);

            const choice = suite.selectableChoices.first();
            await expect(choice).toHaveText(city);
          });
        });
      });
    });

    describe('custom properties via html', () => {
      const testId = 'custom-properties-html';
      describe('on input', () => {
        [
          {
            searchText: 'fantastic',
            label: 'Label Three',
          },
          {
            searchText: 'foo',
            label: 'Label Four',
          },
        ].forEach(({ searchText, label }) => {
          test(`filters choices - ${searchText} = ${label}`, async ({ page, bundle }) => {
            const suite = new SelectTestSuit(page, bundle, testUrl, testId);
            await suite.startWithClick();
            await suite.typeText(searchText);
            await suite.expectVisibleDropdown();

            const choice = suite.selectableChoices.first();
            await expect(choice).toHaveText(label);
          });
        });
      });
    });

    describe('non-string values', () => {
      const testId = 'non-string-values';
      test('displays expected amount of choices in dropdown', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.startWithClick();

        await expect(suite.selectableChoices).toHaveCount(4);
      });

      test('allows selecting choices from dropdown', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.startWithClick();

        const choice = suite.selectableChoices.first();
        const choiceText = await choice.textContent();
        expect(choiceText).toBeTruthy();
        await choice.click();

        await expect(suite.items.first()).toHaveText(choiceText as string);
      });
    });

    describe('within form', () => {
      const testId = 'within-form';
      describe('selecting choice', () => {
        describe('on enter key', () => {
          test('does not submit form', async ({ page, bundle }) => {
            let submit = false;
            await page.route(page.url(), (route) => {
              submit = true;

              return route.abort();
            });

            const suite = new SelectTestSuit(page, bundle, testUrl, testId);
            await suite.startWithClick();
            await suite.expectVisibleDropdown();

            const choice = suite.choices.first();
            const text = await choice.innerText();
            await expect(choice).toBeEnabled();
            await choice.click();
            await suite.advanceClock();

            await suite.expectedItemCount(1);
            await suite.expectedValue(text);
            expect(submit).toEqual(false);
            await suite.expectHiddenDropdown();
          });
        });
      });
    });

    describe('dynamically setting choice by value', () => {
      const dynamicallySelectedChoiceValue = 'Choice 2';
      const testId = 'set-choice-by-value';
      test('selects choice', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.startWithClick();

        await expect(suite.items).toHaveText(dynamicallySelectedChoiceValue);
        await suite.expectedItemCount(1);
      });

      test('does not remove choice from dropdown list', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.startWithClick();

        await expect(suite.getChoiceWithText(dynamicallySelectedChoiceValue)).toHaveCount(1);
      });

      test('updates the value of the original input', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.startWithClick();

        await suite.expectedValue(dynamicallySelectedChoiceValue);
      });
    });

    describe('searching by label only', () => {
      const testId = 'search-by-label';
      test('gets zero results when searching by value', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.startWithClick();
        await suite.typeText('item2');

        await suite.expectVisibleNoticeHtml('No results found', true);
      });

      test('gets a result when searching by label', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.startWithClick();
        await suite.typeText('label1');
        await suite.expectVisibleDropdown();
        await suite.enterKey();
        await suite.expectHiddenDropdown();

        await expect(suite.items.filter({ hasText: 'label1' })).not.toHaveCount(0);
      });
    });

    describe('html allowed', () => {
      const textInput = 'testing';
      const htmlInput = `<b>${textInput}</b>`;
      const escapedInput = sanitise(htmlInput);
      describe('set to undefined', () => {
        const testId = 'allowhtml-undefined';
        test('does not show html', async ({ page, bundle }) => {
          const suite = new SelectTestSuit(page, bundle, testUrl, testId);
          await suite.startWithClick();
          await suite.typeText(htmlInput);
          await suite.expectVisibleNoticeHtml(`Press Enter to add <b>"${escapedInput}"</b>`);
          await suite.enterKey();

          await expect(suite.items.first()).toHaveText(htmlInput);
        });
      });

      describe('set to true', () => {
        const testId = 'allowhtml-true';
        test('does not show html as text', async ({ page, bundle }) => {
          const suite = new SelectTestSuit(page, bundle, testUrl, testId);
          await suite.startWithClick();
          await suite.typeText(htmlInput);
          await suite.expectVisibleNoticeHtml(`Press Enter to add <b>"${escapedInput}"</b>`);
          await suite.enterKey();

          await expect(suite.items.first()).toHaveText(textInput);
        });
      });

      describe('set to true - except user input', () => {
        const testId = 'allowhtml-true-userinput-false';
        test('does not show html as text', async ({ page, bundle }) => {
          const suite = new SelectTestSuit(page, bundle, testUrl, testId);
          await suite.startWithClick();
          await suite.typeText(htmlInput);
          await suite.expectVisibleNoticeHtml(`Press Enter to add <b>"${escapedInput}"</b>`);
          await suite.enterKey();

          await expect(suite.items.first()).toHaveText(htmlInput);
        });
      });

      describe('set to false', () => {
        const testId = 'allowhtml-false';
        test('does not show html as text', async ({ page, bundle }) => {
          const suite = new SelectTestSuit(page, bundle, testUrl, testId);
          await suite.startWithClick();
          await suite.typeText(htmlInput);
          await suite.expectVisibleNoticeHtml(`Press Enter to add <b>"${escapedInput}"</b>`);
          await suite.enterKey();

          await expect(suite.items.first()).toHaveText(htmlInput);
        });
      });
    });

    describe('re-initialising a choices instance', () => {
      const testId = 'new-destroy-init';
      const testvalue = 'Choice 2';
      test('preserves the choices & items lists', async ({ page, bundle }) => {
        let suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.startWithClick();
        await suite.typeTextAndEnter(testvalue);
        await suite.expectHiddenDropdown();
        await suite.expectedItemCount(1);
        await suite.expectChoiceCount(3);

        await suite.expectHiddenDropdown();

        await suite.group.locator('.destroy').click({ force: true });
        await suite.advanceClock();

        await expect(suite.group.locator('select > optgroup > option')).toHaveCount(1);
        await expect(suite.group.locator('select > option')).toHaveCount(2);

        await suite.group.locator('.init').click({ force: true });
        await suite.advanceClock();

        suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.expectedItemCount(1);
        await suite.expectChoiceCount(3);
        await suite.expectedValue(testvalue);
      });
    });

    describe('autocomplete', () => {
      const testId = 'autocomplete';
      test('Expected notice results', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.startWithClick();
        await suite.typeText('f');
        await expect(suite.input).toHaveValue('f');
        await suite.expectVisibleNoticeHtml('No results found');
        await suite.typeText('fo');
        await expect(suite.input).toHaveValue('fo');
        await suite.expectVisibleDropdownWithItem('Found');

        await suite.keyPress('Backspace');
        await suite.keyPress('Backspace');
        await suite.expectVisibleNoticeHtml('No choices to choose from');
      });
    });

    describe('Clear choices on add item', () => {
      const testId = 'clear-on-add';
      test('Expected items', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, testId);
        await suite.startWithClick();
        await suite.expectChoiceCount(2);

        await suite.choices.last().click();
        await suite.advanceClock();
        await suite.expectedItemCount(1);
        await suite.expectChoiceCount(1);
      });
    });

    describe('setChoices', () => {
      test('Expected selected to be preserved', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, 'set-choices-preserve');
        await suite.start();

        await suite.expectHiddenDropdown();
        await suite.expectedValue('Choice 2');
        await suite.expectedItemCount(1);
        await suite.expectChoiceCount(3);
      });

      test('Expected selected to be preserved (no duplicates)', async ({ page, bundle }) => {
        const suite = new SelectTestSuit(page, bundle, testUrl, 'set-choices-preserve-no-dupes');
        await suite.start();

        await suite.expectHiddenDropdown();
        await suite.expectedValue('Choice 2');
        await suite.expectedItemCount(1);
        await suite.expectChoiceCount(2);
      });
    });
  });
});
