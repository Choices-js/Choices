/*! choices.js v11.0.0-rc5 | © 2024 Josh Johnson | https://github.com/jshjohnson/Choices#readme */

'use strict';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}
typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}

/**
 * Fuse.js v7.0.0 - Lightweight fuzzy-search (http://fusejs.io)
 *
 * Copyright (c) 2023 Kiro Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

function isArray(value) {
  return !Array.isArray ? getTag(value) === '[object Array]' : Array.isArray(value);
}

// Adapted from: https://github.com/lodash/lodash/blob/master/.internal/baseToString.js
const INFINITY = 1 / 0;
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  let result = value + '';
  return result == '0' && 1 / value == -INFINITY ? '-0' : result;
}
function toString(value) {
  return value == null ? '' : baseToString(value);
}
function isString(value) {
  return typeof value === 'string';
}
function isNumber(value) {
  return typeof value === 'number';
}

// Adapted from: https://github.com/lodash/lodash/blob/master/isBoolean.js
function isBoolean(value) {
  return value === true || value === false || isObjectLike(value) && getTag(value) == '[object Boolean]';
}
function isObject(value) {
  return typeof value === 'object';
}

// Checks if `value` is object-like.
function isObjectLike(value) {
  return isObject(value) && value !== null;
}
function isDefined(value) {
  return value !== undefined && value !== null;
}
function isBlank(value) {
  return !value.trim().length;
}

// Gets the `toStringTag` of `value`.
// Adapted from: https://github.com/lodash/lodash/blob/master/.internal/getTag.js
function getTag(value) {
  return value == null ? value === undefined ? '[object Undefined]' : '[object Null]' : Object.prototype.toString.call(value);
}
const EXTENDED_SEARCH_UNAVAILABLE = 'Extended search is not available';
const LOGICAL_SEARCH_UNAVAILABLE = 'Logical search is not available';
const INCORRECT_INDEX_TYPE = "Incorrect 'index' type";
const LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = key => `Invalid value for key ${key}`;
const PATTERN_LENGTH_TOO_LARGE = max => `Pattern length exceeds max of ${max}.`;
const MISSING_KEY_PROPERTY = name => `Missing ${name} property in key`;
const INVALID_KEY_WEIGHT_VALUE = key => `Property 'weight' in key '${key}' must be a positive integer`;
const hasOwn = Object.prototype.hasOwnProperty;
class KeyStore {
  constructor(keys) {
    this._keys = [];
    this._keyMap = {};
    let totalWeight = 0;
    keys.forEach(key => {
      let obj = createKey(key);
      this._keys.push(obj);
      this._keyMap[obj.id] = obj;
      totalWeight += obj.weight;
    });

    // Normalize weights so that their sum is equal to 1
    this._keys.forEach(key => {
      key.weight /= totalWeight;
    });
  }
  get(keyId) {
    return this._keyMap[keyId];
  }
  keys() {
    return this._keys;
  }
  toJSON() {
    return JSON.stringify(this._keys);
  }
}
function createKey(key) {
  let path = null;
  let id = null;
  let src = null;
  let weight = 1;
  let getFn = null;
  if (isString(key) || isArray(key)) {
    src = key;
    path = createKeyPath(key);
    id = createKeyId(key);
  } else {
    if (!hasOwn.call(key, 'name')) {
      throw new Error(MISSING_KEY_PROPERTY('name'));
    }
    const name = key.name;
    src = name;
    if (hasOwn.call(key, 'weight')) {
      weight = key.weight;
      if (weight <= 0) {
        throw new Error(INVALID_KEY_WEIGHT_VALUE(name));
      }
    }
    path = createKeyPath(name);
    id = createKeyId(name);
    getFn = key.getFn;
  }
  return {
    path,
    id,
    weight,
    src,
    getFn
  };
}
function createKeyPath(key) {
  return isArray(key) ? key : key.split('.');
}
function createKeyId(key) {
  return isArray(key) ? key.join('.') : key;
}
function get(obj, path) {
  let list = [];
  let arr = false;
  const deepGet = (obj, path, index) => {
    if (!isDefined(obj)) {
      return;
    }
    if (!path[index]) {
      // If there's no path left, we've arrived at the object we care about.
      list.push(obj);
    } else {
      let key = path[index];
      const value = obj[key];
      if (!isDefined(value)) {
        return;
      }

      // If we're at the last value in the path, and if it's a string/number/bool,
      // add it to the list
      if (index === path.length - 1 && (isString(value) || isNumber(value) || isBoolean(value))) {
        list.push(toString(value));
      } else if (isArray(value)) {
        arr = true;
        // Search each item in the array.
        for (let i = 0, len = value.length; i < len; i += 1) {
          deepGet(value[i], path, index + 1);
        }
      } else if (path.length) {
        // An object. Recurse further.
        deepGet(value, path, index + 1);
      }
    }
  };

  // Backwards compatibility (since path used to be a string)
  deepGet(obj, isString(path) ? path.split('.') : path, 0);
  return arr ? list : list[0];
}
const MatchOptions = {
  // Whether the matches should be included in the result set. When `true`, each record in the result
  // set will include the indices of the matched characters.
  // These can consequently be used for highlighting purposes.
  includeMatches: false,
  // When `true`, the matching function will continue to the end of a search pattern even if
  // a perfect match has already been located in the string.
  findAllMatches: false,
  // Minimum number of characters that must be matched before a result is considered a match
  minMatchCharLength: 1
};
const BasicOptions = {
  // When `true`, the algorithm continues searching to the end of the input even if a perfect
  // match is found before the end of the same input.
  isCaseSensitive: false,
  // When true, the matching function will continue to the end of a search pattern even if
  includeScore: false,
  // List of properties that will be searched. This also supports nested properties.
  keys: [],
  // Whether to sort the result list, by score
  shouldSort: true,
  // Default sort function: sort by ascending score, ascending index
  sortFn: (a, b) => a.score === b.score ? a.idx < b.idx ? -1 : 1 : a.score < b.score ? -1 : 1
};
const FuzzyOptions = {
  // Approximately where in the text is the pattern expected to be found?
  location: 0,
  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
  // (of both letters and location), a threshold of '1.0' would match anything.
  threshold: 0.6,
  // Determines how close the match must be to the fuzzy location (specified above).
  // An exact letter match which is 'distance' characters away from the fuzzy location
  // would score as a complete mismatch. A distance of '0' requires the match be at
  // the exact location specified, a threshold of '1000' would require a perfect match
  // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
  distance: 100
};
const AdvancedOptions = {
  // When `true`, it enables the use of unix-like search commands
  useExtendedSearch: false,
  // The get function to use when fetching an object's properties.
  // The default will search nested paths *ie foo.bar.baz*
  getFn: get,
  // When `true`, search will ignore `location` and `distance`, so it won't matter
  // where in the string the pattern appears.
  // More info: https://fusejs.io/concepts/scoring-theory.html#fuzziness-score
  ignoreLocation: false,
  // When `true`, the calculation for the relevance score (used for sorting) will
  // ignore the field-length norm.
  // More info: https://fusejs.io/concepts/scoring-theory.html#field-length-norm
  ignoreFieldNorm: false,
  // The weight to determine how much field length norm effects scoring.
  fieldNormWeight: 1
};
var Config = _objectSpread2(_objectSpread2(_objectSpread2(_objectSpread2({}, BasicOptions), MatchOptions), FuzzyOptions), AdvancedOptions);
const SPACE = /[^ ]+/g;

// Field-length norm: the shorter the field, the higher the weight.
// Set to 3 decimals to reduce index size.
function norm(weight = 1, mantissa = 3) {
  const cache = new Map();
  const m = Math.pow(10, mantissa);
  return {
    get(value) {
      const numTokens = value.match(SPACE).length;
      if (cache.has(numTokens)) {
        return cache.get(numTokens);
      }

      // Default function is 1/sqrt(x), weight makes that variable
      const norm = 1 / Math.pow(numTokens, 0.5 * weight);

      // In place of `toFixed(mantissa)`, for faster computation
      const n = parseFloat(Math.round(norm * m) / m);
      cache.set(numTokens, n);
      return n;
    },
    clear() {
      cache.clear();
    }
  };
}
class FuseIndex {
  constructor({
    getFn = Config.getFn,
    fieldNormWeight = Config.fieldNormWeight
  } = {}) {
    this.norm = norm(fieldNormWeight, 3);
    this.getFn = getFn;
    this.isCreated = false;
    this.setIndexRecords();
  }
  setSources(docs = []) {
    this.docs = docs;
  }
  setIndexRecords(records = []) {
    this.records = records;
  }
  setKeys(keys = []) {
    this.keys = keys;
    this._keysMap = {};
    keys.forEach((key, idx) => {
      this._keysMap[key.id] = idx;
    });
  }
  create() {
    if (this.isCreated || !this.docs.length) {
      return;
    }
    this.isCreated = true;

    // List is Array<String>
    if (isString(this.docs[0])) {
      this.docs.forEach((doc, docIndex) => {
        this._addString(doc, docIndex);
      });
    } else {
      // List is Array<Object>
      this.docs.forEach((doc, docIndex) => {
        this._addObject(doc, docIndex);
      });
    }
    this.norm.clear();
  }
  // Adds a doc to the end of the index
  add(doc) {
    const idx = this.size();
    if (isString(doc)) {
      this._addString(doc, idx);
    } else {
      this._addObject(doc, idx);
    }
  }
  // Removes the doc at the specified index of the index
  removeAt(idx) {
    this.records.splice(idx, 1);

    // Change ref index of every subsquent doc
    for (let i = idx, len = this.size(); i < len; i += 1) {
      this.records[i].i -= 1;
    }
  }
  getValueForItemAtKeyId(item, keyId) {
    return item[this._keysMap[keyId]];
  }
  size() {
    return this.records.length;
  }
  _addString(doc, docIndex) {
    if (!isDefined(doc) || isBlank(doc)) {
      return;
    }
    let record = {
      v: doc,
      i: docIndex,
      n: this.norm.get(doc)
    };
    this.records.push(record);
  }
  _addObject(doc, docIndex) {
    let record = {
      i: docIndex,
      $: {}
    };

    // Iterate over every key (i.e, path), and fetch the value at that key
    this.keys.forEach((key, keyIndex) => {
      let value = key.getFn ? key.getFn(doc) : this.getFn(doc, key.path);
      if (!isDefined(value)) {
        return;
      }
      if (isArray(value)) {
        let subRecords = [];
        const stack = [{
          nestedArrIndex: -1,
          value
        }];
        while (stack.length) {
          const {
            nestedArrIndex,
            value
          } = stack.pop();
          if (!isDefined(value)) {
            continue;
          }
          if (isString(value) && !isBlank(value)) {
            let subRecord = {
              v: value,
              i: nestedArrIndex,
              n: this.norm.get(value)
            };
            subRecords.push(subRecord);
          } else if (isArray(value)) {
            value.forEach((item, k) => {
              stack.push({
                nestedArrIndex: k,
                value: item
              });
            });
          } else ;
        }
        record.$[keyIndex] = subRecords;
      } else if (isString(value) && !isBlank(value)) {
        let subRecord = {
          v: value,
          n: this.norm.get(value)
        };
        record.$[keyIndex] = subRecord;
      }
    });
    this.records.push(record);
  }
  toJSON() {
    return {
      keys: this.keys,
      records: this.records
    };
  }
}
function createIndex(keys, docs, {
  getFn = Config.getFn,
  fieldNormWeight = Config.fieldNormWeight
} = {}) {
  const myIndex = new FuseIndex({
    getFn,
    fieldNormWeight
  });
  myIndex.setKeys(keys.map(createKey));
  myIndex.setSources(docs);
  myIndex.create();
  return myIndex;
}
function parseIndex(data, {
  getFn = Config.getFn,
  fieldNormWeight = Config.fieldNormWeight
} = {}) {
  const {
    keys,
    records
  } = data;
  const myIndex = new FuseIndex({
    getFn,
    fieldNormWeight
  });
  myIndex.setKeys(keys);
  myIndex.setIndexRecords(records);
  return myIndex;
}
function computeScore$1(pattern, {
  errors = 0,
  currentLocation = 0,
  expectedLocation = 0,
  distance = Config.distance,
  ignoreLocation = Config.ignoreLocation
} = {}) {
  const accuracy = errors / pattern.length;
  if (ignoreLocation) {
    return accuracy;
  }
  const proximity = Math.abs(expectedLocation - currentLocation);
  if (!distance) {
    // Dodge divide by zero error.
    return proximity ? 1.0 : accuracy;
  }
  return accuracy + proximity / distance;
}
function convertMaskToIndices(matchmask = [], minMatchCharLength = Config.minMatchCharLength) {
  let indices = [];
  let start = -1;
  let end = -1;
  let i = 0;
  for (let len = matchmask.length; i < len; i += 1) {
    let match = matchmask[i];
    if (match && start === -1) {
      start = i;
    } else if (!match && start !== -1) {
      end = i - 1;
      if (end - start + 1 >= minMatchCharLength) {
        indices.push([start, end]);
      }
      start = -1;
    }
  }

  // (i-1 - start) + 1 => i - start
  if (matchmask[i - 1] && i - start >= minMatchCharLength) {
    indices.push([start, i - 1]);
  }
  return indices;
}

// Machine word size
const MAX_BITS = 32;
function search$2(text, pattern, patternAlphabet, {
  location = Config.location,
  distance = Config.distance,
  threshold = Config.threshold,
  findAllMatches = Config.findAllMatches,
  minMatchCharLength = Config.minMatchCharLength,
  includeMatches = Config.includeMatches,
  ignoreLocation = Config.ignoreLocation
} = {}) {
  if (pattern.length > MAX_BITS) {
    throw new Error(PATTERN_LENGTH_TOO_LARGE(MAX_BITS));
  }
  const patternLen = pattern.length;
  // Set starting location at beginning text and initialize the alphabet.
  const textLen = text.length;
  // Handle the case when location > text.length
  const expectedLocation = Math.max(0, Math.min(location, textLen));
  // Highest score beyond which we give up.
  let currentThreshold = threshold;
  // Is there a nearby exact match? (speedup)
  let bestLocation = expectedLocation;

  // Performance: only computer matches when the minMatchCharLength > 1
  // OR if `includeMatches` is true.
  const computeMatches = minMatchCharLength > 1 || includeMatches;
  // A mask of the matches, used for building the indices
  const matchMask = computeMatches ? Array(textLen) : [];
  let index;

  // Get all exact matches, here for speed up
  while ((index = text.indexOf(pattern, bestLocation)) > -1) {
    let score = computeScore$1(pattern, {
      currentLocation: index,
      expectedLocation,
      distance,
      ignoreLocation
    });
    currentThreshold = Math.min(score, currentThreshold);
    bestLocation = index + patternLen;
    if (computeMatches) {
      let i = 0;
      while (i < patternLen) {
        matchMask[index + i] = 1;
        i += 1;
      }
    }
  }

  // Reset the best location
  bestLocation = -1;
  let lastBitArr = [];
  let finalScore = 1;
  let binMax = patternLen + textLen;
  const mask = 1 << patternLen - 1;
  for (let i = 0; i < patternLen; i += 1) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from the match location we can stray
    // at this error level.
    let binMin = 0;
    let binMid = binMax;
    while (binMin < binMid) {
      const score = computeScore$1(pattern, {
        errors: i,
        currentLocation: expectedLocation + binMid,
        expectedLocation,
        distance,
        ignoreLocation
      });
      if (score <= currentThreshold) {
        binMin = binMid;
      } else {
        binMax = binMid;
      }
      binMid = Math.floor((binMax - binMin) / 2 + binMin);
    }

    // Use the result from this iteration as the maximum for the next.
    binMax = binMid;
    let start = Math.max(1, expectedLocation - binMid + 1);
    let finish = findAllMatches ? textLen : Math.min(expectedLocation + binMid, textLen) + patternLen;

    // Initialize the bit array
    let bitArr = Array(finish + 2);
    bitArr[finish + 1] = (1 << i) - 1;
    for (let j = finish; j >= start; j -= 1) {
      let currentLocation = j - 1;
      let charMatch = patternAlphabet[text.charAt(currentLocation)];
      if (computeMatches) {
        // Speed up: quick bool to int conversion (i.e, `charMatch ? 1 : 0`)
        matchMask[currentLocation] = +!!charMatch;
      }

      // First pass: exact match
      bitArr[j] = (bitArr[j + 1] << 1 | 1) & charMatch;

      // Subsequent passes: fuzzy match
      if (i) {
        bitArr[j] |= (lastBitArr[j + 1] | lastBitArr[j]) << 1 | 1 | lastBitArr[j + 1];
      }
      if (bitArr[j] & mask) {
        finalScore = computeScore$1(pattern, {
          errors: i,
          currentLocation,
          expectedLocation,
          distance,
          ignoreLocation
        });

        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (finalScore <= currentThreshold) {
          // Indeed it is
          currentThreshold = finalScore;
          bestLocation = currentLocation;

          // Already passed `loc`, downhill from here on in.
          if (bestLocation <= expectedLocation) {
            break;
          }

          // When passing `bestLocation`, don't exceed our current distance from `expectedLocation`.
          start = Math.max(1, 2 * expectedLocation - bestLocation);
        }
      }
    }

    // No hope for a (better) match at greater error levels.
    const score = computeScore$1(pattern, {
      errors: i + 1,
      currentLocation: expectedLocation,
      expectedLocation,
      distance,
      ignoreLocation
    });
    if (score > currentThreshold) {
      break;
    }
    lastBitArr = bitArr;
  }
  const result = {
    isMatch: bestLocation >= 0,
    // Count exact matches (those with a score of 0) to be "almost" exact
    score: Math.max(0.001, finalScore)
  };
  if (computeMatches) {
    const indices = convertMaskToIndices(matchMask, minMatchCharLength);
    if (!indices.length) {
      result.isMatch = false;
    } else if (includeMatches) {
      result.indices = indices;
    }
  }
  return result;
}
function createPatternAlphabet(pattern) {
  let mask = {};
  for (let i = 0, len = pattern.length; i < len; i += 1) {
    const char = pattern.charAt(i);
    mask[char] = (mask[char] || 0) | 1 << len - i - 1;
  }
  return mask;
}
class BitapSearch {
  constructor(pattern, {
    location = Config.location,
    threshold = Config.threshold,
    distance = Config.distance,
    includeMatches = Config.includeMatches,
    findAllMatches = Config.findAllMatches,
    minMatchCharLength = Config.minMatchCharLength,
    isCaseSensitive = Config.isCaseSensitive,
    ignoreLocation = Config.ignoreLocation
  } = {}) {
    this.options = {
      location,
      threshold,
      distance,
      includeMatches,
      findAllMatches,
      minMatchCharLength,
      isCaseSensitive,
      ignoreLocation
    };
    this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
    this.chunks = [];
    if (!this.pattern.length) {
      return;
    }
    const addChunk = (pattern, startIndex) => {
      this.chunks.push({
        pattern,
        alphabet: createPatternAlphabet(pattern),
        startIndex
      });
    };
    const len = this.pattern.length;
    if (len > MAX_BITS) {
      let i = 0;
      const remainder = len % MAX_BITS;
      const end = len - remainder;
      while (i < end) {
        addChunk(this.pattern.substr(i, MAX_BITS), i);
        i += MAX_BITS;
      }
      if (remainder) {
        const startIndex = len - MAX_BITS;
        addChunk(this.pattern.substr(startIndex), startIndex);
      }
    } else {
      addChunk(this.pattern, 0);
    }
  }
  searchIn(text) {
    const {
      isCaseSensitive,
      includeMatches
    } = this.options;
    if (!isCaseSensitive) {
      text = text.toLowerCase();
    }

    // Exact match
    if (this.pattern === text) {
      let result = {
        isMatch: true,
        score: 0
      };
      if (includeMatches) {
        result.indices = [[0, text.length - 1]];
      }
      return result;
    }

    // Otherwise, use Bitap algorithm
    const {
      location,
      distance,
      threshold,
      findAllMatches,
      minMatchCharLength,
      ignoreLocation
    } = this.options;
    let allIndices = [];
    let totalScore = 0;
    let hasMatches = false;
    this.chunks.forEach(({
      pattern,
      alphabet,
      startIndex
    }) => {
      const {
        isMatch,
        score,
        indices
      } = search$2(text, pattern, alphabet, {
        location: location + startIndex,
        distance,
        threshold,
        findAllMatches,
        minMatchCharLength,
        includeMatches,
        ignoreLocation
      });
      if (isMatch) {
        hasMatches = true;
      }
      totalScore += score;
      if (isMatch && indices) {
        allIndices = [...allIndices, ...indices];
      }
    });
    let result = {
      isMatch: hasMatches,
      score: hasMatches ? totalScore / this.chunks.length : 1
    };
    if (hasMatches && includeMatches) {
      result.indices = allIndices;
    }
    return result;
  }
}
const registeredSearchers = [];
function createSearcher(pattern, options) {
  for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
    let searcherClass = registeredSearchers[i];
    if (searcherClass.condition(pattern, options)) {
      return new searcherClass(pattern, options);
    }
  }
  return new BitapSearch(pattern, options);
}
const LogicalOperator = {
  AND: '$and',
  OR: '$or'
};
const KeyType = {
  PATH: '$path',
  PATTERN: '$val'
};
const isExpression = query => !!(query[LogicalOperator.AND] || query[LogicalOperator.OR]);
const isPath = query => !!query[KeyType.PATH];
const isLeaf = query => !isArray(query) && isObject(query) && !isExpression(query);
const convertToExplicit = query => ({
  [LogicalOperator.AND]: Object.keys(query).map(key => ({
    [key]: query[key]
  }))
});

// When `auto` is `true`, the parse function will infer and initialize and add
// the appropriate `Searcher` instance
function parse(query, options, {
  auto = true
} = {}) {
  const next = query => {
    let keys = Object.keys(query);
    const isQueryPath = isPath(query);
    if (!isQueryPath && keys.length > 1 && !isExpression(query)) {
      return next(convertToExplicit(query));
    }
    if (isLeaf(query)) {
      const key = isQueryPath ? query[KeyType.PATH] : keys[0];
      const pattern = isQueryPath ? query[KeyType.PATTERN] : query[key];
      if (!isString(pattern)) {
        throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key));
      }
      const obj = {
        keyId: createKeyId(key),
        pattern
      };
      if (auto) {
        obj.searcher = createSearcher(pattern, options);
      }
      return obj;
    }
    let node = {
      children: [],
      operator: keys[0]
    };
    keys.forEach(key => {
      const value = query[key];
      if (isArray(value)) {
        value.forEach(item => {
          node.children.push(next(item));
        });
      }
    });
    return node;
  };
  if (!isExpression(query)) {
    query = convertToExplicit(query);
  }
  return next(query);
}

// Practical scoring function
function computeScore(results, {
  ignoreFieldNorm = Config.ignoreFieldNorm
}) {
  results.forEach(result => {
    let totalScore = 1;
    result.matches.forEach(({
      key,
      norm,
      score
    }) => {
      const weight = key ? key.weight : null;
      totalScore *= Math.pow(score === 0 && weight ? Number.EPSILON : score, (weight || 1) * (ignoreFieldNorm ? 1 : norm));
    });
    result.score = totalScore;
  });
}
function transformMatches(result, data) {
  const matches = result.matches;
  data.matches = [];
  if (!isDefined(matches)) {
    return;
  }
  matches.forEach(match => {
    if (!isDefined(match.indices) || !match.indices.length) {
      return;
    }
    const {
      indices,
      value
    } = match;
    let obj = {
      indices,
      value
    };
    if (match.key) {
      obj.key = match.key.src;
    }
    if (match.idx > -1) {
      obj.refIndex = match.idx;
    }
    data.matches.push(obj);
  });
}
function transformScore(result, data) {
  data.score = result.score;
}
function format(results, docs, {
  includeMatches = Config.includeMatches,
  includeScore = Config.includeScore
} = {}) {
  const transformers = [];
  if (includeMatches) transformers.push(transformMatches);
  if (includeScore) transformers.push(transformScore);
  return results.map(result => {
    const {
      idx
    } = result;
    const data = {
      item: docs[idx],
      refIndex: idx
    };
    if (transformers.length) {
      transformers.forEach(transformer => {
        transformer(result, data);
      });
    }
    return data;
  });
}
class Fuse {
  constructor(docs, options = {}, index) {
    this.options = _objectSpread2(_objectSpread2({}, Config), options);
    if (this.options.useExtendedSearch && !false) {
      throw new Error(EXTENDED_SEARCH_UNAVAILABLE);
    }
    this._keyStore = new KeyStore(this.options.keys);
    this.setCollection(docs, index);
  }
  setCollection(docs, index) {
    this._docs = docs;
    if (index && !(index instanceof FuseIndex)) {
      throw new Error(INCORRECT_INDEX_TYPE);
    }
    this._myIndex = index || createIndex(this.options.keys, this._docs, {
      getFn: this.options.getFn,
      fieldNormWeight: this.options.fieldNormWeight
    });
  }
  add(doc) {
    if (!isDefined(doc)) {
      return;
    }
    this._docs.push(doc);
    this._myIndex.add(doc);
  }
  remove(predicate = ( /* doc, idx */) => false) {
    const results = [];
    for (let i = 0, len = this._docs.length; i < len; i += 1) {
      const doc = this._docs[i];
      if (predicate(doc, i)) {
        this.removeAt(i);
        i -= 1;
        len -= 1;
        results.push(doc);
      }
    }
    return results;
  }
  removeAt(idx) {
    this._docs.splice(idx, 1);
    this._myIndex.removeAt(idx);
  }
  getIndex() {
    return this._myIndex;
  }
  search(query, {
    limit = -1
  } = {}) {
    const {
      includeMatches,
      includeScore,
      shouldSort,
      sortFn,
      ignoreFieldNorm
    } = this.options;
    let results = isString(query) ? isString(this._docs[0]) ? this._searchStringList(query) : this._searchObjectList(query) : this._searchLogical(query);
    computeScore(results, {
      ignoreFieldNorm
    });
    if (shouldSort) {
      results.sort(sortFn);
    }
    if (isNumber(limit) && limit > -1) {
      results = results.slice(0, limit);
    }
    return format(results, this._docs, {
      includeMatches,
      includeScore
    });
  }
  _searchStringList(query) {
    const searcher = createSearcher(query, this.options);
    const {
      records
    } = this._myIndex;
    const results = [];

    // Iterate over every string in the index
    records.forEach(({
      v: text,
      i: idx,
      n: norm
    }) => {
      if (!isDefined(text)) {
        return;
      }
      const {
        isMatch,
        score,
        indices
      } = searcher.searchIn(text);
      if (isMatch) {
        results.push({
          item: text,
          idx,
          matches: [{
            score,
            value: text,
            norm,
            indices
          }]
        });
      }
    });
    return results;
  }
  _searchLogical(query) {
    {
      throw new Error(LOGICAL_SEARCH_UNAVAILABLE);
    }
  }
  _searchObjectList(query) {
    const searcher = createSearcher(query, this.options);
    const {
      keys,
      records
    } = this._myIndex;
    const results = [];

    // List is Array<Object>
    records.forEach(({
      $: item,
      i: idx
    }) => {
      if (!isDefined(item)) {
        return;
      }
      let matches = [];

      // Iterate over every key (i.e, path), and fetch the value at that key
      keys.forEach((key, keyIndex) => {
        matches.push(...this._findMatches({
          key,
          value: item[keyIndex],
          searcher
        }));
      });
      if (matches.length) {
        results.push({
          idx,
          item,
          matches
        });
      }
    });
    return results;
  }
  _findMatches({
    key,
    value,
    searcher
  }) {
    if (!isDefined(value)) {
      return [];
    }
    let matches = [];
    if (isArray(value)) {
      value.forEach(({
        v: text,
        i: idx,
        n: norm
      }) => {
        if (!isDefined(text)) {
          return;
        }
        const {
          isMatch,
          score,
          indices
        } = searcher.searchIn(text);
        if (isMatch) {
          matches.push({
            score,
            key,
            value: text,
            idx,
            norm,
            indices
          });
        }
      });
    } else {
      const {
        v: text,
        n: norm
      } = value;
      const {
        isMatch,
        score,
        indices
      } = searcher.searchIn(text);
      if (isMatch) {
        matches.push({
          score,
          key,
          value: text,
          norm,
          indices
        });
      }
    }
    return matches;
  }
}
Fuse.version = '7.0.0';
Fuse.createIndex = createIndex;
Fuse.parseIndex = parseIndex;
Fuse.config = Config;
{
  Fuse.parseQuery = parse;
}

