import { describe, expect, it } from 'vitest';

import { DaisyRangeError, Duration, LocalDate, LocalDateTime, Period } from '../../../../src';
import type { TruncationUnit } from '../../../../src';

const date = (text: string) => LocalDate.parse(text);
const dateTime = (text: string) => LocalDateTime.parse(text);

const LUXON_MATH_FIXTURE = dateTime('2010-02-03T04:05:06.007');
const EPOCH = dateTime('1970-01-01T00:00');
const DAYS_PAST_THE_LIMIT = 1e8 + 1;

describe('Luxon datetime/math: plus and minus', () => {
  it.each<[string, (value: LocalDateTime) => LocalDateTime, string, string]>([
    [
      'math.test.js:22: plus 1 year',
      (value) => value.plusYears(1),
      '2010-02-03T04:05:06.007',
      '2011-02-03T04:05:06.007',
    ],
    [
      'math.test.js:33: plus 1 month at the end of the month',
      (value) => value.plusMonths(1),
      '2018-01-31T10:00',
      '2018-02-28T10:00',
    ],
    [
      'math.test.js:40: plus 1 month at the end of the month in a leap year',
      (value) => value.plusMonths(1),
      '2016-01-31T10:00',
      '2016-02-29T10:00',
    ],
    [
      'math.test.js:47: plus 13 months at the end of the month',
      (value) => value.plusMonths(13),
      '2015-01-31T10:00',
      '2016-02-29T10:00',
    ],
    [
      'math.test.js:55: plus 1 day keeps the time',
      (value) => value.plusDays(1),
      '2016-03-12T10:00',
      '2016-03-13T10:00',
    ],
    [
      'math.test.js:83: plus a period and a duration',
      (value) => value.plus(Period.parse('P1D')).plus(Duration.parse('PT3H28M')),
      '2016-03-12T10:13',
      '2016-03-13T13:41',
    ],
    [
      'math.test.js:91: plus several units',
      (value) => value.plusDays(1).plusHours(3).plusMinutes(28),
      '2016-03-12T10:13',
      '2016-03-13T13:41',
    ],
    [
      'math.test.js:158: plus 1 month and -1 day',
      (value) => value.plus(Period.of({ months: 1, days: -1 })),
      '2020-01-08T12:34',
      '2020-02-07T12:34',
    ],
    [
      'math.test.js:158: plus 4 years and -1 day',
      (value) => value.plus(Period.of({ years: 4, days: -1 })),
      '2020-01-08T12:34',
      '2024-01-07T12:34',
    ],
    [
      'math.test.js:168: minus 1 year',
      (value) => value.minusYears(1),
      '2010-02-03T04:05:06.007',
      '2009-02-03T04:05:06.007',
    ],
    [
      'math.test.js:180: minus 1 month at the end of the month',
      (value) => value.minusMonths(1),
      '2018-03-31T10:00',
      '2018-02-28T10:00',
    ],
    [
      'math.test.js:187: minus 1 month at the end of the month in a leap year',
      (value) => value.minusMonths(1),
      '2016-03-31T10:00',
      '2016-02-29T10:00',
    ],
    [
      'math.test.js:194: minus 13 months at the end of the month',
      (value) => value.minusMonths(13),
      '2017-03-31T10:00',
      '2016-02-29T10:00',
    ],
    [
      'math.test.js:254: minus 1 month and -1 day',
      (value) => value.minus(Period.of({ months: 1, days: -1 })),
      '2020-01-08T12:34',
      '2019-12-09T12:34',
    ],
    [
      'math.test.js:254: minus 4 years and -1 day',
      (value) => value.minus(Period.of({ years: 4, days: -1 })),
      '2020-01-08T12:34',
      '2016-01-09T12:34',
    ],
  ])('%s', (_name, move, start, expected) => {
    expect(move(dateTime(start))).toEqual(dateTime(expected));
  });

  it.each<[string, (value: LocalDate) => LocalDate, string, string]>([
    [
      'math.test.js:103: plus 2 days across the year 100',
      (value) => value.plusDays(2),
      '0099-12-31',
      '0100-01-02',
    ],
    [
      'math.test.js:110: plus 61 days across the year 100 and through February',
      (value) => value.plusDays(61),
      '0099-12-31',
      '0100-03-02',
    ],
    [
      'math.test.js:206: minus 2 days across the year 100',
      (value) => value.minusDays(2),
      '0100-01-02',
      '0099-12-31',
    ],
  ])('%s', (_name, move, start, expected) => {
    expect(move(date(start))).toEqual(date(expected));
  });
});

