import { describe, expect, it } from 'vitest';

import { DaisyParseError, DaisyRangeError, LocalDate, LocalDateTime } from '../../../../src';

const dateTime = (text: string) => LocalDateTime.parse(text);

describe('Luxon datetime/create: now and local', () => {
  it.each([
    ['create.test.js:16: DateTime.now has today’s date'],
    ['create.test.js:43: DateTime.local() has today’s date'],
  ])('%s', () => {
    const jsDate = new Date();
    const now = LocalDateTime.now();
    expect(now.day).toBe(jsDate.getDate());
    expect(Math.abs(now.toDate().getTime() - jsDate.getTime())).toBeLessThan(1000);
  });

  it.each<[string, LocalDateTime, string]>([
    [
      'create.test.js:73: DateTime.local(2017, 6, 12) is the beginning of 6/12',
      LocalDateTime.of(2017, 6, 12),
      '2017-06-12T00:00:00.000',
    ],
    [
      'create.test.js:84: DateTime.local(2017, 6, 12, 5) is the beginning of the hour',
      LocalDateTime.of(2017, 6, 12, 5),
      '2017-06-12T05:00:00.000',
    ],
    [
      'create.test.js:95: DateTime.local(2017, 6, 12, 5, 25) is the beginning of the minute',
      LocalDateTime.of(2017, 6, 12, 5, 25),
      '2017-06-12T05:25:00.000',
    ],
    [
      'create.test.js:106: DateTime.local(2017, 6, 12, 5, 25, 16) is the beginning of the second',
      LocalDateTime.of(2017, 6, 12, 5, 25, 16),
      '2017-06-12T05:25:16.000',
    ],
    [
      'create.test.js:117: DateTime.local(2017, 6, 12, 5, 25, 16, 255) is right down to the millisecond',
      LocalDateTime.of(2017, 6, 12, 5, 25, 16, 255),
      '2017-06-12T05:25:16.255',
    ],
    [
      'create.test.js:420: DateTime.fromObject() sets all the fields',
      LocalDateTime.of(1982, 5, 25, 9, 23, 54, 123),
      '1982-05-25T09:23:54.123',
    ],
    [
      'create.test.js:970: DateTime.local(2024, 11, 3, 0, 5, 0) keeps its fields',
      LocalDateTime.of(2024, 11, 3, 0, 5, 0),
      '2024-11-03T00:05:00.000',
    ],
  ])('%s', (_name, created, expected) => {
    expect(created).toEqual(dateTime(expected));
  });

  it('create.test.js:950: the current year matches the JS clock', () => {
    expect(LocalDate.today().year).toBe(new Date().getFullYear());
  });

  it('create.test.js:970: 2024-11-03T00:05 round-trips through America/Chicago', () => {
    const created = LocalDateTime.of(2024, 11, 3, 0, 5, 0);
    expect(LocalDateTime.fromDate(created.toDate('America/Chicago'), 'America/Chicago')).toEqual(
      created,
    );
  });
});

