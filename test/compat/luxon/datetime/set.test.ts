import { describe, expect, it } from 'vitest';

import { LocalDate, LocalDateTime } from '../../../../src';
import type { DayOfWeek } from '../../../../src';
import { de } from '../../../../src/locale/de';

const date = (text: string) => LocalDate.parse(text);
const dateTime = (text: string) => LocalDateTime.parse(text);

const LUXON_SET_FIXTURE = dateTime('1982-05-25T09:23:54.123');
const US_FIRST_DAY_OF_WEEK: DayOfWeek = 'sunday';

describe('Luxon datetime/set: with*', () => {
  it.each<[string, (value: LocalDateTime) => LocalDateTime, string]>([
    ['set.test.js:14: with year 2012', (value) => value.withYear(2012), '2012-05-25T09:23:54.123'],
    [
      'set.test.js:14: with month 2 keeps the hour',
      (value) => value.withMonth(2),
      '1982-02-25T09:23:54.123',
    ],
    ['set.test.js:14: with day 5', (value) => value.withDay(5), '1982-05-05T09:23:54.123'],
    ['set.test.js:14: with hour 4', (value) => value.withHour(4), '1982-05-25T04:23:54.123'],
    ['set.test.js:14: with minute 16', (value) => value.withMinute(16), '1982-05-25T09:16:54.123'],
    ['set.test.js:14: with second 45', (value) => value.withSecond(45), '1982-05-25T09:23:45.123'],
    [
      'set.test.js:14: with millisecond 86',
      (value) => value.withMillisecond(86),
      '1982-05-25T09:23:54.086',
    ],
    [
      'set.test.js:68: Monday of the same week',
      (value) => value.previousOrSame('monday'),
      '1982-05-24T09:23:54.123',
    ],
    [
      'set.test.js:269: month 3 and day 31 together',
      (value) => value.withMonth(3).withDay(31),
      '1982-03-31T09:23:54.123',
    ],
  ])('%s', (_name, adjust, expected) => {
    expect(adjust(LUXON_SET_FIXTURE)).toEqual(dateTime(expected));
  });

  it.each<[string, (value: LocalDate) => LocalDate, string, string]>([
    [
      'set.test.js:25: with month 4 clamps May 31 to April 30',
      (value) => value.withMonth(4),
      '1983-05-31',
      '1983-04-30',
    ],
    [
      'set.test.js:32: with year 2013 clamps Feb 29 to Feb 28',
      (value) => value.withYear(2013),
      '2012-02-29',
      '2013-02-28',
    ],
    [
      'set.test.js:68: start of the ISO week',
      (value) => value.startOfWeek(),
      '1982-05-25',
      '1982-05-24',
    ],
    [
      'set.test.js:80: Sunday of the ISO week',
      (value) => value.endOfWeek(),
      '2016-01-02',
      '2016-01-03',
    ],
    [
      'set.test.js:80: Sunday of the ISO week',
      (value) => value.endOfWeek(),
      '2016-12-29',
      '2017-01-01',
    ],
    [
      'set.test.js:80: Sunday of the ISO week',
      (value) => value.endOfWeek(),
      '2021-01-01',
      '2021-01-03',
    ],
    [
      'set.test.js:80: Sunday of the ISO week',
      (value) => value.endOfWeek(),
      '2028-01-01',
      '2028-01-02',
    ],
  ])('%s: %s', (_name, adjust, start, expected) => {
    expect(adjust(date(start))).toEqual(date(expected));
  });

  it('set.test.js:254: day 200 of 1982 is 19 July', () => {
    expect(LocalDate.ofYearDay(1982, 200).atTime(9, 23, 54, 123)).toEqual(
      dateTime('1982-07-19T09:23:54.123'),
    );
  });
});

describe('Luxon datetime/set: week fields of the expected dates', () => {
  it.each<[string, string, DayOfWeek, number]>([
    ['set.test.js:43: 2017-W21-2', '2017-05-23', 'tuesday', 21],
    ['set.test.js:56: 1982-W02-2', '1982-01-12', 'tuesday', 2],
  ])('%s is %s, a %s in ISO week %s', (_name, text, dayOfWeek, weekOfYear) => {
    expect(date(text).dayOfWeek).toBe(dayOfWeek);
    expect(date(text).weekOfYear).toBe(weekOfYear);
  });
});

describe('Luxon datetime/set: local weekday 1 is the start of the locale week', () => {
  it('set.test.js:97: en-US weeks start on Sunday', () => {
    expect(date('1982-05-25').startOfWeek(US_FIRST_DAY_OF_WEEK)).toEqual(date('1982-05-23'));
    expect(LUXON_SET_FIXTURE.previousOrSame(US_FIRST_DAY_OF_WEEK)).toEqual(
      dateTime('1982-05-23T09:23:54.123'),
    );
  });

  it('set.test.js:110: de-DE weeks start on Monday', () => {
    expect(LUXON_SET_FIXTURE.previousOrSame(de.firstDayOfWeek)).toEqual(
      dateTime('1982-05-24T09:23:54.123'),
    );
    expect(LUXON_SET_FIXTURE.startOfWeek(de.firstDayOfWeek)).toEqual(dateTime('1982-05-24T00:00'));
  });

  it.each<[string]>([['set.test.js:123'], ['set.test.js:138']])(
    '%s: local weekday 2 of the en-US week of 2022-01-01 is 2021-12-27',
    () => {
      expect(
        dateTime('2022-01-01T09:23:54.123').previousOrSame(US_FIRST_DAY_OF_WEEK).plusDays(1),
      ).toEqual(dateTime('2021-12-27T09:23:54.123'));
    },
  );
});
