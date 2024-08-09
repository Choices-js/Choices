import { Options } from '../interfaces';
import { SearchResult } from '../interfaces/search';
export declare function searchByPrefixFilter<T extends object>(config: Options, haystack: T[], _needle: string): SearchResult<T>[];
