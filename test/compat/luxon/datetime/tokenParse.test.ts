import { describe, expect, it } from 'vitest';

import {
  DaisyError,
  DaisyFormatError,
  DaisyParseError,
  LocalDate,
  LocalDateTime,
} from '../../../../src';
import { de } from '../../../../src/locale/de';
import { en } from '../../../../src/locale/en';
import { es } from '../../../../src/locale/es';
import { fr } from '../../../../src/locale/fr';

const date = (text: string) => LocalDate.parse(text);
const dateTime = (text: string) => LocalDateTime.parse(text);

describe('Luxon datetime/tokenParse: date-times with a pattern', () => {
  it.each<[string, string, string, string]>([
    [
      'tokenParse.test.js:11: basic times',
      '1982/05/25 09:10:11.445',
      'yyyy/MM/dd HH:mm:ss.SSS',
      '1982-05-25T09:10:11.445',
    ],
    [
      'tokenParse.test.js:28: variable-length input (Luxon S is SSS here)',
      '1982/05/03 09:07:05.004',
      'y/M/d H:m:s.SSS',
      '1982-05-03T09:07:05.004',
    ],
    ['tokenParse.test.js:48: 9 PM', '1982/05/25 9 PM', 'yyyy/MM/dd h a', '1982-05-25T21:00'],
    ['tokenParse.test.js:54: 9 AM', '1982/05/25 9 AM', 'yyyy/MM/dd h a', '1982-05-25T09:00'],
    ['tokenParse.test.js:60: 12 AM', '1982/05/25 12 AM', 'yyyy/MM/dd h a', '1982-05-25T00:00'],
    ['tokenParse.test.js:66: 12 PM', '1982/05/25 12 PM', 'yyyy/MM/dd h a', '1982-05-25T12:00'],
    [
      'tokenParse.test.js:85: 8:30 AM',
      '1982/05/25 8:30 AM',
      'yyyy/MM/dd h:mm a',
      '1982-05-25T08:30',
    ],
    [
      'tokenParse.test.js:86: 12:30 AM',
      '1982/05/25 12:30 AM',
      'yyyy/MM/dd h:mm a',
      '1982-05-25T00:30',
    ],
    [
      'tokenParse.test.js:87: 12:30 PM',
      '1982/05/25 12:30 PM',
      'yyyy/MM/dd h:mm a',
      '1982-05-25T12:30',
    ],
    [
      'tokenParse.test.js:88: 1:00 PM',
      '1982/05/25 1:00 PM',
      'yyyy/MM/dd h:mm a',
      '1982-05-25T13:00',
    ],
    ['tokenParse.test.js:176: H', '2000-01-01 5', 'yyyy-MM-dd H', '2000-01-01T05:00'],
    ['tokenParse.test.js:177: H', '2000-01-01 13', 'yyyy-MM-dd H', '2000-01-01T13:00'],
    ['tokenParse.test.js:178: HH', '2000-01-01 05', 'yyyy-MM-dd HH', '2000-01-01T05:00'],
    ['tokenParse.test.js:179: HH', '2000-01-01 13', 'yyyy-MM-dd HH', '2000-01-01T13:00'],
    [
      'tokenParse.test.js:185: S reads 123',
      '2000-01-01 00:00:00.123',
      'yyyy-MM-dd HH:mm:ss.S',
      '2000-01-01T00:00:00.123',
    ],
    [
      'tokenParse.test.js:194: SSS',
      '2000-01-01 00:00:00.123',
      'yyyy-MM-dd HH:mm:ss.SSS',
      '2000-01-01T00:00:00.123',
    ],
    [
      'tokenParse.test.js:195: SSS',
      '2000-01-01 00:00:00.023',
      'yyyy-MM-dd HH:mm:ss.SSS',
      '2000-01-01T00:00:00.023',
    ],
    [
      'tokenParse.test.js:200: u is S',
      '2000-01-01 00:00:00.1',
      'yyyy-MM-dd HH:mm:ss.S',
      '2000-01-01T00:00:00.100',
    ],
    [
      'tokenParse.test.js:201: u is S',
      '2000-01-01 00:00:00.12',
      'yyyy-MM-dd HH:mm:ss.S',
      '2000-01-01T00:00:00.120',
    ],
    [
      'tokenParse.test.js:202: u is S',
      '2000-01-01 00:00:00.123',
      'yyyy-MM-dd HH:mm:ss.S',
      '2000-01-01T00:00:00.123',
    ],
    [
      'tokenParse.test.js:203: u is S',
      '2000-01-01 00:00:00.023',
      'yyyy-MM-dd HH:mm:ss.S',
      '2000-01-01T00:00:00.023',
    ],
    [
      'tokenParse.test.js:204: u is S',
      '2000-01-01 00:00:00.003',
      'yyyy-MM-dd HH:mm:ss.S',
      '2000-01-01T00:00:00.003',
    ],
    [
      'tokenParse.test.js:209: uu is SS',
      '2000-01-01 00:00:00.12',
      'yyyy-MM-dd HH:mm:ss.SS',
      '2000-01-01T00:00:00.120',
    ],
    [
      'tokenParse.test.js:210: uu is SS',
      '2000-01-01 00:00:00.02',
      'yyyy-MM-dd HH:mm:ss.SS',
      '2000-01-01T00:00:00.020',
    ],
    [
      'tokenParse.test.js:213: uuu is S',
      '2000-01-01 00:00:00.1',
      'yyyy-MM-dd HH:mm:ss.S',
      '2000-01-01T00:00:00.100',
    ],
    [
      'tokenParse.test.js:496: literals',
      '1982/05/25 hello 09:10:11.445',
      "yyyy/MM/dd 'hello' HH:mm:ss.SSS",
      '1982-05-25T09:10:11.445',
    ],
    [
      'tokenParse.test.js:818: matching weekday',
      'Wed 2017-11-29 02:00',
      'EEE yyyy-MM-dd HH:mm',
      '2017-11-29T02:00',
    ],
  ])('%s: %j with %j', (_source, text, pattern, expected) => {
    expect(LocalDateTime.parse(text, pattern)).toEqual(dateTime(expected));
  });

  it.each<[string, string, string]>([
    ['tokenParse.test.js:102: es', '10:45 a. m.', '2000-01-01T10:45'],
    ['tokenParse.test.js:107: es', '10:45 p. m.', '2000-01-01T22:45'],
  ])('%s: %j with hh:mm a', (_source, time, expected) => {
    expect(LocalDateTime.parse(`2000-01-01 ${time}`, 'yyyy-MM-dd hh:mm a', { locale: es })).toEqual(
      dateTime(expected),
    );
  });

  it.each<[string, string, string]>([
    ['tokenParse.test.js:79', '1982/05/25 18:30 AM', 'yyyy/MM/dd h:mm a'],
    ['tokenParse.test.js:80', '1982/05/25 16:00 PM', 'yyyy/MM/dd h:mm a'],
    ['tokenParse.test.js:81', '1982/05/25 0:30 AM', 'yyyy/MM/dd h:mm a'],
    ['tokenParse.test.js:82', '1982/05/25 13:00 PM', 'yyyy/MM/dd h:mm a'],
    ['tokenParse.test.js:186: S', '2000-01-01 00:00:00.1234', 'yyyy-MM-dd HH:mm:ss.S'],
    ['tokenParse.test.js:192: SSS', '2000-01-01 00:00:00.1', 'yyyy-MM-dd HH:mm:ss.SSS'],
    ['tokenParse.test.js:193: SSS', '2000-01-01 00:00:00.12', 'yyyy-MM-dd HH:mm:ss.SSS'],
    ['tokenParse.test.js:196: SSS', '2000-01-01 00:00:00.1234', 'yyyy-MM-dd HH:mm:ss.SSS'],
    ['tokenParse.test.js:211: uu', '2000-01-01 00:00:00.-33', 'yyyy-MM-dd HH:mm:ss.SS'],
    ['tokenParse.test.js:214: uuu', '2000-01-01 00:00:00.-2', 'yyyy-MM-dd HH:mm:ss.S'],
    ['tokenParse.test.js:821: weekday mismatch', 'Thu 2017-11-29 02:00', 'EEE yyyy-MM-dd HH:mm'],
  ])('%s: rejects %j with %j', (_source, text, pattern) => {
    expect(() => LocalDateTime.parse(text, pattern)).toThrow(DaisyError);
  });
});

