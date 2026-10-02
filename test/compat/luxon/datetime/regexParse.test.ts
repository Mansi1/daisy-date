import { describe, expect, it } from 'vitest';

import { DaisyFormatError, DaisyParseError, LocalDate, LocalDateTime } from '../../../../src';

const dateTime = (text: string) => LocalDateTime.parse(text);

describe('Luxon datetime/regexParse: ISO 8601 without a pattern', () => {
  it.each<[string, string, string]>([
    [
      'regexParse.test.js:11: local by default',
      '2016-05-25T09:08:34.123',
      '2016-05-25T09:08:34.123',
    ],
    ['regexParse.test.js:238: hour:minute', '2016-05-25T09:24', '2016-05-25T09:24:00'],
    ['regexParse.test.js:260: hour:minute:second', '2016-05-25T09:24:15', '2016-05-25T09:24:15'],
    ['regexParse.test.js:282: milliseconds', '2016-05-25T09:24:15.123', '2016-05-25T09:24:15.123'],
    ['regexParse.test.js:322: milliseconds', '2016-05-25T09:24:15.023', '2016-05-25T09:24:15.023'],
    ['regexParse.test.js:364: deciseconds', '2016-05-25T09:24:15.1', '2016-05-25T09:24:15.100'],
  ])('%s: %j', (_source, text, expected) => {
    expect(LocalDateTime.parse(text).toString()).toBe(expected);
  });

  it.each<[string, string, [number, number, number]]>([
    ['regexParse.test.js:180: year-month-day', '2016-05-25', [2016, 5, 25]],
    ['regexParse.test.js:204: extended year', '+002016-05-25', [2016, 5, 25]],
    ['regexParse.test.js:214: negative extended year', '-002016-05-25', [-2016, 5, 25]],
  ])('%s: %j', (_source, text, [year, month, day]) => {
    expect(LocalDate.parse(text)).toEqual(LocalDate.of(year, month, day));
  });

  it.each<[string, string]>([
    ['regexParse.test.js:714', ''],
    ['regexParse.test.js:715', ' '],
    ['regexParse.test.js:716', '2016-1'],
    ['regexParse.test.js:717', '2016-1-15'],
    ['regexParse.test.js:718', '2016-01-5'],
    ['regexParse.test.js:719', '2016-01-00'],
    ['regexParse.test.js:720', '2016-00-01'],
    ['regexParse.test.js:728', '2016-W32-02'],
  ])('%s: rejects the date %j', (_source, text) => {
    expect(() => LocalDate.parse(text)).toThrow(DaisyParseError);
  });

  it.each<[string, string]>([
    ['regexParse.test.js:557', '2018-05-25T24:23'],
    ['regexParse.test.js:721', '2016-05-25 08:34:34'],
    ['regexParse.test.js:722', '2016-05-25Q08:34:34'],
    ['regexParse.test.js:723', '2016-05-25T8:04:34'],
    ['regexParse.test.js:724', '2016-05-25T08:4:34'],
    ['regexParse.test.js:725', '2016-05-25T08:04:4'],
    ['regexParse.test.js:726', '2016-05-25T:03:4'],
    ['regexParse.test.js:727', '2016-05-25T08::4'],
  ])('%s: rejects the date-time %j', (_source, text) => {
    expect(() => LocalDateTime.parse(text)).toThrow(DaisyParseError);
  });
});

describe('Luxon datetime/regexParse: HTTP and SQL text via patterns', () => {
  it.each<[string, string, string, string]>([
    [
      'regexParse.test.js:853: RFC 1123',
      'Sun, 06 Nov 1994 08:49:37 GMT',
      "EEE, dd MMM yyyy HH:mm:ss 'GMT'",
      '1994-11-06T08:49:37',
    ],
    [
      'regexParse.test.js:881: RFC 850 on a Wednesday',
      'Wednesday, 29-Jun-22 08:49:37 GMT',
      "EEEE, dd-MMM-yy HH:mm:ss 'GMT'",
      '2022-06-29T08:49:37',
    ],
    [
      'regexParse.test.js:895: asctime with one date digit',
      'Sun Nov  6 08:49:37 1994',
      'EEE MMM  d HH:mm:ss yyyy',
      '1994-11-06T08:49:37',
    ],
    [
      'regexParse.test.js:909: asctime with two date digits',
      'Wed Nov 16 08:49:37 1994',
      'EEE MMM d HH:mm:ss yyyy',
      '1994-11-16T08:49:37',
    ],
    [
      'regexParse.test.js:807: RFC 2822 with Z',
      '01 Nov 2016 13:23:12 Z',
      "dd MMM yyyy HH:mm:ss 'Z'",
      '2016-11-01T13:23:12',
    ],
    [
      'regexParse.test.js:835: RFC 2822 with UT',
      '01 Nov 2016 13:23:12 UT',
      "dd MMM yyyy HH:mm:ss 'UT'",
      '2016-11-01T13:23:12',
    ],
    [
      'regexParse.test.js:997: SQL deciseconds',
      '2016-05-14 10:23:54.1',
      'yyyy-MM-dd HH:mm:ss.S',
      '2016-05-14T10:23:54.100',
    ],
    [
      'regexParse.test.js:1011: SQL without fraction',
      '2016-05-14 10:23:54',
      'yyyy-MM-dd HH:mm:ss',
      '2016-05-14T10:23:54',
    ],
  ])('%s: %j with %j', (_source, text, pattern, expected) => {
    expect(LocalDateTime.parse(text, pattern)).toEqual(dateTime(expected));
  });

  it('regexParse.test.js:927: an SQL date is an ISO date', () => {
    expect(LocalDate.parse('2016-05-14')).toEqual(LocalDate.of(2016, 5, 14));
  });
});

