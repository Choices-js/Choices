import { ClassNames } from '../interfaces/class-names';
import { PassedElementType } from '../interfaces/passed-element-type';
export default class Dropdown {
    element: HTMLElement;
    type: PassedElementType;
    classNames: ClassNames;
    isActive: boolean;
    constructor({ element, type, classNames, }: {
        element: HTMLElement;
        type: PassedElementType;
        classNames: ClassNames;
    });
    /**
     * Bottom position of dropdown in viewport coordinates
     */
    get distanceFromTopWindow(): number;
    getChild(selector: string): HTMLElement | null;
    /**
     * Show dropdown to user by adding active state class
     */
    show(): this;
    /**
     * Hide dropdown from user
     */
    hide(): this;
}
//# sourceMappingURL=dropdown.d.ts.map