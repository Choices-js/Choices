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
    isDisabled: boolean;
    isLoading: boolean;
    constructor({ element, type, classNames, position, }: {
        element: HTMLElement;
        type: PassedElementType;
        classNames: ClassNames;
        position: PositionOptionsType;
    });
    /**
     * Determine whether container should be flipped based on passed
     * dropdown position
     */
    shouldFlip(dropdownPos: number, dropdownHeight: number): boolean;
    setActiveDescendant(activeDescendantID: string): void;
    removeActiveDescendant(): void;
    open(dropdownPos: number, dropdownHeight: number): void;
    close(): void;
    addFocusState(): void;
    removeFocusState(): void;
    addInvalidState(): void;
    removeInvalidState(): void;
    enable(): void;
    disable(): void;
    wrap(element: HTMLElement): void;
    unwrap(element: HTMLElement): void;
    addLoadingState(): void;
    removeLoadingState(): void;
}
