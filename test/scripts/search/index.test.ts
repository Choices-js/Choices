import { expect } from 'chai';
import { searchByPrefixFilter } from '../../../src/scripts/search/prefix-filter';
import { searchByFuse } from '../../../src/scripts/search/fuse';
import { DEFAULT_CONFIG } from '../../../src';

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
    const search = searchByFuse;
    process.env.SEARCH_FUSE = 'full';
    it('empty result', () => {
      const results = search<SearchableShape>(options, haystack, '');
      expect(results.length).eq(0);
    });
    it('label prefix', () => {
      const results = search<SearchableShape>(options, haystack, 'label');
      expect(results.length).eq(haystack.length);
    });
    it('label suffix', () => {
      const results = search<SearchableShape>(
        options,
        haystack,
        `${haystack.length - 1}`,
      );
      expect(results.length).eq(1);
    });
  });

  describe('fuse-basic', () => {
    const search = searchByFuse;
    process.env.SEARCH_FUSE = 'basic';
    it('empty result', () => {
      const results = search<SearchableShape>(options, haystack, '');
      expect(results.length).eq(0);
    });
    it('label prefix', () => {
      const results = search<SearchableShape>(options, haystack, 'label');
      expect(results.length).eq(haystack.length);
    });
    it('label suffix', () => {
      const results = search<SearchableShape>(
        options,
        haystack,
        `${haystack.length - 1}`,
      );
      expect(results.length).eq(1);
    });
  });

  describe('prefix-filter', () => {
    const search = searchByPrefixFilter;
    process.env.SEARCH_FUSE = undefined;
    it('empty result', () => {
      const results = search<SearchableShape>(options, haystack, '');
      expect(results.length).eq(0);
    });
    it('label prefix', () => {
      const results = search<SearchableShape>(options, haystack, 'label');
      expect(results.length).eq(haystack.length);
    });
    it('label suffix', () => {
      const results = search<SearchableShape>(
        options,
        haystack,
        `${haystack.length - 1}`,
      );
      expect(results.length).eq(0);
    });
  });
});