describe('Luxon datetime/create: utc and zone options', () => {
  it.each<[string, LocalDateTime, string, string]>([
    [
      'create.test.js:207: DateTime.utc(2017, 6, 12) is the beginning of 6/12',
      LocalDateTime.of(2017, 6, 12),
      'UTC',
      '2017-06-12T00:00:00.000Z',
    ],
    [
      'create.test.js:218: DateTime.utc(2017, 6, 12, 5) is the beginning of the hour',
      LocalDateTime.of(2017, 6, 12, 5),
      'UTC',
      '2017-06-12T05:00:00.000Z',
    ],
    [
      'create.test.js:229: DateTime.utc(2017, 6, 12, 5, 25) is the beginning of the minute',
      LocalDateTime.of(2017, 6, 12, 5, 25),
      'UTC',
      '2017-06-12T05:25:00.000Z',
    ],
    [
      'create.test.js:240: DateTime.utc(2017, 6, 12, 5, 25, 16) is the beginning of the second',
      LocalDateTime.of(2017, 6, 12, 5, 25, 16),
      'UTC',
      '2017-06-12T05:25:16.000Z',
    ],
    [
      'create.test.js:251: DateTime.utc(2017, 6, 12, 5, 25, 16, 255) is right down to the millisecond',
      LocalDateTime.of(2017, 6, 12, 5, 25, 16, 255),
      'UTC',
      '2017-06-12T05:25:16.255Z',
    ],
    [
      'create.test.js:433: fromObject() in "utc" keeps the wall-clock fields',
      LocalDateTime.of(1982, 5, 25, 9, 23, 54, 123),
      'UTC',
      '1982-05-25T09:23:54.123Z',
    ],
    [
      'create.test.js:446: fromObject() in "utc-8" (Etc/GMT+8) has offset -8h',
      LocalDateTime.of(1982, 5, 25, 9, 23, 54, 123),
      'Etc/GMT+8',
      '1982-05-25T17:23:54.123Z',
    ],
    [
      'create.test.js:460: fromObject() in America/Los_Angeles has offset -7h in May',
      LocalDateTime.of(1982, 5, 25, 9, 23, 54, 123),
      'America/Los_Angeles',
      '1982-05-25T16:23:54.123Z',
    ],
    [
      'create.test.js:474: fromObject() in America/Los_Angeles has offset -8h in December',
      LocalDateTime.of(1982, 12, 25, 9, 23, 54, 123),
      'America/Los_Angeles',
      '1982-12-25T17:23:54.123Z',
    ],
  ])('%s', (_name, created, timeZone, expectedInstant) => {
    expect(created.toDate(timeZone).toISOString()).toBe(expectedInstant);
  });

  it('create.test.js:296: DateTime.fromJSDate(date) clones the date', () => {
    const jsDate = new Date(1982, 4, 25);
    const created = LocalDateTime.fromDate(jsDate);
    jsDate.setDate(14);
    expect(created).toEqual(dateTime('1982-05-25T00:00'));
  });

  it('create.test.js:305: DateTime.fromJSDate(date) accepts a zone option', () => {
    const jsDate = new Date(1982, 4, 25);
    const created = LocalDateTime.fromDate(jsDate, 'America/Santiago');
    expect(created.toDate('America/Santiago').getTime()).toBe(jsDate.getTime());
  });

  it('create.test.js:323: DateTime.fromJSDate throws for invalid values (throwOnInvalid)', () => {
    expect(() => LocalDateTime.fromDate(new Date(''))).toThrow(DaisyRangeError);
    expect(() => LocalDateTime.fromDate(new Date(), 'America/Blorp')).toThrow(DaisyRangeError);
  });

  it('create.test.js:777: year 5 round-trips through America/New_York', () => {
    const created = LocalDateTime.of(5, 1, 1);
    expect(LocalDateTime.fromDate(created.toDate('America/New_York'), 'America/New_York')).toEqual(
      dateTime('0005-01-01T00:00'),
    );
  });
});

describe('Luxon datetime/create: fromObject fields', () => {
  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'create.test.js:523: a month of %s throws',
    (month) => {
      expect(() => LocalDate.of(2017, month, 1)).toThrow(DaisyRangeError);
    },
  );

  it.each<[string, string, number, string]>([
    ['create.test.js:561: week 2 of 2016, Wednesday is 2016-01-13', '2016-01-13', 2, 'wednesday'],
    ['create.test.js:579: week 1 of 2015, Wednesday is 2014-12-31', '2014-12-31', 1, 'wednesday'],
    ['create.test.js:579: week 53 of 2009, Friday is 2010-01-01', '2010-01-01', 53, 'friday'],
  ])('%s', (_name, text, weekOfYear, dayOfWeek) => {
    const weekDate = LocalDate.parse(text);
    expect(weekDate.weekOfYear).toBe(weekOfYear);
    expect(weekDate.dayOfWeek).toBe(dayOfWeek);
  });

  it.each<[string, string]>([
    ['2016-01-13', '2016'],
    ['2014-12-31', '2015'],
    ['2010-01-01', '2009'],
  ])('create.test.js:561/579: %s is in week-year %s', (text, weekYear) => {
    expect(LocalDate.parse(text).format('Y')).toBe(weekYear);
  });

  it('create.test.js:738: day 200 of 2016 with a time is 2016-07-18T09:23:54.123', () => {
    const created = LocalDate.ofYearDay(2016, 200).atTime(9, 23, 54, 123);
    expect(created).toEqual(dateTime('2016-07-18T09:23:54.123'));
    expect(created.dayOfYear).toBe(200);
  });

  it('create.test.js:770: DateTime.fromObject accepts really low year numbers', () => {
    const created = LocalDate.of(5, 1, 1);
    expect([created.year, created.month, created.day]).toEqual([5, 1, 1]);
  });
});

