import { expect, type Page } from '@playwright/test';
import type Choices from '../../src/scripts/choices';
import type { Options } from '../../src';
import { test } from '../bundle-test';

type LabelOptions = Partial<Pick<Options, 'searchEnabled' | 'labelId' | 'placeholderValue'>>;

async function initialise(page: Page, bundle: string, markup: string, config: LabelOptions = {}): Promise<void> {
  await page.setContent(`<button id="before" type="button">Before control</button>${markup}`);
  await page.addStyleTag({ url: new URL('../styles/choices.css', bundle).href });
  await page.addScriptTag({ url: bundle });
  await page.evaluate((options) => {
    const scope = window as unknown as { Choices: typeof Choices; instance: Choices };
    scope.instance = new scope.Choices(document.querySelector('select')!, options);
  }, config);
}

const choices = '<option value="apple">Apple</option><option value="pear">Pear</option>';

test.describe('native select label preservation', () => {
  [false, true].forEach((multiple) => {
    [true, false].forEach((searchEnabled) => {
      test(`labels the wrapper: multiple=${multiple}, searchEnabled=${searchEnabled}`, async ({ page, bundle }) => {
        await initialise(
          page,
          bundle!,
          `<label for="fruit">Favorite fruit</label><select id="fruit"${multiple ? ' multiple' : ''}>${choices}</select>`,
          { searchEnabled },
        );

        await expect(page.locator('.choices')).toHaveAccessibleName('Favorite fruit');
        await expect(page.locator('label')).not.toHaveAttribute('id');
        await expect(page.locator('#fruit')).toHaveAttribute('id', 'fruit');
      });
    });
  });

  test('retains its name when reached with Tab and opened with ArrowDown', async ({ page, bundle }) => {
    await initialise(page, bundle!, `<label for="fruit">Favorite fruit</label><select id="fruit">${choices}</select>`);
    const wrapper = page.locator('.choices');

    await page.locator('#before').focus();
    await page.keyboard.press('Tab');
    await expect(wrapper).toBeFocused();
    await expect(wrapper).toHaveAccessibleName('Favorite fruit');
    await page.keyboard.press('ArrowDown');
    await expect(wrapper).toHaveAttribute('aria-expanded', 'true');
    await expect(wrapper).toHaveAccessibleName('Favorite fruit');
    await page.keyboard.press('Escape');
    await expect(wrapper).toHaveAttribute('aria-expanded', 'false');
  });

  test('preserves explicit labelId precedence over the native label', async ({ page, bundle }) => {
    await initialise(
      page,
      bundle!,
      `<label for="fruit">Native label</label><span id="explicit-label">Configured label</span><select id="fruit">${choices}</select>`,
      { labelId: 'explicit-label' },
    );

    await expect(page.locator('.choices')).toHaveAccessibleName('Configured label');
    await expect(page.locator('.choices')).toHaveAttribute('aria-labelledby', 'explicit-label');
    await expect(page.locator('.choices')).not.toHaveAttribute('aria-label');
  });

  ["fruit'quoted", 'fruit\\backslash'].forEach((id) => {
    test(`handles a native label with a selector-sensitive control ID: ${id}`, async ({ page, bundle }) => {
      await initialise(
        page,
        bundle!,
        `<label for="${id}">Favorite fruit</label><select id="${id}">${choices}</select>`,
        { placeholderValue: 'Choose an option' },
      );

      await expect(page.locator('.choices')).toHaveAccessibleName('Favorite fruit');
      await expect(page.locator('select')).toHaveAttribute('id', id);
      await expect(page.locator('label')).toHaveAttribute('for', id);
    });
  });

  test('does not use the selected value or placeholder as the wrapper name', async ({ page, bundle }) => {
    await initialise(
      page,
      bundle!,
      `<label id="native-label" for="fruit">Favorite fruit</label><select id="fruit">${choices}</select>`,
      { placeholderValue: 'Choose an option' },
    );

    await expect(page.locator('.choices')).toHaveAccessibleName('Favorite fruit');
    await expect(page.locator('label')).toHaveAttribute('id', 'native-label');
    await expect(page.locator('label')).toHaveAttribute('for', 'fruit');
  });

  test('does not invent a name when the native control has no label', async ({ page, bundle }) => {
    await initialise(page, bundle!, `<select id="fruit">${choices}</select>`);

    await expect(page.locator('.choices')).toHaveAccessibleName('');
    await expect(page.locator('.choices')).not.toHaveAttribute('aria-label');
    await expect(page.locator('.choices')).not.toHaveAttribute('aria-labelledby');
  });

  test('leaves the native label association intact after destroy', async ({ page, bundle }) => {
    await initialise(page, bundle!, `<label for="fruit">Favorite fruit</label><select id="fruit">${choices}</select>`);
    await expect(page.locator('.choices')).toHaveAccessibleName('Favorite fruit');
    await page.evaluate(() => {
      (window as unknown as { instance: Choices }).instance.destroy();
    });

    await expect(page.locator('.choices')).toHaveCount(0);
    await expect(page.locator('#fruit')).toHaveAccessibleName('Favorite fruit');
    await expect(page.locator('label')).not.toHaveAttribute('id');
  });
});
