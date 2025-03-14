import { Options } from '../interfaces';
import { Searcher, SearchResult } from '../interfaces/search';
export declare class SearchByKMP<T extends object> implements Searcher<T> {
    _fields: string[];
    _haystack: T[];
    constructor(config: Options);
    index(data: T[]): void;
    reset(): void;
    isEmptyIndex(): boolean;
    search(_needle: string): SearchResult<T>[];
}
