import { describe, expect, it } from 'vitest';

import { LocalDate, LocalDateTime } from '../../../../src';
import { es } from '../../../../src/locale/es';
import { fr } from '../../../../src/locale/fr';

const LUXON_FIXTURE = LocalDateTime.parse('1982-05-25T09:23:54.123');

const LOCALES = { es, fr } as const;

type LocaleCode = keyof typeof LOCALES;

describe('Luxon datetime/format: ISO, SQL and HTTP text', () => {
  it.each<[string, LocalDate, string]>([
    ['format.test.js:182 (toISODate)', LUXON_FIXTURE.toLocalDate(), '1982-05-25'],
    ['format.test.js:199 (toISODate)', LocalDate.of(118040, 5, 25), '+118040-05-25'],
    ['format.test.js:202 (toISODate)', LocalDate.of(-118040, 5, 25), '-118040-05-25'],
    ['format.test.js:207 (toISODate)', LocalDate.of(-1, 1, 1), '-000001-01-01'],
    ['format.test.js:210 (toISODate)', LocalDate.of(-10, 1, 1), '-000010-01-01'],
    ['format.test.js:369 (toSQLDate)', LUXON_FIXTURE.toLocalDate(), '1982-05-25'],
  ])('%s: %s.toString() is %j', (_source, value, expected) => {
    expect(value.toString()).toBe(expected);
  });

  it.each<[string, LocalDateTime, string, string]>([
    ['format.test.js:190 (toISODate basic)', LUXON_FIXTURE, 'yyyyMMdd', '19820525'],
    ['format.test.js:235 (toISOWeekDate)', LUXON_FIXTURE, "YYYY-'W'ww-e", '1982-W21-2'],
    [
      'format.test.js:278 (toISOTime without offset)',
      LUXON_FIXTURE,
      'HH:mm:ss.SSS',
      '09:23:54.123',
    ],
    [
      'format.test.js:355 (toHTTP)',
      LUXON_FIXTURE,
      "EEE, dd MMM yyyy HH:mm:ss 'GMT'",
      'Tue, 25 May 1982 09:23:54 GMT',
    ],
    [
      'format.test.js:357 (toHTTP)',
      LUXON_FIXTURE.plusHours(10),
      "EEE, dd MMM yyyy HH:mm:ss 'GMT'",
      'Tue, 25 May 1982 19:23:54 GMT',
    ],
    [
      'format.test.js:387 (toSQLTime without offset)',
      LUXON_FIXTURE,
      'HH:mm:ss.SSS',
      '09:23:54.123',
    ],
    [
      'format.test.js:424 (toSQL without offset)',
      LUXON_FIXTURE,
      'yyyy-MM-dd HH:mm:ss.SSS',
      '1982-05-25 09:23:54.123',
    ],
  ])('%s: %s with %j is %j', (_source, value, pattern, expected) => {
    expect(value.format(pattern)).toBe(expected);
  });
});

describe('Luxon datetime/format: toLocaleString', () => {
  it.each<[string, LocalDateTime, string, string]>([
    ['format.test.js:456 (default, en-US)', LUXON_FIXTURE, 'M/d/yyyy', '5/25/1982'],
    ['format.test.js:552 (TIME_SIMPLE, en-US)', LUXON_FIXTURE, 'h:mm a', '9:23 AM'],
    ['format.test.js:553 (TIME_24_SIMPLE, en-US)', LUXON_FIXTURE, 'HH:mm', '09:23'],
  ])('%s: %s with %j is %j', (_source, value, pattern, expected) => {
    expect(value.format(pattern)).toBe(expected);
  });

  it('format.test.js:476: { weekday: "short" } contains Tue, like EEE', () => {
    expect(LUXON_FIXTURE.format('EEE')).toContain('Tue');
  });

  it.each<[string, LocalDateTime, string, LocaleCode, string]>([
    ['format.test.js:556 (TIME_SIMPLE)', LUXON_FIXTURE, 'HH:mm', 'fr', '09:23'],
    ['format.test.js:557 (TIME_24_SIMPLE)', LUXON_FIXTURE, 'HH:mm', 'fr', '09:23'],
    ['format.test.js:560 (TIME_SIMPLE)', LUXON_FIXTURE, 'H:mm', 'es', '9:23'],
    ['format.test.js:561 (TIME_24_SIMPLE)', LUXON_FIXTURE, 'H:mm', 'es', '9:23'],
  ])('%s: %s with %j in %s is %j', (_source, value, pattern, localeCode, expected) => {
    expect(value.format(pattern, { locale: LOCALES[localeCode] })).toBe(expected);
  });

  it('format.test.js:480: the fr short date preset gives 25/05/1982', () => {
    expect(LUXON_FIXTURE.toLocalDate().format('short', { locale: fr })).toBe('25/05/1982');
  });
});

describe('Luxon datetime/format (differs from Luxon on purpose)', () => {
  it.each<[string, LocalDateTime, string]>([
    ['format.test.js:72 (toJSON)', LUXON_FIXTURE, '1982-05-25T09:23:54.123'],
    ['format.test.js:94 (suppressMilliseconds)', LUXON_FIXTURE, '1982-05-25T09:23:54.123'],
    [
      'format.test.js:95 (suppressMilliseconds)',
      LUXON_FIXTURE.withMillisecond(0),
      '1982-05-25T09:23:54',
    ],
    [
      'format.test.js:98 (suppressSeconds)',
      LUXON_FIXTURE.withMillisecond(0),
      '1982-05-25T09:23:54',
    ],
    [
      'format.test.js:99 (suppressSeconds)',
      LUXON_FIXTURE.withSecond(0).withMillisecond(0),
      '1982-05-25T09:23:00',
    ],
    [
      'format.test.js:102 (suppressSeconds)',
      LUXON_FIXTURE.withSecond(0),
      '1982-05-25T09:23:00.123',
    ],
    [
      'format.test.js:103 (suppressSeconds)',
      LUXON_FIXTURE.withSecond(0).withMillisecond(0),
      '1982-05-25T09:23:00',
    ],
    ['format.test.js:121 (toISO)', LUXON_FIXTURE.withYear(12345), '+012345-05-25T09:23:54.123'],
    ['format.test.js:126 (toISO)', LUXON_FIXTURE.withYear(-12345), '-012345-05-25T09:23:54.123'],
  ])(
    '%s: toString has no offset (§2) and always writes seconds, milliseconds only when not zero (§5.3): %s is %j',
    (_source, value, expected) => {
      expect(value.toString()).toBe(expected);
      expect(value.toJSON()).toBe(expected);
    },
  );

  it.each<[string, LocalDateTime, string]>([
    ['format.test.js:246 (toISOTime)', LUXON_FIXTURE, '09:23:54.123'],
    ['format.test.js:250 (toISOTime)', LUXON_FIXTURE.truncatedTo('minute'), '09:23:00.000'],
    ['format.test.js:254 (toISOTime)', LUXON_FIXTURE.truncatedTo('second'), '09:23:54.000'],
  ])(
    '%s: values carry no zone (§2), so there is no Z: %s with HH:mm:ss.SSS is %j',
    (_source, value, expected) => {
      expect(value.format('HH:mm:ss.SSS')).toBe(expected);
    },
  );
});
