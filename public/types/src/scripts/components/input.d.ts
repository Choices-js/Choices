import { ClassNames } from '../interfaces/class-names';
import { PassedElementType } from '../interfaces/passed-element-type';
export default class Input {
    element: HTMLInputElement;
    type: PassedElementType;
    classNames: ClassNames;
    preventPaste: boolean;
    isFocussed: boolean;
    isDisabled: boolean;
    constructor({ element, type, classNames, preventPaste, }: {
        element: HTMLInputElement;
        type: PassedElementType;
        classNames: ClassNames;
        preventPaste: boolean;
    });
    set placeholder(placeholder: string);
    get value(): string;
    set value(value: string);
    get rawValue(): string;
    addEventListeners(): void;
    removeEventListeners(): void;
    enable(): void;
    disable(): void;
    focus(): void;
    blur(): void;
    clear(setWidth?: boolean): this;
    /**
     * Set the correct input width based on placeholder
     * value or input value
     */
    setWidth(): void;
    setActiveDescendant(activeDescendantID: string): void;
    removeActiveDescendant(): void;
    _onInput(): void;
    _onPaste(event: ClipboardEvent): void;
    _onFocus(): void;
    _onBlur(): void;
}
//# sourceMappingURL=input.d.ts.map