describe('Luxon datetime/tokenParse: conflicting specifications', () => {
  it('tokenParse.test.js:73: throws if you specify meridiem with 24-hour time', () => {
    expect(() => LocalDateTime.parse('2000-01-01 0930PM', 'yyyy-MM-dd HHmma')).toThrow(
      DaisyFormatError,
    );
  });
});

describe('Luxon datetime/tokenParse: dates with a pattern', () => {
  it.each<[string, string, string, string]>([
    ['tokenParse.test.js:128: y', '2-01-01', 'y-MM-dd', '0002-01-01'],
    ['tokenParse.test.js:129: y', '22-01-01', 'y-MM-dd', '0022-01-01'],
    ['tokenParse.test.js:130: y', '222-01-01', 'y-MM-dd', '0222-01-01'],
    ['tokenParse.test.js:131: y', '2222-01-01', 'y-MM-dd', '2222-01-01'],
    ['tokenParse.test.js:140: yyyyy', '22222-01-01', 'yyyyy-MM-dd', '+022222-01-01'],
    ['tokenParse.test.js:147: yyyyyy', '222222-01-01', 'yyyyyy-MM-dd', '+222222-01-01'],
    ['tokenParse.test.js:148: yyyyyy', '022222-01-01', 'yyyyyy-MM-dd', '+022222-01-01'],
    ['tokenParse.test.js:153: yy', '60-01-01', 'yy-MM-dd', '2060-01-01'],
    ['tokenParse.test.js:221: ccc is EEE', 'Fri 1982-05-28', 'EEE yyyy-MM-dd', '1982-05-28'],
    ['tokenParse.test.js:222: ccc is EEE', 'Fri 1982-05-28', 'EEE yyyy-MM-dd', '1982-05-28'],
    ['tokenParse.test.js:224: EEEE', 'Friday 1982-05-28', 'EEEE yyyy-MM-dd', '1982-05-28'],
    ['tokenParse.test.js:225: cccc', 'Friday 1982-05-28', 'EEEE yyyy-MM-dd', '1982-05-28'],
    ['tokenParse.test.js:240: d', 'Mar 3, 2020', 'MMM d, yyyy', '2020-03-03'],
    ['tokenParse.test.js:243: d', 'Mar 13, 2020', 'MMM d, yyyy', '2020-03-13'],
    ['tokenParse.test.js:248: dd', 'Mar 03, 2020', 'MMM dd, yyyy', '2020-03-03'],
    ['tokenParse.test.js:251: dd', 'Mar 13, 2020', 'MMM dd, yyyy', '2020-03-13'],
    ['tokenParse.test.js:256: LLLL', 'May 25 1982', 'LLLL dd yyyy', '1982-05-25'],
    ['tokenParse.test.js:261: LLL', 'Sep 25 1982', 'LLL dd yyyy', '1982-09-25'],
    ['tokenParse.test.js:266: L', '5 25 1982', 'L dd yyyy', '1982-05-25'],
    ['tokenParse.test.js:271: LL', '05 25 1982', 'LL dd yyyy', '1982-05-25'],
    ['tokenParse.test.js:288: MMMM', 'May 25 1982', 'MMMM dd yyyy', '1982-05-25'],
    ['tokenParse.test.js:293: MMM', 'Sep 25 1982', 'MMM dd yyyy', '1982-09-25'],
    ['tokenParse.test.js:298: M', '5 25 1982', 'M dd yyyy', '1982-05-25'],
    ['tokenParse.test.js:303: MM', '05 25 1982', 'MM dd yyyy', '1982-05-25'],
    [
      'tokenParse.test.js:372: weekday name',
      'Tuesday, 05/25/1982',
      'EEEE, LL/dd/yyyy',
      '1982-05-25',
    ],
    ['tokenParse.test.js:404: ooo is DDD', '2016 200', 'yyyy DDD', '2016-07-18'],
    ['tokenParse.test.js:408: ooo is DDD', '2016 200', 'yyyy DDD', '2016-07-18'],
    ['tokenParse.test.js:412: ooo is DDD', '2016 016', 'yyyy DDD', '2016-01-16'],
    ['tokenParse.test.js:416: o is D', '2016 200', 'yyyy D', '2016-07-18'],
    ['tokenParse.test.js:420: o is D', '2016 16', 'yyyy D', '2016-01-16'],
    ['tokenParse.test.js:515: q is Q', '2019Q1 01-15', "yyyy'Q'Q MM-dd", '2019-01-15'],
  ])('%s: %j with %j', (_source, text, pattern, expected) => {
    expect(LocalDate.parse(text, pattern)).toEqual(date(expected));
  });

  it.each<[string, string, string, string]>([
    ['tokenParse.test.js:276: fr LLLL', 'mai 25 1982', 'LLLL dd yyyy', '1982-05-25'],
    ['tokenParse.test.js:281: fr LLL', 'janv. 25 1982', 'LLL dd yyyy', '1982-01-25'],
    ['tokenParse.test.js:308: fr MMMM', 'mai 25 1982', 'MMMM dd yyyy', '1982-05-25'],
    ['tokenParse.test.js:313: fr MMM', 'janv. 25 1982', 'MMM dd yyyy', '1982-01-25'],
    ['tokenParse.test.js:351: fr, case-insensitive', 'Janv. 25 1982', 'LLL dd yyyy', '1982-01-25'],
    ['tokenParse.test.js:381: fr weekday', 'mardi, 05/25/1982', 'EEEE, LL/dd/yyyy', '1982-05-25'],
  ])('%s: %j with %j', (_source, text, pattern, expected) => {
    expect(LocalDate.parse(text, pattern, { locale: fr })).toEqual(date(expected));
  });

  it.each<[string, string, string]>([
    ['tokenParse.test.js:22: dd needs two digits', 'Mar 3, 2020', 'MMM dd, yyyy'],
    ['tokenParse.test.js:127: empty year', '-01-01', 'y-MM-dd'],
    ['tokenParse.test.js:134: 7-digit y', '2222222-01-01', 'y-MM-dd'],
    ['tokenParse.test.js:138: 3-digit yyyyy', '222-01-01', 'yyyyy-MM-dd'],
    ['tokenParse.test.js:142: 7-digit yyyyy', '2222222-01-01', 'yyyyy-MM-dd'],
    ['tokenParse.test.js:146: 4-digit yyyyyy', '2222-01-01', 'yyyyyy-MM-dd'],
    ['tokenParse.test.js:149: 7-digit yyyyyy', '2222222-01-01', 'yyyyyy-MM-dd'],
    ['tokenParse.test.js:378: wrong weekday', 'Monday, 05/25/1982', 'EEEE, LL/dd/yyyy'],
    ['tokenParse.test.js:508: unknown weekday', 'Splurk, 05/25/1982', 'EEEE, MM/dd/yyyy'],
    ['tokenParse.test.js:512: quarter aa', '2019Qaa 01-15', "yyyy'Q'QQ MM-dd"],
    ['tokenParse.test.js:513: quarter 00', '2019Q00 01-15', "yyyy'Q'QQ MM-dd"],
    ['tokenParse.test.js:514: quarter 0', '2019Q0 01-15', "yyyy'Q'Q MM-dd"],
    ['tokenParse.test.js:516: quarter 5', '2019Q5 01-15', "yyyy'Q'Q MM-dd"],
    ['tokenParse.test.js:525: unknown weekday', 'Giberish, 05/25/1982', 'EEEE, MM/dd/yyyy'],
    ['tokenParse.test.js:526: month 14', '14/25/1982', 'MM/dd/yyyy'],
    ['tokenParse.test.js:527: day 46', '05/46/1982', 'MM/dd/yyyy'],
  ])('%s: rejects %j with %j', (_source, text, pattern) => {
    expect(() => LocalDate.parse(text, pattern)).toThrow(DaisyError);
  });

  it.each<[string, string, string]>([
    ['tokenParse.test.js:344: no stray letter for the period', 'janvQ 25 1982', 'LLL dd yyyy'],
    ['tokenParse.test.js:524: English name in fr', 'Tuesday, 05/25/1982', 'EEEE, MM/dd/yyyy'],
  ])('%s: fr rejects %j with %j', (_source, text, pattern) => {
    expect(() => LocalDate.parse(text, pattern, { locale: fr })).toThrow(DaisyParseError);
  });
});

