import { searchByFuse } from './fuse';
import { searchByPrefixFilter } from './prefix-filter';
import { SearchHandler } from '../interfaces/search';

// eslint-disable-next-line import/no-mutable-exports
let search: SearchHandler;

if (process.env.SEARCH_FUSE) {
  search = searchByFuse;
} else {
  search = searchByPrefixFilter;
}

export default search;