describe('Luxon datetime/regexParse: 24:00 (differs from Luxon on purpose: PROJECT.md §5.3 rejects the end-of-day form)', () => {
  it('regexParse.test.js:544: 2018-01-04T24:00 is rejected instead of rolling over', () => {
    expect(() => LocalDateTime.parse('2018-01-04T24:00')).toThrow(DaisyParseError);
  });
});

describe('Luxon datetime/regexParse (differs from Luxon on purpose)', () => {
  it.each<[string, string]>([
    ['regexParse.test.js:144: year only', '2016'],
    ['regexParse.test.js:156: year-month', '2016-05'],
    ['regexParse.test.js:168: basic year-month', '201605'],
    ['regexParse.test.js:192: basic year-month-day', '20160525'],
    ['regexParse.test.js:376: week date', '2016-W21'],
    ['regexParse.test.js:388: week date with day', '2016-W21-3'],
    ['regexParse.test.js:398: basic week date', '2016W213'],
    ['regexParse.test.js:432: ordinal date', '2016-200'],
    ['regexParse.test.js:442: basic ordinal date', '2016200'],
    ['regexParse.test.js:699: week date without a day dash', '2016-W213'],
  ])(
    '%s: parse without a pattern only reads yyyy-MM-dd (§6.3, T15): %j throws',
    (_source, text) => {
      expect(() => LocalDate.parse(text)).toThrow(DaisyParseError);
    },
  );

  it.each<[string, string]>([
    ['regexParse.test.js:226: hour only', '2016-05-25T09'],
    ['regexParse.test.js:248: basic hour-minute', '2016-05-25T0924'],
    ['regexParse.test.js:270: basic time', '2016-05-25T092415'],
    ['regexParse.test.js:292: basic time with fraction', '2016-05-25T092415.123'],
    ['regexParse.test.js:302: comma fraction', '2016-05-25T09:24:15,123'],
    ['regexParse.test.js:410: week date-time', '2016-W21-3T09:24:15.123'],
    ['regexParse.test.js:420: basic week date-time', '2016W213T09:24:15.123'],
    ['regexParse.test.js:454: ordinal date-time', '2016-200T09:24:15.123'],
    ['regexParse.test.js:481: bare time', '09:24:15.123'],
    ['regexParse.test.js:494: bare time with comma', '09:24:15,123'],
    ['regexParse.test.js:507: bare time with seconds', '09:24:15'],
    ['regexParse.test.js:520: bare time', '09:24'],
    ['regexParse.test.js:533: bare time', '09:24'],
    ['regexParse.test.js:679: mixed basic and extended time', '2016-05-25T0924:15.123'],
    ['regexParse.test.js:689: mixed basic and extended time', '2016-05-25T09:2415.123'],
  ])(
    '%s: parse without a pattern only reads yyyy-MM-ddTHH:mm[:ss[.SSS]] (§5.3, T09): %j throws',
    (_source, text) => {
      expect(() => LocalDateTime.parse(text)).toThrow(DaisyParseError);
    },
  );

  it.each<[string, string]>([
    ['regexParse.test.js:312', '2016-05-25T09:24:15.1239999'],
    ['regexParse.test.js:333', '2016-05-25T09:24:15.3456'],
    ['regexParse.test.js:343', '2016-05-25T09:24:15.999999'],
    ['regexParse.test.js:354', '2016-05-25T09:24:15.12345678901234567890123456789'],
  ])(
    '%s: finer than milliseconds is rejected, not truncated (§5.3): %j throws',
    (_source, text) => {
      expect(() => LocalDateTime.parse(text)).toThrow(DaisyParseError);
    },
  );

  it('regexParse.test.js:867: RFC 850 yy is 2094, a Saturday, so "Sunday" is rejected (§6.3)', () => {
    expect(() =>
      LocalDateTime.parse('Sunday, 06-Nov-94 08:49:37 GMT', "EEEE, dd-MMM-yy HH:mm:ss 'GMT'"),
    ).toThrow(DaisyParseError);
  });

  it.each<[string, string, string]>([
    ['regexParse.test.js:941: SQL time', '04:12:00.123', 'HH:mm:ss.SSS'],
    ['regexParse.test.js:956: SQL time', '04:12:00', 'HH:mm:ss'],
  ])(
    '%s: a parse pattern needs a year plus month and day (§6.3): %j with %j throws',
    (_source, text, pattern) => {
      expect(() => LocalDateTime.parse(text, pattern)).toThrow(DaisyFormatError);
    },
  );

  it.each<[string, string]>([
    ['regexParse.test.js:971', '2016-05-14 10:23:54.2346'],
    ['regexParse.test.js:983', '2016-05-14 10:23:54.2341'],
  ])(
    '%s: SSS takes exactly 3 digits and nothing finer than milliseconds (§5.3, §6.3): %j throws',
    (_source, text) => {
      expect(() => LocalDateTime.parse(text, 'yyyy-MM-dd HH:mm:ss.SSS')).toThrow(DaisyParseError);
    },
  );
});