const presetSample = dateTime('2019-04-17T22:45:55.555');

describe('Luxon datetime/tokenParse: years with more than four digits', () => {
  it.each<[string, string, string]>([
    ['tokenParse.test.js:132', '22222-01-01', '+022222-01-01'],
    ['tokenParse.test.js:133', '222222-01-01', '+222222-01-01'],
  ])('%s: parses %j with y-MM-dd', (_source, text, expected) => {
    expect(LocalDate.parse(text, 'y-MM-dd')).toEqual(date(expected));
  });
});

describe('Luxon datetime/tokenParse: mixed units', () => {
  it('tokenParse.test.js:431: throws when a month contradicts the day of year', () => {
    expect(() => LocalDate.parse('2017 05 340', 'yyyy MM DDD')).toThrow(DaisyParseError);
  });
});

describe('Luxon datetime/tokenParse: presets read back what they write', () => {
  it.each<[string, string]>([
    ['tokenParse.test.js:739: D is short', 'short'],
    ['tokenParse.test.js:739: DD is medium', 'medium'],
    ['tokenParse.test.js:739: DDD is long', 'long'],
    ['tokenParse.test.js:739: DDDD is full', 'full'],
  ])('%s: the %s date preset in en and de', (_source, preset) => {
    for (const locale of [en, de]) {
      const text = presetSample.toLocalDate().format(preset, { locale });
      expect(LocalDate.parse(text, preset, { locale })).toEqual(date('2019-04-17'));
    }
  });

  it('tokenParse.test.js:739: FF is the medium date-time preset in en and de', () => {
    for (const locale of [en, de]) {
      const text = presetSample.format('medium', { locale });
      expect(LocalDateTime.parse(text, 'medium', { locale })).toEqual(
        dateTime('2019-04-17T22:45:55'),
      );
    }
  });
});

