import { expect } from 'chai';
import { beforeEach } from 'vitest';
import { DEFAULT_CONFIG } from '../../../src';
import { cloneObject } from '../../../src/scripts/lib/utils';
import { SearchByFuse } from '../../../src/scripts/search/fuse';
import { SearchByKMP } from '../../../src/scripts/search/kmp';
import { SearchByPrefixFilter } from '../../../src/scripts/search/prefix-filter';

export interface SearchableShape {
  label: string;
  value: string;
}

describe('search', () => {
  const options = DEFAULT_CONFIG;
  const haystack: SearchableShape[] = [];
  Array.from(Array(10).keys()).forEach((i) =>
    haystack.push({
      label: `label ${i}`,
      value: `value ${i}`,
    }),
  );

  describe('fuse-full', () => {
    let searcher: SearchByFuse<SearchableShape>;

    beforeEach(() => {
      process.env.CHOICES_SEARCH_FUSE = 'full';
      searcher = new SearchByFuse<SearchableShape>(options);
      searcher.index(haystack);
    });
    it('empty result', () => {
      const results = searcher.search('');
      expect(results.length).eq(0);
    });
    it('label prefix', () => {
      const results = searcher.search('label');
      expect(results.length).eq(haystack.length);
    });
    it('label suffix', () => {
      const results = searcher.search(`${haystack.length - 1}`);
      expect(results.length).eq(1);
    });

    it('search order', () => {
      const results = searcher.search('label');

      expect(results.length).eq(haystack.length);
      haystack.forEach((value, index) => {
        expect(results[index].item.value).eq(value.value);
      });
    });

    it('search order - custom sortFn', () => {
      const opts = cloneObject(options);
      opts.fuseOptions.sortFn = (a, b) => {
        if (a.score === b.score) {
          return a.idx < b.idx ? 1 : -1;
        }

        return a.score < b.score ? 1 : -1;
      };

      searcher = new SearchByFuse<SearchableShape>(opts);
      searcher.index(haystack);
      const results = searcher.search('label');

      expect(results.length).eq(haystack.length);
      haystack.reverse().forEach((value, index) => {
        expect(results[index].item.value).eq(value.value);
      });
    });
  });

  describe('fuse-basic', () => {
    let searcher: SearchByFuse<SearchableShape>;
    beforeEach(() => {
      process.env.CHOICES_SEARCH_FUSE = 'basic';
      searcher = new SearchByFuse<SearchableShape>(options);
      searcher.index(haystack);
    });
    it('empty result', () => {
      const results = searcher.search('');
      expect(results.length).eq(0);
    });
    it('label prefix', () => {
      const results = searcher.search('label');
      expect(results.length).eq(haystack.length);
    });
    it('label suffix', () => {
      const results = searcher.search(`${haystack.length - 1}`);
      expect(results.length).eq(1);
    });
    it('search order', () => {
      const results = searcher.search('label');

      expect(results.length).eq(haystack.length);
      haystack.forEach((value, index) => {
        expect(results[index].item.value).eq(value.value);
      });
    });
  });

  describe('kmp', () => {
    let searcher: SearchByKMP<SearchableShape>;
    beforeEach(() => {
      process.env.CHOICES_SEARCH_KMP = '1';
      searcher = new SearchByKMP<SearchableShape>(options);
      searcher.index(haystack);
    });
    it('empty result', () => {
      const results = searcher.search('');
      expect(results.length).eq(0);
    });
    it('label prefix', () => {
      const results = searcher.search('label');
      expect(results.length).eq(haystack.length);
    });
    it('label suffix', () => {
      const results = searcher.search(`${haystack.length - 1}`);
      expect(results.length).eq(2);
    });
  });

  describe('prefix-filter', () => {
    let searcher: SearchByPrefixFilter<SearchableShape>;
    beforeEach(() => {
      process.env.CHOICES_SEARCH_FUSE = undefined;
      searcher = new SearchByPrefixFilter<SearchableShape>(options);
      searcher.index(haystack);
    });
    it('empty result', () => {
      const results = searcher.search('');
      expect(results.length).eq(0);
    });
    it('label prefix', () => {
      const results = searcher.search('label');
      expect(results.length).eq(haystack.length);
    });
    it('label suffix', () => {
      const results = searcher.search(`${haystack.length - 1}`);
      expect(results.length).eq(0);
    });
  });
});
