import { Options } from '../interfaces';
import { SearchResult } from '../interfaces/search';

export function searchByPrefixFilter<T extends object>(
  config: Options,
  haystack: T[],
  _needle: string,
): SearchResult<T>[] {
  const fields = config.searchFields;
  if (!fields || fields.length === 0 || _needle === '') {
    return [];
  }

  const needle = _needle.toLowerCase();

  return haystack
    .filter((obj) =>
      fields.some(
        (field) =>
          field in obj &&
          (obj[field] as string).toLowerCase().startsWith(needle),
      ),
    )
    .map((value, index): SearchResult<T> => {
      return {
        item: value,
        score: index,
      };
    });
}
