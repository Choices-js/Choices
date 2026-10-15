import { expect } from 'vitest';
import Choices from '../../src';

const controls = [
  '<input type="text" value="one">',
  '<select><option selected>one</option><option>two</option></select>',
  '<select multiple><option selected>one</option><option>two</option></select>',
];

describe('configured tab order', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  controls.forEach((markup) => {
    [-1, 0, 2].forEach((tabIndex) => {
      it(`uses ${tabIndex} for ${markup} through disable, enable and reinitialization`, () => {
        document.body.innerHTML = markup;
        const element = document.body.firstElementChild as HTMLInputElement | HTMLSelectElement;
        const choices = new Choices(element, { tabIndex, removeItemButton: true });
        const check = (): void => {
          expect(choices.input.element.tabIndex).to.equal(tabIndex);
          if (element.type === 'select-one') {
            expect(choices.containerOuter.element.tabIndex).to.equal(tabIndex);
          } else {
            expect(choices.containerOuter.element.hasAttribute('tabindex')).to.equal(false);
          }
          expect(choices.containerOuter.element.querySelectorAll('button').length).to.be.greaterThan(0);
          choices.containerOuter.element.querySelectorAll('button').forEach((button) => {
            expect(button.tabIndex).to.equal(tabIndex);
          });
        };
        check();
        choices.disable();
        expect(choices.input.element.disabled).to.equal(true);
        if (element.type === 'select-one') {
          expect(choices.containerOuter.element.tabIndex).to.equal(-1);
        }
        choices.enable();
        check();
        choices.destroy();
        expect(element.hasAttribute('tabindex')).to.equal(false);
        choices.init();
        check();
        choices.destroy();
      });
    });
  });

  it('keeps a non-searchable single select out of the tab order', () => {
    document.body.innerHTML = controls[1];
    const choices = new Choices(document.querySelector('select')!, { tabIndex: -1, searchEnabled: false });
    expect(choices.containerOuter.element.tabIndex).to.equal(-1);
    choices.disable().enable();
    expect(choices.containerOuter.element.tabIndex).to.equal(-1);
    choices.destroy();
  });

  it('keeps the configured index after asynchronous choices and new remove buttons', async () => {
    document.body.innerHTML = controls[2];
    const choices = new Choices(document.querySelector('select')!, { tabIndex: -1, removeItemButton: true });
    await choices.setChoices(async () => [{ value: 'new', label: 'New', selected: true }], 'value', 'label', true);
    expect(choices.input.element.tabIndex).to.equal(-1);
    expect(choices.input.element.disabled).to.equal(false);
    choices.containerOuter.element.querySelectorAll('button').forEach((button) => {
      expect(button.tabIndex).to.equal(-1);
    });
    choices.destroy();
  });

  it('restores the configured single-select index when initially disabled', () => {
    document.body.innerHTML = '<select disabled><option>One</option></select>';
    const choices = new Choices(document.querySelector('select')!, { tabIndex: 2 });
    expect(choices.containerOuter.element.tabIndex).to.equal(-1);
    choices.enable();
    expect(choices.containerOuter.element.tabIndex).to.equal(2);
    choices.destroy();
  });

  it('restores the configured index after a failed choices request', async () => {
    document.body.innerHTML = controls[1];
    const choices = new Choices(document.querySelector('select')!, { tabIndex: -1, silent: true });
    await choices.setChoices(
      () =>
        new Promise((_resolve, reject) => {
          setTimeout(() => reject(new Error('unavailable')), 50);
        }),
    );
    expect(choices.containerOuter.element.tabIndex).to.equal(-1);
    expect(choices.input.element.tabIndex).to.equal(-1);
    expect(choices.input.element.disabled).to.equal(false);
    choices.destroy();
  });
});
