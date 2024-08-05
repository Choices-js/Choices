/* eslint-disable @typescript-eslint/no-explicit-any */

import { StringUntrusted } from './string-untrusted';

export interface ChoiceFull {
  id: number;
  highlighted: boolean;
  element?: HTMLOptionElement | HTMLOptGroupElement;
  labelClass?: Array<string>;
  labelDescription?: string;
  customProperties?: Record<string, any> | null;
  disabled: boolean;
  active: boolean;
  elementId?: string;
  groupId: number;
  label: StringUntrusted | string;
  placeholder: boolean;
  selected: boolean;
  value: string;
  score: number;
}
