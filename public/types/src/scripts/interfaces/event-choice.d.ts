import { InputChoice } from './input-choice';
export interface EventChoice extends InputChoice {
    element?: HTMLOptionElement | HTMLOptGroupElement;
    groupValue?: string;
    keyCode?: number;
}