function searchByFuse(config, haystack, needle) {
    // Need to use an object literal for options argument
    // see https://github.com/krisk/Fuse/issues/303#issuecomment-506940824
    var fuse;
    {
        fuse = new Fuse(haystack, __assign(__assign({}, config.fuseOptions), { keys: __spreadArray([], config.searchFields, true), includeMatches: true }));
    }
    var results = fuse.search(needle);
    return results;
}

// eslint-disable-next-line import/no-mutable-exports
var search;
{
    search = searchByFuse;
}
var search$1 = search;

var addChoice = function (choice) { return ({
    type: "ADD_CHOICE" /* ActionType.ADD_CHOICE */,
    choice: choice,
}); };
var removeChoice = function (choice) { return ({
    type: "REMOVE_CHOICE" /* ActionType.REMOVE_CHOICE */,
    choice: choice,
}); };
var filterChoices = function (results) { return ({
    type: "FILTER_CHOICES" /* ActionType.FILTER_CHOICES */,
    results: results,
}); };
var activateChoices = function (active) {
    return ({
        type: "ACTIVATE_CHOICES" /* ActionType.ACTIVATE_CHOICES */,
        active: active,
    });
};
var clearChoices = function () { return ({
    type: "CLEAR_CHOICES" /* ActionType.CLEAR_CHOICES */,
}); };

var addGroup = function (group) { return ({
    type: "ADD_GROUP" /* ActionType.ADD_GROUP */,
    group: group,
}); };

var addItem = function (item) { return ({
    type: "ADD_ITEM" /* ActionType.ADD_ITEM */,
    item: item,
}); };
var removeItem = function (item) { return ({
    type: "REMOVE_ITEM" /* ActionType.REMOVE_ITEM */,
    item: item,
}); };
var highlightItem = function (item, highlighted) { return ({
    type: "HIGHLIGHT_ITEM" /* ActionType.HIGHLIGHT_ITEM */,
    item: item,
    highlighted: highlighted,
}); };

var clearAll = function () { return ({
    type: "CLEAR_ALL" /* ActionType.CLEAR_ALL */,
}); };
var setIsLoading = function (isLoading) { return ({
    type: "SET_IS_LOADING" /* ActionType.SET_IS_LOADING */,
    isLoading: isLoading,
}); };

