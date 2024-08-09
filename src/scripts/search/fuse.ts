// eslint-disable-next-line import/no-named-default
import { default as FuseFull } from 'fuse.js';
// eslint-disable-next-line import/no-named-default
import { default as FuseBasic } from 'fuse.js/basic';
import { Options } from '../interfaces/options';
import { SearchResult } from '../interfaces/search';

export function searchByFuse<T extends object>(
  config: Options,
  haystack: T[],
  needle: string,
): SearchResult<T>[] {
  // Need to use an object literal for options argument
  // see https://github.com/krisk/Fuse/issues/303#issuecomment-506940824
  let fuse: FuseFull<T> | FuseBasic<T>;
  if (process.env.SEARCH_FUSE === 'full') {
    fuse = new FuseFull<T>(haystack, {
      ...config.fuseOptions,
      keys: [...config.searchFields],
      includeMatches: true,
    });
  } else {
    fuse = new FuseBasic<T>(haystack, {
      ...config.fuseOptions,
      keys: [...config.searchFields],
      includeMatches: true,
    });
  }

  const results = fuse.search(needle);

  return results as SearchResult<T>[];
}
