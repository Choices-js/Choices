import { expect } from '@playwright/test';
import { test } from '../bundle-test';
import { SelectTestSuit } from '../select-test-suit';
import { DEFAULT_CLASSNAMES } from '../../src';
// import { mkdirSync } from 'fs';
// import path from 'path';

const { describe } = test;
// describe.configure({ mode: 'serial', retries: 0 });

describe(`Choices`, () => {
  const testUrl = '/index.html';
  describe(`slow`, () => {
    test.setTimeout(30000);
    const testId = 'custom-templates';

    test('screenshot', async ({ page, bundle }) => {
      const suite = new SelectTestSuit(page, bundle, testUrl, testId);

      await page.routeFromHAR('./test-e2e/hars/discogs.har', {
        url: 'https://api.discogs.com/**',
        update: false, // https://playwright.dev/docs/mock#replaying-from-har
      });

      await suite.startWithClick();
      await suite.expectVisibleDropdown();
      await suite.input.press('ArrowDown');
      await suite.advanceClock();

      await expect(page).toHaveScreenshot({
        fullPage: true,
        maxDiffPixels: 200,
        timeout: 30000,
      });
    });
  });

  describe(`functionality`, () => {
    test('reset form', async ({ page, bundle }) => {
      const testId = 'reset-simple';
      const suite = new SelectTestSuit(page, bundle, testUrl, testId);
      await suite.startWithClick();

      await suite.expectedItemCount(1);
      await expect(suite.items.first()).toHaveText('Option 2');

      await suite.selectableChoices.first().click();
      await suite.expectedItemCount(1);
      await expect(suite.items.first()).toHaveText('Option 1');

      await page.getByTestId('reset-form').getByRole('button', { name: /reset/i }).click();

      await suite.expectedItemCount(1);
      await expect(suite.items.first()).toHaveText('Option 2');
    });

    test('show invalid on required form submit', async ({ page, bundle }) => {
      const testId = 'invalid-select';
      const suite = new SelectTestSuit(page, bundle, testUrl, testId);
      await suite.startWithClick();

      await page
        .getByTestId('invalid-form')
        .getByRole('button', { name: /submit/i })
        .click();

      await suite.advanceClock();

      await expect(suite.getWrapper()).toHaveClass(
        `${DEFAULT_CLASSNAMES.containerOuter} ${DEFAULT_CLASSNAMES.invalidState}`,
      );
    });
  });
});
