import { Options } from '../interfaces';
import { Searcher } from '../interfaces/search';
import { SearchByPrefixFilter } from './prefix-filter';
import { SearchByFuse } from './fuse';
import { SearchByKMP } from './kmp';
import { searchFuse, searchKMP } from '../interfaces/build-flags';

export function getSearcher<T extends object>(config: Options): Searcher<T> {
  if (searchFuse) {
    return new SearchByFuse<T>(config);
  }
  if (searchKMP) {
    return new SearchByKMP<T>(config);
  }

  return new SearchByPrefixFilter<T>(config);
}