describe('Luxon datetime/create: RFC 2822 and HTTP text via patterns', () => {
  it.each<[string, string, string, string]>([
    [
      'create.test.js:860: fromRFC2822 parses GMT correctly',
      '25 Nov 2016 13:23:12 GMT',
      "d MMM yyyy HH:mm:ss 'GMT'",
      '2016-11-25T13:23:12',
    ],
    [
      'create.test.js:872: fromRFC2822 parses Zulu correctly',
      '25 Nov 2016 13:23 Z',
      "d MMM yyyy HH:mm 'Z'",
      '2016-11-25T13:23:00',
    ],
    [
      'create.test.js:903: fromHTTP parses rfc1123',
      'Sun, 06 Nov 1994 08:49:37 GMT',
      "EEE, dd MMM yyyy HH:mm:ss 'GMT'",
      '1994-11-06T08:49:37',
    ],
    [
      'create.test.js:931: fromHTTP parses ascii',
      'Sun Nov  6 08:49:37 1994',
      'EEE MMM  d HH:mm:ss yyyy',
      '1994-11-06T08:49:37',
    ],
  ])('%s', (_name, text, pattern, expected) => {
    expect(LocalDateTime.parse(text, pattern)).toEqual(dateTime(expected));
  });
});

describe('Luxon datetime/create (differs from Luxon on purpose)', () => {
  it.each<[string, readonly number[]]>([
    [
      'create.test.js:51/185/550: of(2017) throws, since of requires year, month and day (PROJECT §5.3)',
      [2017],
    ],
    [
      'create.test.js:62/196: of(2017, 6) throws, since of requires year, month and day (PROJECT §5.3)',
      [2017, 6],
    ],
  ])('%s', (_name, fields) => {
    expect(() => LocalDateTime.of(...(fields as [number, number, number]))).toThrow(
      DaisyRangeError,
    );
  });

  it('create.test.js:140: a non-integer month throws instead of an invalid instance (no invalid instances)', () => {
    expect(() => LocalDateTime.of(2017, 6.7, 12)).toThrow(DaisyRangeError);
  });

  it('create.test.js:313: an invalid JS Date throws instead of an invalid instance (no invalid instances)', () => {
    expect(() => LocalDateTime.fromDate(new Date(''))).toThrow(DaisyRangeError);
    expect(() => LocalDate.fromDate(new Date(''))).toThrow(DaisyRangeError);
  });

  it('create.test.js:505: an unknown zone throws instead of an invalid instance (no invalid instances)', () => {
    expect(() => LocalDateTime.now('blorp')).toThrow(DaisyRangeError);
  });

  it('create.test.js:535: day of year 5000 and minute -6 throw instead of an invalid instance (no invalid instances)', () => {
    expect(() => LocalDate.ofYearDay(2017, 5000)).toThrow(DaisyRangeError);
    expect(() => LocalDateTime.of(2017, 1, 1, 0, -6)).toThrow(DaisyRangeError);
  });

  it('create.test.js:791: a weekday that contradicts the date throws (a parsed weekday must agree, §6.3)', () => {
    expect(() => LocalDate.parse('Monday 2005-12-13', 'EEEE yyyy-MM-dd')).toThrow(DaisyParseError);
    expect(LocalDate.parse('Tuesday 2005-12-13', 'EEEE yyyy-MM-dd')).toEqual(
      LocalDate.parse('2005-12-13'),
    );
  });

  it('create.test.js:898: a weekday that contradicts the date throws (a parsed weekday must agree, §6.3)', () => {
    expect(() =>
      LocalDateTime.parse('Sat, 25 Nov 2016 13:23:12 +0600', "EEE, d MMM yyyy HH:mm:ss '+0600'"),
    ).toThrow(DaisyParseError);
  });

  it('create.test.js:917: rfc850 "06-Nov-94" is 2094-11-06, a Saturday, so "Sunday" throws (yy is 2000–2099, §6.3)', () => {
    expect(() =>
      LocalDateTime.parse('Sunday, 06-Nov-94 08:49:37 GMT', "EEEE, dd-MMM-yy HH:mm:ss 'GMT'"),
    ).toThrow(DaisyParseError);
  });

  it.each<[string, string]>([
    ['Sat, 06 Nov 1994 08:49:37 GMT', "EEE, dd MMM yyyy HH:mm:ss 'GMT'"],
    ['Sat Nov  6 08:49:37 1994', 'EEE MMM  d HH:mm:ss yyyy'],
  ])(
    'create.test.js:943: "%s" throws, the weekday contradicts the date (a parsed weekday must agree, §6.3)',
    (text, pattern) => {
      expect(() => LocalDateTime.parse(text, pattern)).toThrow(DaisyParseError);
    },
  );

  it('create.test.js:943: "Saturday, 06-Nov-94" parses as 2094-11-06, a Saturday (yy is 2000–2099, §6.3)', () => {
    expect(
      LocalDateTime.parse('Saturday, 06-Nov-94 08:49:37 GMT', "EEEE, dd-MMM-yy HH:mm:ss 'GMT'"),
    ).toEqual(dateTime('2094-11-06T08:49:37'));
  });
});
