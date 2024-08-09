import { ClassNames } from '../interfaces/class-names';
import { EventType } from '../interfaces/event-type';
export default class WrappedElement<T extends HTMLInputElement | HTMLSelectElement> {
    element: T;
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
