import { describe, expect, it } from 'vitest';

import { selectPluralCategory } from '../../src/locale/plural-rules';

describe('selectPluralCategory', () => {
  it.each([
    ['fr', 0, 'cardinal', 'one'],
    ['fr', 2, 'cardinal', 'other'],
    ['de', 1, 'cardinal', 'one'],
    ['en', 22, 'ordinal', 'two'],
    ['fr', 1, 'ordinal', 'one'],
  ] as const)('selects %s %s (%s) as %s', (code, count, type, expected) => {
    expect(selectPluralCategory(code, count, type)).toBe(expected);
  });

  it('gives the same answer when the rules come from the cache', () => {
    expect(selectPluralCategory('es', 1)).toBe('one');
    expect(selectPluralCategory('es', 1)).toBe('one');
  });
});
