import { describe, expect, it } from 'vitest';

import { LocalDate, LocalDateTime } from '../../../../src';

describe('Luxon datetime/misc: hasSame via equals, truncatedTo and startOf', () => {
  it('misc.test.js:10: millisecond-exact comparison', () => {
    const now = LocalDateTime.now();
    expect(now.equals(now)).toBe(true);
    expect(now.equals(now.plusMilliseconds(1))).toBe(false);
  });

  it('misc.test.js:17: same day, not the next day', () => {
    const now = LocalDateTime.now();
    expect(now.truncatedTo('day').equals(now.truncatedTo('day'))).toBe(true);
    expect(now.truncatedTo('day').equals(now.startOfDay().truncatedTo('day'))).toBe(true);
    expect(now.truncatedTo('day').equals(now.plusDays(1).truncatedTo('day'))).toBe(false);
  });

  it('misc.test.js:24: 2001-02-03 and 2001-05-03 share the year, not the month or day', () => {
    const february = LocalDate.parse('2001-02-03');
    const may = LocalDate.parse('2001-05-03');
    expect(february.startOfYear().equals(may.startOfYear())).toBe(true);
    expect(february.startOfMonth().equals(may.startOfMonth())).toBe(false);
    expect(february.equals(may)).toBe(false);
  });

  it('misc.test.js:34: equal wall-clock times are the same at every unit', () => {
    const helsinki = LocalDateTime.parse('2019-10-02T01:02:03.045');
    const chicago = LocalDateTime.parse('2019-10-02T01:02:03.045');
    for (const unit of ['day', 'hour', 'second'] as const) {
      expect(helsinki.truncatedTo(unit).equals(chicago.truncatedTo(unit))).toBe(true);
      expect(chicago.truncatedTo(unit).equals(helsinki.truncatedTo(unit))).toBe(true);
    }
    expect(helsinki.equals(chicago)).toBe(true);
    expect(chicago.equals(helsinki)).toBe(true);
  });
});

describe('Luxon datetime/misc: calendar facts', () => {
  it.each<[string, boolean]>([
    ['2017-05-25', false],
    ['2020-05-25', true],
  ])('misc.test.js:85: %s isLeapYear is %s', (text, expected) => {
    expect(LocalDate.parse(text).isLeapYear()).toBe(expected);
  });

  it.each<[string, number]>([
    ['2017-05-25', 365],
    ['2020-05-25', 366],
  ])('misc.test.js:97: %s daysInYear is %s', (text, expected) => {
    expect(LocalDate.parse(text).daysInYear).toBe(expected);
  });

  it.each<[string, number]>([
    ['2017-03-10', 31],
    ['2017-06-10', 30],
    ['2017-02-10', 28],
    ['2020-02-10', 29],
  ])('misc.test.js:109: %s daysInMonth is %s', (text, expected) => {
    expect(LocalDate.parse(text).daysInMonth).toBe(expected);
  });

  it.each<[number, number]>([
    [2004, 53],
    [2017, 52],
    [2020, 53],
  ])(
    'misc.test.js:123: week-year %s has %s weeks (28 December is in the last week)',
    (year, weeks) => {
      expect(LocalDate.of(year, 12, 28).weekOfYear).toBe(weeks);
    },
  );
});
