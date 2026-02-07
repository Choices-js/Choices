import { StringUntrusted } from './string-untrusted';
import { StringPreEscaped } from './string-pre-escaped';
import { Types } from './types';
// eslint-disable-next-line import/no-cycle
import { GroupFull } from './group-full';

/*
  A disabled choice appears in the choice dropdown but cannot be selected
  A selected choice has been added to the passed input's value (added as an item)
  An active choice appears within the choice dropdown (ie search sets active to false if it doesn't match)
*/
export interface ChoiceFull {
  id: number;
  highlighted: boolean;
  element?: HTMLOptionElement | HTMLOptGroupElement;
  itemEl?: HTMLElement;
  choiceEl?: HTMLElement;
  labelClass?: Array<string>;
  labelDescription?: StringPreEscaped | StringUntrusted | string;
  customProperties?: Types.CustomProperties;
  disabled: boolean;
  active: boolean;
  elementId?: string;
  group: GroupFull | null;
  label: StringUntrusted | string;
  placeholder: boolean;
  selected: boolean;
  value: string;
  score: number;
  rank: number;
}