/* eslint-disable @typescript-eslint/no-explicit-any */
var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
};
var generateChars = function (length) {
    return Array.from({ length: length }, function () { return getRandomNumber(0, 36).toString(36); }).join('');
};
var generateId = function (element, prefix) {
    var id = element.id ||
        (element.name && "".concat(element.name, "-").concat(generateChars(2))) ||
        generateChars(4);
    id = id.replace(/(:|\.|\[|\]|,)/g, '');
    id = "".concat(prefix, "-").concat(id);
    return id;
};
var getAdjacentEl = function (startEl, selector, direction) {
    if (direction === void 0) { direction = 1; }
    var prop = "".concat(direction > 0 ? 'next' : 'previous', "ElementSibling");
    var sibling = startEl[prop];
    while (sibling) {
        if (sibling.matches(selector)) {
            return sibling;
        }
        sibling = sibling[prop];
    }
    return sibling;
};
var isScrolledIntoView = function (element, parent, direction) {
    if (direction === void 0) { direction = 1; }
    if (!element) {
        return false;
    }
    var isVisible;
    if (direction > 0) {
        // In view from bottom
        isVisible =
            parent.scrollTop + parent.offsetHeight >=
                element.offsetTop + element.offsetHeight;
    }
    else {
        // In view from top
        isVisible = element.offsetTop >= parent.scrollTop;
    }
    return isVisible;
};
var sanitise = function (value) {
    if (typeof value !== 'string') {
        if (value === null || value === undefined) {
            return '';
        }
        if (typeof value === 'object') {
            if ('raw' in value) {
                return sanitise(value.raw);
            }
            if ('trusted' in value) {
                return value.trusted;
            }
        }
        return value;
    }
    return value
        .replace(/&/g, '&amp;')
        .replace(/>/g, '&gt;')
        .replace(/</g, '&lt;')
        .replace(/'/g, '&#039;')
        .replace(/"/g, '&quot;');
};
var strToEl = (function () {
    var tmpEl = document.createElement('div');
    return function (str) {
        tmpEl.innerHTML = str.trim();
        var firldChild = tmpEl.children[0];
        while (tmpEl.firstChild) {
            tmpEl.removeChild(tmpEl.firstChild);
        }
        return firldChild;
    };
})();
var unwrapStringForRaw = function (s) {
    if (typeof s === 'string') {
        return s;
    }
    if (typeof s === 'object') {
        if ('trusted' in s) {
            return s.trusted;
        }
        if ('raw' in s) {
            return s.raw;
        }
    }
    return '';
};
var unwrapStringForEscaped = function (s) {
    if (typeof s === 'string') {
        return s;
    }
    if (typeof s === 'object') {
        if ('escaped' in s) {
            return s.escaped;
        }
        if ('trusted' in s) {
            return s.trusted;
        }
    }
    return '';
};
var sortByAlpha = function (_a, _b) {
    var value = _a.value, _c = _a.label, label = _c === void 0 ? value : _c;
    var value2 = _b.value, _d = _b.label, label2 = _d === void 0 ? value2 : _d;
    return unwrapStringForRaw(label).localeCompare(unwrapStringForRaw(label2), [], {
        sensitivity: 'base',
        ignorePunctuation: true,
        numeric: true,
    });
};
var sortByScore = function (a, b) {
    return a.score - b.score;
};
var dispatchEvent = function (element, type, customArgs) {
    if (customArgs === void 0) { customArgs = null; }
    var event = new CustomEvent(type, {
        detail: customArgs,
        bubbles: true,
        cancelable: true,
    });
    return element.dispatchEvent(event);
};
var cloneObject = function (obj) {
    return obj !== undefined ? JSON.parse(JSON.stringify(obj)) : undefined;
};
/**
 * Returns an array of keys present on the first but missing on the second object
 */
var diff = function (a, b) {
    var aKeys = Object.keys(a).sort();
    var bKeys = Object.keys(b).sort();
    return aKeys.filter(function (i) { return bKeys.indexOf(i) < 0; });
};
var getClassNames = function (ClassNames) {
    return Array.isArray(ClassNames) ? ClassNames : [ClassNames];
};
var getClassNamesSelector = function (option) {
    if (option && Array.isArray(option)) {
        return option
            .map(function (item) {
            return ".".concat(item);
        })
            .join('');
    }
    return ".".concat(option);
};
var parseCustomProperties = function (customProperties) {
    if (typeof customProperties !== 'undefined') {
        try {
            return JSON.parse(customProperties);
        }
        catch (e) {
            return customProperties;
        }
    }
    return {};
};

var Dropdown = /** @class */ (function () {
    function Dropdown(_a) {
        var element = _a.element, type = _a.type, classNames = _a.classNames;
        this.element = element;
        this.classNames = classNames;
        this.type = type;
        this.isActive = false;
    }
    Object.defineProperty(Dropdown.prototype, "distanceFromTopWindow", {
        /**
         * Bottom position of dropdown in viewport coordinates
         */
        get: function () {
            return this.element.getBoundingClientRect().bottom;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Show dropdown to user by adding active state class
     */
    Dropdown.prototype.show = function () {
        var _a;
        (_a = this.element.classList).add.apply(_a, getClassNames(this.classNames.activeState));
        this.element.setAttribute('aria-expanded', 'true');
        this.isActive = true;
        return this;
    };
    /**
     * Hide dropdown from user
     */
    Dropdown.prototype.hide = function () {
        var _a;
        (_a = this.element.classList).remove.apply(_a, getClassNames(this.classNames.activeState));
        this.element.setAttribute('aria-expanded', 'false');
        this.isActive = false;
        return this;
    };
    return Dropdown;
}());

var TEXT_TYPE = 'text';
var SELECT_ONE_TYPE = 'select-one';
var SELECT_MULTIPLE_TYPE = 'select-multiple';
var SCROLLING_SPEED = 4;

var Container = /** @class */ (function () {
    function Container(_a) {
        var element = _a.element, type = _a.type, classNames = _a.classNames, position = _a.position;
        this.element = element;
        this.classNames = classNames;
        this.type = type;
        this.position = position;
        this.isOpen = false;
        this.isFlipped = false;
        this.isDisabled = false;
        this.isLoading = false;
    }
    /**
     * Determine whether container should be flipped based on passed
     * dropdown position
     */
    Container.prototype.shouldFlip = function (dropdownPos) {
        // If flip is enabled and the dropdown bottom position is
        // greater than the window height flip the dropdown.
        var shouldFlip = false;
        if (this.position === 'auto') {
            shouldFlip = !window.matchMedia("(min-height: ".concat(dropdownPos + 1, "px)"))
                .matches;
        }
        else if (this.position === 'top') {
            shouldFlip = true;
        }
        return shouldFlip;
    };
    Container.prototype.setActiveDescendant = function (activeDescendantID) {
        this.element.setAttribute('aria-activedescendant', activeDescendantID);
    };
    Container.prototype.removeActiveDescendant = function () {
        this.element.removeAttribute('aria-activedescendant');
    };
    Container.prototype.open = function (dropdownPos) {
        var _a, _b;
        (_a = this.element.classList).add.apply(_a, getClassNames(this.classNames.openState));
        this.element.setAttribute('aria-expanded', 'true');
        this.isOpen = true;
        if (this.shouldFlip(dropdownPos)) {
            (_b = this.element.classList).add.apply(_b, getClassNames(this.classNames.flippedState));
            this.isFlipped = true;
        }
    };
    Container.prototype.close = function () {
        var _a, _b;
        (_a = this.element.classList).remove.apply(_a, getClassNames(this.classNames.openState));
        this.element.setAttribute('aria-expanded', 'false');
        this.removeActiveDescendant();
        this.isOpen = false;
        // A dropdown flips if it does not have space within the page
        if (this.isFlipped) {
            (_b = this.element.classList).remove.apply(_b, getClassNames(this.classNames.flippedState));
            this.isFlipped = false;
        }
    };
    Container.prototype.focus = function () {
        this.element.focus();
    };
    Container.prototype.addFocusState = function () {
        var _a;
        (_a = this.element.classList).add.apply(_a, getClassNames(this.classNames.focusState));
    };
    Container.prototype.removeFocusState = function () {
        var _a;
        (_a = this.element.classList).remove.apply(_a, getClassNames(this.classNames.focusState));
    };
    Container.prototype.enable = function () {
        var _a;
        (_a = this.element.classList).remove.apply(_a, getClassNames(this.classNames.disabledState));
        this.element.removeAttribute('aria-disabled');
        if (this.type === SELECT_ONE_TYPE) {
            this.element.setAttribute('tabindex', '0');
        }
        this.isDisabled = false;
    };
    Container.prototype.disable = function () {
        var _a;
        (_a = this.element.classList).add.apply(_a, getClassNames(this.classNames.disabledState));
        this.element.setAttribute('aria-disabled', 'true');
        if (this.type === SELECT_ONE_TYPE) {
            this.element.setAttribute('tabindex', '-1');
        }
        this.isDisabled = true;
    };
    Container.prototype.wrap = function (element) {
        if (element.parentNode) {
            if (element.nextSibling) {
                element.parentNode.insertBefore(this.element, element.nextSibling);
            }
            else {
                element.parentNode.appendChild(this.element);
            }
        }
        this.element.appendChild(element);
    };
    Container.prototype.unwrap = function (element) {
        if (this.element.parentNode) {
            // Move passed element outside this element
            this.element.parentNode.insertBefore(element, this.element);
            // Remove this element
            this.element.parentNode.removeChild(this.element);
        }
    };
    Container.prototype.addLoadingState = function () {
        var _a;
        (_a = this.element.classList).add.apply(_a, getClassNames(this.classNames.loadingState));
        this.element.setAttribute('aria-busy', 'true');
        this.isLoading = true;
    };
    Container.prototype.removeLoadingState = function () {
        var _a;
        (_a = this.element.classList).remove.apply(_a, getClassNames(this.classNames.loadingState));
        this.element.removeAttribute('aria-busy');
        this.isLoading = false;
    };
    return Container;
}());

var Input = /** @class */ (function () {
    function Input(_a) {
        var element = _a.element, type = _a.type, classNames = _a.classNames, preventPaste = _a.preventPaste;
        this.element = element;
        this.type = type;
        this.classNames = classNames;
        this.preventPaste = preventPaste;
        this.isFocussed = this.element.isEqualNode(document.activeElement);
        this.isDisabled = element.disabled;
        this._onPaste = this._onPaste.bind(this);
        this._onInput = this._onInput.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onBlur = this._onBlur.bind(this);
    }
    Object.defineProperty(Input.prototype, "placeholder", {
        set: function (placeholder) {
            this.element.placeholder = placeholder;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input.prototype, "value", {
        get: function () {
            return this.element.value;
        },
        set: function (value) {
            this.element.value = value;
        },
        enumerable: false,
        configurable: true
    });
    Input.prototype.addEventListeners = function () {
        this.element.addEventListener('paste', this._onPaste);
        this.element.addEventListener('input', this._onInput, {
            passive: true,
        });
        this.element.addEventListener('focus', this._onFocus, {
            passive: true,
        });
        this.element.addEventListener('blur', this._onBlur, {
            passive: true,
        });
    };
    Input.prototype.removeEventListeners = function () {
        this.element.removeEventListener('input', this._onInput);
        this.element.removeEventListener('paste', this._onPaste);
        this.element.removeEventListener('focus', this._onFocus);
        this.element.removeEventListener('blur', this._onBlur);
    };
    Input.prototype.enable = function () {
        this.element.removeAttribute('disabled');
        this.isDisabled = false;
    };
    Input.prototype.disable = function () {
        this.element.setAttribute('disabled', '');
        this.isDisabled = true;
    };
    Input.prototype.focus = function () {
        if (!this.isFocussed) {
            this.element.focus();
        }
    };
    Input.prototype.blur = function () {
        if (this.isFocussed) {
            this.element.blur();
        }
    };
    Input.prototype.clear = function (setWidth) {
        if (setWidth === void 0) { setWidth = true; }
        if (this.element.value) {
            this.element.value = '';
        }
        if (setWidth) {
            this.setWidth();
        }
        return this;
    };
    /**
     * Set the correct input width based on placeholder
     * value or input value
     */
    Input.prototype.setWidth = function () {
        // Resize input to contents or placeholder
        var _a = this.element, style = _a.style, value = _a.value, placeholder = _a.placeholder;
        style.minWidth = "".concat(placeholder.length + 1, "ch");
        style.width = "".concat(value.length + 1, "ch");
    };
    Input.prototype.setActiveDescendant = function (activeDescendantID) {
        this.element.setAttribute('aria-activedescendant', activeDescendantID);
    };
    Input.prototype.removeActiveDescendant = function () {
        this.element.removeAttribute('aria-activedescendant');
    };
    Input.prototype._onInput = function () {
        if (this.type !== SELECT_ONE_TYPE) {
            this.setWidth();
        }
    };
    Input.prototype._onPaste = function (event) {
        if (this.preventPaste) {
            event.preventDefault();
        }
    };
    Input.prototype._onFocus = function () {
        this.isFocussed = true;
    };
    Input.prototype._onBlur = function () {
        this.isFocussed = false;
    };
    return Input;
}());

var List = /** @class */ (function () {
    function List(_a) {
        var element = _a.element;
        this.element = element;
        this.scrollPos = this.element.scrollTop;
        this.height = this.element.offsetHeight;
    }
    List.prototype.clear = function () {
        this.element.innerHTML = '';
    };
    List.prototype.prepend = function (node) {
        var child = this.element.firstElementChild;
        if (child) {
            this.element.insertBefore(node, child);
        }
        else {
            this.element.append(node);
        }
    };
    List.prototype.append = function (node) {
        this.element.appendChild(node);
    };
    List.prototype.hasChildren = function () {
        return this.element.hasChildNodes();
    };
    List.prototype.scrollToTop = function () {
        this.element.scrollTop = 0;
    };
    List.prototype.scrollToChildElement = function (element, direction) {
        var _this = this;
        if (!element) {
            return;
        }
        var listHeight = this.element.offsetHeight;
        // Scroll position of dropdown
        var listScrollPosition = this.element.scrollTop + listHeight;
        var elementHeight = element.offsetHeight;
        // Distance from bottom of element to top of parent
        var elementPos = element.offsetTop + elementHeight;
        // Difference between the element and scroll position
        var destination = direction > 0
            ? this.element.scrollTop + elementPos - listScrollPosition
            : element.offsetTop;
        requestAnimationFrame(function () {
            _this._animateScroll(destination, direction);
        });
    };
    List.prototype._scrollDown = function (scrollPos, strength, destination) {
        var easing = (destination - scrollPos) / strength;
        var distance = easing > 1 ? easing : 1;
        this.element.scrollTop = scrollPos + distance;
    };
    List.prototype._scrollUp = function (scrollPos, strength, destination) {
        var easing = (scrollPos - destination) / strength;
        var distance = easing > 1 ? easing : 1;
        this.element.scrollTop = scrollPos - distance;
    };
    List.prototype._animateScroll = function (destination, direction) {
        var _this = this;
        var strength = SCROLLING_SPEED;
        var choiceListScrollTop = this.element.scrollTop;
        var continueAnimation = false;
        if (direction > 0) {
            this._scrollDown(choiceListScrollTop, strength, destination);
            if (choiceListScrollTop < destination) {
                continueAnimation = true;
            }
        }
        else {
            this._scrollUp(choiceListScrollTop, strength, destination);
            if (choiceListScrollTop > destination) {
                continueAnimation = true;
            }
        }
        if (continueAnimation) {
            requestAnimationFrame(function () {
                _this._animateScroll(destination, direction);
            });
        }
    };
    return List;
}());

var WrappedElement = /** @class */ (function () {
    function WrappedElement(_a) {
        var element = _a.element, classNames = _a.classNames;
        this.element = element;
        this.classNames = classNames;
        this.isDisabled = false;
    }
    Object.defineProperty(WrappedElement.prototype, "isActive", {
        get: function () {
            return this.element.dataset.choice === 'active';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WrappedElement.prototype, "dir", {
        get: function () {
            return this.element.dir;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WrappedElement.prototype, "value", {
        get: function () {
            return this.element.value;
        },
        set: function (value) {
            this.element.setAttribute('value', value);
            this.element.value = value;
        },
        enumerable: false,
        configurable: true
    });
    WrappedElement.prototype.conceal = function () {
        var _a;
        // Hide passed input
        (_a = this.element.classList).add.apply(_a, getClassNames(this.classNames.input));
        this.element.hidden = true;
        // Remove element from tab index
        this.element.tabIndex = -1;
        // Backup original styles if any
        var origStyle = this.element.getAttribute('style');
        if (origStyle) {
            this.element.setAttribute('data-choice-orig-style', origStyle);
        }
        this.element.setAttribute('data-choice', 'active');
    };
    WrappedElement.prototype.reveal = function () {
        var _a;
        // Reinstate passed element
        (_a = this.element.classList).remove.apply(_a, getClassNames(this.classNames.input));
        this.element.hidden = false;
        this.element.removeAttribute('tabindex');
        // Recover original styles if any
        var origStyle = this.element.getAttribute('data-choice-orig-style');
        if (origStyle) {
            this.element.removeAttribute('data-choice-orig-style');
            this.element.setAttribute('style', origStyle);
        }
        else {
            this.element.removeAttribute('style');
        }
        this.element.removeAttribute('data-choice');
        // Re-assign values - this is weird, I know
        // @todo Figure out why we need to do this
        this.element.value = this.element.value; // eslint-disable-line no-self-assign
    };
    WrappedElement.prototype.enable = function () {
        this.element.removeAttribute('disabled');
        this.element.disabled = false;
        this.isDisabled = false;
    };
    WrappedElement.prototype.disable = function () {
        this.element.setAttribute('disabled', '');
        this.element.disabled = true;
        this.isDisabled = true;
    };
    WrappedElement.prototype.triggerEvent = function (eventType, data) {
        dispatchEvent(this.element, eventType, data);
    };
    return WrappedElement;
}());

var WrappedInput = /** @class */ (function (_super) {
    __extends(WrappedInput, _super);
    function WrappedInput() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return WrappedInput;
}(WrappedElement));

var coerceBool = function (arg, defaultValue) {
    if (defaultValue === void 0) { defaultValue = true; }
    return typeof arg === 'undefined' ? defaultValue : !!arg;
};
var stringToHtmlClass = function (input) {
    if (typeof input === 'string') {
        // eslint-disable-next-line no-param-reassign
        input = input.split(' ').filter(function (s) { return s.length !== 0; });
    }
    if (Array.isArray(input) && input.length !== 0) {
        return input;
    }
    return undefined;
};
var mapInputToChoice = function (value, allowGroup) {
    if (typeof value === 'string') {
        var result_1 = mapInputToChoice({
            value: value,
            label: value,
        }, false);
        return result_1;
    }
    var groupOrChoice = value;
    if ('choices' in groupOrChoice) {
        if (!allowGroup) {
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup
            throw new TypeError("optGroup is not allowed");
        }
        var group = groupOrChoice;
        var choices = group.choices.map(function (e) { return mapInputToChoice(e, false); });
        var result_2 = {
            id: 0, // actual ID will be assigned during _addGroup
            label: unwrapStringForRaw(group.label) || group.value,
            active: choices.length !== 0,
            disabled: !!group.disabled,
            choices: choices,
        };
        return result_2;
    }
    var choice = groupOrChoice;
    var result = {
        id: 0, // actual ID will be assigned during _addChoice
        groupId: 0, // actual ID will be assigned during _addGroup but before _addChoice
        score: 0, // used in search
        value: choice.value,
        label: choice.label || choice.value,
        active: coerceBool(choice.active),
        selected: coerceBool(choice.selected, false),
        disabled: coerceBool(choice.disabled, false),
        placeholder: coerceBool(choice.placeholder, false),
        highlighted: false,
        labelClass: stringToHtmlClass(choice.labelClass),
        labelDescription: choice.labelDescription,
        customProperties: choice.customProperties,
    };
    return result;
};

var isHtmlInputElement = function (e) {
    return e.tagName === 'INPUT';
};
var isHtmlSelectElement = function (e) {
    return e.tagName === 'SELECT';
};
var isHtmlOption = function (e) {
    return e.tagName === 'OPTION';
};
var isHtmlOptgroup = function (e) {
    return e.tagName === 'OPTGROUP';
};

var WrappedSelect = /** @class */ (function (_super) {
    __extends(WrappedSelect, _super);
    function WrappedSelect(_a) {
        var element = _a.element, classNames = _a.classNames, template = _a.template, extractPlaceholder = _a.extractPlaceholder;
        var _this = _super.call(this, { element: element, classNames: classNames }) || this;
        _this.template = template;
        _this.extractPlaceholder = extractPlaceholder;
        return _this;
    }
    Object.defineProperty(WrappedSelect.prototype, "placeholderOption", {
        get: function () {
            return (this.element.querySelector('option[value=""]') ||
                // Backward compatibility layer for the non-standard placeholder attribute supported in older versions.
                this.element.querySelector('option[placeholder]'));
        },
        enumerable: false,
        configurable: true
    });
    WrappedSelect.prototype.addOptions = function (choices) {
        var _this = this;
        choices.forEach(function (obj) {
            var choice = obj;
            if (choice.element) {
                return;
            }
            var option = _this.template(choice);
            _this.element.appendChild(option);
            choice.element = option;
        });
    };
    WrappedSelect.prototype.optionsAsChoices = function () {
        var _this = this;
        var choices = [];
        this.element
            .querySelectorAll(':scope > option, :scope > optgroup')
            .forEach(function (e) {
            if (isHtmlOption(e)) {
                choices.push(_this._optionToChoice(e));
            }
            else if (isHtmlOptgroup(e)) {
                choices.push(_this._optgroupToChoice(e));
            }
            // todo: hr as empty optgroup, requires displaying empty opt-groups to be useful
        });
        return choices;
    };
    // eslint-disable-next-line class-methods-use-this
    WrappedSelect.prototype._optionToChoice = function (option) {
        return {
            id: 0,
            groupId: 0,
            score: 0,
            value: option.value,
            label: option.innerHTML,
            element: option,
            active: true,
            // this returns true if nothing is selected on initial load, which will break placeholder support
            selected: this.extractPlaceholder
                ? option.selected
                : option.hasAttribute('selected'),
            disabled: option.disabled,
            highlighted: false,
            placeholder: this.extractPlaceholder &&
                (option.value === '' || option.hasAttribute('placeholder')),
            labelClass: typeof option.dataset.labelClass !== 'undefined'
                ? stringToHtmlClass(option.dataset.labelClass)
                : undefined,
            labelDescription: typeof option.dataset.labelDescription !== 'undefined'
                ? option.dataset.labelDescription
                : undefined,
            customProperties: parseCustomProperties(option.dataset.customProperties),
        };
    };
    WrappedSelect.prototype._optgroupToChoice = function (optgroup) {
        var _this = this;
        var options = optgroup.querySelectorAll('option');
        var choices = Array.from(options).map(function (option) {
            return _this._optionToChoice(option);
        });
        return {
            id: 0,
            label: optgroup.label || '',
            element: optgroup,
            active: choices.length !== 0,
            disabled: optgroup.disabled,
            choices: choices,
        };
    };
    return WrappedSelect;
}(WrappedElement));

var DEFAULT_CLASSNAMES = {
    containerOuter: ['choices'],
    containerInner: ['choices__inner'],
    input: ['choices__input'],
    inputCloned: ['choices__input--cloned'],
    list: ['choices__list'],
    listItems: ['choices__list--multiple'],
    listSingle: ['choices__list--single'],
    listDropdown: ['choices__list--dropdown'],
    item: ['choices__item'],
    itemSelectable: ['choices__item--selectable'],
    itemDisabled: ['choices__item--disabled'],
    itemChoice: ['choices__item--choice'],
    description: ['choices__description'],
    placeholder: ['choices__placeholder'],
    group: ['choices__group'],
    groupHeading: ['choices__heading'],
    button: ['choices__button'],
    activeState: ['is-active'],
    focusState: ['is-focused'],
    openState: ['is-open'],
    disabledState: ['is-disabled'],
    highlightedState: ['is-highlighted'],
    selectedState: ['is-selected'],
    flippedState: ['is-flipped'],
    loadingState: ['is-loading'],
    addChoice: ['choices__item', 'choices__item--selectable', 'add-choice'],
    noResults: ['has-no-results'],
    noChoices: ['has-no-choices'],
};
var DEFAULT_CONFIG = {
    items: [],
    choices: [],
    silent: false,
    renderChoiceLimit: -1,
    maxItemCount: -1,
    singleModeForMultiSelect: false,
    addChoices: false,
    addItems: true,
    addItemFilter: function (value) { return !!value && value !== ''; },
    removeItems: true,
    removeItemButton: false,
    removeItemButtonAlignLeft: false,
    editItems: false,
    allowHTML: false,
    allowHtmlUserInput: false,
    duplicateItemsAllowed: true,
    delimiter: ',',
    paste: true,
    searchEnabled: true,
    searchChoices: true,
    searchFloor: 1,
    searchResultLimit: 4,
    searchFields: ['label', 'value'],
    position: 'auto',
    resetScrollPosition: true,
    shouldSort: true,
    shouldSortItems: false,
    sorter: sortByAlpha,
    shadowRoot: null,
    placeholder: true,
    placeholderValue: null,
    searchPlaceholderValue: null,
    prependValue: null,
    appendValue: null,
    renderSelectedChoices: 'auto',
    loadingText: 'Loading...',
    noResultsText: 'No results found',
    noChoicesText: 'No choices to choose from',
    itemSelectText: 'Press to select',
    uniqueItemText: 'Only unique values can be added',
    customAddItemText: 'Only values matching specific conditions can be added',
    addItemText: function (value) { return "Press Enter to add <b>\"".concat(value, "\"</b>"); },
    removeItemIconText: function () { return "Remove item"; },
    removeItemLabelText: function (value) { return "Remove item: ".concat(value); },
    maxItemText: function (maxItemCount) { return "Only ".concat(maxItemCount, " values can be added"); },
    valueComparer: function (value1, value2) { return value1 === value2; },
    fuseOptions: {
        includeScore: true,
    },
    labelId: '',
    callbackOnInit: null,
    callbackOnCreateTemplates: null,
    classNames: DEFAULT_CLASSNAMES,
    appendGroupInSearch: false,
};

var ObjectsInConfig = ['fuseOptions', 'classNames'];

/**
 * Adapted from React: https://github.com/facebook/react/blob/master/packages/shared/formatProdErrorMessage.js
 *
 * Do not require this module directly! Use normal throw error calls. These messages will be replaced with error codes
 * during build.
 * @param {number} code
 */
function formatProdErrorMessage(code) {
  return "Minified Redux error #" + code + "; visit https://redux.js.org/Errors?code=" + code + " for the full message or " + 'use the non-minified dev environment for full errors. ';
}

// Inlined version of the `symbol-observable` polyfill
var $$observable = function () {
  return typeof Symbol === 'function' && Symbol.observable || '@@observable';
}();

/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var randomString = function randomString() {
  return Math.random().toString(36).substring(7).split('').join('.');
};
var ActionTypes = {
  INIT: "@@redux/INIT" + randomString(),
  REPLACE: "@@redux/REPLACE" + randomString(),
  PROBE_UNKNOWN_ACTION: function PROBE_UNKNOWN_ACTION() {
    return "@@redux/PROBE_UNKNOWN_ACTION" + randomString();
  }
};

/**
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false;
  var proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
}

/**
 * @deprecated
 *
 * **We recommend using the `configureStore` method
 * of the `@reduxjs/toolkit` package**, which replaces `createStore`.
 *
 * Redux Toolkit is our recommended approach for writing Redux logic today,
 * including store setup, reducers, data fetching, and more.
 *
 * **For more details, please read this Redux docs page:**
 * **https://redux.js.org/introduction/why-rtk-is-redux-today**
 *
 * `configureStore` from Redux Toolkit is an improved version of `createStore` that
 * simplifies setup and helps avoid common bugs.
 *
 * You should not be using the `redux` core package by itself today, except for learning purposes.
 * The `createStore` method from the core `redux` package will not be removed, but we encourage
 * all users to migrate to using Redux Toolkit for all Redux code.
 *
 * If you want to use `createStore` without this visual deprecation warning, use
 * the `legacy_createStore` import instead:
 *
 * `import { legacy_createStore as createStore} from 'redux'`
 *
 */

function createStore(reducer, preloadedState, enhancer) {
  var _ref2;
  if (typeof preloadedState === 'function' && typeof enhancer === 'function' || typeof enhancer === 'function' && typeof arguments[3] === 'function') {
    throw new Error(formatProdErrorMessage(0) );
  }
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }
  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error(formatProdErrorMessage(1) );
    }
    return enhancer(createStore)(reducer, preloadedState);
  }
  if (typeof reducer !== 'function') {
    throw new Error(formatProdErrorMessage(2) );
  }
  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;
  /**
   * This makes a shallow copy of currentListeners so we can use
   * nextListeners as a temporary list while dispatching.
   *
   * This prevents any bugs around consumers calling
   * subscribe/unsubscribe in the middle of a dispatch.
   */

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }
  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */

  function getState() {
    if (isDispatching) {
      throw new Error(formatProdErrorMessage(3) );
    }
    return currentState;
  }
  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */

  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error(formatProdErrorMessage(4) );
    }
    if (isDispatching) {
      throw new Error(formatProdErrorMessage(5) );
    }
    var isSubscribed = true;
    ensureCanMutateNextListeners();
    nextListeners.push(listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }
      if (isDispatching) {
        throw new Error(formatProdErrorMessage(6) );
      }
      isSubscribed = false;
      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    };
  }
  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */

  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error(formatProdErrorMessage(7) );
    }
    if (typeof action.type === 'undefined') {
      throw new Error(formatProdErrorMessage(8) );
    }
    if (isDispatching) {
      throw new Error(formatProdErrorMessage(9) );
    }
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }
    return action;
  }
  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */

  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error(formatProdErrorMessage(10) );
    }
    currentReducer = nextReducer; // This action has a similiar effect to ActionTypes.INIT.
    // Any reducers that existed in both the new and old rootReducer
    // will receive the previous state. This effectively populates
    // the new state tree with any relevant data from the old one.

    dispatch({
      type: ActionTypes.REPLACE
    });
  }
  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */

  function observable() {
    var _ref;
    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new Error(formatProdErrorMessage(11) );
        }
        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }
        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe: unsubscribe
        };
      }
    }, _ref[$$observable] = function () {
      return this;
    }, _ref;
  } // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.

  dispatch({
    type: ActionTypes.INIT
  });
  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[$$observable] = observable, _ref2;
}
function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, {
      type: ActionTypes.INIT
    });
    if (typeof initialState === 'undefined') {
      throw new Error(formatProdErrorMessage(12) );
    }
    if (typeof reducer(undefined, {
      type: ActionTypes.PROBE_UNKNOWN_ACTION()
    }) === 'undefined') {
      throw new Error(formatProdErrorMessage(13) );
    }
  });
}
/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */

