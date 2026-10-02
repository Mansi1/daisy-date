import { describe, expect, it } from 'vitest';

import { Duration } from '../../../../src';
import type { DurationFields } from '../../../../src';

describe('Luxon duration/math', () => {
  it.each<[string, Duration, Duration, Required<DurationFields>]>([
    [
      'math.test.js:8: Duration#plus add straightforward durations',
      Duration.of({ hours: 4, minutes: 12, seconds: 2 }),
      Duration.of({ hours: 1, seconds: 6, milliseconds: 14 }),
      { hours: 5, minutes: 12, seconds: 8, milliseconds: 14 },
    ],
    [
      'math.test.js:30: Duration#plus noops empty druations',
      Duration.of({ hours: 4, minutes: 12, seconds: 2 }),
      Duration.of({}),
      { hours: 4, minutes: 12, seconds: 2, milliseconds: 0 },
    ],
    [
      'math.test.js:40: Duration#plus adds negatives',
      Duration.of({ hours: 4, minutes: -12, seconds: -2 }),
      Duration.of({ hours: -5, seconds: 6, milliseconds: 14 }),
      { hours: -1, minutes: -12, seconds: 4, milliseconds: 14 },
    ],
    [
      'math.test.js:51: Duration#plus adds single values',
      Duration.of({ hours: 4, minutes: 12, seconds: 2 }),
      Duration.ofMinutes(5),
      { hours: 4, minutes: 17, seconds: 2, milliseconds: 0 },
    ],
    [
      'math.test.js:60: Duration#plus adds number as milliseconds',
      Duration.of({ minutes: 11, seconds: 22 }),
      Duration.ofMilliseconds(333),
      { hours: 0, minutes: 11, seconds: 22, milliseconds: 333 },
    ],
    [
      'math.test.js:75: Duration#plus results in the superset of units',
      Duration.of({ hours: 1, minutes: 0 }),
      Duration.of({ seconds: 3, milliseconds: 0 }),
      { hours: 1, minutes: 0, seconds: 3, milliseconds: 0 },
    ],
  ])('%s', (_name, first, second, expected) => {
    expect(first.plus(second)).toEqual(expected);
  });

  it('math.test.js:75: Duration#plus results in the superset of units (plus zero)', () => {
    expect(Duration.of({ hours: 1, minutes: 0 }).plus(Duration.of({}))).toEqual({
      hours: 1,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
  });

  it('math.test.js:83: Duration#plus throws with invalid parameter', () => {
    expect(() => Duration.of({}).plus('123' as unknown as Duration)).toThrow(TypeError);
  });

  it.each<[string, Duration, Duration, Required<DurationFields>]>([
    [
      'math.test.js:90: Duration#minus subtracts durations',
      Duration.of({ hours: 4, minutes: 12, seconds: 2 }),
      Duration.of({ hours: 1, seconds: 6, milliseconds: 14 }),
      { hours: 3, minutes: 12, seconds: -4, milliseconds: -14 },
    ],
    [
      'math.test.js:112: Duration#minus subtracts single values',
      Duration.of({ hours: 4, minutes: 12, seconds: 2 }),
      Duration.ofMinutes(5),
      { hours: 4, minutes: 7, seconds: 2, milliseconds: 0 },
    ],
  ])('%s', (_name, first, second, expected) => {
    expect(first.minus(second)).toEqual(expected);
  });

  it('math.test.js:131: Duration#negate flips all the signs', () => {
    expect(Duration.of({ hours: 4, minutes: -12, seconds: 2 }).negated()).toEqual({
      hours: -4,
      minutes: 12,
      seconds: -2,
      milliseconds: 0,
    });
  });

  it("math.test.js:146: Duration#negate doesn't mutate", () => {
    const original = Duration.of({ hours: 8 });
    original.negated();
    expect(original.hours).toBe(8);
  });
});
