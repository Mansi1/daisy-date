import { describe, expect, it } from 'vitest';

import { DaisyRangeError, LocalDate, LocalDateRange } from '../../../../src';

const range = (startText: string, endText: string) =>
  LocalDateRange.of(LocalDate.parse(startText), LocalDate.parse(endText));

const hourAsDay = (hour: number) => LocalDate.of(1982, 5, hour);

const sixToSeven = LocalDateRange.of(hourAsDay(6), hourAsDay(6));

describe('Luxon interval/info, an interval as the days it touches', () => {
  it.each<[string, LocalDateRange, number]>([
    ['info.test.js:37: days() is 1 inside a day', range('2016-05-25', '2016-05-25'), 1],
    ['info.test.js:42: days() is 2 across midnight', range('2016-05-25', '2016-05-26'), 2],
    [
      'info.test.js:57: days() leaves out the exclusive midnight end',
      range('2022-10-01', '2022-10-02'),
      2,
    ],
  ])('%s', (_name, interval, expected) => {
    expect(interval.days()).toBe(expected);
  });
});

describe('Luxon interval/info contains, hour h of 1982-05-25 as day h of May 1982', () => {
  it.each<[string, LocalDate, boolean]>([
    ['info.test.js:111: contains a date inside the range (06:30)', hourAsDay(6), true],
    ['info.test.js:116: does not contain a date after the range (08:30)', hourAsDay(8), false],
    ['info.test.js:121: does not contain a date before the range (05:30)', hourAsDay(5), false],
    ['info.test.js:126: contains the start (06:00)', hourAsDay(6), true],
    ['info.test.js:131: does not contain the exclusive end (07:00)', hourAsDay(7), false],
  ])('%s', (_name, day, expected) => {
    expect(sixToSeven.contains(day)).toBe(expected);
  });
});

describe('Luxon interval/info (differs from Luxon on purpose)', () => {
  it('info.test.js:144: an empty interval cannot be built, ranges are never empty (T10)', () => {
    expect(() => LocalDateRange.of(hourAsDay(6), hourAsDay(5))).toThrow(DaisyRangeError);
  });
});
