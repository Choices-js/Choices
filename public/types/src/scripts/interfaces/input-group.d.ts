import { InputChoice } from './input-choice';
import { StringUntrusted } from './string-untrusted';
export interface InputGroup {
    id?: number;
    active?: boolean;
    disabled?: boolean;
    label?: StringUntrusted | string;
    value: string;
    choices: InputChoice[];
}
