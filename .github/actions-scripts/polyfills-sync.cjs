const { readFileSync } = require('fs');
const path = require('path');
const assert = require('assert');

const readme = readFileSync(path.resolve(__dirname, '../../README.md'), 'utf8');

const polyfillsFromDocs = /^```polyfills\s*\n([^`]+)\n^```/m
  .exec(readme)[1]
  .split('\n')
  .map(v => v.trim())
  .sort();
// @ts-ignore
const polyfillsFromSettings = require('../../.eslintrc.json').settings.polyfills.sort();
assert.deepStrictEqual(polyfillsFromDocs, polyfillsFromSettings);
