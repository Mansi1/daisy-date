import { describe, expect, it } from 'vitest';

import { Duration, Period } from '../../../../src';
import { fr } from '../../../../src/locale/fr';

const fixturePeriod = Period.of({ years: 1, months: 2, weeks: 1, days: 3 });
const fixtureDuration = Duration.of({ hours: 4, minutes: 5, seconds: 6, milliseconds: 7 });
const zerosPeriod = Period.of({ years: 1, months: 0, weeks: 1, days: 0 });
const zerosDuration = Duration.of({ hours: 4, minutes: 0, seconds: 6, milliseconds: 0 });

describe('Luxon duration/format: toISO', () => {
  it.each<[string, Period, string]>([
    ['format.test.js:20: Duration#toISO fills out every field', fixturePeriod, 'P1Y2M1W3D'],
    [
      'format.test.js:38: Duration#toISO creates a minimal string (P3YT45S)',
      Period.ofYears(3),
      'P3Y',
    ],
    [
      'format.test.js:38: Duration#toISO creates a minimal string (P4MT45S)',
      Period.ofMonths(4),
      'P4M',
    ],
    ['format.test.js:38: Duration#toISO creates a minimal string (P5M)', Period.ofMonths(5), 'P5M'],
    ['format.test.js:45: Duration#toISO handles negative durations', Period.ofYears(-3), 'P-3Y'],
    [
      'format.test.js:49: Duration#toISO handles mixed negative/positive durations (P3YT-45S)',
      Period.ofYears(3),
      'P3Y',
    ],
    [
      'format.test.js:49: Duration#toISO handles mixed negative/positive durations (P-5YT34S)',
      Period.ofYears(-5),
      'P-5Y',
    ],
  ])('%s: date part', (_name, period, expected) => {
    expect(period.toString()).toBe(expected);
  });

  it.each<[string, Duration, string]>([
    ['format.test.js:20: Duration#toISO fills out every field', fixtureDuration, 'PT4H5M6.007S'],
    [
      'format.test.js:38: Duration#toISO creates a minimal string (P3YT45S)',
      Duration.ofSeconds(45),
      'PT45S',
    ],
    [
      'format.test.js:38: Duration#toISO creates a minimal string (PT5M)',
      Duration.ofMinutes(5),
      'PT5M',
    ],
    [
      'format.test.js:45: Duration#toISO handles negative durations',
      Duration.ofSeconds(-45),
      'PT-45S',
    ],
    [
      'format.test.js:49: Duration#toISO handles mixed negative/positive durations (P3YT-45S)',
      Duration.ofSeconds(-45),
      'PT-45S',
    ],
    [
      'format.test.js:49: Duration#toISO handles mixed negative/positive durations (PT-45S)',
      Duration.ofSeconds(-45),
      'PT-45S',
    ],
    [
      'format.test.js:49: Duration#toISO handles mixed negative/positive durations (P-5YT34S)',
      Duration.ofSeconds(34),
      'PT34S',
    ],
    [
      'format.test.js:55: Duration#toISO handles zero durations',
      Duration.ofMilliseconds(0),
      'PT0S',
    ],
    [
      'format.test.js:63: Duration#toISO handles milliseconds duration',
      Duration.ofMilliseconds(7),
      'PT0.007S',
    ],
    [
      'format.test.js:67: Duration#toISO handles seconds/milliseconds duration',
      Duration.of({ seconds: 17, milliseconds: 548 }),
      'PT17.548S',
    ],
    [
      'format.test.js:71: Duration#toISO handles negative seconds/milliseconds duration',
      Duration.of({ seconds: -17, milliseconds: -548 }),
      'PT-17.548S',
    ],
    [
      'format.test.js:75: Duration#toISO handles mixed negative/positive numbers in seconds/milliseconds durations',
      Duration.of({ seconds: 17, milliseconds: -548 }),
      'PT16.452S',
    ],
    [
      'format.test.js:75: Duration#toISO handles mixed negative/positive numbers in seconds/milliseconds durations',
      Duration.of({ seconds: -17, milliseconds: 548 }),
      'PT-16.452S',
    ],
  ])('%s: time part', (_name, duration, expected) => {
    expect(duration.toString()).toBe(expected);
  });
});

