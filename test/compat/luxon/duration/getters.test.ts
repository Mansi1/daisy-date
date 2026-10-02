import { describe, expect, it } from 'vitest';

import { DaisyRangeError, Duration, Period } from '../../../../src';

const period = Period.of({ years: 1, months: 2, weeks: 8, days: 3 });
const duration = Duration.of({ hours: 4, minutes: 5, seconds: 6, milliseconds: 7 });

describe('Luxon duration/getters', () => {
  it.each<[string, number, number]>([
    ['getters.test.js:22: Duration#years returns the years', period.years, 1],
    ['getters.test.js:32: Duration#months returns the (1-indexed) months', period.months, 2],
    ['getters.test.js:37: Duration#days returns the days', period.days, 3],
    ['getters.test.js:42: Duration#hours returns the hours', duration.hours, 4],
    ['getters.test.js:65: Duration#minutes returns the minutes', duration.minutes, 5],
    ['getters.test.js:70: Duration#seconds returns the seconds', duration.seconds, 6],
    [
      'getters.test.js:75: Duration#milliseconds returns the milliseconds',
      duration.milliseconds,
      7,
    ],
    ['getters.test.js:80: Duration#weeks returns the weeks', period.weeks, 8],
  ])('%s', (_name, actual, expected) => {
    expect(actual).toBe(expected);
  });
});

describe('Luxon duration/getters (differs from Luxon on purpose)', () => {
  it('getters.test.js:47: fractional hours throw, because invalid input is a DaisyRangeError (PROJECT.md §5.1) and components are whole units', () => {
    expect(() => Duration.of({ hours: 4.5, minutes: 5, seconds: 6, milliseconds: 7 })).toThrow(
      DaisyRangeError,
    );
  });
});
