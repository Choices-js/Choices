import { expect } from '@playwright/test';
import { test } from '../bundle-test';
import { TextTestSuit } from '../text-test-suit';
import { sanitise } from '../../src/scripts/lib/utils';

const { describe } = test;

const testUrl = '/test/text/index.html';
const textInput = 'testing';

describe(`Choices - text element`, () => {
  describe('scenarios', () => {
    describe('basic', () => {
      const testId = 'basic';
      describe('adding items', () => {
        test('allows me to input items', async ({ page, bundle }) => {
          const suite = new TextTestSuit(page, bundle, testUrl, testId);
          await suite.start(textInput);
          await suite.expectHiddenDropdown();

          await suite.expectedValue(textInput);
        });

        test('Verify text mode has no choices UI', async ({ page, bundle }) => {
          const suite = new TextTestSuit(page, bundle, testUrl, testId);
          await suite.start(textInput);
          await suite.enterKey();
          await expect(suite.dropdown).not.toHaveText('No choices to choose from');
        });

        describe('inputting data', () => {
          test('shows a dropdown prompt', async ({ page, bundle }) => {
            const suite = new TextTestSuit(page, bundle, testUrl, testId);
            await suite.start();
            await suite.typeText(textInput);

            await suite.expectVisibleNoticeHtml(`Press Enter to add <b>"${textInput}"</b>`);
          });
        });
      });
    });

    describe('editing items', () => {
      const testId = 'edit-items';
      describe('on back space', () => {
        test('allows me to change my entry', async ({ page, bundle }) => {
          const suite = new TextTestSuit(page, bundle, testUrl, testId);
          await suite.start(textInput);
          await suite.backspaceKey();
          await suite.typeTextAndEnter('-edited');
          await suite.expectHiddenDropdown();

          await expect(suite.itemList).toHaveText('-edited');
        });
      });

      describe('on cmd+a', () => {
        test('highlights all items', async ({ page, bundle }) => {
          const suite = new TextTestSuit(page, bundle, testUrl, testId);
          await suite.start(textInput);
          await suite.ctrlA();
          await suite.expectHiddenDropdown();

          expect(await suite.itemList.locator('.is-highlighted').count()).toEqual(1);
        });

        describe('on backspace', () => {
          test('clears all inputted values', async ({ page, bundle }) => {
            const suite = new TextTestSuit(page, bundle, testUrl, testId);
            await suite.start(textInput);
            await suite.ctrlA();
            await suite.backspaceKey();
            await suite.expectHiddenDropdown();

            expect(await suite.itemList.locator('.is-highlighted').count()).toEqual(0);
          });
        });
      });
    });

    describe('remove button', () => {
      const testId = 'remove-button';
      describe('on click', () => {
        test('removes respective choice', async ({ page, bundle }) => {
          const suite = new TextTestSuit(page, bundle, testUrl, testId);
          await suite.start(textInput);
          await suite.expectHiddenDropdown();

          await suite.expectedItemCount(1);

          const button = suite.itemList.getByRole('button');
          await button.focus();
          await button.click();

          await suite.expectedItemCount(0);
          await suite.expectedValue('');
        });
      });
    });

    describe('unique values only', () => {
      const testId = 'unique-values';
      describe('unique values', () => {
        test('only allows me to input unique values', async ({ page, bundle }) => {
          const suite = new TextTestSuit(page, bundle, testUrl, testId);
          await suite.start(textInput);
          await suite.expectHiddenDropdown();

          await suite.typeTextAndEnter(textInput);

          await suite.expectedItemCount(1);
          await suite.expectVisibleNoticeHtml(`Only unique values can be added`);
        });
      });
    });

    describe('html allowed', () => {
      const htmlInput = `<b>${textInput}</b>`;
      const escapedInput = sanitise(htmlInput);
      describe('set to undefined', () => {
        const testId = 'allowhtml-undefined';
        test('does not show html', async ({ page, bundle }) => {
          const suite = new TextTestSuit(page, bundle, testUrl, testId);
          await suite.start();
          await suite.typeText(htmlInput);
          await suite.expectVisibleNoticeHtml(`Press Enter to add <b>"${escapedInput}"</b>`);
          await suite.enterKey();

          await expect(suite.items.first()).toHaveText('<b>Mason Rogers</b>');
          await expect(suite.items.last()).toHaveText(htmlInput);
        });
      });

      describe('set to true', () => {
        const testId = 'allowhtml-true';
        test('does not show html as text', async ({ page, bundle }) => {
          const suite = new TextTestSuit(page, bundle, testUrl, testId);
          await suite.start();
          await suite.typeText(htmlInput);
          await suite.expectVisibleNoticeHtml(`Press Enter to add <b>"${escapedInput}"</b>`);
          await suite.enterKey();

          await expect(suite.items.first()).toHaveText('Mason Rogers');
          await expect(suite.items.last()).toHaveText(textInput);
        });
      });

      describe('set to true - except user input', () => {
        const testId = 'allowhtml-true-userinput-false';
        test('does not show html as text', async ({ page, bundle }) => {
          const suite = new TextTestSuit(page, bundle, testUrl, testId);
          await suite.start();
          await suite.typeText(htmlInput);
          await suite.expectVisibleNoticeHtml(`Press Enter to add <b>"${escapedInput}"</b>`);
          await suite.enterKey();

          await expect(suite.items.first()).toHaveText('Mason Rogers');
          await expect(suite.items.last()).toHaveText(htmlInput);
        });
      });

      describe('set to false', () => {
        const testId = 'allowhtml-false';
        test('does not show html as text', async ({ page, bundle }) => {
          const suite = new TextTestSuit(page, bundle, testUrl, testId);
          await suite.start();
          await suite.typeText(htmlInput);
          await suite.expectVisibleNoticeHtml(`Press Enter to add <b>"${escapedInput}"</b>`);
          await suite.enterKey();

          await expect(suite.items.first()).toHaveText('<b>Mason Rogers</b>');
          await expect(suite.items.last()).toHaveText(htmlInput);
        });
      });
    });

    describe('input limit', () => {
      const testId = 'input-limit';
      const inputLimit = 5;

      test('does not let me input more than 5 choices', async ({ page, bundle }) => {
        const suite = new TextTestSuit(page, bundle, testUrl, testId);
        await suite.start();
        for (let index = 0; index < inputLimit; index++) {
          await suite.typeTextAndEnter(textInput);
          await suite.expectHiddenDropdown();
        }
        expect(await suite.items.count()).toEqual(inputLimit);

        await suite.typeText(textInput);
        await suite.expectHiddenDropdown();
        await suite.enterKey();
        await suite.expectVisibleNoticeHtml(`Only ${inputLimit} values can be added`);
      });
    });

    describe('add item filter', () => {
      const testId = 'add-item-filter';
      describe('inputting a value that satisfies the filter', () => {
        const input = 'joe@bloggs.com';

        test('allows me to add choice', async ({ page, bundle }) => {
          const suite = new TextTestSuit(page, bundle, testUrl, testId);
          await suite.start(input);
          await suite.expectHiddenDropdown();

          await expect(suite.itemList).toHaveText(input);
        });
      });

      describe('inputting a value that does not satisfy the regex', () => {
        test('displays dropdown prompt', async ({ page, bundle }) => {
          const suite = new TextTestSuit(page, bundle, testUrl, testId);
          await suite.start(`this is not an email address`);

          await suite.expectVisibleNoticeHtml(`Only values matching specific conditions can be added`);
        });
      });
    });

    describe('adding items disabled', () => {
      const testId = 'adding-items-disabled';
      test('does not allow me to input data', async ({ page, bundle }) => {
        const suite = new TextTestSuit(page, bundle, testUrl, testId);
        await suite.start();
        await suite.expectHiddenDropdown();

        await expect(suite.input).toBeDisabled();
      });
    });

    describe('disabled via fieldset', () => {
      const testId = 'disabled-via-fieldset';
      test('does not allow me to input data', async ({ page, bundle }) => {
        const suite = new TextTestSuit(page, bundle, testUrl, testId);
        await suite.start();
        await suite.expectHiddenDropdown();

        await expect(suite.input).toBeDisabled();
      });
    });

    describe('disabled via attribute', () => {
      const testId = 'disabled-via-attr';
      test('does not allow me to input data', async ({ page, bundle }) => {
        const suite = new TextTestSuit(page, bundle, testUrl, testId);
        await suite.start();
        await suite.expectHiddenDropdown();

        await expect(suite.input).toBeDisabled();
      });
    });

    describe('prepend/append', () => {
      const testId = 'prepend-append';
      test('prepends and appends value to inputted value', async ({ page, bundle }) => {
        const suite = new TextTestSuit(page, bundle, testUrl, testId);
        await suite.start(textInput);
        await suite.expectHiddenDropdown();

        const item = suite.items.first();
        await expect(item).toHaveText(textInput);
        await expect(item).toHaveAttribute('data-value', `before-${textInput}-after`);
      });
    });

    describe('pre-populated choices', () => {
      const testId = 'prepopulated';
      test('pre-populates choices', async ({ page, bundle }) => {
        const suite = new TextTestSuit(page, bundle, testUrl, testId);
        await suite.start();
        await suite.expectHiddenDropdown();

        expect(await suite.items.count()).toEqual(2);
        await expect(suite.items.first()).toHaveText('Josh Johnson');
        await expect(suite.items.last()).toHaveText('Joe Bloggs');
      });
    });

    describe('placeholder', () => {
      const testId = 'placeholder';
      describe('when no value has been inputted', () => {
        test('displays a placeholder', async ({ page, bundle }) => {
          const suite = new TextTestSuit(page, bundle, testUrl, testId);
          await suite.start();
          await suite.expectHiddenDropdown();

          await expect(suite.input).toHaveAttribute('placeholder', 'I am a placeholder');
        });
      });
    });

    describe('within form', () => {
      const testId = 'within-form';
      describe('inputting item', () => {
        describe('on enter key', () => {
          test('does not submit form', async ({ page, bundle }) => {
            let submit = false;
            await page.route(page.url(), (route) => {
              submit = true;

              return route.abort();
            });

            const suite = new TextTestSuit(page, bundle, testUrl, testId);
            await suite.start(textInput);
            await suite.expectHiddenDropdown();

            await suite.expectedValue(textInput);
            expect(submit).toEqual(false);
          });
        });
      });
    });

    describe('shadow-dom - basic', () => {
      const testId = 'shadow-dom';
      describe('adding items', () => {
        test('allows me to input items', async ({ page, bundle }) => {
          const suite = new TextTestSuit(page, bundle, testUrl, testId);
          await suite.start(textInput);
          await suite.expectHiddenDropdown();

          await suite.expectedValue(textInput);
        });

        describe('inputting data', () => {
          test('shows a dropdown prompt', async ({ page, bundle }) => {
            const suite = new TextTestSuit(page, bundle, testUrl, testId);
            await suite.start();
            await suite.typeText(textInput);

            await suite.expectVisibleNoticeHtml(`Press Enter to add <b>"${textInput}"</b>`);
          });
        });
      });
    });

    describe('re-initialising a choices instance', () => {
      const testId = 'new-destroy-init';
      test('preserves the choices & items lists', async ({ page, bundle }) => {
        let suite = new TextTestSuit(page, bundle, testUrl, testId);
        await suite.start(textInput);
        await suite.expectHiddenDropdown();

        await suite.expectedItemCount(1);

        await suite.group.locator('.destroy').click({ force: true });
        await suite.advanceClock();

        await suite.group.locator('.init').click({ force: true });
        await suite.advanceClock();

        suite = new TextTestSuit(page, bundle, testUrl, testId);
        await suite.expectedItemCount(1);
        await suite.expectedValue(textInput);
      });
    });
  });
});
