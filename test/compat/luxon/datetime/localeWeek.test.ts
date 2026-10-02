import { describe, expect, it } from 'vitest';

import { LocalDate, LocalDateRange, LocalDateTime, en } from '../../../../src';
import type { DayOfWeek, Locale } from '../../../../src';
import { de } from '../../../../src/locale/de';

const date = (text: string) => LocalDate.parse(text);
const dateTime = (text: string) => LocalDateTime.parse(text);

const US_FIRST_DAY_OF_WEEK: DayOfWeek = 'sunday';
const enUS: Locale = { ...en, firstDayOfWeek: US_FIRST_DAY_OF_WEEK };

const LUXON_WEEK = [
  '2023-07-31',
  '2023-08-01',
  '2023-08-02',
  '2023-08-03',
  '2023-08-04',
  '2023-08-05',
  '2023-08-06',
].map((text) => dateTime(`${text}T00:00`));

const sameWeek = (value: LocalDateTime, other: LocalDateTime, firstDay: DayOfWeek) =>
  LocalDateRange.ofWeek(value.toLocalDate(), firstDay).contains(other.toLocalDate());

describe('Luxon datetime/localeWeek: start and end of a locale week', () => {
  it.each<[string, (value: LocalDateTime) => LocalDateTime, string, string]>([
    [
      'localeWeek.test.js:11: de-DE week starts on Monday',
      (value) => value.startOfWeek(de.firstDayOfWeek),
      '2023-06-14T13:00',
      '2023-06-12T00:00',
    ],
    [
      'localeWeek.test.js:11: en-US week starts on Sunday',
      (value) => value.startOfWeek(enUS.firstDayOfWeek),
      '2023-06-14T13:00',
      '2023-06-11T00:00',
    ],
    [
      'localeWeek.test.js:21: de-DE week start crosses into the previous year',
      (value) => value.startOfWeek(de.firstDayOfWeek),
      '2023-01-01T13:00',
      '2022-12-26T00:00',
    ],
    [
      'localeWeek.test.js:31: de-DE week ends on Sunday',
      (value) => value.endOfWeek(de.firstDayOfWeek),
      '2023-06-14T13:00',
      '2023-06-18T23:59:59.999',
    ],
    [
      'localeWeek.test.js:31: en-US week ends on Saturday',
      (value) => value.endOfWeek(enUS.firstDayOfWeek),
      '2023-06-14T13:00',
      '2023-06-17T23:59:59.999',
    ],
    [
      'localeWeek.test.js:41: de-DE week end crosses into the next year',
      (value) => value.endOfWeek(de.firstDayOfWeek),
      '2022-12-31T13:00',
      '2023-01-01T23:59:59.999',
    ],
  ])('%s', (_name, adjust, start, expected) => {
    expect(adjust(dateTime(start))).toEqual(dateTime(expected));
  });
});

describe('Luxon datetime/localeWeek: same week', () => {
  it.each<[string, string, string, DayOfWeek, boolean]>([
    [
      'localeWeek.test.js:51: en-US, Sunday and Wednesday',
      '2023-06-11T03:00',
      '2023-06-14T03:00',
      'sunday',
      true,
    ],
    [
      'localeWeek.test.js:51: en-US, Wednesday and Sunday',
      '2023-06-14T03:00',
      '2023-06-18T03:00',
      'sunday',
      false,
    ],
    [
      'localeWeek.test.js:61: the en-US week of Sunday 2023-06-11',
      '2023-06-11T03:00',
      '2023-06-14T03:00',
      'sunday',
      true,
    ],
    [
      'localeWeek.test.js:61: the de-DE week of Wednesday 2023-06-14',
      '2023-06-14T03:00',
      '2023-06-11T03:00',
      'monday',
      false,
    ],
  ])('%s', (_name, value, other, firstDay, expected) => {
    expect(sameWeek(dateTime(value), dateTime(other), firstDay)).toBe(expected);
  });
});

describe('Luxon datetime/localeWeek: weekends', () => {
  it('localeWeek.test.js:81: en-US weekend is Saturday and Sunday', () => {
    expect(LUXON_WEEK.map((value) => value.isWeekend({ weekend: en.weekend }))).toStrictEqual([
      false,
      false,
      false,
      false,
      false,
      true,
      true,
    ]);
  });

  it('localeWeek.test.js:88: a Friday and Saturday weekend, as in he', () => {
    expect(
      LUXON_WEEK.map((value) => value.isWeekend({ weekend: ['friday', 'saturday'] })),
    ).toStrictEqual([false, false, false, false, true, true, false]);
  });

  it('localeWeek.test.js:267: a Monday and Wednesday weekend', () => {
    expect(
      [
        '2022-01-31',
        '2022-02-01',
        '2022-02-02',
        '2022-02-03',
        '2022-02-04',
        '2022-02-05',
        '2022-02-06',
      ].map((text) => date(text).isWeekend({ weekend: ['monday', 'wednesday'] })),
    ).toStrictEqual([true, false, true, false, false, false, false]);
  });
});

describe('Luxon datetime/localeWeek: local weekday numbers', () => {
  it.each<[string, string, Locale, string]>([
    ['localeWeek.test.js:156: en-US Sunday is day 1', '2023-08-06', enUS, '1'],
    ['localeWeek.test.js:160: en-US Monday is day 2', '2023-08-07', enUS, '2'],
    ['localeWeek.test.js:164: en-US Tuesday is day 3', '2023-08-08', enUS, '3'],
    ['localeWeek.test.js:168: en-US Wednesday is day 4', '2023-08-09', enUS, '4'],
    ['localeWeek.test.js:172: en-US Thursday is day 5', '2023-08-10', enUS, '5'],
    ['localeWeek.test.js:176: en-US Friday is day 6', '2023-08-11', enUS, '6'],
    ['localeWeek.test.js:180: en-US Saturday is day 7', '2023-08-12', enUS, '7'],
    ['localeWeek.test.js:187: de-DE Monday is day 1', '2023-08-07', de, '1'],
    ['localeWeek.test.js:191: de-DE Tuesday is day 2', '2023-08-08', de, '2'],
    ['localeWeek.test.js:195: de-DE Wednesday is day 3', '2023-08-09', de, '3'],
    ['localeWeek.test.js:199: de-DE Thursday is day 4', '2023-08-10', de, '4'],
    ['localeWeek.test.js:203: de-DE Friday is day 5', '2023-08-11', de, '5'],
    ['localeWeek.test.js:207: de-DE Saturday is day 6', '2023-08-12', de, '6'],
    ['localeWeek.test.js:211: de-DE Sunday is day 7', '2023-08-13', de, '7'],
  ])('%s', (_name, text, locale, expected) => {
    expect(date(text).format('e', { locale })).toBe(expected);
  });

  it('localeWeek.test.js:278: with weeks starting on Sunday, Saturday 2022-01-01 is local weekday 7', () => {
    expect(date('2022-01-01').format('e', { locale: { ...de, firstDayOfWeek: 'sunday' } })).toBe(
      '7',
    );
  });

  it('localeWeek.test.js:286: with weeks starting on Sunday, local weekday 1 of 2022-01-01 is 2021-12-26', () => {
    expect(date('2022-01-01').startOfWeek('sunday')).toEqual(date('2021-12-26'));
  });
});
