import { ClassNames } from '../interfaces/class-names';
import { PositionOptionsType } from '../interfaces/position-options-type';
import { PassedElementType } from '../interfaces/passed-element-type';
export default class Container {
    element: HTMLElement;
    type: PassedElementType;
    classNames: ClassNames;
    position: PositionOptionsType;
    isOpen: boolean;
    isFlipped: boolean;
    isFocussed: boolean;
    isDisabled: boolean;
    isLoading: boolean;
    constructor({ element, type, classNames, position, }: {
        element: HTMLElement;
        type: PassedElementType;
        classNames: ClassNames;
        position: PositionOptionsType;
    });
    addEventListeners(): void;
    removeEventListeners(): void;
    /**
     * Determine whether container should be flipped based on passed
     * dropdown position
     */
    shouldFlip(dropdownPos: number): boolean;
    setActiveDescendant(activeDescendantID: string): void;
    removeActiveDescendant(): void;
    open(dropdownPos: number): void;
    close(): void;
    focus(): void;
    addFocusState(): void;
    removeFocusState(): void;
    enable(): void;
    disable(): void;
    wrap(element: HTMLSelectElement | HTMLInputElement | HTMLElement): void;
    unwrap(element: HTMLElement): void;
    addLoadingState(): void;
    removeLoadingState(): void;
    _onFocus(): void;
    _onBlur(): void;
}
//# sourceMappingURL=container.d.ts.map