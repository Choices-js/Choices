export default class List {
    element: HTMLElement;
    scrollPos: number;
    height: number;
    constructor({ element }: {
        element: HTMLElement;
    });
    clear(): void;
    prepend(node: Element | DocumentFragment): void;
    append(node: Element | DocumentFragment): void;
    hasChildren(): boolean;
    scrollToTop(): void;
    scrollToChildElement(element: HTMLElement, direction: 1 | -1): void;
    _scrollDown(scrollPos: number, strength: number, destination: number): void;
    _scrollUp(scrollPos: number, strength: number, destination: number): void;
    _animateScroll(destination: number, direction: number): void;
}
