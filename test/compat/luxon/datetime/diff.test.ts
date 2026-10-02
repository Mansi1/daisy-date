import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Duration, LocalDate, LocalDateTime, Period } from '../../../../src';

const date = (text: string) => LocalDate.parse(text);
const dateTime = (text: string) => LocalDateTime.parse(text);

type PeriodObject = { years: number; months: number; weeks: number; days: number };
type DurationObject = { hours: number; minutes: number; seconds: number; milliseconds: number };

describe('Luxon datetime/diff: until between dates', () => {
  it.each<[string, string, string, PeriodObject]>([
    [
      'diff.test.js:21: 0 years',
      '2017-01-01',
      '2017-01-01',
      { years: 0, months: 0, weeks: 0, days: 0 },
    ],
    [
      'diff.test.js:21: 1 year',
      '2016-01-01',
      '2017-01-01',
      { years: 1, months: 0, weeks: 0, days: 0 },
    ],
    [
      'diff.test.js:21: 1 month',
      '2016-05-28',
      '2016-06-28',
      { years: 0, months: 1, weeks: 0, days: 0 },
    ],
    [
      'diff.test.js:21: 3 days',
      '2016-06-25',
      '2016-06-28',
      { years: 0, months: 0, weeks: 0, days: 3 },
    ],
    [
      'diff.test.js:21: 4 days across a month end',
      '2016-05-28',
      '2016-06-01',
      { years: 0, months: 0, weeks: 0, days: 4 },
    ],
    [
      'diff.test.js:81: 6 years and 12 days',
      '2010-03-16',
      '2016-03-28',
      { years: 6, months: 0, weeks: 0, days: 12 },
    ],
    [
      'diff.test.js:187: 6 whole years across leap days',
      '2010-06-14',
      '2016-06-14',
      { years: 6, months: 0, weeks: 0, days: 0 },
    ],
    [
      'diff.test.js:307: from Feb 29 to April 1 of the next year',
      '2020-02-29',
      '2021-04-01',
      { years: 1, months: 1, weeks: 0, days: 3 },
    ],
  ])('%s: from %s to %s', (_name, start, end, expected) => {
    expect(date(start).until(date(end))).toEqual(expected);
  });

  it('diff.test.js:307: adding the difference back gives the end date', () => {
    const start = date('2020-02-29');
    expect(start.plus(start.until(date('2021-04-01')))).toEqual(date('2021-04-01'));
  });

  it.each<[string, string, string, number]>([
    ['diff.test.js:81: 5 years and 364 days', '2010-03-16', '2016-03-14', 5],
    ['diff.test.js:81: 5 years and 363 days', '2009-03-16', '2015-03-14', 5],
    ['diff.test.js:187: 5 years and 364 days', '2010-03-16', '2016-03-14', 5],
  ])('%s: whole years from %s to %s', (_name, start, end, expected) => {
    expect(date(start).until(date(end)).years).toBe(expected);
  });

  it.each<[string, string, string, number]>([
    ['diff.test.js:21: 3 days', '2016-06-25', '2016-06-28', 3],
    ['diff.test.js:21: 4 days', '2016-05-28', '2016-06-01', 4],
    ['diff.test.js:21: 4 weeks', '2016-06-01', '2016-06-29', 28],
    ['diff.test.js:21: 2 weeks', '2016-02-18', '2016-03-03', 14],
    ['diff.test.js:81: 3 weeks and 3 days', '2016-03-01', '2016-03-25', 24],
    ['diff.test.js:81: the 364 days after 5 years', '2015-03-16', '2016-03-14', 364],
    ['diff.test.js:81: the 363 days after 5 years', '2014-03-16', '2015-03-14', 363],
    ['diff.test.js:187: the 364 days after 5 years', '2015-03-16', '2016-03-14', 364],
    ['diff.test.js:187: calendar days, not months', '2016-02-14', '2016-05-14', 90],
  ])('%s: from %s to %s is %s days', (_name, start, end, expected) => {
    expect(date(start).daysUntil(date(end))).toBe(expected);
  });
});

