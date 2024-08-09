import { StringPreEscaped } from './string-pre-escaped';
import { StringUntrusted } from './string-untrusted';

export interface Notice {
  response: boolean;
  notice: StringUntrusted | StringPreEscaped | string;
}