function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers); // This is used to make sure we don't warn about the same
  var shapeAssertionError;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }
  return function combination(state, action) {
    if (state === void 0) {
      state = {};
    }
    if (shapeAssertionError) {
      throw shapeAssertionError;
    }
    var hasChanged = false;
    var nextState = {};
    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        action && action.type;
        throw new Error(formatProdErrorMessage(14) );
      }
      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
}

function items(state, action) {
    if (state === void 0) { state = []; }
    if (action === void 0) { action = {}; }
    switch (action.type) {
        case "ADD_ITEM" /* ActionType.ADD_ITEM */: {
            var item = action.item;
            if (!item.id) {
                return state;
            }
            item.selected = true;
            var el = item.element;
            if (el) {
                el.selected = true;
                el.setAttribute('selected', '');
            }
            return __spreadArray(__spreadArray([], state, true), [item], false).map(function (obj) {
                var choice = obj;
                choice.highlighted = false;
                return choice;
            });
        }
        case "REMOVE_ITEM" /* ActionType.REMOVE_ITEM */: {
            var item_1 = action.item;
            if (!item_1.id) {
                return state;
            }
            item_1.selected = false;
            var el = item_1.element;
            if (el) {
                el.selected = false;
                el.removeAttribute('selected');
            }
            return state.filter(function (choice) { return choice.id !== item_1.id; });
        }
        case "REMOVE_CHOICE" /* ActionType.REMOVE_CHOICE */: {
            var choice_1 = action.choice;
            return state.filter(function (item) { return item.id !== choice_1.id; });
        }
        case "HIGHLIGHT_ITEM" /* ActionType.HIGHLIGHT_ITEM */: {
            var highlightItemAction_1 = action;
            return state.map(function (obj) {
                var item = obj;
                if (item.id === highlightItemAction_1.item.id) {
                    item.highlighted = highlightItemAction_1.highlighted;
                }
                return item;
            });
        }
        default: {
            return state;
        }
    }
}

function groups(state, action) {
    if (state === void 0) { state = []; }
    if (action === void 0) { action = {}; }
    switch (action.type) {
        case "ADD_GROUP" /* ActionType.ADD_GROUP */: {
            var addGroupAction = action;
            return __spreadArray(__spreadArray([], state, true), [addGroupAction.group], false);
        }
        case "CLEAR_CHOICES" /* ActionType.CLEAR_CHOICES */: {
            return [];
        }
        default: {
            return state;
        }
    }
}

function choices(state, action) {
    if (state === void 0) { state = []; }
    if (action === void 0) { action = {}; }
    switch (action.type) {
        case "ADD_CHOICE" /* ActionType.ADD_CHOICE */: {
            var choice = action.choice;
            /*
              A disabled choice appears in the choice dropdown but cannot be selected
              A selected choice has been added to the passed input's value (added as an item)
              An active choice appears within the choice dropdown
            */
            return __spreadArray(__spreadArray([], state, true), [choice], false);
        }
        case "REMOVE_CHOICE" /* ActionType.REMOVE_CHOICE */: {
            var choice_1 = action.choice;
            return state.filter(function (obj) { return obj.id !== choice_1.id; });
        }
        case "ADD_ITEM" /* ActionType.ADD_ITEM */: {
            var item = action.item;
            // trigger a rebuild of the choices list as the item can not be added multiple times
            if (item.id && item.selected) {
                return __spreadArray([], state, true);
            }
            return state;
        }
        case "REMOVE_ITEM" /* ActionType.REMOVE_ITEM */: {
            var item = action.item;
            // trigger a rebuild of the choices list as the item can be added
            if (item.id && !item.selected) {
                return __spreadArray([], state, true);
            }
            return state;
        }
        case "FILTER_CHOICES" /* ActionType.FILTER_CHOICES */: {
            var results_1 = action.results;
            return state.map(function (obj) {
                var choice = obj;
                // Set active state based on whether choice is
                // within filtered results
                choice.active = results_1.some(function (_a) {
                    var item = _a.item, score = _a.score;
                    if (item.id === choice.id) {
                        choice.score = score;
                        return true;
                    }
                    return false;
                });
                return choice;
            });
        }
        case "ACTIVATE_CHOICES" /* ActionType.ACTIVATE_CHOICES */: {
            var active_1 = action.active;
            return state.map(function (obj) {
                var choice = obj;
                choice.active = active_1;
                return choice;
            });
        }
        case "CLEAR_CHOICES" /* ActionType.CLEAR_CHOICES */: {
            return [];
        }
        default: {
            return state;
        }
    }
}

var general = function (state, action) {
    if (state === void 0) { state = 0; }
    if (action === void 0) { action = {}; }
    switch (action.type) {
        case "SET_IS_LOADING" /* ActionType.SET_IS_LOADING */: {
            if (action.isLoading) {
                return state + 1;
            }
            return Math.max(0, state - 1);
        }
        default: {
            return state;
        }
    }
};

var defaultState = {
    groups: [],
    items: [],
    choices: [],
    loading: 0,
};
var appReducer = combineReducers({
    items: items,
    groups: groups,
    choices: choices,
    loading: general,
});
var rootReducer = function (passedState, action) {
    var state = passedState;
    // If we are clearing all items, groups and options we reassign
    // state and then pass that state to our proper reducer. This isn't
    // mutating our actual state
    // See: http://stackoverflow.com/a/35641992
    if (action.type === "CLEAR_ALL" /* ActionType.CLEAR_ALL */) {
        // preserve the loading state as to allow withDeferRendering to work
        var isLoading = state.loading;
        state = cloneObject(defaultState);
        state.loading = isLoading;
    }
    return appReducer(state, action);
};

