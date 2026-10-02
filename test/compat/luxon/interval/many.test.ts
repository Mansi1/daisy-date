import { describe, expect, it } from 'vitest';

import { DaisyRangeError, LocalDate, LocalDateRange } from '../../../../src';

const fromISOs = (startText: string, endExclusiveText: string) =>
  LocalDateRange.of(LocalDate.parse(startText), LocalDate.parse(endExclusiveText).minusDays(1));

const todayFrom = (startHour: number, endHour: number) =>
  LocalDateRange.of(LocalDate.of(2017, 5, startHour), LocalDate.of(2017, 5, endHour - 1));

describe('Luxon interval/many, fromISOs(a, b) as a..b-1 and todayFrom(a, b) as 2017-05-a..2017-05-(b-1)', () => {
  it('many.test.js:12: equals is true iff both ends are the same', () => {
    const first = fromISOs('2016-10-14', '2016-10-15');

    expect(first.equals(fromISOs('2016-10-14', '2016-10-15'))).toBe(true);
    expect(first.equals(fromISOs('2016-10-13', '2016-10-15'))).toBe(false);
    expect(first.equals(fromISOs('2016-10-14', '2016-10-16'))).toBe(false);
    expect(first.equals(fromISOs('2016-10-13', '2016-10-16'))).toBe(false);
  });

  it.each<[string, LocalDateRange, LocalDateRange]>([
    ['many.test.js:46: union spans a partially later range', todayFrom(7, 10), todayFrom(5, 10)],
    ['many.test.js:50: union spans a partially earlier range', todayFrom(4, 6), todayFrom(4, 8)],
    ['many.test.js:54: union with an engulfed range is a no-op', todayFrom(6, 7), todayFrom(5, 8)],
    ['many.test.js:58: union expands to an engulfing range', todayFrom(4, 10), todayFrom(4, 10)],
    ['many.test.js:62: union spans adjacent ranges', todayFrom(8, 10), todayFrom(5, 10)],
  ])('%s', (_name, other, expected) => {
    expect(todayFrom(5, 8).union(other).equals(expected)).toBe(true);
  });

  it('many.test.js:74: intersection is null when the ranges do not meet', () => {
    expect(todayFrom(5, 8).intersection(todayFrom(3, 4))).toBeNull();
  });

  it('many.test.js:78: intersection of overlapping ranges', () => {
    expect(todayFrom(5, 8).intersection(todayFrom(3, 7))?.equals(todayFrom(5, 7))).toBe(true);
  });

  it('many.test.js:82: intersection of adjacent ranges is null', () => {
    expect(todayFrom(5, 8).intersection(todayFrom(8, 10))).toBeNull();
  });

  it.each<[string, LocalDateRange, boolean]>([
    ['many.test.js:223: encloses (engulfs), wholly later', todayFrom(13, 15), false],
    ['many.test.js:224: encloses (engulfs), partially later', todayFrom(11, 15), false],
    ['many.test.js:225: encloses (engulfs), wholly earlier', todayFrom(6, 8), false],
    ['many.test.js:226: encloses (engulfs), partially earlier', todayFrom(6, 10), false],
    ['many.test.js:227: encloses (engulfs), engulfed', todayFrom(8, 13), false],
    ['many.test.js:229: encloses (engulfs), engulfing', todayFrom(10, 11), true],
    ['many.test.js:230: encloses (engulfs), equal', todayFrom(9, 12), true],
  ])('%s', (_name, other, expected) => {
    expect(todayFrom(9, 12).encloses(other)).toBe(expected);
  });

  it.each<[string, LocalDateRange, LocalDateRange, boolean]>([
    ['many.test.js:242: abuts (abutsStart), next range', todayFrom(9, 10), todayFrom(10, 11), true],
    ['many.test.js:243: abuts (abutsStart), gap', todayFrom(9, 10), todayFrom(11, 12), false],
    ['many.test.js:244: abuts (abutsStart), overlap', todayFrom(9, 10), todayFrom(8, 11), false],
    ['many.test.js:245: abuts (abutsStart), same range', todayFrom(9, 10), todayFrom(9, 10), false],
    ['many.test.js:257: abuts (abutsEnd), previous range', todayFrom(9, 11), todayFrom(8, 9), true],
    ['many.test.js:258: abuts (abutsEnd), overlap', todayFrom(9, 11), todayFrom(8, 10), false],
    ['many.test.js:259: abuts (abutsEnd), gap', todayFrom(9, 11), todayFrom(7, 8), false],
    ['many.test.js:260: abuts (abutsEnd), same range', todayFrom(9, 11), todayFrom(9, 11), false],
  ])('%s', (_name, range, other, expected) => {
    expect(range.abuts(other)).toBe(expected);
  });
});

describe('Luxon interval/many (differs from Luxon on purpose)', () => {
  it.each<[string, LocalDateRange]>([
    [
      'many.test.js:38: union with a later range across a gap throws (§5.4 union needs connected ranges)',
      todayFrom(9, 11),
    ],
    [
      'many.test.js:42: union with an earlier range across a gap throws (§5.4 union needs connected ranges)',
      todayFrom(3, 4),
    ],
  ])('%s', (_name, other) => {
    expect(() => todayFrom(5, 8).union(other)).toThrow(DaisyRangeError);
  });

  it('many.test.js:356: splitBy month cuts at calendar month ends, first and last pieces partial (T10)', () => {
    const range = LocalDateRange.of(LocalDate.parse('2019-12-30'), LocalDate.parse('2020-05-02'));

    expect(range.splitBy('month').map((piece) => piece.toString())).toEqual([
      '2019-12-30/2019-12-31',
      '2020-01-01/2020-01-31',
      '2020-02-01/2020-02-29',
      '2020-03-01/2020-03-31',
      '2020-04-01/2020-04-30',
      '2020-05-01/2020-05-02',
    ]);
  });
});
