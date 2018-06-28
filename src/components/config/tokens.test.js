'use strict';

import Tokens from './tokens';

/* global describe, test, expect */

describe('Tokens config', () => {
  test('retrieves value at a simple path', () => {
    const tokens = new Tokens({
      times: [1, 2, 3, 4]
    });

    expect(tokens.get('times')).toEqual([1, 2, 3, 4]);
  });

  test('retrieves value at a nested path', () => {
    const tokens = new Tokens({
      tokens: {
        when: {
          past: [1, 2, 3]
        }
      }
    });

    expect(tokens.get('tokens.when')).toEqual({ past: [1, 2, 3] });
    expect(tokens.get('tokens.when.past')).toEqual([1, 2, 3]);
  });

  test('retrieves value at a pseudo-nested path', () => {
    const tokens = new Tokens({
      'tokens.when.past': [1, 2, 3]
    });

    expect(tokens.get('tokens.when.past')).toEqual([1, 2, 3]);
  });
});
