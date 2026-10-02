import { describe, expect, it } from 'vitest';

import { Duration, Period } from '../../../../src';
import type { DurationFields, PeriodFields } from '../../../../src';

describe('Luxon duration/units', () => {
  it.each<[string, Duration, Required<DurationFields>]>([
    [
      'units.test.js:7: Duration#shiftTo rolls milliseconds up hours and minutes',
      Duration.ofMilliseconds(5760000),
      { hours: 1, minutes: 36, seconds: 0, milliseconds: 0 },
    ],
    [
      'units.test.js:69: Duration#shiftTo accumulates when rolling up',
      Duration.of({ minutes: 59, seconds: 183 }),
      { hours: 1, minutes: 2, seconds: 3, milliseconds: 0 },
    ],
    [
      'units.test.js:166: Duration#shiftToAll shifts to all available units',
      Duration.ofMilliseconds(5760000),
      { hours: 1, minutes: 36, seconds: 0, milliseconds: 0 },
    ],
    [
      'units.test.js:222: Duration#normalize handles the full grid partially negative durations (hours row)',
      Duration.of({ hours: 96, minutes: 0, seconds: -10 }),
      { hours: 95, minutes: 59, seconds: 50, milliseconds: 0 },
    ],
    [
      'units.test.js:354: Duration#rescale normalizes, shifts to all units and remove units with a value of 0',
      Duration.ofMilliseconds(90000),
      { hours: 0, minutes: 1, seconds: 30, milliseconds: 0 },
    ],
    [
      'units.test.js:354: Duration#rescale normalizes, shifts to all units and remove units with a value of 0',
      Duration.of({ minutes: 70, milliseconds: 12100 }),
      { hours: 1, minutes: 10, seconds: 12, milliseconds: 100 },
    ],
  ])('%s: normalized()', (_name, duration, expected) => {
    expect(duration.normalized()).toEqual(expected);
  });

  it.each<[string, Duration, number]>([
    [
      'units.test.js:15: Duration#shiftTo boils hours down milliseconds',
      Duration.ofHours(1),
      3600000,
    ],
    ['units.test.js:392: Duration#valueOf value of zero duration', Duration.of({}), 0],
    [
      'units.test.js:397: Duration#valueOf returns as millisecond value (lower order units)',
      Duration.of({ hours: 1, minutes: 36, seconds: 0 }),
      5760000,
    ],
  ])('%s: toMillis()', (_name, duration, expected) => {
    expect(duration.toMillis()).toBe(expected);
  });
});

describe('Luxon duration/units (differs from Luxon on purpose)', () => {
  it.each<[string, Required<PeriodFields>]>([
    [
      'units.test.js:205: Duration#normalize rebalances negative units',
      { years: 2, months: 0, weeks: 0, days: -2 },
    ],
    [
      'units.test.js:210: Duration#normalize de-overflows',
      { years: 2, months: 0, weeks: 0, days: 5000 },
    ],
    [
      'units.test.js:217: Duration#normalize handles fully negative durations',
      { years: -2, months: 0, weeks: 0, days: -5000 },
    ],
    [
      'units.test.js:222: full grid row { months: 1, days: 32 }',
      { years: 0, months: 1, weeks: 0, days: 32 },
    ],
    [
      'units.test.js:222: full grid row { months: 1, days: 28 }',
      { years: 0, months: 1, weeks: 0, days: 28 },
    ],
    [
      'units.test.js:222: full grid row { months: 1, days: -32 }',
      { years: 0, months: 1, weeks: 0, days: -32 },
    ],
    [
      'units.test.js:222: full grid row { months: 1, days: -28 }',
      { years: 0, months: 1, weeks: 0, days: -28 },
    ],
    [
      'units.test.js:222: full grid row { months: -1, days: 32 }',
      { years: 0, months: -1, weeks: 0, days: 32 },
    ],
    [
      'units.test.js:222: full grid row { months: -1, days: 28 }',
      { years: 0, months: -1, weeks: 0, days: 28 },
    ],
    [
      'units.test.js:222: full grid row { months: -1, days: -32 }',
      { years: 0, months: -1, weeks: 0, days: -32 },
    ],
    [
      'units.test.js:222: full grid row { months: -1, days: -28 }',
      { years: 0, months: -1, weeks: 0, days: -28 },
    ],
    [
      'units.test.js:222: full grid row { months: 0, days: 32 }',
      { years: 0, months: 0, weeks: 0, days: 32 },
    ],
    [
      'units.test.js:222: full grid row { months: 0, days: 28 }',
      { years: 0, months: 0, weeks: 0, days: 28 },
    ],
    [
      'units.test.js:222: full grid row { months: 0, days: -32 }',
      { years: 0, months: 0, weeks: 0, days: -32 },
    ],
    [
      'units.test.js:222: full grid row { months: 0, days: -28 }',
      { years: 0, months: 0, weeks: 0, days: -28 },
    ],
    [
      'units.test.js:354: rescale row { months: 2, days: -30 }',
      { years: 0, months: 2, weeks: 0, days: -30 },
    ],
  ])(
    '%s: Period.normalized() keeps days as they are, because it only folds months into years (PROJECT.md §5.5)',
    (_name, fields) => {
      expect(Period.of(fields).normalized()).toEqual(fields);
    },
  );
});
