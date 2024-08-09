import { Options } from './options';

export interface SearchResult<T extends object> {
  item: T;
  score: number;
}

export type SearchHandler = <T extends object>(
  config: Options,
  haystack: T[],
  needle: string,
) => SearchResult<T>[];
