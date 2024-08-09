/* eslint-disable @typescript-eslint/no-explicit-any */

import { StringUntrusted } from './string-untrusted';

export interface InputChoice {
  id?: number;
  highlighted?: boolean;
  labelClass?: string | Array<string>;
  labelDescription?: string;
  customProperties?: Record<string, any> | string;
  disabled?: boolean;
  active?: boolean;
  label: StringUntrusted | string;
  placeholder?: boolean;
  selected?: boolean;
  value: any;
}
