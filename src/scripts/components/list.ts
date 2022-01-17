import { SCROLLING_SPEED } from '../constants';

export default class List {
  element: HTMLElement;

  scrollPos: number;

  height: number;

  constructor({ element }: { element: HTMLElement }) {
    this.element = element;
    this.scrollPos = this.element.scrollTop;
    this.height = this.element.offsetHeight;
  }

  clear(): void {
    this.element.innerHTML = '';
  }

  append(node: Element | DocumentFragment): void {
    this.element.appendChild(node);
  }

  getChild(selector: string): HTMLElement | null {
    return this.element.querySelector(selector);
  }

  hasChildren(): boolean {
    return this.element.hasChildNodes();
  }

  scrollToTop(): void {
    this.element.scrollTop = 0;
  }

  scrollToChildElement(element: HTMLElement, direction: 1 | -1): void {
    if (!element) {
      return;
    }

    const listHeight = this.element.offsetHeight;
    // Scroll position of dropdown
    const listScrollPosition = this.element.scrollTop + listHeight;

    const elementHeight = element.offsetHeight;
    // Distance from bottom of element to top of parent
    const elementPos = element.offsetTop + elementHeight;

    // Difference between the element and scroll position
    const destination =
      direction > 0
        ? this.element.scrollTop + elementPos - listScrollPosition
        : element.offsetTop;

    requestAnimationFrame(() => {
      this._animateScroll(destination, direction);
    });
  }

  _scrollDown(scrollPos: number, strength: number, destination: number): void {
    const easing = (destination - scrollPos) / strength;
    const distance = easing > 1 ? easing : 1;

    this.element.scrollTop = scrollPos + distance;
  }

  _scrollUp(scrollPos: number, strength: number, destination: number): void {
    const easing = (scrollPos - destination) / strength;
    const distance = easing > 1 ? easing : 1;

    this.element.scrollTop = scrollPos - distance;
  }

  _animateScroll(destination: number, direction: number): void {
    const strength = SCROLLING_SPEED;
    const choiceListScrollTop = this.element.scrollTop;
    let continueAnimation = false;

    if (direction > 0) {
      this._scrollDown(choiceListScrollTop, strength, destination);

      if (choiceListScrollTop < destination) {
        continueAnimation = true;
      }
    } else {
      this._scrollUp(choiceListScrollTop, strength, destination);

      if (choiceListScrollTop > destination) {
        continueAnimation = true;
      }
    }

    if (continueAnimation) {
      requestAnimationFrame(() => {
        this._animateScroll(destination, direction);
      });
    }
  }
}
