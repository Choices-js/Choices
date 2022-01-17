export namespace Types {
  export type StrToEl = (
    str: string,
  ) => HTMLElement | HTMLInputElement | HTMLOptionElement;
  export type StringFunction = () => string;
  export type NoticeStringFunction = (value: string) => string;
  export type NoticeLimitFunction = (maxItemCount: number) => string;
  export type FilterFunction = (value: string) => boolean;
  export type ValueCompareFunction = (
    value1: string,
    value2: string,
  ) => boolean;
}
