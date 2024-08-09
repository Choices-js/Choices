import { InputChoice } from '../interfaces/input-choice';
import { InputGroup } from '../interfaces/input-group';
import { GroupFull } from '../interfaces/group-full';
import { ChoiceFull } from '../interfaces/choice-full';
import { unwrapStringForRaw } from './utils';

type MappedInputTypeToChoiceType<T extends string | InputChoice | InputGroup> =
  T extends InputGroup ? GroupFull : ChoiceFull;

const coerceBool = (arg: unknown, defaultValue: boolean = true) =>
  typeof arg === 'undefined' ? defaultValue : !!arg;

export const stringToHtmlClass = (input): string[] | undefined => {
  if (typeof input === 'string') {
    // eslint-disable-next-line no-param-reassign
    input = input.split(' ').filter((s) => s.length !== 0);
  }

  if (Array.isArray(input) && input.length !== 0) {
    return input;
  }

  return undefined;
};

export const mapInputToChoice = <T extends string | InputChoice | InputGroup>(
  value: T,
  allowGroup: boolean,
): MappedInputTypeToChoiceType<T> => {
  if (typeof value === 'string') {
    const result: ChoiceFull = mapInputToChoice(
      {
        value,
        label: value,
      } as InputChoice,
      false,
    );

    return result as MappedInputTypeToChoiceType<T>;
  }

  const groupOrChoice = value as InputChoice | InputGroup;
  if ('choices' in groupOrChoice) {
    if (!allowGroup) {
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup
      throw new TypeError(`optGroup is not allowed`);
    }
    const group = groupOrChoice;
    const choices = group.choices.map((e) => mapInputToChoice(e, false));

    const result: GroupFull = {
      id: 0, // actual ID will be assigned during _addGroup
      label: unwrapStringForRaw(group.label) || group.value,
      active: choices.length !== 0,
      disabled: !!group.disabled,
      choices,
    };

    return result as MappedInputTypeToChoiceType<T>;
  }

  const choice = groupOrChoice;

  const result: ChoiceFull = {
    id: 0, // actual ID will be assigned during _addChoice
    groupId: 0, // actual ID will be assigned during _addGroup but before _addChoice
    score: 0, // used in search
    value: choice.value,
    label: choice.label || choice.value,
    active: coerceBool(choice.active),
    selected: coerceBool(choice.selected, false),
    disabled: coerceBool(choice.disabled, false),
    placeholder: coerceBool(choice.placeholder, false),
    highlighted: false,
    labelClass: stringToHtmlClass(choice.labelClass),
    labelDescription: choice.labelDescription,
    customProperties: choice.customProperties,
  };

  return result as MappedInputTypeToChoiceType<T>;
};
