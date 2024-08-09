import { Options } from '../interfaces/options';
import { SearchResult } from '../interfaces/search';
export declare function searchByFuse<T extends object>(config: Options, haystack: T[], needle: string): SearchResult<T>[];
