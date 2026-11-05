import { expect, type Locator, type Page } from '@playwright/test';
import { lock } from 'cross-process-lock';
import { writeFileSync, existsSync } from 'fs';

export class TestSuit {
  readonly testId: string;

  readonly url: string;

  readonly page: Page;

  readonly group: Locator;

  readonly input: Locator;

  readonly wrapper: Locator;

  readonly itemList: Locator;

  readonly items: Locator;

  readonly dropdown: Locator;

  readonly choicesBundle: string | undefined;

  constructor(page: Page, choicesBundle: string | undefined, url: string, testId: string) {
    this.choicesBundle = choicesBundle;
    this.testId = testId;
    this.url = url;
    this.page = page;
    this.group = page.getByTestId(this.testId);
    this.input = this.group.locator('input[type="search"]');
    this.wrapper = this.group.locator('.choices').first();
    this.itemList = this.group.locator('.choices__list.choices__list--multiple, .choices__list.choices__list--single');
    this.items = this.itemList.locator('.choices__item:not(.choices__placeholder)');
    this.dropdown = this.group.locator('.choices__list.choices__list--dropdown');
  }

  logConsole(): void {
    this.page.on('console', (msg) => {
      // eslint-disable-next-line no-console
      console.log(msg);
    });
  }

  async start(textInput?: string): Promise<void> {
    if (this.choicesBundle) {
      await this.page.route('/assets/scripts/choices.js', (route) => route.continue({ url: this.choicesBundle }));
      await this.page.route('/assets/scripts/choices.min.js', (route) => route.continue({ url: this.choicesBundle }));
    }

    // reduce external network traffic
    await this.page.route('**polyfill**', (route) => route.abort('blockedbyresponse'));
    // disable google analytics, as it can weirdly fail sometimes
    await this.page.route('https://www.google-analytics.com/analytics.js', (route) => route.abort('blockedbyresponse'));
    await this.page.clock.install();

    await this.page.goto(this.url);

    await this.group.scrollIntoViewIfNeeded();

    if (textInput) {
      await this.typeTextAndEnter(textInput);
    } else {
      await this.wrapper.focus();
      await this.advanceClock();
    }
  }

  async advanceClock(): Promise<void> {
    // dropdown uses requestAnimationFrame for show/hide
    await this.page.clock.runFor(1000);
  }

  async selectByKeyPress(textInput: string): Promise<void> {
    await this.wrapper.focus();
    await this.advanceClock();
    await this.input.pressSequentially(textInput);
    await this.advanceClock();
    await this.expectVisibleDropdown();
  }

  async selectByClick(): Promise<void> {
    await this.wrapper.click();
    await this.advanceClock();
    await this.expectVisibleDropdown();
  }

  async typeTextAndEnter(textInput: string): Promise<void> {
    await this.typeText(textInput);
    await this.enterKey();
  }

  async typeText(textInput: string): Promise<void> {
    await this.input.focus();
    await this.advanceClock();

    await this.input.fill(textInput);
    await this.advanceClock();
  }

  async keyPress(key: string, _locator?: Locator): Promise<void> {
    const locator = _locator || this.input;
    await locator.focus();
    await this.advanceClock();
    await locator.press(key);
    await this.advanceClock();
  }

  ctrlA(locator?: Locator): Promise<void> {
    return this.keyPress('ControlOrMeta+KeyA', locator);
  }

  ctrlX(locator?: Locator): Promise<void> {
    return this.keyPress('ControlOrMeta+KeyX', locator);
  }

  ctrlC(locator?: Locator): Promise<void> {
    return this.keyPress('ControlOrMeta+KeyC', locator);
  }

  ctrlV(locator?: Locator): Promise<void> {
    return this.keyPress('ControlOrMeta+KeyV', locator);
  }

  enterKey(locator?: Locator): Promise<void> {
    return this.keyPress('Enter', locator);
  }

  escapeKey(locator?: Locator): Promise<void> {
    return this.keyPress('Escape', locator);
  }

  backspaceKey(locator?: Locator): Promise<void> {
    return this.keyPress('Backspace', locator);
  }

  async expectVisibleDropdown(): Promise<void> {
    await this.advanceClock();

    await this.dropdown.waitFor({ state: 'visible' });
    await expect(this.dropdown).toBeVisible();
  }

  async expectVisibleDropdownWithItem(text: string): Promise<void> {
    await this.advanceClock();

    await expect(this.dropdown.filter({ hasText: text })).toHaveCount(1);
    await this.expectVisibleDropdown();
  }

  async expectVisibleNoticeHtml(html: string, singleItem: boolean = false): Promise<void> {
    await this.advanceClock();

    if (singleItem) {
      await expect(this.dropdown.locator('> *:not(input)')).toHaveCount(1);
    }
    expect(await this.dropdown.locator('.choices__notice').innerHTML()).toEqual(html);
    await this.expectVisibleDropdown();
  }

  async expectHiddenDropdown(): Promise<void> {
    await this.advanceClock();
    await this.dropdown.waitFor({ state: 'hidden' });
    await expect(this.dropdown).toBeHidden();
  }

  async expectHiddenNotice(singleItem: boolean = false): Promise<void> {
    await this.advanceClock();

    if (singleItem) {
      await expect(this.dropdown.locator('> *:not(input)')).toHaveCount(0);
    }
    await expect(this.dropdown.locator('.choices__notice')).toBeHidden();
  }

  // eslint-disable-next-line class-methods-use-this
  getWrappedElement(): Locator {
    throw new Error('Not implemented');
  }

  getWrapper(): Locator {
    return this.wrapper;
  }

  async expectedValue(text: string): Promise<void> {
    if (text !== '') {
      await expect(this.items.filter({ hasText: text })).not.toHaveCount(0);
    }

    expect(await this.getWrappedElement().inputValue()).toEqual(text);
  }

  async expectedItemCount(count: number): Promise<void> {
    await expect(this.items).toHaveCount(count);
  }

  // eslint-disable-next-line class-methods-use-this
  async crossProcessLock(func: () => Promise<void>): Promise<void> {
    // playwright lacks clipboard isolation, so use a lock to ensure other tests don't modify the clipboard at the same time
    // https://github.com/microsoft/playwright/issues/13097#issuecomment-1445271511
    const name = 'test-results/clipboard';
    if (!existsSync(name)) {
      writeFileSync(name, '', 'utf8');
    }
    const unlock = await lock(name, { waitTimeout: 30000 });
    try {
      await func();
    } finally {
      await unlock();
    }
  }

  async pasteText(text: string, _locator?: Locator): Promise<void> {
    const locator = _locator || this.input;

    await this.crossProcessLock(async () => {
      await this.page.evaluate(() => {
        if (!document.querySelector('textarea#pasteTarget')) {
          document.body.insertAdjacentHTML('afterbegin', "<textarea id='pasteTarget'></textarea>");
        }
      });

      const target = this.page.locator('textarea#pasteTarget');
      await target.fill(text);

      await target.selectText(); // Focus & Ctrl+a
      await this.ctrlC(target);

      await this.selectByClick();

      await this.ctrlV(locator);

      await this.page.evaluate(() => {
        document.body.querySelector('textarea#pasteTarget')?.remove();
      });
    });

    await this.advanceClock();
    await expect(locator).toHaveValue(text);
  }
}
