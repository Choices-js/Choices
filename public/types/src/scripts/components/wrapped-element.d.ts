import { ClassNames } from '../interfaces/class-names';
import { EventType } from '../interfaces/event-type';
export default class WrappedElement {
    element: HTMLInputElement | HTMLSelectElement;
    classNames: ClassNames;
    isDisabled: boolean;
    constructor({ element, classNames }: {
        element: any;
        classNames: any;
    });
    get isActive(): boolean;
    get dir(): string;
    get value(): string;
    set value(value: string);
    conceal(): void;
    reveal(): void;
    enable(): void;
    disable(): void;
    triggerEvent(eventType: EventType, data?: object): void;
}
//# sourceMappingURL=wrapped-element.d.ts.map