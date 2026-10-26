import { afterEach, describe, expect, it } from 'vitest';
import Choices from '../../src';

describe('clearChoices with grouped selections', () => {
  let instance: Choices | undefined;

  afterEach(() => {
    instance?.destroy();
    instance = undefined;
    document.body.innerHTML = '';
  });

  const setup = (multiple: boolean, explicitlySelected: boolean = true): HTMLFormElement => {
    document.body.innerHTML = `
      <form>
        <select name="color" ${multiple ? 'multiple' : ''}>
          <optgroup label="Selected group">
            <option value="red" ${explicitlySelected ? 'selected' : ''}>Red</option>
            <option value="blue">Blue</option>
          </optgroup>
          <optgroup label="Unselected group">
            <option value="green">Green</option>
          </optgroup>
        </select>
      </form>`;
    const form = document.querySelector('form')!;
    instance = new Choices(form.querySelector('select')!, { allowHTML: false });

    return form;
  };

  it.each([false, true])('preserves selected options in submitted form data (multiple=%s)', (multiple) => {
    const form = setup(multiple);
    const select = form.querySelector('select')!;

    instance!.clearChoices();

    expect(new FormData(form).getAll('color')).to.deep.equal(['red']);
    expect(Array.from(select.options).map((option) => option.value)).to.deep.equal(['red']);
    expect(select.querySelectorAll('optgroup')).to.have.length(1);
    expect(instance!.getValue(true)).to.deep.equal(multiple ? ['red'] : 'red');
  });

  it('preserves the current single selection after setChoiceByValue', () => {
    const form = setup(false);
    instance!.setChoiceByValue('blue');

    instance!.clearChoices();

    expect(new FormData(form).getAll('color')).to.deep.equal(['blue']);
    expect(instance!.getValue(true)).to.equal('blue');
    expect(Array.from(form.querySelector('select')!.options).map((option) => option.value)).to.deep.equal(['blue']);
  });

  it('preserves dynamically added selections and drops removed selections', () => {
    const form = setup(true);
    instance!.setChoiceByValue('blue');
    instance!.removeActiveItemsByValue('red');

    instance!.clearChoices();

    expect(new FormData(form).getAll('color')).to.deep.equal(['blue']);
    expect(instance!.getValue(true)).to.deep.equal(['blue']);
    expect(Array.from(form.querySelector('select')!.options).map((option) => option.value)).to.deep.equal(['blue']);
  });

  it('preserves the implicit first selection without an initial selected attribute', () => {
    const form = setup(false, false);

    instance!.clearChoices();

    expect(new FormData(form).getAll('color')).to.deep.equal(['red']);
    expect(instance!.getValue(true)).to.equal('red');
  });

  it('preserves selections in more than one optgroup', () => {
    const form = setup(true);
    instance!.setChoiceByValue('green');

    instance!.clearChoices();

    expect(new FormData(form).getAll('color')).to.deep.equal(['red', 'green']);
    expect(instance!.getValue(true)).to.deep.equal(['red', 'green']);
    expect(form.querySelectorAll('optgroup')).to.have.length(2);
    expect(Array.from(form.querySelector('select')!.options).map((option) => option.value)).to.deep.equal([
      'red',
      'green',
    ]);
  });

  it('still removes selected items when clearItems is true', () => {
    const form = setup(true);

    instance!.clearChoices(true, true);

    expect(new FormData(form).getAll('color')).to.deep.equal([]);
    expect(form.querySelector('select')!.options).to.have.length(0);
    expect(instance!.getValue(true)).to.deep.equal([]);
  });

  it('does not remove backing options when clearOptions is false', () => {
    const form = setup(true);

    instance!.clearChoices(false, false);

    expect(new FormData(form).getAll('color')).to.deep.equal(['red']);
    expect(form.querySelector('select')!.options).to.have.length(3);
    expect(form.querySelectorAll('optgroup')).to.have.length(2);
  });
});
