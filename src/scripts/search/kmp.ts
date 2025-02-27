import { Options } from '../interfaces';
import { Searcher, SearchResult } from '../interfaces/search';

function kmpSearch(pattern: string, text: string): number {
  if (pattern.length === 0) {
    return 0; // Immediate match
  }

  // Compute longest suffix-prefix table
  const lsp = [0]; // Base case
  for (let i = 1; i < pattern.length; i++) {
    let j = lsp[i - 1]; // Start by assuming we're extending the previous LSP
    while (j > 0 && pattern.charAt(i) !== pattern.charAt(j)) {
      j = lsp[j - 1];
    }
    if (pattern.charAt(i) === pattern.charAt(j)) {
      j++;
    }
    lsp.push(j);
  }

  // Walk through text string
  let j = 0; // Number of chars matched in pattern
  for (let i = 0; i < text.length; i++) {
    while (j > 0 && text.charAt(i) !== pattern.charAt(j)) {
      j = lsp[j - 1]; // Fall back in the pattern
    }
    if (text.charAt(i) === pattern.charAt(j)) {
      j++; // Next char matched, increment position
      if (j === pattern.length) {
        return i - (j - 1);
      }
    }
  }

  return -1; // Not found
}

export class SearchByKMP<T extends object> implements Searcher<T> {
  _fields: string[];

  _haystack: T[] = [];

  constructor(config: Options) {
    this._fields = config.searchFields;
  }

  index(data: T[]): void {
    this._haystack = data;
  }

  reset(): void {
    this._haystack = [];
  }

  isEmptyIndex(): boolean {
    return !this._haystack.length;
  }

  search(_needle: string): SearchResult<T>[] {
    const fields = this._fields;
    if (!fields || !fields.length || !_needle) {
      return [];
    }
    const needle = _needle.toLowerCase();

    const results: SearchResult<T>[] = [];

    let count = 0;
    for (let i = 0, j = this._haystack.length; i < j; i++) {
      const obj = this._haystack[i];
      for (let k = 0, l = this._fields.length; k < l; k++) {
        const field = this._fields[k];
        if (field in obj && kmpSearch(needle, (obj[field] as string).toLowerCase()) !== -1) {
          results.push({
            item: obj[field],
            score: count,
            rank: count + 1,
          });
          count++;
        }
      }
    }

    return results;
  }
}