var Store = /** @class */ (function () {
    function Store() {
        this._store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ &&
            window.__REDUX_DEVTOOLS_EXTENSION__());
    }
    /**
     * Subscribe store to function call (wrapped Redux method)
     */
    Store.prototype.subscribe = function (onChange) {
        this._store.subscribe(onChange);
    };
    /**
     * Dispatch event to store (wrapped Redux method)
     */
    Store.prototype.dispatch = function (action) {
        this._store.dispatch(action);
    };
    Store.prototype.startDeferRendering = function () {
        this._store.dispatch(setIsLoading(true));
    };
    Store.prototype.stopDeferRendering = function () {
        this._store.dispatch(setIsLoading(false));
    };
    Store.prototype.withDeferRendering = function (func) {
        this.startDeferRendering();
        try {
            func();
        }
        finally {
            this.stopDeferRendering();
        }
    };
    Object.defineProperty(Store.prototype, "state", {
        /**
         * Get store object (wrapping Redux method)
         */
        get: function () {
            return this._store.getState();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Store.prototype, "items", {
        /**
         * Get items from store
         */
        get: function () {
            return this.state.items;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Store.prototype, "highlightedActiveItems", {
        /**
         * Get highlighted items from store
         */
        get: function () {
            return this.items.filter(function (item) { return !item.disabled && item.active && item.highlighted; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Store.prototype, "choices", {
        /**
         * Get choices from store
         */
        get: function () {
            return this.state.choices;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Store.prototype, "activeChoices", {
        /**
         * Get active choices from store
         */
        get: function () {
            return this.choices.filter(function (choice) { return choice.active; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Store.prototype, "searchableChoices", {
        /**
         * Get choices that can be searched (excluding placeholders)
         */
        get: function () {
            return this.choices.filter(function (choice) { return !choice.disabled && !choice.placeholder; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Store.prototype, "placeholderChoice", {
        /**
         * Get placeholder choice from store
         */
        get: function () {
            return __spreadArray([], this.choices, true).reverse()
                .find(function (choice) { return !choice.disabled && choice.placeholder; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Store.prototype, "groups", {
        /**
         * Get groups from store
         */
        get: function () {
            return this.state.groups;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Store.prototype, "activeGroups", {
        /**
         * Get active groups from store
         */
        get: function () {
            var _a = this, groups = _a.groups, choices = _a.choices;
            return groups.filter(function (group) {
                var isActive = group.active && !group.disabled;
                var hasActiveOptions = choices.some(function (choice) { return choice.active && !choice.disabled; });
                return isActive && hasActiveOptions;
            }, []);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get loading state from store
     */
    Store.prototype.isLoading = function () {
        return this.state.loading > 0;
    };
    /**
     * Get single choice by it's ID
     */
    Store.prototype.getChoiceById = function (id) {
        return this.activeChoices.find(function (choice) { return choice.id === id; });
    };
    /**
     * Get group by group id
     */
    Store.prototype.getGroupById = function (id) {
        return this.groups.find(function (group) { return group.id === id; });
    };
    return Store;
}());

/**
 * Helpers to create HTML elements used by Choices
 * Can be overridden by providing `callbackOnCreateTemplates` option.
 * `Choices.defaults.templates` allows access to the default template methods from `callbackOnCreateTemplates`
 */
var escapeForTemplate = function (allowHTML, s) { return (allowHTML ? unwrapStringForEscaped(s) : sanitise(s)); };
var isEmptyObject = function (obj) {
    // eslint-disable-next-line no-restricted-syntax
    for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }
    return true;
};
var assignCustomProperties = function (el, customProperties) {
    if (!customProperties) {
        return;
    }
    var dataset = el.dataset;
    if (typeof customProperties === 'string') {
        dataset.customProperties = customProperties;
    }
    else if (typeof customProperties === 'object' &&
        !isEmptyObject(customProperties)) {
        dataset.customProperties = JSON.stringify(customProperties);
    }
};
var templates = {
    containerOuter: function (_a, dir, isSelectElement, isSelectOneElement, searchEnabled, passedElementType, labelId) {
        var containerOuter = _a.classNames.containerOuter;
        var div = Object.assign(document.createElement('div'), {
            className: getClassNames(containerOuter).join(' '),
        });
        div.dataset.type = passedElementType;
        if (dir) {
            div.dir = dir;
        }
        if (isSelectOneElement) {
            div.tabIndex = 0;
        }
        if (isSelectElement) {
            div.setAttribute('role', searchEnabled ? 'combobox' : 'listbox');
            if (searchEnabled) {
                div.setAttribute('aria-autocomplete', 'list');
            }
        }
        div.setAttribute('aria-haspopup', 'true');
        div.setAttribute('aria-expanded', 'false');
        if (labelId) {
            div.setAttribute('aria-labelledby', labelId);
        }
        return div;
    },
    containerInner: function (_a) {
        var containerInner = _a.classNames.containerInner;
        return Object.assign(document.createElement('div'), {
            className: getClassNames(containerInner).join(' '),
        });
    },
    itemList: function (_a, isSelectOneElement) {
        var _b = _a.classNames, list = _b.list, listSingle = _b.listSingle, listItems = _b.listItems;
        return Object.assign(document.createElement('div'), {
            className: "".concat(getClassNames(list).join(' '), " ").concat(isSelectOneElement
                ? getClassNames(listSingle).join(' ')
                : getClassNames(listItems).join(' ')),
        });
    },
    placeholder: function (_a, value) {
        var allowHTML = _a.allowHTML, placeholder = _a.classNames.placeholder;
        return Object.assign(document.createElement('div'), {
            className: getClassNames(placeholder).join(' '),
            innerHTML: escapeForTemplate(allowHTML, value),
        });
    },
    item: function (_a, _b, removeItemButton) {
        var _c, _d, _e;
        var allowHTML = _a.allowHTML, removeItemButtonAlignLeft = _a.removeItemButtonAlignLeft, _f = _a.classNames, item = _f.item, button = _f.button, highlightedState = _f.highlightedState, itemSelectable = _f.itemSelectable, placeholder = _f.placeholder;
        var id = _b.id, value = _b.value, label = _b.label, labelClass = _b.labelClass, labelDescription = _b.labelDescription, customProperties = _b.customProperties, active = _b.active, disabled = _b.disabled, highlighted = _b.highlighted, isPlaceholder = _b.placeholder;
        var div = Object.assign(document.createElement('div'), {
            className: getClassNames(item).join(' '),
        });
        if (labelClass) {
            var spanLabel = Object.assign(document.createElement('span'), {
                innerHTML: escapeForTemplate(allowHTML, label),
                className: getClassNames(labelClass).join(' '),
            });
            div.appendChild(spanLabel);
        }
        else {
            div.innerHTML = escapeForTemplate(allowHTML, label);
        }
        Object.assign(div.dataset, {
            item: '',
            id: id,
            value: value,
        });
        if (labelClass) {
            div.dataset.labelClass = getClassNames(labelClass).join(' ');
        }
        if (labelDescription) {
            div.dataset.labelDescription = labelDescription;
        }
        assignCustomProperties(div, customProperties);
        if (active) {
            div.setAttribute('aria-selected', 'true');
        }
        if (disabled) {
            div.setAttribute('aria-disabled', 'true');
        }
        if (isPlaceholder) {
            (_c = div.classList).add.apply(_c, getClassNames(placeholder));
            div.dataset.placeholder = '';
        }
        (_d = div.classList).add.apply(_d, (highlighted
            ? getClassNames(highlightedState)
            : getClassNames(itemSelectable)));
        if (removeItemButton) {
            if (disabled) {
                (_e = div.classList).remove.apply(_e, getClassNames(itemSelectable));
            }
            div.dataset.deletable = '';
            var REMOVE_ITEM_ICON = typeof this.config.removeItemIconText === 'function'
                ? this.config.removeItemIconText(sanitise(value), value)
                : this.config.removeItemIconText;
            var REMOVE_ITEM_LABEL = typeof this.config.removeItemLabelText === 'function'
                ? this.config.removeItemLabelText(sanitise(value), value)
                : this.config.removeItemLabelText;
            var removeButton = Object.assign(document.createElement('button'), {
                type: 'button',
                className: getClassNames(button).join(' '),
                innerHTML: REMOVE_ITEM_ICON,
            });
            if (REMOVE_ITEM_LABEL) {
                removeButton.setAttribute('aria-label', REMOVE_ITEM_LABEL);
            }
            removeButton.dataset.button = '';
            if (removeItemButtonAlignLeft) {
                div.insertAdjacentElement('afterbegin', removeButton);
            }
            else {
                div.appendChild(removeButton);
            }
        }
        return div;
    },
    choiceList: function (_a, isSelectOneElement) {
        var list = _a.classNames.list;
        var div = Object.assign(document.createElement('div'), {
            className: getClassNames(list).join(' '),
        });
        if (!isSelectOneElement) {
            div.setAttribute('aria-multiselectable', 'true');
        }
        div.setAttribute('role', 'listbox');
        return div;
    },
    choiceGroup: function (_a, _b) {
        var allowHTML = _a.allowHTML, _c = _a.classNames, group = _c.group, groupHeading = _c.groupHeading, itemDisabled = _c.itemDisabled;
        var id = _b.id, label = _b.label, disabled = _b.disabled;
        var div = Object.assign(document.createElement('div'), {
            className: "".concat(getClassNames(group).join(' '), " ").concat(disabled ? getClassNames(itemDisabled).join(' ') : ''),
        });
        div.setAttribute('role', 'group');
        Object.assign(div.dataset, {
            group: '',
            id: id,
            value: label,
        });
        if (disabled) {
            div.setAttribute('aria-disabled', 'true');
        }
        div.appendChild(Object.assign(document.createElement('div'), {
            className: getClassNames(groupHeading).join(' '),
            innerHTML: escapeForTemplate(allowHTML, label),
        }));
        return div;
    },
    choice: function (_a, _b, selectText) {
        var _c, _d, _e, _f, _g;
        var allowHTML = _a.allowHTML, _h = _a.classNames, item = _h.item, itemChoice = _h.itemChoice, itemSelectable = _h.itemSelectable, selectedState = _h.selectedState, itemDisabled = _h.itemDisabled, description = _h.description, placeholder = _h.placeholder;
        var id = _b.id, value = _b.value, label = _b.label, groupId = _b.groupId, elementId = _b.elementId, labelClass = _b.labelClass, labelDescription = _b.labelDescription, isDisabled = _b.disabled, isSelected = _b.selected, isPlaceholder = _b.placeholder;
        var div = Object.assign(document.createElement('div'), {
            id: elementId,
            className: "".concat(getClassNames(item).join(' '), " ").concat(getClassNames(itemChoice).join(' ')),
        });
        var describedBy = div;
        if (labelClass) {
            var spanLabel = Object.assign(document.createElement('span'), {
                innerHTML: escapeForTemplate(allowHTML, label),
                className: getClassNames(labelClass).join(' '),
            });
            describedBy = spanLabel;
            div.appendChild(spanLabel);
        }
        else {
            div.innerHTML = escapeForTemplate(allowHTML, label);
        }
        if (labelDescription) {
            var descId = "".concat(elementId, "-description");
            describedBy.setAttribute('aria-describedby', descId);
            var spanDesc = Object.assign(document.createElement('span'), {
                innerHTML: escapeForTemplate(allowHTML, labelDescription),
                id: descId,
            });
            (_c = spanDesc.classList).add.apply(_c, getClassNames(description));
            div.appendChild(spanDesc);
        }
        if (isSelected) {
            (_d = div.classList).add.apply(_d, getClassNames(selectedState));
        }
        if (isPlaceholder) {
            (_e = div.classList).add.apply(_e, getClassNames(placeholder));
        }
        div.setAttribute('role', groupId && groupId > 0 ? 'treeitem' : 'option');
        Object.assign(div.dataset, {
            choice: '',
            id: id,
            value: value,
            selectText: selectText,
        });
        if (labelClass) {
            div.dataset.labelClass = getClassNames(labelClass).join(' ');
        }
        if (labelDescription) {
            div.dataset.labelDescription = labelDescription;
        }
        if (isDisabled) {
            (_f = div.classList).add.apply(_f, getClassNames(itemDisabled));
            div.dataset.choiceDisabled = '';
            div.setAttribute('aria-disabled', 'true');
        }
        else {
            (_g = div.classList).add.apply(_g, getClassNames(itemSelectable));
            div.dataset.choiceSelectable = '';
        }
        return div;
    },
    input: function (_a, placeholderValue) {
        var _b = _a.classNames, input = _b.input, inputCloned = _b.inputCloned;
        var inp = Object.assign(document.createElement('input'), {
            type: 'search',
            className: "".concat(getClassNames(input).join(' '), " ").concat(getClassNames(inputCloned).join(' ')),
            autocomplete: 'off',
            autocapitalize: 'off',
            spellcheck: false,
        });
        inp.setAttribute('role', 'textbox');
        inp.setAttribute('aria-autocomplete', 'list');
        if (placeholderValue) {
            inp.setAttribute('aria-label', placeholderValue);
        }
        return inp;
    },
    dropdown: function (_a) {
        var _b, _c;
        var _d = _a.classNames, list = _d.list, listDropdown = _d.listDropdown;
        var div = document.createElement('div');
        (_b = div.classList).add.apply(_b, getClassNames(list));
        (_c = div.classList).add.apply(_c, getClassNames(listDropdown));
        div.setAttribute('aria-expanded', 'false');
        return div;
    },
    notice: function (_a, innerText, type) {
        var allowHTML = _a.allowHTML, _b = _a.classNames, item = _b.item, itemChoice = _b.itemChoice, addChoice = _b.addChoice, noResults = _b.noResults, noChoices = _b.noChoices;
        if (type === void 0) { type = ''; }
        var classes = __spreadArray(__spreadArray([], getClassNames(item), true), getClassNames(itemChoice), true);
        // eslint-disable-next-line default-case
        switch (type) {
            case 'add-choice':
                classes.push.apply(classes, getClassNames(addChoice));
                break;
            case 'no-results':
                classes.push.apply(classes, getClassNames(noResults));
                break;
            case 'no-choices':
                classes.push.apply(classes, getClassNames(noChoices));
                break;
        }
        var notice = Object.assign(document.createElement('div'), {
            innerHTML: escapeForTemplate(allowHTML, innerText),
            className: classes.join(' '),
        });
        if (type === 'add-choice') {
            notice.dataset.choiceSelectable = '';
            notice.dataset.choice = '';
        }
        return notice;
    },
    option: function (_a) {
        var label = _a.label, value = _a.value, labelClass = _a.labelClass, labelDescription = _a.labelDescription, customProperties = _a.customProperties, active = _a.active, disabled = _a.disabled;
        // HtmlOptionElement's label value does not support HTML, so the avoid double escaping unwrap the untrusted string.
        var labelValue = unwrapStringForRaw(label);
        var opt = new Option(labelValue, value, false, active);
        if (labelClass) {
            opt.dataset.labelClass = getClassNames(labelClass).join(' ');
        }
        if (labelDescription) {
            opt.dataset.labelDescription = labelDescription;
        }
        assignCustomProperties(opt, customProperties);
        opt.disabled = disabled;
        return opt;
    },
};

/** @see {@link http://browserhacks.com/#hack-acea075d0ac6954f275a70023906050c} */
var IS_IE11 = '-ms-scroll-limit' in document.documentElement.style &&
    '-ms-ime-align' in document.documentElement.style;
var USER_DEFAULTS = {};
var parseDataSetId = function (element) {
    if (!element) {
        return undefined;
    }
    var id = element.dataset.id;
    return id ? parseInt(id, 10) : undefined;
};
/**
 * Choices
 * @author Josh Johnson<josh@joshuajohnson.co.uk>
 */
var Choices = /** @class */ (function () {
    function Choices(element, userConfig) {
        if (element === void 0) { element = '[data-choice]'; }
        if (userConfig === void 0) { userConfig = {}; }
        var _this = this;
        this._hasNonChoicePlaceholder = false;
        this._lastAddedChoiceId = 0;
        this._lastAddedGroupId = 0;
        this.config = __assign(__assign(__assign({}, Choices.defaults.allOptions), Choices.defaults.options), userConfig);
        ObjectsInConfig.forEach(function (key) {
            _this.config[key] = __assign(__assign(__assign({}, Choices.defaults.allOptions[key]), Choices.defaults.options[key]), userConfig[key]);
        });
        if (!this.config.silent) {
            this._validateConfig();
        }
        var documentElement = this.config.shadowRoot || document.documentElement;
        var passedElement = typeof element === 'string'
            ? documentElement.querySelector(element)
            : element;
        if (!passedElement ||
            typeof passedElement !== 'object' ||
            !(isHtmlInputElement(passedElement) || isHtmlSelectElement(passedElement))) {
            if (!passedElement && typeof element === 'string') {
                throw TypeError("Selector ".concat(element, " failed to find an element"));
            }
            throw TypeError("Expected one of the following types text|select-one|select-multiple");
        }
        this._elementType = passedElement.type;
        this._isTextElement = this._elementType === TEXT_TYPE;
        if (this._isTextElement || this.config.maxItemCount !== 1) {
            this.config.singleModeForMultiSelect = false;
        }
        if (this.config.singleModeForMultiSelect) {
            this._elementType = SELECT_MULTIPLE_TYPE;
        }
        this._isSelectOneElement = this._elementType === SELECT_ONE_TYPE;
        this._isSelectMultipleElement = this._elementType === SELECT_MULTIPLE_TYPE;
        this._isSelectElement =
            this._isSelectOneElement || this._isSelectMultipleElement;
        this._canAddUserChoices =
            (this._isTextElement && this.config.addItems) ||
                (this._isSelectElement && this.config.addChoices);
        if (!['auto', 'always'].includes("".concat(this.config.renderSelectedChoices))) {
            this.config.renderSelectedChoices = 'auto';
        }
        if (this.config.placeholder) {
            if (this.config.placeholderValue) {
                this._hasNonChoicePlaceholder = true;
            }
            else if (passedElement.dataset.placeholder) {
                this._hasNonChoicePlaceholder = true;
                this.config.placeholderValue = passedElement.dataset.placeholder;
            }
        }
        if (userConfig.addItemFilter &&
            typeof userConfig.addItemFilter !== 'function') {
            var re = userConfig.addItemFilter instanceof RegExp
                ? userConfig.addItemFilter
                : new RegExp(userConfig.addItemFilter);
            this.config.addItemFilter = re.test.bind(re);
        }
        if (this._isTextElement) {
            this.passedElement = new WrappedInput({
                element: passedElement,
                classNames: this.config.classNames,
            });
        }
        else {
            var selectEl = passedElement;
            this.passedElement = new WrappedSelect({
                element: selectEl,
                classNames: this.config.classNames,
                template: function (data) {
                    return _this._templates.option(data);
                },
                extractPlaceholder: this.config.placeholder && !this._hasNonChoicePlaceholder,
            });
        }
        this.initialised = false;
        this._store = new Store();
        this._initialState = defaultState;
        this._currentState = defaultState;
        this._prevState = defaultState;
        this._currentValue = '';
        this.config.searchEnabled =
            (!this._isTextElement && this.config.searchEnabled) ||
                this._elementType === SELECT_MULTIPLE_TYPE;
        this._canSearch = this.config.searchEnabled;
        this._isScrollingOnIe = false;
        this._highlightPosition = 0;
        this._wasTap = true;
        this._placeholderValue = this._generatePlaceholderValue();
        this._baseId = generateId(this.passedElement.element, 'choices-');
        this._searchFn = search$1;
        /**
         * setting direction in cases where it's explicitly set on passedElement
         * or when calculated direction is different from the document
         */
        this._direction = this.passedElement.dir;
        if (!this._direction) {
            var elementDirection = window.getComputedStyle(this.passedElement.element).direction;
            var documentDirection = window.getComputedStyle(document.documentElement).direction;
            if (elementDirection !== documentDirection) {
                this._direction = elementDirection;
            }
        }
        this._idNames = {
            itemChoice: 'item-choice',
        };
        this._render = this._render.bind(this);
        this._onFocus = this._onFocus.bind(this);
        this._onBlur = this._onBlur.bind(this);
        this._onKeyUp = this._onKeyUp.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onInput = this._onInput.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._onMouseDown = this._onMouseDown.bind(this);
        this._onMouseOver = this._onMouseOver.bind(this);
        this._onFormReset = this._onFormReset.bind(this);
        this._onSelectKey = this._onSelectKey.bind(this);
        this._onEnterKey = this._onEnterKey.bind(this);
        this._onEscapeKey = this._onEscapeKey.bind(this);
        this._onDirectionKey = this._onDirectionKey.bind(this);
        this._onDeleteKey = this._onDeleteKey.bind(this);
        // If element has already been initialised with Choices, fail silently
        if (this.passedElement.isActive) {
            if (!this.config.silent) {
                console.warn('Trying to initialise Choices on element already initialised', { element: element });
            }
            this.initialised = true;
            return;
        }
        // Let's go
        this.init();
        // preserve the selected item list after setup for form reset
        this._initialItems = this._store.items.map(function (choice) { return choice.value; });
    }
    Object.defineProperty(Choices, "defaults", {
        get: function () {
            return Object.preventExtensions({
                get options() {
                    return USER_DEFAULTS;
                },
                get allOptions() {
                    return DEFAULT_CONFIG;
                },
                get templates() {
                    return templates;
                },
            });
        },
        enumerable: false,
        configurable: true
    });
    Choices.prototype.init = function () {
        if (this.initialised) {
            return;
        }
        this._loadChoices();
        this._createTemplates();
        this._createElements();
        this._createStructure();
        this._store.subscribe(this._render);
        this._render();
        this._addEventListeners();
        var shouldDisable = (this._isTextElement && !this.config.addItems) ||
            (this._isSelectElement &&
                !this.config.addChoices &&
                this._store.choices.length === 0) ||
            this.passedElement.element.hasAttribute('disabled') ||
            !!this.passedElement.element.closest('fieldset:disabled');
        if (shouldDisable) {
            this.disable();
        }
        this.initialised = true;
        var callbackOnInit = this.config.callbackOnInit;
        // Run callback if it is a function
        if (callbackOnInit && typeof callbackOnInit === 'function') {
            callbackOnInit.call(this);
        }
    };
    Choices.prototype.destroy = function () {
        if (!this.initialised) {
            return;
        }
        this._removeEventListeners();
        this.passedElement.reveal();
        this.containerOuter.unwrap(this.passedElement.element);
        this.clearStore();
        this._stopSearch();
        this._templates = templates;
        this.initialised = false;
    };
    Choices.prototype.enable = function () {
        if (this.passedElement.isDisabled) {
            this.passedElement.enable();
        }
        if (this.containerOuter.isDisabled) {
            this._addEventListeners();
            this.input.enable();
            this.containerOuter.enable();
        }
        return this;
    };
    Choices.prototype.disable = function () {
        if (!this.passedElement.isDisabled) {
            this.passedElement.disable();
        }
        if (!this.containerOuter.isDisabled) {
            this._removeEventListeners();
            this.input.disable();
            this.containerOuter.disable();
        }
        return this;
    };
    Choices.prototype.highlightItem = function (item, runEvent) {
        if (runEvent === void 0) { runEvent = true; }
        if (!item || !item.id) {
            return this;
        }
        var choice = this._store.choices.find(function (c) { return c.id === item.id; });
        if (!choice || choice.highlighted) {
            return this;
        }
        this._store.dispatch(highlightItem(choice, true));
        if (runEvent) {
            this.passedElement.triggerEvent("highlightItem" /* EventType.highlightItem */, this._getChoiceForOutput(choice));
        }
        return this;
    };
    Choices.prototype.unhighlightItem = function (item, runEvent) {
        if (runEvent === void 0) { runEvent = true; }
        if (!item || !item.id) {
            return this;
        }
        var choice = this._store.choices.find(function (c) { return c.id === item.id; });
        if (!choice || !choice.highlighted) {
            return this;
        }
        this._store.dispatch(highlightItem(choice, false));
        if (runEvent) {
            this.passedElement.triggerEvent("highlightItem" /* EventType.highlightItem */, this._getChoiceForOutput(choice));
        }
        return this;
    };
    Choices.prototype.highlightAll = function () {
        var _this = this;
        this._store.withDeferRendering(function () {
            _this._store.items.forEach(function (item) { return _this.highlightItem(item); });
        });
        return this;
    };
    Choices.prototype.unhighlightAll = function () {
        var _this = this;
        this._store.withDeferRendering(function () {
            _this._store.items.forEach(function (item) { return _this.unhighlightItem(item); });
        });
        return this;
    };
    Choices.prototype.removeActiveItemsByValue = function (value) {
        var _this = this;
        this._store.withDeferRendering(function () {
            _this._store.items
                .filter(function (item) { return item.value === value; })
                .forEach(function (item) { return _this._removeItem(item); });
        });
        return this;
    };
    Choices.prototype.removeActiveItems = function (excludedId) {
        var _this = this;
        this._store.withDeferRendering(function () {
            _this._store.items
                .filter(function (_a) {
                var id = _a.id;
                return id !== excludedId;
            })
                .forEach(function (item) { return _this._removeItem(item); });
        });
        return this;
    };
    Choices.prototype.removeHighlightedItems = function (runEvent) {
        var _this = this;
        if (runEvent === void 0) { runEvent = false; }
        this._store.withDeferRendering(function () {
            _this._store.highlightedActiveItems.forEach(function (item) {
                _this._removeItem(item);
                // If this action was performed by the user
                // trigger the event
                if (runEvent) {
                    _this._triggerChange(item.value);
                }
            });
        });
        return this;
    };
    Choices.prototype.showDropdown = function (preventInputFocus) {
        var _this = this;
        if (this.dropdown.isActive) {
            return this;
        }
        requestAnimationFrame(function () {
            _this.dropdown.show();
            _this.containerOuter.open(_this.dropdown.distanceFromTopWindow);
            if (!preventInputFocus && _this._canSearch) {
                _this.input.focus();
            }
            _this.passedElement.triggerEvent("showDropdown" /* EventType.showDropdown */, {});
        });
        return this;
    };
    Choices.prototype.hideDropdown = function (preventInputBlur) {
        var _this = this;
        if (!this.dropdown.isActive) {
            return this;
        }
        requestAnimationFrame(function () {
            _this.dropdown.hide();
            _this.containerOuter.close();
            if (!preventInputBlur && _this._canSearch) {
                _this.input.removeActiveDescendant();
                _this.input.blur();
            }
            _this.passedElement.triggerEvent("hideDropdown" /* EventType.hideDropdown */, {});
        });
        return this;
    };
    Choices.prototype.getValue = function (valueOnly) {
        var _this = this;
        if (valueOnly === void 0) { valueOnly = false; }
        var values = this._store.items.reduce(function (selectedItems, item) {
            var itemValue = valueOnly ? item.value : _this._getChoiceForOutput(item);
            selectedItems.push(itemValue);
            return selectedItems;
        }, []);
        return this._isSelectOneElement || this.config.singleModeForMultiSelect
            ? values[0]
            : values;
    };
    Choices.prototype.setValue = function (items) {
        var _this = this;
        if (!this.initialised) {
            return this;
        }
        this._store.withDeferRendering(function () {
            items.forEach(function (value) {
                if (value) {
                    _this._addChoice(mapInputToChoice(value, false));
                }
            });
        });
        return this;
    };
    Choices.prototype.setChoiceByValue = function (value) {
        var _this = this;
        if (!this.initialised || this._isTextElement) {
            return this;
        }
        this._store.withDeferRendering(function () {
            // If only one value has been passed, convert to array
            var choiceValue = Array.isArray(value) ? value : [value];
            // Loop through each value and
            choiceValue.forEach(function (val) { return _this._findAndSelectChoiceByValue(val); });
        });
        return this;
    };
    /**
     * Set choices of select input via an array of objects (or function that returns array of object or promise of it),
     * a value field name and a label field name.
     * This behaves the same as passing items via the choices option but can be called after initialising Choices.
     * This can also be used to add groups of choices (see example 2); Optionally pass a true `replaceChoices` value to remove any existing choices.
     * Optionally pass a `customProperties` object to add additional data to your choices (useful when searching/filtering etc).
     *
     * **Input types affected:** select-one, select-multiple
     *
     * @example
     * ```js
     * const example = new Choices(element);
     *
     * example.setChoices([
     *   {value: 'One', label: 'Label One', disabled: true},
     *   {value: 'Two', label: 'Label Two', selected: true},
     *   {value: 'Three', label: 'Label Three'},
     * ], 'value', 'label', false);
     * ```
     *
     * @example
     * ```js
     * const example = new Choices(element);
     *
     * example.setChoices(async () => {
     *   try {
     *      const items = await fetch('/items');
     *      return items.json()
     *   } catch(err) {
     *      console.error(err)
     *   }
     * });
     * ```
     *
     * @example
     * ```js
     * const example = new Choices(element);
     *
     * example.setChoices([{
     *   label: 'Group one',
     *   id: 1,
     *   disabled: false,
     *   choices: [
     *     {value: 'Child One', label: 'Child One', selected: true},
     *     {value: 'Child Two', label: 'Child Two',  disabled: true},
     *     {value: 'Child Three', label: 'Child Three'},
     *   ]
     * },
     * {
     *   label: 'Group two',
     *   id: 2,
     *   disabled: false,
     *   choices: [
     *     {value: 'Child Four', label: 'Child Four', disabled: true},
     *     {value: 'Child Five', label: 'Child Five'},
     *     {value: 'Child Six', label: 'Child Six', customProperties: {
     *       description: 'Custom description about child six',
     *       random: 'Another random custom property'
     *     }},
     *   ]
     * }], 'value', 'label', false);
     * ```
     */
    Choices.prototype.setChoices = function (choicesArrayOrFetcher, value, label, replaceChoices) {
        var _this = this;
        if (choicesArrayOrFetcher === void 0) { choicesArrayOrFetcher = []; }
        if (value === void 0) { value = 'value'; }
        if (label === void 0) { label = 'label'; }
        if (replaceChoices === void 0) { replaceChoices = false; }
        if (!this.initialised) {
            throw new ReferenceError("setChoices was called on a non-initialized instance of Choices");
        }
        if (!this._isSelectElement) {
            throw new TypeError("setChoices can't be used with INPUT based Choices");
        }
        if (typeof value !== 'string' || !value) {
            throw new TypeError("value parameter must be a name of 'value' field in passed objects");
        }
        // Clear choices if needed
        if (replaceChoices) {
            this.clearChoices();
        }
        if (typeof choicesArrayOrFetcher === 'function') {
            // it's a choices fetcher function
            var fetcher_1 = choicesArrayOrFetcher(this);
            if (typeof Promise === 'function' && fetcher_1 instanceof Promise) {
                // that's a promise
                // eslint-disable-next-line no-promise-executor-return
                return new Promise(function (resolve) { return requestAnimationFrame(resolve); })
                    .then(function () { return _this._handleLoadingState(true); })
                    .then(function () { return fetcher_1; })
                    .then(function (data) {
                    return _this.setChoices(data, value, label, replaceChoices);
                })
                    .catch(function (err) {
                    if (!_this.config.silent) {
                        console.error(err);
                    }
                })
                    .then(function () { return _this._handleLoadingState(false); })
                    .then(function () { return _this; });
            }
            // function returned something else than promise, let's check if it's an array of choices
            if (!Array.isArray(fetcher_1)) {
                throw new TypeError(".setChoices first argument function must return either array of choices or Promise, got: ".concat(typeof fetcher_1));
            }
            // recursion with results, it's sync and choices were cleared already
            return this.setChoices(fetcher_1, value, label, false);
        }
        if (!Array.isArray(choicesArrayOrFetcher)) {
            throw new TypeError(".setChoices must be called either with array of choices with a function resulting into Promise of array of choices");
        }
        this.containerOuter.removeLoadingState();
        this._store.withDeferRendering(function () {
            var isDefaultValue = value === 'value';
            var isDefaultLabel = label === 'label';
            choicesArrayOrFetcher.forEach(function (groupOrChoice) {
                if ('choices' in groupOrChoice) {
                    var group = groupOrChoice;
                    if (!isDefaultLabel) {
                        group = __assign(__assign({}, group), { label: group[label] });
                    }
                    _this._addGroup(mapInputToChoice(group, true));
                }
                else {
                    var choice = groupOrChoice;
                    if (!isDefaultLabel || !isDefaultValue) {
                        choice = __assign(__assign({}, choice), { value: choice[value], label: choice[label] });
                    }
                    _this._addChoice(mapInputToChoice(choice, false));
                }
            });
        });
        return this;
    };
    Choices.prototype.refresh = function (withEvents, selectFirstOption, deselectAll) {
        var _this = this;
        if (withEvents === void 0) { withEvents = false; }
        if (selectFirstOption === void 0) { selectFirstOption = false; }
        if (deselectAll === void 0) { deselectAll = false; }
        if (!this._isSelectElement) {
            if (!this.config.silent) {
                console.warn('refresh method can only be used on choices backed by a <select> element');
            }
            return this;
        }
        this._store.withDeferRendering(function () {
            var choicesFromOptions = _this.passedElement.optionsAsChoices();
            var items = _this._store.items;
            // Build the list of items which require preserving
            var existingItems = {};
            if (!deselectAll) {
                items.forEach(function (choice) {
                    if (choice.id &&
                        choice.active &&
                        choice.selected &&
                        !choice.disabled) {
                        existingItems[choice.value] = true;
                    }
                });
            }
            choicesFromOptions.forEach(function (groupOrChoice) {
                if ('choices' in groupOrChoice) {
                    return;
                }
                var choice = groupOrChoice;
                if (deselectAll) {
                    choice.selected = false;
                }
                else if (existingItems[choice.value]) {
                    choice.selected = true;
                }
            });
            _this.clearStore();
            /* @todo only generate add events for the added options instead of all
            if (withEvents) {
              items.forEach((choice) => {
                if (existingItems[choice.value]) {
                  this.passedElement.triggerEvent(
                    EventType.removeItem,
                    this._getChoiceForEvent(choice),
                  );
                }
              });
            }
            */
            // load new choices & items
            _this._addPredefinedChoices(choicesFromOptions, selectFirstOption, withEvents);
            // re-do search if required
            if (_this._isSearching) {
                _this._searchChoices(_this.input.value);
            }
        });
        return this;
    };
    Choices.prototype.removeChoice = function (value) {
        var choice = this._store.choices.find(function (c) { return c.value === value; });
        if (!choice) {
            return this;
        }
        this._store.dispatch(removeChoice(choice));
        if (choice.selected) {
            this.passedElement.triggerEvent("removeItem" /* EventType.removeItem */, this._getChoiceForOutput(choice));
        }
        return this;
    };
    Choices.prototype.clearChoices = function () {
        this._store.dispatch(clearChoices());
        return this;
    };
    Choices.prototype.clearStore = function () {
        this._store.dispatch(clearAll());
        this._lastAddedChoiceId = 0;
        this._lastAddedGroupId = 0;
        return this;
    };
    Choices.prototype.clearInput = function () {
        var shouldSetInputWidth = !this._isSelectOneElement;
        this.input.clear(shouldSetInputWidth);
        if (this._isSearching) {
            this._stopSearch();
        }
        return this;
    };
    Choices.prototype._validateConfig = function () {
        var invalidConfigOptions = diff(this.config, DEFAULT_CONFIG);
        if (invalidConfigOptions.length) {
            console.warn('Unknown config option(s) passed', invalidConfigOptions.join(', '));
        }
        if (this.config.allowHTML && this.config.allowHtmlUserInput) {
            if (this.config.addItems) {
                console.warn('Warning: allowHTML/allowHtmlUserInput/addItems all being true is strongly not recommended and may lead to XSS attacks');
            }
            if (this.config.addChoices) {
                console.warn('Warning: allowHTML/allowHtmlUserInput/addChoices all being true is strongly not recommended and may lead to XSS attacks');
            }
        }
    };
    Choices.prototype._render = function () {
        if (this._store.isLoading()) {
            return;
        }
        this._currentState = this._store.state;
        var shouldRenderItems = this._currentState.items !== this._prevState.items;
        var stateChanged = this._currentState.choices !== this._prevState.choices ||
            this._currentState.groups !== this._prevState.groups ||
            shouldRenderItems;
        if (!stateChanged) {
            return;
        }
        if (this._isSelectElement) {
            this._renderChoices();
        }
        if (shouldRenderItems) {
            this._renderItems();
        }
        this._prevState = this._currentState;
    };
    Choices.prototype._renderChoices = function () {
        var _this = this;
        var _a = this._store, activeGroups = _a.activeGroups, activeChoices = _a.activeChoices;
        var choiceListFragment = document.createDocumentFragment();
        this.choiceList.clear();
        if (this.config.resetScrollPosition) {
            requestAnimationFrame(function () { return _this.choiceList.scrollToTop(); });
        }
        // If we have grouped options
        if (activeGroups.length >= 1 && !this._isSearching) {
            // If we have a placeholder choice along with groups
            var activePlaceholders = activeChoices.filter(function (activeChoice) {
                return activeChoice.placeholder && activeChoice.groupId === -1;
            });
            if (activePlaceholders.length >= 1) {
                choiceListFragment = this._createChoicesFragment(activePlaceholders, choiceListFragment);
            }
            choiceListFragment = this._createGroupsFragment(activeGroups, activeChoices, choiceListFragment);
        }
        else if (activeChoices.length >= 1) {
            choiceListFragment = this._createChoicesFragment(activeChoices, choiceListFragment);
        }
        var value = this.input.value;
        var canAdd = this._canAddItem(this._store.items, value);
        if (choiceListFragment.childNodes &&
            choiceListFragment.childNodes.length > 0) {
            var showNotice = !canAdd.response;
            // ...and we can select them
            if (canAdd.response) {
                // ...append them and highlight the first choice
                this.choiceList.append(choiceListFragment);
                this._highlightChoice();
                // for exact matches, do not prompt to add it as a custom choice
                if (this._canAddUserChoices && value && canAdd.notice) {
                    showNotice = !activeChoices.find(function (choice) {
                        return _this.config.valueComparer(choice.value, value);
                    });
                }
            }
            // when adding items, provide feedback while also displaying choices
            if (showNotice) {
                var notice = this._templates.notice(this.config, canAdd.notice, this._canAddUserChoices ? 'add-choice' : '');
                this.choiceList.prepend(notice);
            }
        }
        else {
            // Otherwise show a notice
            var dropdownItem = void 0;
            if (canAdd.response && this._canAddUserChoices && value) {
                dropdownItem = this._templates.notice(this.config, canAdd.notice, 'add-choice');
            }
            else if (this._isSearching) {
                var notice = typeof this.config.noResultsText === 'function'
                    ? this.config.noResultsText()
                    : this.config.noResultsText;
                dropdownItem = this._templates.notice(this.config, notice, 'no-results');
            }
            else {
                var notice = typeof this.config.noChoicesText === 'function'
                    ? this.config.noChoicesText()
                    : this.config.noChoicesText;
                dropdownItem = this._templates.notice(this.config, notice, 'no-choices');
            }
            this.choiceList.append(dropdownItem);
        }
    };
    Choices.prototype._renderItems = function () {
        var items = this._store.items || [];
        this.itemList.clear();
        // Create a fragment to store our list items
        // (so we don't have to update the DOM for each item)
        var itemListFragment = this._createItemsFragment(items);
        // If we have items to add, append them
        if (itemListFragment.childNodes) {
            this.itemList.append(itemListFragment);
        }
    };
    Choices.prototype._createGroupsFragment = function (groups, choices, fragment) {
        var _this = this;
        if (fragment === void 0) { fragment = document.createDocumentFragment(); }
        var getGroupChoices = function (group) {
            return choices.filter(function (choice) {
                if (_this._isSelectOneElement) {
                    return choice.groupId === group.id;
                }
                return (choice.groupId === group.id &&
                    (_this.config.renderSelectedChoices === 'always' || !choice.selected));
            });
        };
        // If sorting is enabled, filter groups
        if (this.config.shouldSort) {
            groups.sort(this.config.sorter);
        }
        // Add Choices without group first, regardless of sort, otherwise they won't be distinguishable
        // from the last group
        var choicesWithoutGroup = choices.filter(function (c) { return c.groupId === 0; });
        if (choicesWithoutGroup.length > 0) {
            this._createChoicesFragment(choicesWithoutGroup, fragment, false);
        }
        groups.forEach(function (group) {
            var groupChoices = getGroupChoices(group);
            if (groupChoices.length >= 1) {
                var dropdownGroup = _this._templates.choiceGroup(_this.config, group);
                fragment.appendChild(dropdownGroup);
                _this._createChoicesFragment(groupChoices, fragment, true);
            }
        });
        return fragment;
    };
    Choices.prototype._createChoicesFragment = function (choices, fragment, withinGroup) {
        var _this = this;
        if (fragment === void 0) { fragment = document.createDocumentFragment(); }
        if (withinGroup === void 0) { withinGroup = false; }
        // Create a fragment to store our list items (so we don't have to update the DOM for each item)
        var _a = this.config, renderSelectedChoices = _a.renderSelectedChoices, searchResultLimit = _a.searchResultLimit, renderChoiceLimit = _a.renderChoiceLimit, appendGroupInSearch = _a.appendGroupInSearch;
        var filter = this._isSearching ? sortByScore : this.config.sorter;
        var appendChoice = function (choice) {
            var shouldRender = renderSelectedChoices === 'auto'
                ? _this._isSelectOneElement || !choice.selected
                : true;
            if (shouldRender) {
                var dropdownItem = _this._templates.choice(_this.config, choice, _this.config.itemSelectText);
                if (appendGroupInSearch) {
                    var groupName_1 = '';
                    _this._store.groups.every(function (group) {
                        if (group.id === choice.groupId) {
                            groupName_1 = group.label;
                            return false;
                        }
                        return true;
                    });
                    if (groupName_1 && _this._isSearching) {
                        dropdownItem.innerHTML += " (".concat(groupName_1, ")");
                    }
                }
                fragment.appendChild(dropdownItem);
            }
        };
        var rendererableChoices = choices;
        if (renderSelectedChoices === 'auto' && !this._isSelectOneElement) {
            rendererableChoices = choices.filter(function (choice) { return !choice.selected; });
        }
        if (this._isSelectElement) {
            var backingOptions = choices.filter(function (choice) { return !choice.element; });
            if (backingOptions.length !== 0) {
                this.passedElement.addOptions(backingOptions);
            }
        }
        // Split array into placeholders and "normal" choices
        var _b = rendererableChoices.reduce(function (acc, choice) {
            if (choice.placeholder) {
                acc.placeholderChoices.push(choice);
            }
            else {
                acc.normalChoices.push(choice);
            }
            return acc;
        }, {
            placeholderChoices: [],
            normalChoices: [],
        }), placeholderChoices = _b.placeholderChoices, normalChoices = _b.normalChoices;
        // If sorting is enabled or the user is searching, filter choices
        if (this.config.shouldSort || this._isSearching) {
            normalChoices.sort(filter);
        }
        var choiceLimit = rendererableChoices.length;
        // Prepend placeholeder
        var sortedChoices = this._isSelectOneElement
            ? __spreadArray(__spreadArray([], placeholderChoices, true), normalChoices, true) : normalChoices;
        if (this._isSearching) {
            choiceLimit = searchResultLimit;
        }
        else if (renderChoiceLimit && renderChoiceLimit > 0 && !withinGroup) {
            choiceLimit = renderChoiceLimit;
        }
        // Add each choice to dropdown within range
        for (var i = 0; i < choiceLimit; i += 1) {
            if (sortedChoices[i]) {
                appendChoice(sortedChoices[i]);
            }
        }
        return fragment;
    };
    Choices.prototype._createItemsFragment = function (items, fragment) {
        var _this = this;
        if (fragment === void 0) { fragment = document.createDocumentFragment(); }
        // Create fragment to add elements to
        var _a = this.config, shouldSortItems = _a.shouldSortItems, sorter = _a.sorter, removeItemButton = _a.removeItemButton;
        // If sorting is enabled, filter items
        if (shouldSortItems && !this._isSelectOneElement) {
            items.sort(sorter);
        }
        if (this._isTextElement) {
            // Update the value of the hidden input
            this.passedElement.value = items
                .map(function (_a) {
                var value = _a.value;
                return value;
            })
                .join(this.config.delimiter);
        }
        var addItemToFragment = function (item) {
            // Create new list element
            var listItem = _this._templates.item(_this.config, item, removeItemButton);
            // Append it to list
            fragment.appendChild(listItem);
        };
        // Add each list item to list
        items.forEach(addItemToFragment);
        if (this._isSelectOneElement &&
            this._hasNonChoicePlaceholder &&
            items.length === 0) {
            addItemToFragment(mapInputToChoice({
                selected: true,
                value: '',
                label: this.config.placeholderValue || '',
                active: true,
                placeholder: true,
            }, false));
        }
        return fragment;
    };
    Choices.prototype._getChoiceForOutput = function (choice, keyCode) {
        if (!choice) {
            return undefined;
        }
        var group = choice.groupId > 0 ? this._store.getGroupById(choice.groupId) : null;
        return {
            id: choice.id,
            highlighted: choice.highlighted,
            labelClass: choice.labelClass,
            labelDescription: choice.labelDescription,
            customProperties: choice.customProperties,
            disabled: choice.disabled,
            active: choice.active,
            label: choice.label,
            placeholder: choice.placeholder,
            value: choice.value,
            groupValue: group && group.label ? group.label : undefined,
            element: choice.element,
            keyCode: keyCode,
        };
    };
    Choices.prototype._triggerChange = function (value) {
        if (value === undefined || value === null) {
            return;
        }
        this.passedElement.triggerEvent("change" /* EventType.change */, {
            value: value,
        });
    };
    Choices.prototype._selectPlaceholderChoice = function (placeholderChoice) {
        this._addItem(placeholderChoice);
        if (placeholderChoice.value) {
            this._triggerChange(placeholderChoice.value);
        }
    };
    Choices.prototype._handleButtonAction = function (items, element) {
        if (items.length === 0 ||
            !this.config.removeItems ||
            !this.config.removeItemButton) {
            return;
        }
        var id = element && parseDataSetId(element.parentNode);
        var itemToRemove = id && items.find(function (item) { return item.id === id; });
        if (!itemToRemove) {
            return;
        }
        // Remove item associated with button
        this._removeItem(itemToRemove);
        this._triggerChange(itemToRemove.value);
        if (this._isSelectOneElement && !this._hasNonChoicePlaceholder) {
            var placeholderChoice = this._store.placeholderChoice;
            if (placeholderChoice) {
                this._selectPlaceholderChoice(placeholderChoice);
            }
        }
    };
    Choices.prototype._handleItemAction = function (items, element, hasShiftKey) {
        var _this = this;
        if (hasShiftKey === void 0) { hasShiftKey = false; }
        if (items.length === 0 ||
            !this.config.removeItems ||
            this._isSelectOneElement) {
            return;
        }
        var id = parseDataSetId(element);
        if (!id) {
            return;
        }
        // We only want to select one item with a click
        // so we deselect any items that aren't the target
        // unless shift is being pressed
        items.forEach(function (item) {
            if (item.id === id && !item.highlighted) {
                _this.highlightItem(item);
            }
            else if (!hasShiftKey && item.highlighted) {
                _this.unhighlightItem(item);
            }
        });
        // Focus input as without focus, a user cannot do anything with a
        // highlighted item
        this.input.focus();
    };
    Choices.prototype._handleChoiceAction = function (items, element, keyCode) {
        var _this = this;
        // If we are clicking on an option
        var id = parseDataSetId(element);
        var choice = id && this._store.getChoiceById(id);
        if (!choice) {
            return false;
        }
        var hasActiveDropdown = this.dropdown.isActive;
        var addedItem = false;
        this._store.withDeferRendering(function () {
            if (!choice.selected && !choice.disabled) {
                var canAddItem = _this._canAddItem(items, choice.value);
                if (canAddItem.response) {
                    if (_this.config.singleModeForMultiSelect) {
                        if (items.length !== 0) {
                            var lastItem = items[items.length - 1];
                            _this._removeItem(lastItem);
                        }
                    }
                    _this.passedElement.triggerEvent("choice" /* EventType.choice */, _this._getChoiceForOutput(choice, keyCode));
                    _this._addItem(choice);
                    _this.clearInput();
                    addedItem = true;
                }
            }
        });
        if (!addedItem) {
            return false;
        }
        this._triggerChange(choice.value);
        // We want to close the dropdown if we are dealing with a single select box
        if (hasActiveDropdown &&
            (this.config.singleModeForMultiSelect || this._isSelectOneElement)) {
            this.hideDropdown(true);
            this.containerOuter.focus();
        }
        return true;
    };
    Choices.prototype._handleBackspace = function (items) {
        if (!this.config.removeItems || items.length === 0) {
            return;
        }
        var lastItem = items[items.length - 1];
        var hasHighlightedItems = items.some(function (item) { return item.highlighted; });
        // If editing the last item is allowed and there are not other selected items,
        // we can edit the item value. Otherwise if we can remove items, remove all selected items
        if (this.config.editItems && !hasHighlightedItems && lastItem) {
            this.input.value = lastItem.value;
            this.input.setWidth();
            this._removeItem(lastItem);
            this._triggerChange(lastItem.value);
        }
        else {
            if (!hasHighlightedItems) {
                // Highlight last item if none already highlighted
                this.highlightItem(lastItem, false);
            }
            this.removeHighlightedItems(true);
        }
    };
    Choices.prototype._loadChoices = function () {
        var _a;
        if (this._isTextElement) {
            // Assign preset items from passed object first
            this._presetItems = this.config.items.map(function (e) {
                return mapInputToChoice(e, false);
            });
            // Add any values passed from attribute
            var value = this.passedElement.value;
            if (value) {
                var elementItems = value
                    .split(this.config.delimiter)
                    .map(function (e) { return mapInputToChoice(e, false); });
                this._presetItems = this._presetItems.concat(elementItems);
            }
            this._presetItems.forEach(function (obj) {
                // eslint-disable-next-line no-param-reassign
                obj.selected = true;
            });
        }
        else if (this._isSelectElement) {
            // Assign preset choices from passed object
            this._presetChoices = this.config.choices.map(function (e) {
                return mapInputToChoice(e, true);
            });
            // Create array of choices from option elements
            var choicesFromOptions = this.passedElement.optionsAsChoices();
            if (choicesFromOptions) {
                (_a = this._presetChoices).push.apply(_a, choicesFromOptions);
            }
        }
    };
    // noinspection JSUnusedGlobalSymbols
    Choices.prototype._startLoading = function () {
        this._store.startDeferRendering();
    };
    // noinspection JSUnusedGlobalSymbols
    Choices.prototype._stopLoading = function () {
        this._store.stopDeferRendering();
    };
    Choices.prototype._handleLoadingState = function (setLoading) {
        if (setLoading === void 0) { setLoading = true; }
        var placeholderItem = this.itemList.element.querySelector(getClassNamesSelector(this.config.classNames.placeholder));
        if (setLoading) {
            this.disable();
            this.containerOuter.addLoadingState();
            if (this._isSelectOneElement) {
                if (!placeholderItem) {
                    placeholderItem = this._templates.placeholder(this.config, this.config.loadingText);
                    if (placeholderItem) {
                        this.itemList.append(placeholderItem);
                    }
                }
                else {
                    placeholderItem.innerHTML = this.config.loadingText;
                }
            }
            else {
                this.input.placeholder = this.config.loadingText;
            }
        }
        else {
            this.enable();
            this.containerOuter.removeLoadingState();
            if (this._isSelectOneElement) {
                if (placeholderItem) {
                    placeholderItem.innerHTML = this._placeholderValue || '';
                }
            }
            else {
                this.input.placeholder = this._placeholderValue || '';
            }
        }
    };
    Choices.prototype._handleSearch = function (value) {
        if (!this.input.isFocussed) {
            return;
        }
        var choices = this._store.choices;
        var _a = this.config, searchFloor = _a.searchFloor, searchChoices = _a.searchChoices;
        var hasUnactiveChoices = choices.some(function (option) { return !option.active; });
        // Check that we have a value to search and the input was an alphanumeric character
        if (value !== null &&
            typeof value !== 'undefined' &&
            value.length >= searchFloor) {
            var resultCount = searchChoices ? this._searchChoices(value) : 0;
            if (resultCount !== null) {
                // Trigger search event
                this.passedElement.triggerEvent("search" /* EventType.search */, {
                    value: value,
                    resultCount: resultCount,
                });
            }
        }
        else if (hasUnactiveChoices) {
            this._stopSearch();
        }
    };
    Choices.prototype._canAddItem = function (items, value) {
        var _this = this;
        var canAddItem = true;
        var notice = '';
        if (this.config.maxItemCount > 0 &&
            this.config.maxItemCount <= items.length) {
            // If there is a max entry limit and we have reached that limit
            // don't update
            if (!this.config.singleModeForMultiSelect) {
                canAddItem = false;
                notice =
                    typeof this.config.maxItemText === 'function'
                        ? this.config.maxItemText(this.config.maxItemCount)
                        : this.config.maxItemText;
            }
        }
        if (canAddItem &&
            this._canAddUserChoices &&
            value !== '' &&
            typeof this.config.addItemFilter === 'function' &&
            !this.config.addItemFilter(value)) {
            canAddItem = false;
            notice =
                typeof this.config.customAddItemText === 'function'
                    ? this.config.customAddItemText(sanitise(value), value)
                    : this.config.customAddItemText;
        }
        if (canAddItem &&
            value !== '' &&
            (this._isSelectElement || !this.config.duplicateItemsAllowed)) {
            var foundChoice = this._store.items.find(function (choice) {
                return _this.config.valueComparer(choice.value, value);
            });
            if (foundChoice) {
                canAddItem = false;
                notice =
                    typeof this.config.uniqueItemText === 'function'
                        ? this.config.uniqueItemText(sanitise(value), value)
                        : this.config.uniqueItemText;
            }
        }
        if (canAddItem) {
            notice =
                typeof this.config.addItemText === 'function'
                    ? this.config.addItemText(sanitise(value), value)
                    : this.config.addItemText;
        }
        return {
            response: canAddItem,
            notice: {
                trusted: notice,
            },
        };
    };
    Choices.prototype._searchChoices = function (value) {
        var newValue = value.trim().replace(/\s{2,}/, ' ');
        // signal input didn't change search
        if (newValue.length === 0 || newValue === this._currentValue) {
            return null;
        }
        // If new value matches the desired length and is not the same as the current value with a space
        var haystack = this._store.searchableChoices;
        var results = this._searchFn(this.config, haystack, newValue);
        this._currentValue = newValue;
        this._highlightPosition = 0;
        this._isSearching = true;
        this._store.dispatch(filterChoices(results));
        return results.length;
    };
    Choices.prototype._stopSearch = function () {
        var wasSearching = this._isSearching;
        this._currentValue = '';
        this._isSearching = false;
        if (wasSearching) {
            this._store.dispatch(activateChoices(true));
        }
    };
    Choices.prototype._addEventListeners = function () {
        var documentElement = this.config.shadowRoot || document.documentElement;
        // capture events - can cancel event processing or propagation
        documentElement.addEventListener('touchend', this._onTouchEnd, true);
        this.containerOuter.element.addEventListener('keydown', this._onKeyDown, true);
        this.containerOuter.element.addEventListener('mousedown', this._onMouseDown, true);
        // passive events - doesn't call `preventDefault` or `stopPropagation`
        documentElement.addEventListener('click', this._onClick, { passive: true });
        documentElement.addEventListener('touchmove', this._onTouchMove, {
            passive: true,
        });
        this.dropdown.element.addEventListener('mouseover', this._onMouseOver, {
            passive: true,
        });
        if (this._isSelectOneElement) {
            this.containerOuter.element.addEventListener('focus', this._onFocus, {
                passive: true,
            });
            this.containerOuter.element.addEventListener('blur', this._onBlur, {
                passive: true,
            });
        }
        this.input.element.addEventListener('keyup', this._onKeyUp, {
            passive: true,
        });
        this.input.element.addEventListener('input', this._onInput, {
            passive: true,
        });
        this.input.element.addEventListener('focus', this._onFocus, {
            passive: true,
        });
        this.input.element.addEventListener('blur', this._onBlur, {
            passive: true,
        });
        if (this.input.element.form) {
            this.input.element.form.addEventListener('reset', this._onFormReset, {
                passive: true,
            });
        }
        this.input.addEventListeners();
    };
    Choices.prototype._removeEventListeners = function () {
        var documentElement = this.config.shadowRoot || document.documentElement;
        documentElement.removeEventListener('touchend', this._onTouchEnd, true);
        this.containerOuter.element.removeEventListener('keydown', this._onKeyDown, true);
        this.containerOuter.element.removeEventListener('mousedown', this._onMouseDown, true);
        documentElement.removeEventListener('click', this._onClick);
        documentElement.removeEventListener('touchmove', this._onTouchMove);
        this.dropdown.element.removeEventListener('mouseover', this._onMouseOver);
        if (this._isSelectOneElement) {
            this.containerOuter.element.removeEventListener('focus', this._onFocus);
            this.containerOuter.element.removeEventListener('blur', this._onBlur);
        }
        this.input.element.removeEventListener('keyup', this._onKeyUp);
        this.input.element.removeEventListener('input', this._onInput);
        this.input.element.removeEventListener('focus', this._onFocus);
        this.input.element.removeEventListener('blur', this._onBlur);
        if (this.input.element.form) {
            this.input.element.form.removeEventListener('reset', this._onFormReset);
        }
        this.input.removeEventListeners();
    };
    Choices.prototype._onKeyDown = function (event) {
        var keyCode = event.keyCode;
        var items = this._store.items;
        var hasFocusedInput = this.input.isFocussed;
        var hasActiveDropdown = this.dropdown.isActive;
        var hasItems = this.itemList.hasChildren();
        /*
        See:
        https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key
        https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
        https://en.wikipedia.org/wiki/UTF-16#Code_points_from_U+010000_to_U+10FFFF - UTF-16 surrogate pairs
        https://stackoverflow.com/a/70866532 - "Unidentified" for mobile
        http://www.unicode.org/versions/Unicode5.2.0/ch16.pdf#G19635 - U+FFFF is reserved (Section 16.7)
    
        Logic: when a key event is sent, `event.key` represents its printable value _or_ one
        of a large list of special values indicating meta keys/functionality. In addition,
        key events for compose functionality contain a value of `Dead` when mid-composition.
    
        I can't quite verify it, but non-English IMEs may also be able to generate key codes
        for code points in the surrogate-pair range, which could potentially be seen as having
        key.length > 1. Since `Fn` is one of the special keys, we can't distinguish by that
        alone.
    
        Here, key.length === 1 means we know for sure the input was printable and not a special
        `key` value. When the length is greater than 1, it could be either a printable surrogate
        pair or a special `key` value. We can tell the difference by checking if the _character
        code_ value (not code point!) is in the "surrogate pair" range or not.
    
        We don't use .codePointAt because an invalid code point would return 65535, which wouldn't
        pass the >= 0x10000 check we would otherwise use.
    
        > ...The Unicode Standard sets aside 66 noncharacter code points. The last two code points
        > of each plane are noncharacters: U+FFFE and U+FFFF on the BMP...
        */
        var wasPrintableChar = event.key.length === 1 ||
            (event.key.length === 2 && event.key.charCodeAt(0) >= 0xd800) ||
            event.key === 'Unidentified';
        if (!this._isTextElement && !hasActiveDropdown) {
            this.showDropdown();
            if (!this.input.isFocussed && wasPrintableChar) {
                /*
                  We update the input value with the pressed key as
                  the input was not focussed at the time of key press
                  therefore does not have the value of the key.
                */
                this.input.value += event.key;
            }
        }
        switch (keyCode) {
            case 65 /* KeyCodeMap.A_KEY */:
                return this._onSelectKey(event, hasItems);
            case 13 /* KeyCodeMap.ENTER_KEY */:
                return this._onEnterKey(event, items, hasActiveDropdown);
            case 27 /* KeyCodeMap.ESC_KEY */:
                return this._onEscapeKey(event, hasActiveDropdown);
            case 38 /* KeyCodeMap.UP_KEY */:
            case 33 /* KeyCodeMap.PAGE_UP_KEY */:
            case 40 /* KeyCodeMap.DOWN_KEY */:
            case 34 /* KeyCodeMap.PAGE_DOWN_KEY */:
                return this._onDirectionKey(event, hasActiveDropdown);
            case 8 /* KeyCodeMap.DELETE_KEY */:
            case 46 /* KeyCodeMap.BACK_KEY */:
                return this._onDeleteKey(event, items, hasFocusedInput);
        }
    };
    Choices.prototype._onKeyUp = function ( /* event: KeyboardEvent */) {
        this._canSearch = this.config.searchEnabled;
    };
    Choices.prototype._onInput = function ( /* event: InputEvent */) {
        var value = this.input.value;
        if (!value) {
            if (this._isTextElement) {
                this.hideDropdown(true);
            }
            else {
                this._stopSearch();
            }
            return;
        }
        if (this._isTextElement) {
            var canAddItem_1 = this._canAddItem(this._store.items, value);
            if (canAddItem_1.notice) {
                this._displayAddItemNotice(canAddItem_1);
                this.showDropdown(true);
            }
        }
        if (!this._canSearch) {
            return;
        }
        // do the search even if the entered text can not be added
        this._handleSearch(value);
        // determine if a notice needs to be displayed for why a search result can't be added
        var canAddItem = this._canAddItem(this._store.items, value);
        if (!canAddItem.response) {
            this._displayAddItemNotice(canAddItem);
        }
        if (this._canAddUserChoices) {
            // select the non-value so 'enter' doesn't select anything
            this._highlightPosition = 0;
            this._highlightChoice();
        }
    };
    Choices.prototype._displayAddItemNotice = function (canAddItem) {
        var dropdownItem = this._templates.notice(this.config, canAddItem.notice, 'add-choice');
        // only show the notice once!
        var selector = "".concat(getClassNamesSelector(this.config.classNames.addChoice), "[data-choice-selectable]");
        var noticeElement = this.choiceList.element.querySelector(selector);
        if (noticeElement) {
            noticeElement.outerHTML = dropdownItem.outerHTML;
        }
        else {
            this.choiceList.prepend(dropdownItem);
        }
    };
    Choices.prototype._onSelectKey = function (event, hasItems) {
        var ctrlKey = event.ctrlKey, metaKey = event.metaKey;
        var hasCtrlDownKeyPressed = ctrlKey || metaKey;
        // If CTRL + A or CMD + A have been pressed and there are items to select
        if (hasCtrlDownKeyPressed && hasItems) {
            this._canSearch = false;
            var shouldHightlightAll = this.config.removeItems &&
                !this.input.value &&
                this.input.element === document.activeElement;
            if (shouldHightlightAll) {
                this.highlightAll();
            }
        }
    };
    Choices.prototype._onEnterKey = function (event, items, hasActiveDropdown) {
        var _this = this;
        var value = this.input.value;
        var target = event.target;
        var targetWasRemoveButton = target && target.hasAttribute('data-button');
        var addedItem = false;
        if (targetWasRemoveButton) {
            event.preventDefault();
            this._handleButtonAction(items, target);
            return;
        }
        if (!hasActiveDropdown && this._isSelectOneElement) {
            event.preventDefault();
            this.showDropdown();
            return;
        }
        // add the highlighted item
        if (hasActiveDropdown) {
            var highlightedChoice = this.dropdown.element.querySelector(getClassNamesSelector(this.config.classNames.highlightedState));
            if (highlightedChoice) {
                addedItem = this._handleChoiceAction(items, highlightedChoice, 13 /* KeyCodeMap.ENTER_KEY */);
                if (addedItem) {
                    event.preventDefault();
                    this.unhighlightAll();
                    return;
                }
            }
            if (!value) {
                this.hideDropdown(true);
            }
        }
        if (!target || !value || !this._canAddUserChoices) {
            return;
        }
        var canAdd = this._canAddItem(items, value);
        if (!canAdd.response) {
            return;
        }
        this._store.withDeferRendering(function () {
            if (_this._isSelectOneElement || _this.config.singleModeForMultiSelect) {
                if (items.length !== 0) {
                    var lastItem = items[items.length - 1];
                    _this._removeItem(lastItem);
                }
            }
            var choiceNotFound = true;
            if (_this._isSelectElement || !_this.config.duplicateItemsAllowed) {
                choiceNotFound = !_this._findAndSelectChoiceByValue(value);
            }
            if (choiceNotFound) {
                var sanitisedValue = sanitise(value);
                var userValue = _this.config.allowHtmlUserInput || sanitisedValue === value
                    ? value
                    : { escaped: sanitisedValue, raw: value };
                _this._addChoice(mapInputToChoice({
                    value: userValue,
                    label: userValue,
                    selected: true,
                }, false));
            }
            _this.clearInput();
            _this.unhighlightAll();
            _this._triggerChange(value);
        });
        if (this._isTextElement || this._isSelectOneElement) {
            this.hideDropdown(true);
        }
    };
    Choices.prototype._onEscapeKey = function (event, hasActiveDropdown) {
        if (hasActiveDropdown) {
            event.stopPropagation();
            this.hideDropdown(true);
            this.containerOuter.focus();
        }
    };
    Choices.prototype._onDirectionKey = function (event, hasActiveDropdown) {
        var keyCode = event.keyCode, metaKey = event.metaKey;
        // If up or down key is pressed, traverse through options
        if (hasActiveDropdown || this._isSelectOneElement) {
            this.showDropdown();
            this._canSearch = false;
            var directionInt = keyCode === 40 /* KeyCodeMap.DOWN_KEY */ || keyCode === 34 /* KeyCodeMap.PAGE_DOWN_KEY */
                ? 1
                : -1;
            var skipKey = metaKey ||
                keyCode === 34 /* KeyCodeMap.PAGE_DOWN_KEY */ ||
                keyCode === 33 /* KeyCodeMap.PAGE_UP_KEY */;
            var selectableChoiceIdentifier = '[data-choice-selectable]';
            var nextEl = void 0;
            if (skipKey) {
                if (directionInt > 0) {
                    nextEl = this.dropdown.element.querySelector("".concat(selectableChoiceIdentifier, ":last-of-type"));
                }
                else {
                    nextEl = this.dropdown.element.querySelector(selectableChoiceIdentifier);
                }
            }
            else {
                var currentEl = this.dropdown.element.querySelector(getClassNamesSelector(this.config.classNames.highlightedState));
                if (currentEl) {
                    nextEl = getAdjacentEl(currentEl, selectableChoiceIdentifier, directionInt);
                }
                else {
                    nextEl = this.dropdown.element.querySelector(selectableChoiceIdentifier);
                }
            }
            if (nextEl) {
                // We prevent default to stop the cursor moving
                // when pressing the arrow
                if (!isScrolledIntoView(nextEl, this.choiceList.element, directionInt)) {
                    this.choiceList.scrollToChildElement(nextEl, directionInt);
                }
                this._highlightChoice(nextEl);
            }
            // Prevent default to maintain cursor position whilst
            // traversing dropdown options
            event.preventDefault();
        }
    };
    Choices.prototype._onDeleteKey = function (event, items, hasFocusedInput) {
        var target = event.target;
        // If backspace or delete key is pressed and the input has no value
        if (!this._isSelectOneElement &&
            !target.value &&
            hasFocusedInput) {
            this._handleBackspace(items);
            event.preventDefault();
        }
    };
    Choices.prototype._onTouchMove = function () {
        if (this._wasTap) {
            this._wasTap = false;
        }
    };
    Choices.prototype._onTouchEnd = function (event) {
        var target = (event || event.touches[0]).target;
        var touchWasWithinContainer = this._wasTap && this.containerOuter.element.contains(target);
        if (touchWasWithinContainer) {
            var containerWasExactTarget = target === this.containerOuter.element ||
                target === this.containerInner.element;
            if (containerWasExactTarget) {
                if (this._isTextElement) {
                    this.input.focus();
                }
                else if (this._isSelectMultipleElement) {
                    this.showDropdown();
                }
            }
            // Prevents focus event firing
            event.stopPropagation();
        }
        this._wasTap = true;
    };
    /**
     * Handles mousedown event in capture mode for containetOuter.element
     */
    Choices.prototype._onMouseDown = function (event) {
        var target = event.target;
        if (!(target instanceof HTMLElement)) {
            return;
        }
        // If we have our mouse down on the scrollbar and are on IE11...
        if (IS_IE11 && this.choiceList.element.contains(target)) {
            // check if click was on a scrollbar area
            var firstChoice = this.choiceList.element
                .firstElementChild;
            this._isScrollingOnIe =
                this._direction === 'ltr'
                    ? event.offsetX >= firstChoice.offsetWidth
                    : event.offsetX < firstChoice.offsetLeft;
        }
        if (target === this.input.element) {
            return;
        }
        var item = target.closest('[data-button],[data-item],[data-choice]');
        if (item instanceof HTMLElement) {
            var hasShiftKey = event.shiftKey;
            var items = this._store.items;
            var dataset = item.dataset;
            if ('button' in dataset) {
                this._handleButtonAction(items, item);
            }
            else if ('item' in dataset) {
                this._handleItemAction(items, item, hasShiftKey);
            }
            else if ('choice' in dataset) {
                this._handleChoiceAction(items, item);
            }
        }
        event.preventDefault();
    };
    /**
     * Handles mouseover event over this.dropdown
     * @param {MouseEvent} event
     */
    Choices.prototype._onMouseOver = function (_a) {
        var target = _a.target;
        if (target instanceof HTMLElement && 'choice' in target.dataset) {
            this._highlightChoice(target);
        }
    };
    Choices.prototype._onClick = function (_a) {
        var target = _a.target;
        var clickWasWithinContainer = this.containerOuter.element.contains(target);
        if (clickWasWithinContainer) {
            if (!this.dropdown.isActive && !this.containerOuter.isDisabled) {
                if (this._isTextElement) {
                    if (document.activeElement !== this.input.element) {
                        this.input.focus();
                    }
                }
                else {
                    this.showDropdown();
                    this.containerOuter.focus();
                }
            }
            else if (this._isSelectOneElement &&
                target !== this.input.element &&
                !this.dropdown.element.contains(target)) {
                this.hideDropdown();
            }
        }
        else {
            var hasHighlightedItems = this._store.highlightedActiveItems.length > 0;
            if (hasHighlightedItems) {
                this.unhighlightAll();
            }
            this.containerOuter.removeFocusState();
            this.hideDropdown(true);
        }
    };
    Choices.prototype._onFocus = function (_a) {
        var _b;
        var _this = this;
        var target = _a.target;
        var focusWasWithinContainer = target && this.containerOuter.element.contains(target);
        if (!focusWasWithinContainer) {
            return;
        }
        var focusActions = (_b = {},
            _b[TEXT_TYPE] = function () {
                if (target === _this.input.element) {
                    _this.containerOuter.addFocusState();
                }
            },
            _b[SELECT_ONE_TYPE] = function () {
                _this.containerOuter.addFocusState();
                if (target === _this.input.element) {
                    _this.showDropdown(true);
                }
            },
            _b[SELECT_MULTIPLE_TYPE] = function () {
                if (target === _this.input.element) {
                    _this.showDropdown(true);
                    // If element is a select box, the focused element is the container and the dropdown
                    // isn't already open, focus and show dropdown
                    _this.containerOuter.addFocusState();
                }
            },
            _b);
        focusActions[this._elementType]();
    };
    Choices.prototype._onBlur = function (_a) {
        var _b;
        var _this = this;
        var target = _a.target;
        var blurWasWithinContainer = target && this.containerOuter.element.contains(target);
        if (blurWasWithinContainer && !this._isScrollingOnIe) {
            var activeChoices = this._store.activeChoices;
            var hasHighlightedItems_1 = activeChoices.some(function (item) { return item.highlighted; });
            var blurActions = (_b = {},
                _b[TEXT_TYPE] = function () {
                    if (target === _this.input.element) {
                        _this.containerOuter.removeFocusState();
                        if (hasHighlightedItems_1) {
                            _this.unhighlightAll();
                        }
                        _this.hideDropdown(true);
                    }
                },
                _b[SELECT_ONE_TYPE] = function () {
                    _this.containerOuter.removeFocusState();
                    if (target === _this.input.element ||
                        (target === _this.containerOuter.element && !_this._canSearch)) {
                        _this.hideDropdown(true);
                    }
                },
                _b[SELECT_MULTIPLE_TYPE] = function () {
                    if (target === _this.input.element) {
                        _this.containerOuter.removeFocusState();
                        _this.hideDropdown(true);
                        if (hasHighlightedItems_1) {
                            _this.unhighlightAll();
                        }
                    }
                },
                _b);
            blurActions[this._elementType]();
        }
        else {
            // On IE11, clicking the scollbar blurs our input and thus
            // closes the dropdown. To stop this, we refocus our input
            // if we know we are on IE *and* are scrolling.
            this._isScrollingOnIe = false;
            this.input.element.focus();
        }
    };
    Choices.prototype._onFormReset = function () {
        var _this = this;
        this._store.withDeferRendering(function () {
            _this.clearInput();
            _this.hideDropdown();
            _this.refresh(false, false, true);
            if (_this._initialItems.length !== 0) {
                _this.setChoiceByValue(_this._initialItems);
            }
        });
    };
    Choices.prototype._highlightChoice = function (el) {
        var _a;
        var _this = this;
        if (el === void 0) { el = null; }
        var choices = Array.from(this.dropdown.element.querySelectorAll('[data-choice-selectable]'));
        if (!choices.length) {
            return;
        }
        var passedEl = el;
        var highlightedChoices = Array.from(this.dropdown.element.querySelectorAll(getClassNamesSelector(this.config.classNames.highlightedState)));
        // Remove any highlighted choices
        highlightedChoices.forEach(function (choice) {
            var _a;
            (_a = choice.classList).remove.apply(_a, getClassNames(_this.config.classNames.highlightedState));
            choice.setAttribute('aria-selected', 'false');
        });
        if (passedEl) {
            this._highlightPosition = choices.indexOf(passedEl);
        }
        else {
            // Highlight choice based on last known highlight location
            if (choices.length > this._highlightPosition) {
                // If we have an option to highlight
                passedEl = choices[this._highlightPosition];
            }
            else {
                // Otherwise highlight the option before
                passedEl = choices[choices.length - 1];
            }
            if (!passedEl) {
                passedEl = choices[0];
            }
        }
        (_a = passedEl.classList).add.apply(_a, getClassNames(this.config.classNames.highlightedState));
        passedEl.setAttribute('aria-selected', 'true');
        this.passedElement.triggerEvent("highlightChoice" /* EventType.highlightChoice */, {
            el: passedEl,
        });
        if (this.dropdown.isActive) {
            // IE11 ignores aria-label and blocks virtual keyboard
            // if aria-activedescendant is set without a dropdown
            this.input.setActiveDescendant(passedEl.id);
            this.containerOuter.setActiveDescendant(passedEl.id);
        }
    };
    Choices.prototype._addItem = function (item, withEvents) {
        if (withEvents === void 0) { withEvents = true; }
        var id = item.id;
        if (id === 0) {
            throw new TypeError('item.id must be set before _addItem is called for a choice/item');
        }
        this._store.dispatch(addItem(item));
        if (this._isSelectOneElement) {
            this.removeActiveItems(id);
        }
        if (withEvents) {
            this.passedElement.triggerEvent("addItem" /* EventType.addItem */, this._getChoiceForOutput(item));
        }
    };
    Choices.prototype._removeItem = function (item) {
        var id = item.id;
        if (!id) {
            return;
        }
        this._store.dispatch(removeItem(item));
        this.passedElement.triggerEvent("removeItem" /* EventType.removeItem */, this._getChoiceForOutput(item));
    };
    Choices.prototype._addChoice = function (choice, withEvents) {
        if (withEvents === void 0) { withEvents = true; }
        if (choice.id !== 0) {
            throw new TypeError('Can not re-add a choice which has already been added');
        }
        // Generate unique id, in-place update is required so chaining _addItem works as expected
        var item = choice;
        this._lastAddedChoiceId++;
        item.id = this._lastAddedChoiceId;
        item.elementId = "".concat(this._baseId, "-").concat(this._idNames.itemChoice, "-").concat(item.id);
        if (this.config.prependValue) {
            item.value = this.config.prependValue + item.value;
        }
        if (this.config.appendValue) {
            item.value += this.config.appendValue.toString();
        }
        if ((this.config.prependValue || this.config.appendValue) && item.element) {
            item.element.value = item.value;
        }
        this._store.dispatch(addChoice(choice));
        if (choice.selected) {
            this._addItem(choice, withEvents);
        }
    };
    Choices.prototype._addGroup = function (group, withEvents) {
        var _this = this;
        if (withEvents === void 0) { withEvents = true; }
        if (group.id !== 0) {
            throw new TypeError('Can not re-add a group which has already been added');
        }
        this._store.dispatch(addGroup(group));
        if (!group.choices) {
            return;
        }
        // add unique id for the group(s), and do not store the full list of choices in this group
        var g = group;
        this._lastAddedGroupId++;
        g.id = this._lastAddedGroupId;
        var id = group.id, choices = group.choices;
        g.choices = [];
        choices.forEach(function (choice) {
            var item = choice;
            item.groupId = id;
            if (group.disabled) {
                item.disabled = true;
            }
            _this._addChoice(item, withEvents);
        });
    };
    /**
     * @deprecated call this._templates.{template}(this.config, ...) instead
     * @param template
     * @param args
     */
    Choices.prototype._getTemplate = function (template) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return (_a = this._templates[template]).call.apply(_a, __spreadArray([this, this.config], args, false));
    };
    Choices.prototype._createTemplates = function () {
        var _this = this;
        var callbackOnCreateTemplates = this.config.callbackOnCreateTemplates;
        var userTemplates = {};
        if (callbackOnCreateTemplates &&
            typeof callbackOnCreateTemplates === 'function') {
            userTemplates = callbackOnCreateTemplates.call(this, strToEl, escapeForTemplate);
        }
        var templating = {};
        Object.keys(templates).forEach(function (name) {
            if (name in userTemplates) {
                templating[name] = userTemplates[name].bind(_this);
            }
            else {
                templating[name] = templates[name].bind(_this);
            }
        });
        this._templates = templating;
    };
    Choices.prototype._createElements = function () {
        this.containerOuter = new Container({
            element: this._templates.containerOuter(this.config, this._direction, this._isSelectElement, this._isSelectOneElement, this.config.searchEnabled, this._elementType, this.config.labelId),
            classNames: this.config.classNames,
            type: this._elementType,
            position: this.config.position,
        });
        this.containerInner = new Container({
            element: this._templates.containerInner(this.config),
            classNames: this.config.classNames,
            type: this._elementType,
            position: this.config.position,
        });
        this.input = new Input({
            element: this._templates.input(this.config, this._placeholderValue),
            classNames: this.config.classNames,
            type: this._elementType,
            preventPaste: !this.config.paste,
        });
        this.choiceList = new List({
            element: this._templates.choiceList(this.config, this._isSelectOneElement),
        });
        this.itemList = new List({
            element: this._templates.itemList(this.config, this._isSelectOneElement),
        });
        this.dropdown = new Dropdown({
            element: this._templates.dropdown(this.config),
            classNames: this.config.classNames,
            type: this._elementType,
        });
    };
    Choices.prototype._createStructure = function () {
        var _this = this;
        // Hide original element
        this.passedElement.conceal();
        // Wrap input in container preserving DOM ordering
        this.containerInner.wrap(this.passedElement.element);
        // Wrapper inner container with outer container
        this.containerOuter.wrap(this.containerInner.element);
        if (this._isSelectOneElement) {
            this.input.placeholder = this.config.searchPlaceholderValue || '';
        }
        else {
            if (this._placeholderValue) {
                this.input.placeholder = this._placeholderValue;
            }
            this.input.setWidth();
        }
        this.containerOuter.element.appendChild(this.containerInner.element);
        this.containerOuter.element.appendChild(this.dropdown.element);
        this.containerInner.element.appendChild(this.itemList.element);
        this.dropdown.element.appendChild(this.choiceList.element);
        if (!this._isSelectOneElement) {
            this.containerInner.element.appendChild(this.input.element);
        }
        else if (this.config.searchEnabled) {
            this.dropdown.element.insertBefore(this.input.element, this.dropdown.element.firstChild);
        }
        this._highlightPosition = 0;
        this._isSearching = false;
        this._store.withDeferRendering(function () {
            if (_this._isSelectElement) {
                _this._addPredefinedChoices(_this._presetChoices, _this._isSelectOneElement && !_this._hasNonChoicePlaceholder);
            }
            else if (_this._isTextElement) {
                _this._addPredefinedItems(_this._presetItems);
            }
        });
    };
    Choices.prototype._addPredefinedChoices = function (choices, selectFirstOption, withEvents) {
        var _this = this;
        if (selectFirstOption === void 0) { selectFirstOption = false; }
        if (withEvents === void 0) { withEvents = true; }
        // If sorting is enabled or the user is searching, filter choices
        if (this.config.shouldSort) {
            choices.sort(this.config.sorter);
        }
        if (selectFirstOption) {
            /**
             * If there is a selected choice already or the choice is not the first in
             * the array, add each choice normally.
             *
             * Otherwise we pre-select the first enabled choice in the array ("select-one" only)
             */
            var hasSelectedChoice = choices.findIndex(function (choice) { return !!choice.selected; }) === -1;
            if (hasSelectedChoice) {
                var i = choices.findIndex(function (choice) { return choice.disabled === undefined || !choice.disabled; });
                if (i !== -1) {
                    var choice = choices[i];
                    choice.selected = true;
                }
            }
        }
        choices.forEach(function (item) {
            if ('choices' in item) {
                if (_this._isSelectElement) {
                    _this._addGroup(item, withEvents);
                }
            }
            else {
                _this._addChoice(item, withEvents);
            }
        });
    };
    Choices.prototype._addPredefinedItems = function (items) {
        var _this = this;
        items.forEach(function (item) {
            _this._addChoice(item);
        });
    };
    Choices.prototype._findAndSelectChoiceByValue = function (value) {
        var _this = this;
        var choices = this._store.choices;
        // Check 'value' property exists and the choice isn't already selected
        var foundChoice = choices.find(function (choice) {
            return _this.config.valueComparer(choice.value, value);
        });
        if (foundChoice && !foundChoice.selected) {
            this._addItem(foundChoice);
            return true;
        }
        return false;
    };
    Choices.prototype._generatePlaceholderValue = function () {
        if (!this.config.placeholder) {
            return null;
        }
        if (this._hasNonChoicePlaceholder) {
            return this.config.placeholderValue;
        }
        if (this._isSelectElement) {
            var placeholderOption = this.passedElement.placeholderOption;
            return placeholderOption ? placeholderOption.text : null;
        }
        return null;
    };
    Choices.version = 'git';
    return Choices;
}());

module.exports = Choices;