describe('Luxon duration/format: toMillis, toJSON, toString', () => {
  it('format.test.js:149: Duration#toMillis returns the value in milliseconds', () => {
    expect(Duration.ofMilliseconds(1000).toMillis()).toBe(1000);
  });

  it('format.test.js:158: Duration#toJSON returns the ISO representation', () => {
    expect(fixturePeriod.toJSON()).toBe('P1Y2M1W3D');
    expect(fixtureDuration.toJSON()).toBe('PT4H5M6.007S');
  });

  it('format.test.js:166: Duration#toString returns the ISO representation', () => {
    expect(fixturePeriod.toString()).toBe('P1Y2M1W3D');
    expect(fixtureDuration.toString()).toBe('PT4H5M6.007S');
  });
});

describe('Luxon duration/format: toHuman', () => {
  it('format.test.js:416: Duration#toHuman formats out a list', () => {
    expect(fixturePeriod.format({ list: 'unit' })).toBe('1 year, 2 months, 1 week, 3 days');
    expect(fixtureDuration.format({ list: 'unit' })).toBe(
      '4 hours, 5 minutes, 6 seconds, 7 milliseconds',
    );
  });

  it('format.test.js:422: Duration#toHuman only shows the units you have', () => {
    expect(Period.ofYears(3).format({ list: 'unit' })).toBe('3 years');
    expect(Duration.ofHours(4).format({ list: 'unit' })).toBe('4 hours');
  });

  it('format.test.js:426: Duration#toHuman accepts a listStyle', () => {
    expect(fixturePeriod.format({ list: 'conjunction' })).toBe(
      '1 year, 2 months, 1 week, and 3 days',
    );
    expect(fixtureDuration.format({ list: 'conjunction' })).toBe(
      '4 hours, 5 minutes, 6 seconds, and 7 milliseconds',
    );
  });

  it('format.test.js:438: Duration#toHuman accepts hiding of zero values', () => {
    expect(zerosPeriod.format({ list: 'unit', zeros: 'omit' })).toBe('1 year, 1 week');
    expect(zerosDuration.format({ list: 'unit', zeros: 'omit' })).toBe('4 hours, 6 seconds');
  });

  it('format.test.js:453: Duration#toHuman handles undefined showZeros', () => {
    expect(zerosPeriod.format({ list: 'unit', zeros: 'show' })).toBe(
      '1 year, 0 months, 1 week, 0 days',
    );
    expect(zerosDuration.format({ list: 'unit', zeros: 'show' })).toBe(
      '4 hours, 0 minutes, 6 seconds, 0 milliseconds',
    );
  });

  it('format.test.js:468: Duration#toHuman works in differt languages', () => {
    expect(fixturePeriod.format({ locale: fr, list: 'unit' })).toBe(
      '1 an, 2 mois, 1 semaine, 3 jours',
    );
    expect(fixtureDuration.format({ locale: fr, list: 'unit' })).toBe(
      '4 heures, 5 minutes, 6 secondes, 7 millisecondes',
    );
  });
});

describe('Luxon duration/format: toHuman with number format options', () => {
  it('format.test.js:432: the time half in the short style', () => {
    expect(fixtureDuration.format({ style: 'short', list: 'unit' })).toBe(
      '4 hr, 5 min, 6 sec, 7 ms',
    );
  });
});

describe('Luxon duration/format: toHuman with number format options (differs from Luxon on purpose)', () => {
  it('format.test.js:432: the date half in the short style writes days as "d" (README: "2 wks and 3 d")', () => {
    expect(fixturePeriod.format({ style: 'short', list: 'unit' })).toBe('1 yr, 2 mths, 1 wk, 3 d');
  });
});