describe('Luxon datetime/math: plus and minus (differs from Luxon on purpose)', () => {
  it.each<[string, (value: LocalDateTime) => LocalDateTime]>([
    [
      'math.test.js:64: no DST, so plus 24 hours is the same time next day',
      (value) => value.plusHours(24),
    ],
    [
      'math.test.js:74: no DST, so plus 0 days and 24 hours is the same time next day',
      (value) => value.plus(Period.ofDays(0)).plus(Duration.ofHours(24)),
    ],
  ])('%s', (_name, move) => {
    expect(move(dateTime('2016-03-12T10:00'))).toEqual(dateTime('2016-03-13T10:00'));
  });

  it.each<[string, (value: LocalDateTime) => LocalDateTime]>([
    [
      'math.test.js:117: out-of-range input throws, so plus 1e8 + 1 days throws',
      (value) => value.plusDays(DAYS_PAST_THE_LIMIT),
    ],
    [
      'math.test.js:213: out-of-range input throws, so minus 1e8 + 1 days throws',
      (value) => value.minusDays(DAYS_PAST_THE_LIMIT),
    ],
  ])('%s', (_name, move) => {
    expect(() => move(EPOCH)).toThrow(DaisyRangeError);
  });

  it.each<[string, (value: LocalDateTime) => LocalDateTime]>([
    [
      'math.test.js:134: amounts must be integers, so plus 0.8 days throws',
      (value) => value.plusDays(0.8),
    ],
    [
      'math.test.js:143: amounts must be integers, so plus 8.7 weeks throws',
      (value) => value.plusWeeks(8.7),
    ],
    [
      'math.test.js:143: amounts must be integers, so plus 8.7 months throws',
      (value) => value.plusMonths(8.7),
    ],
    [
      'math.test.js:143: amounts must be integers, so plus 8.7 years throws',
      (value) => value.plusYears(8.7),
    ],
    [
      'math.test.js:158: amounts must be integers, so plus 0.5 years throws',
      (value) => value.plusYears(0.5),
    ],
    [
      'math.test.js:230: amounts must be integers, so minus 0.8 days throws',
      (value) => value.minusDays(0.8),
    ],
    [
      'math.test.js:239: amounts must be integers, so minus 8.7 weeks throws',
      (value) => value.minusWeeks(8.7),
    ],
    [
      'math.test.js:239: amounts must be integers, so minus 8.7 months throws',
      (value) => value.minusMonths(8.7),
    ],
    [
      'math.test.js:239: amounts must be integers, so minus 8.7 years throws',
      (value) => value.minusYears(8.7),
    ],
    [
      'math.test.js:254: amounts must be integers, so minus 0.5 years throws',
      (value) => value.minusYears(0.5),
    ],
  ])('%s', (_name, move) => {
    expect(() => move(dateTime('2016-01-31T10:00'))).toThrow(DaisyRangeError);
  });
});

describe("Luxon datetime/math: the supported range (differs from Luxon on purpose: PROJECT.md §5.1, daisy uses Temporal's range)", () => {
  it("math.test.js:122: adding 1e8 days and a second ends just inside Temporal's last day", () => {
    expect(LocalDateTime.parse('1970-01-01T00:00').plusSeconds(1e8 * 86400 + 1)).toEqual(
      LocalDateTime.parse('+275760-09-13T00:00:01'),
    );
  });

  it("math.test.js:218: subtracting 1e8 days and a second ends just inside Temporal's first day", () => {
    expect(LocalDateTime.parse('1970-01-01T00:00').minusSeconds(1e8 * 86400 + 1)).toEqual(
      LocalDateTime.parse('-271821-04-19T23:59:59'),
    );
  });
});

describe('Luxon datetime/math: startOf and endOf', () => {
  it.each<[string, (value: LocalDateTime) => LocalDateTime, string]>([
    ['math.test.js:266: start of the year', (value) => value.startOfYear(), '2010-01-01T00:00'],
    ['math.test.js:313: start of the month', (value) => value.startOfMonth(), '2010-02-01T00:00'],
    ['math.test.js:325: start of the day', (value) => value.startOfDay(), '2010-02-03T00:00'],
    [
      'math.test.js:325: truncated to the day',
      (value) => value.truncatedTo('day'),
      '2010-02-03T00:00',
    ],
    [
      'math.test.js:337: truncated to the hour',
      (value) => value.truncatedTo('hour'),
      '2010-02-03T04:00',
    ],
    [
      'math.test.js:349: truncated to the minute',
      (value) => value.truncatedTo('minute'),
      '2010-02-03T04:05',
    ],
    [
      'math.test.js:361: truncated to the second',
      (value) => value.truncatedTo('second'),
      '2010-02-03T04:05:06',
    ],
    ['math.test.js:398: end of the year', (value) => value.endOfYear(), '2010-12-31T23:59:59.999'],
    [
      'math.test.js:457: end of the month',
      (value) => value.endOfMonth(),
      '2010-02-28T23:59:59.999',
    ],
    ['math.test.js:469: end of the day', (value) => value.endOfDay(), '2010-02-03T23:59:59.999'],
  ])('%s', (_name, adjust, expected) => {
    expect(adjust(LUXON_MATH_FIXTURE)).toEqual(dateTime(expected));
  });

  it('math.test.js:373: start of the week of Saturday 2016-03-12', () => {
    expect(dateTime('2016-03-12T10:00').startOfWeek()).toEqual(dateTime('2016-03-07T00:00'));
  });

  it('math.test.js:517: end of the week of Saturday 2016-03-12', () => {
    expect(dateTime('2016-03-12T10:00').endOfWeek()).toEqual(dateTime('2016-03-13T23:59:59.999'));
  });

  it.each<[string, string]>([
    ['math.test.js:390: truncating to an unknown unit throws', 'splork'],
    ['math.test.js:390: truncating to an empty unit throws', ''],
  ])('%s', (_name, unit) => {
    expect(() => dateTime('2016-03-12T10:00').truncatedTo(unit as TruncationUnit)).toThrow(
      DaisyRangeError,
    );
  });
});