describe('Luxon datetime/diff: durationUntil and until between date-times', () => {
  it.each<[string, string, string, DurationObject]>([
    [
      'diff.test.js:14: 12 milliseconds',
      '2017-01-01T00:00',
      '2017-01-01T00:00:00.012',
      { hours: 0, minutes: 0, seconds: 0, milliseconds: 12 },
    ],
    [
      'diff.test.js:14: 0 milliseconds',
      '2017-01-01T00:00',
      '2017-01-01T00:00',
      { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
    ],
    [
      'diff.test.js:21: 8 hours',
      '2016-06-28T05:00',
      '2016-06-28T13:00',
      { hours: 8, minutes: 0, seconds: 0, milliseconds: 0 },
    ],
    [
      'diff.test.js:21: 80 hours',
      '2016-06-25T05:00',
      '2016-06-28T13:00',
      { hours: 80, minutes: 0, seconds: 0, milliseconds: 0 },
    ],
    [
      'diff.test.js:81: 12 days, 8 hours, 45 minutes and 42 seconds as clock time',
      '2016-03-16T05:00:18',
      '2016-03-28T13:46',
      { hours: 296, minutes: 45, seconds: 42, milliseconds: 0 },
    ],
    [
      'diff.test.js:116: 0 weeks and 143 hours',
      '2017-06-01T22:00',
      '2017-06-07T21:00',
      { hours: 143, minutes: 0, seconds: 0, milliseconds: 0 },
    ],
    [
      'diff.test.js:142: 0 hours',
      '2018-11-05T00:00',
      '2018-11-05T00:00',
      { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
    ],
    [
      'diff.test.js:149: -1 millisecond',
      '2017-06-26T21:01:02.002',
      '2017-06-26T21:01:02.001',
      { hours: 0, minutes: 0, seconds: 0, milliseconds: -1 },
    ],
  ])('%s: from %s to %s', (_name, start, end, expected) => {
    expect(dateTime(start).durationUntil(dateTime(end))).toEqual(expected);
  });

  it.each<[string, string, string, string, string]>([
    ['diff.test.js:21: 3 days and 8 hours', '2016-06-25T05:00', '2016-06-28T13:00', 'P3D', 'PT8H'],
    [
      'diff.test.js:81: 12 days, 8 hours, 45 minutes and 42 seconds',
      '2016-03-16T05:00:18',
      '2016-03-28T13:46',
      'P12D',
      'PT8H45M42S',
    ],
    [
      'diff.test.js:116: 0 weeks, 5 days and 23 hours',
      '2017-06-01T22:00',
      '2017-06-07T21:00',
      'P5D',
      'PT23H',
    ],
    [
      'diff.test.js:116: 0 days and 23 hours',
      '2017-06-26T22:00',
      '2017-06-27T21:00',
      'P0D',
      'PT23H',
    ],
    ['diff.test.js:142: all zero', '2018-11-05T00:00', '2018-11-05T00:00', 'P0D', 'PT0S'],
    [
      'diff.test.js:149: all zero but -1 millisecond',
      '2017-06-26T21:01:02.002',
      '2017-06-26T21:01:02.001',
      'P0D',
      '-PT0.001S',
    ],
    [
      'diff.test.js:297: 0 months and 1 day when backtracking months',
      '2019-03-31T08:42:07.038',
      '2019-04-01T08:42:07.128',
      'P1D',
      'PT0.09S',
    ],
  ])('%s: from %s to %s is %s plus %s', (_name, start, end, period, duration) => {
    expect(dateTime(start).until(dateTime(end))).toEqual({
      period: Period.parse(period),
      duration: Duration.parse(duration),
    });
  });
});

describe('Luxon datetime/diff: diffNow', () => {
  beforeEach(() => {
    vi.useFakeTimers({ now: new Date('2017-05-15T00:00:00.000Z') });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('diff.test.js:335: from now to 2014-08-06 is -87523200000 milliseconds', () => {
    expect(LocalDateTime.now('UTC').durationUntil(dateTime('2014-08-06T00:00')).toMillis()).toBe(
      -87523200000,
    );
  });

  it('diff.test.js:341: from today to 2014-08-06 is -1013 days', () => {
    expect(LocalDate.today('UTC').daysUntil(date('2014-08-06'))).toBe(-1013);
  });
});

describe('Luxon datetime/diff: whole units (differs from Luxon on purpose)', () => {
  it.each<[string, string, string, PeriodObject]>([
    [
      'diff.test.js:168: until gives whole years, months and days, so 1 year and 28 days instead of 1.93 months',
      '2016-06-16',
      '2017-07-14',
      { years: 1, months: 0, weeks: 0, days: 28 },
    ],
    [
      'diff.test.js:209: until gives whole years, months and days, so P1Y11M28D instead of 1 + 365/366 years',
      '2018-03-28',
      '2020-03-27',
      { years: 1, months: 11, weeks: 0, days: 28 },
    ],
    [
      'diff.test.js:216: until gives whole years, months and days, so P1M30D instead of 1 + 30/31 months',
      '2017-12-25',
      '2018-02-24',
      { years: 0, months: 1, weeks: 0, days: 30 },
    ],
  ])('%s', (_name, start, end, expected) => {
    expect(date(start).until(date(end))).toEqual(expected);
  });

  it.each<[string, string, string, string, string]>([
    [
      'diff.test.js:21: until gives whole days plus clock time, so P0D and PT8H instead of 1/3 day',
      '2016-06-28T05:00',
      '2016-06-28T13:00',
      'P0D',
      'PT8H',
    ],
    [
      'diff.test.js:177: until gives whole days plus clock time, so P0D and PT4H instead of 1/6 day',
      '2017-07-14T02:00',
      '2017-07-14T06:00',
      'P0D',
      'PT4H',
    ],
    [
      'diff.test.js:223: until gives whole days plus clock time, so P13D and PT23H instead of 1 + 6/7 + 23/168 weeks',
      '2018-11-02T01:00',
      '2018-11-16T00:00',
      'P13D',
      'PT23H',
    ],
    [
      'diff.test.js:234: no DST and whole days plus clock time, so P1D and PT23H instead of 1 + 24/25 days',
      '2018-11-03T01:00',
      '2018-11-05T00:00',
      'P1D',
      'PT23H',
    ],
  ])('%s', (_name, start, end, period, duration) => {
    expect(dateTime(start).until(dateTime(end))).toEqual({
      period: Period.parse(period),
      duration: Duration.parse(duration),
    });
  });

  it('diff.test.js:245: no DST, so 2016-01-01 to 2016-05-05 is 3000 hours instead of 2999', () => {
    expect(dateTime('2016-01-01T00:00').durationUntil(dateTime('2016-05-05T00:00'))).toEqual({
      hours: 3000,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
  });
});
