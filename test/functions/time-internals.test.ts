import { describe, expect, it } from 'vitest';

import type { TruncationUnit } from '../../src';
import { fieldsBelow } from '../../src/functions/time';

describe('fieldsBelow', () => {
  it.each<[TruncationUnit, object]>([
    ['day', { hour: 0, minute: 0, second: 0, millisecond: 0 }],
    ['hour', { minute: 0, second: 0, millisecond: 0 }],
    ['minute', { second: 0, millisecond: 0 }],
    ['second', { millisecond: 0 }],
  ])('resets the fields below %s', (unit, expected) => {
    expect(fieldsBelow(unit)).toEqual(expected);
  });

  it('reaches assertNever for a unit outside the union', () => {
    expect(() => fieldsBelow('week' as TruncationUnit)).toThrow(
      new Error('Unexpected value: "week"'),
    );
  });
});
