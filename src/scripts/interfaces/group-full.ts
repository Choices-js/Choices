/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChoiceFull } from './choice-full';

export interface GroupFull {
  id: number;
  active: boolean;
  disabled: boolean;
  label: string;
  element?: HTMLOptGroupElement;
  choices: ChoiceFull[];
}
