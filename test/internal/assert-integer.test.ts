import { describe, expect, it } from 'vitest';

import { DaisyRangeError } from '../../src';
import { assertInteger } from '../../src/internal/assert-integer';

describe('assertInteger', () => {
  it.each([0, -3, 2026, Number.MAX_SAFE_INTEGER])('accepts %s', (value) => {
    expect(() => {
      assertInteger(value, 'Year');
    }).not.toThrow();
  });

  it.each([
    [1.5, 'Year must be an integer, got 1.5'],
    [Number.NaN, 'Year must be an integer, got NaN'],
    [Number.POSITIVE_INFINITY, 'Year must be an integer, got Infinity'],
  ])('rejects %s', (value, message) => {
    expect(() => {
      assertInteger(value, 'Year');
    }).toThrow(new DaisyRangeError(message));
  });
});
