import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Choices from '../../src';

describe('browser-restored selection', () => {
  let select: HTMLSelectElement;
  let instance: Choices;

  beforeEach(() => {
    select = document.createElement('select');
    select.innerHTML = `
      <option value="">Pick an option</option>
      <option value="Choice 1">Choice 1</option>
      <option value="Choice 3">Choice 3</option>
    `;
    document.body.appendChild(select);

    instance = new Choices(select, {
      allowHTML: false,
      placeholderValue: 'Pick an option',
    });
  });

  afterEach(() => {
    instance.destroy();
    select.remove();
    vi.restoreAllMocks();
  });

  it('reflects a selection restored after initialization on pageshow', async () => {
    expect(select.value).to.equal('');

    // Simulate the browser restoring the native selection after initialization.
    select.value = 'Choice 3';

    expect(select.value).to.equal('Choice 3');
    expect(select.selectedOptions[0].hasAttribute('selected')).to.equal(false);

    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: false }));

    await vi.waitFor(() => {
      expect(select.value).to.equal('Choice 3');
      expect(instance.getValue(true)).to.equal('Choice 3');

      const displayedItem = select.closest('.choices')?.querySelector('.choices__list--single [data-item]');

      expect(displayedItem?.getAttribute('data-value')).to.equal('Choice 3');
    });
  });
  it.each([false, true])('replaces the old selection silently when persisted is %s', async (persisted) => {
    instance.setChoiceByValue('Choice 1');
    select.value = 'Choice 3';
    expect(select.options[1].hasAttribute('selected')).to.equal(true);
    expect(select.options[1].selected).to.equal(false);

    const onSelectionEvent = vi.fn();
    ['change', 'addItem', 'removeItem', 'choice'].forEach((name) => select.addEventListener(name, onSelectionEvent));
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted }));

    await vi.waitFor(() => expect(instance.getValue(true)).to.equal('Choice 3'));
    expect(select.value).to.equal('Choice 3');
    expect(onSelectionEvent).not.toHaveBeenCalled();
  });

  it('reflects form state restored just after pageshow', async () => {
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: false }));
    select.value = 'Choice 3';

    await vi.waitFor(() => expect(instance.getValue(true)).to.equal('Choice 3'));
    expect(select.value).to.equal('Choice 3');
  });

  it('reflects a restored empty selection', async () => {
    instance.setChoiceByValue('Choice 1');
    select.selectedIndex = -1;
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: false }));

    await vi.waitFor(() => expect(instance.getValue(true)).to.equal(undefined));
    expect(select.selectedIndex).to.equal(-1);
    expect(select.closest('.choices')?.querySelector('.choices__list--single [data-item]')?.textContent).to.equal(
      'Pick an option',
    );
  });

  it.each([true, false])('preserves an unchanged custom placeholder with an empty option: %s', async (emptyOption) => {
    if (!emptyOption) {
      instance.destroy();
      select.options[0].remove();
      instance = new Choices(select, { allowHTML: false, placeholderValue: 'Pick an option' });
    }
    const displayedItem = select.closest('.choices')?.querySelector('.choices__list--single [data-item]');
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: false }));
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 0);
    });

    expect(instance.getValue(true)).to.equal(undefined);
    expect(select.closest('.choices')?.querySelector('.choices__list--single [data-item]')).to.equal(displayedItem);
    expect(displayedItem?.textContent).to.equal('Pick an option');
  });

  it('restores multiple selections by option identity, including duplicate values in groups', async () => {
    instance.destroy();
    select.multiple = true;
    select.innerHTML = `
      <optgroup label="Group">
        <option value="shared">First shared option</option>
        <option value="shared">Second shared option</option>
        <option value="Choice 3">Choice 3</option>
      </optgroup>
    `;
    instance = new Choices(select, { allowHTML: false, shouldSort: false });
    instance.setChoiceByValue('shared');
    select.options[0].selected = false;
    select.options[1].selected = true;
    select.options[2].selected = true;
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: false }));

    await vi.waitFor(() => expect(instance.getValue(true)).to.deep.equal(['shared', 'Choice 3']));
    const displayedItems = select.closest('.choices')?.querySelectorAll('.choices__list--multiple [data-item]');
    expect(Array.from(displayedItems || [], (item) => item.textContent)).to.deep.equal([
      'Second shared option',
      'Choice 3',
    ]);
    expect(Array.from(select.selectedOptions, (option) => option.label)).to.deep.equal([
      'Second shared option',
      'Choice 3',
    ]);
  });

  it('synchronizes a disabled select without enabling it', async () => {
    instance.disable();
    select.value = 'Choice 3';
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: false }));

    await vi.waitFor(() => expect(instance.getValue(true)).to.equal('Choice 3'));
    expect(select.disabled).to.equal(true);
    expect(select.closest('.choices')?.classList.contains('is-disabled')).to.equal(true);
  });

  it('keeps the original form reset value after restoring a different selection', async () => {
    instance.destroy();
    select.options[1].defaultSelected = true;
    select.value = 'Choice 1';
    const form = document.createElement('form');
    form.appendChild(select);
    document.body.appendChild(form);
    instance = new Choices(select, { allowHTML: false });

    try {
      select.value = 'Choice 3';
      window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: false }));
      await vi.waitFor(() => expect(instance.getValue(true)).to.equal('Choice 3'));
      form.reset();

      expect(instance.getValue(true)).to.equal('Choice 1');
      expect(select.value).to.equal('Choice 1');
    } finally {
      instance.destroy();
      form.remove();
    }
  });

  it('removes the lifecycle listener and cancels pending restoration work on destroy', () => {
    const removeListener = vi.spyOn(window, 'removeEventListener');
    const clearTimeout = vi.spyOn(window, 'clearTimeout');
    select.value = 'Choice 3';
    window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: false }));
    const pendingTimeout = instance._pageShowTimeout;
    expect(pendingTimeout).not.to.equal(undefined);

    instance.destroy();

    expect(removeListener).toHaveBeenCalledWith('pageshow', instance._onPageShow);
    expect(clearTimeout).toHaveBeenCalledWith(pendingTimeout);
    expect(select.value).to.equal('Choice 3');
    expect(select.hidden).to.equal(false);
  });
});