describe('Luxon datetime/tokenParse (differs from Luxon on purpose)', () => {
  it('tokenParse.test.js:37: yy is 2000–2099 and S reads a fraction (§6.3)', () => {
    expect(LocalDateTime.parse('82/5/3 9:7:5.4', 'yy/M/d H:m:s.S')).toEqual(
      dateTime('2082-05-03T09:07:05.400'),
    );
  });

  it.each<[string, string]>([
    ['tokenParse.test.js:103', '10:45 a. m'],
    ['tokenParse.test.js:104', '10:45 a m.'],
    ['tokenParse.test.js:105', '10:45 a m'],
    ['tokenParse.test.js:108', '10:45 p. m'],
    ['tokenParse.test.js:109', '10:45 p m.'],
    ['tokenParse.test.js:110', '10:45 p m'],
    ['tokenParse.test.js:114', '10:45 a. m.'],
    ['tokenParse.test.js:115', '10:45 a. m'],
    ['tokenParse.test.js:116', '10:45 a m.'],
    ['tokenParse.test.js:117', '10:45 a m'],
    ['tokenParse.test.js:119', '10:45 p. m.'],
    ['tokenParse.test.js:120', '10:45 p. m'],
    ['tokenParse.test.js:121', '10:45 p m.'],
    ['tokenParse.test.js:122', '10:45 p m'],
  ])(
    '%s: es day periods must be typed as a. m. / p. m. with plain spaces (§6.1): %j throws',
    (_source, time) => {
      expect(() =>
        LocalDateTime.parse(`2000-01-01 ${time}`, 'yyyy-MM-dd hh:mm a', { locale: es }),
      ).toThrow(DaisyParseError);
    },
  );

  it.each<[string, string, string, string]>([
    ['tokenParse.test.js:139: 4-digit yyyyy', '2222-01-01', 'yyyyy-MM-dd', '2222-01-01'],
    ['tokenParse.test.js:155: 4-digit yy', '1960-01-01', 'yy-MM-dd', '1960-01-01'],
  ])(
    '%s: strict mode needs the exact digit count (§6.3), lenient mode reads %j',
    (_source, text, pattern, expected) => {
      expect(() => LocalDate.parse(text, pattern)).toThrow(DaisyParseError);
      expect(LocalDate.parse(text, pattern, { strict: false })).toEqual(date(expected));
    },
  );

  it('tokenParse.test.js:141: 6-digit yyyyy is more than the 5 digits of the width (§6.3)', () => {
    expect(() => LocalDate.parse('222222-01-01', 'yyyyy-MM-dd')).toThrow(DaisyParseError);
  });

  it('tokenParse.test.js:154: yy 61 is 2061, not 1961 (yy = 2000–2099, §6.3)', () => {
    expect(LocalDate.parse('61-01-01', 'yy-MM-dd')).toEqual(date('2061-01-01'));
  });

  it.each<[string, string]>([
    ['tokenParse.test.js:172', 'yyyy-MM-dd h'],
    ['tokenParse.test.js:173', 'yyyy-MM-dd h'],
    ['tokenParse.test.js:174', 'yyyy-MM-dd hh'],
    ['tokenParse.test.js:175', 'yyyy-MM-dd hh'],
  ])('%s: h needs a in the pattern (§6.3): %j throws', (_source, pattern) => {
    expect(() => LocalDateTime.parse('2000-01-01 05', pattern)).toThrow(DaisyFormatError);
  });

  it.each<[string, string, string]>([
    ['tokenParse.test.js:183: Luxon S 1 is 1 ms', '1', '2000-01-01T00:00:00.100'],
    ['tokenParse.test.js:184: Luxon S 12 is 12 ms', '12', '2000-01-01T00:00:00.120'],
    ['tokenParse.test.js:188: Luxon S 1 is 1 ms', '1', '2000-01-01T00:00:00.100'],
    ['tokenParse.test.js:189: Luxon S 12 is 12 ms', '12', '2000-01-01T00:00:00.120'],
  ])('%s: S reads a fraction (§6.3), so .%s is %s', (_source, digits, expected) => {
    expect(LocalDateTime.parse(`2000-01-01 00:00:00.${digits}`, 'yyyy-MM-dd HH:mm:ss.S')).toEqual(
      dateTime(expected),
    );
  });

  it.each<[string, string]>([
    ['tokenParse.test.js:205', '1234'],
    ['tokenParse.test.js:206', '1235'],
  ])(
    '%s: a fraction finer than milliseconds is rejected, not truncated (§5.3): .%s',
    (_source, digits) => {
      expect(() =>
        LocalDateTime.parse(`2000-01-01 00:00:00.${digits}`, 'yyyy-MM-dd HH:mm:ss.S'),
      ).toThrow(DaisyParseError);
    },
  );

  it('tokenParse.test.js:208: uu is SS, which needs two digits in strict mode (§6.3)', () => {
    expect(() => LocalDateTime.parse('2000-01-01 00:00:00.1', 'yyyy-MM-dd HH:mm:ss.SS')).toThrow(
      DaisyParseError,
    );
  });

  it.each<[string, string, string]>([
    ['tokenParse.test.js:218: E number is e', '5 1982-05-28', 'e yyyy-MM-dd'],
    ['tokenParse.test.js:219: c number', '5 1982-05-28', 'c yyyy-MM-dd'],
    ['tokenParse.test.js:362: E number is e', '2, 05/25/1982', 'e, LL/dd/yyyy'],
    ['tokenParse.test.js:367: E number is e', '1, 05/25/1982', 'e, LL/dd/yyyy'],
    ['tokenParse.test.js:398: E number is e', '3 2004-01-07', 'e yyyy-MM-dd'],
    ['tokenParse.test.js:427: WW is ww', '2017 34', 'yyyy ww'],
    ['tokenParse.test.js:436: kkkk is YYYY', '2004', 'YYYY'],
    ['tokenParse.test.js:441: kk is YY', '04', 'YY'],
    ['tokenParse.test.js:448: kk is YY', '60', 'YY'],
    ['tokenParse.test.js:449: kk is YY', '61', 'YY'],
    ['tokenParse.test.js:450: kk is YY', '1960', 'YY'],
    ['tokenParse.test.js:469: WW is ww', '17', 'ww'],
    ['tokenParse.test.js:474: W is w', '17', 'w'],
    ['tokenParse.test.js:481: kkkk WW E', '2004 17 2', 'YYYY ww e'],
  ])(
    '%s: week fields and numeric weekdays are format-only (§6.3): %j with %j throws',
    (_source, text, pattern) => {
      expect(() => LocalDate.parse(text, pattern)).toThrow(DaisyFormatError);
    },
  );

  it.each<[string, string, string]>([
    ['tokenParse.test.js:320: q', '1982Q2', "yyyy'Q'Q"],
    ['tokenParse.test.js:324: q', '2019Q1', "yyyy'Q'Q"],
    ['tokenParse.test.js:325: q', '2019Q2', "yyyy'Q'Q"],
    ['tokenParse.test.js:326: q', '2019Q3', "yyyy'Q'Q"],
    ['tokenParse.test.js:327: q', '2019Q4', "yyyy'Q'Q"],
    ['tokenParse.test.js:328: qq', '2019Q01', "yyyy'Q'QQ"],
    ['tokenParse.test.js:329: qq', '2019Q02', "yyyy'Q'QQ"],
    ['tokenParse.test.js:330: qq', '2019Q03', "yyyy'Q'QQ"],
    ['tokenParse.test.js:331: qq', '2019Q04', "yyyy'Q'QQ"],
    ['tokenParse.test.js:391: weekday alone', 'Monday', 'EEEE'],
    ['tokenParse.test.js:488: weekday alone', 'Monday', 'EEEE'],
  ])(
    '%s: a parse pattern needs a year plus month and day or D (§6.3): %j with %j throws',
    (_source, text, pattern) => {
      expect(() => LocalDate.parse(text, pattern)).toThrow(DaisyFormatError);
    },
  );

  it('tokenParse.test.js:335: fr month names need their period (exact names, §6.3)', () => {
    expect(() => LocalDate.parse('janv 25 1982', 'LLL dd yyyy', { locale: fr })).toThrow(
      DaisyParseError,
    );
  });

  it('tokenParse.test.js:523: the numeric weekday e is format-only (§6.3)', () => {
    expect(() => LocalDate.parse('8, 05/25/1982', 'e, MM/dd/yyyy', { locale: fr })).toThrow(
      DaisyFormatError,
    );
  });

  it.each<[string, string]>([
    ['tokenParse.test.js:739: FFF is long', 'long'],
    ['tokenParse.test.js:739: FFFF is full', 'full'],
  ])(
    '%s: the %s date-time preset has no zone name, so it reads back in en and de',
    (_source, preset) => {
      for (const locale of [en, de]) {
        const text = presetSample.format(preset, { locale });
        expect(LocalDateTime.parse(text, preset, { locale })).toEqual(
          dateTime('2019-04-17T22:45:55'),
        );
      }
    },
  );

  it('tokenParse.test.js:814: without a pattern, parse reads ISO 8601 and rejects "yo"', () => {
    expect(() => LocalDateTime.parse('yo')).toThrow(DaisyParseError);
  });
});
