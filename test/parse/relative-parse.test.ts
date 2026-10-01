import { afterEach, describe, expect, it, vi } from 'vitest';

import { DaisyParseError, DaisyRangeError, LocalDate, configureTemporal, en } from '../../src';
import type { Locale } from '../../src';
import { moveBy, startOfPeriod } from '../../src/parse/relative-parser';
import { SYSTEM_TIME_ZONE, useSystemTimeZone } from '../support/system-time-zone';

const date = (text: string) => LocalDate.parse(text);

const MONDAY = date('2026-09-28');
const FRIDAY = date('2026-10-02');

afterEach(() => {
  configureTemporal(undefined);
  vi.useRealTimers();
});

describe('parseRelative from Monday 2026-09-28', () => {
  it.each([
    ['today', '2026-09-28'],
    ['Tomorrow', '2026-09-29'],
    ['  yesterday  ', '2026-09-27'],
    ['day after tomorrow', '2026-09-30'],
    ['the day after tomorrow', '2026-09-30'],
    ['DAY  BEFORE \t yesterday', '2026-09-26'],
    ['in 3 days', '2026-10-01'],
    ['In 1 Day', '2026-09-29'],
    ['in 0 days', '2026-09-28'],
    ['in 2 weeks', '2026-10-12'],
    ['in a month', '2026-10-28'],
    ['in one year', '2027-09-28'],
    ['in twelve days', '2026-10-10'],
    ['in 3 d', '2026-10-01'],
    ['in 2 wks', '2026-10-12'],
    ['3 days ago', '2026-09-25'],
    ['a week ago', '2026-09-21'],
    ['two months ago', '2026-07-28'],
    ['1 yr ago', '2025-09-28'],
    ['next friday', '2026-10-09'],
    ['Next Sunday', '2026-10-11'],
    ['last mon', '2026-09-21'],
    ['this friday', '2026-10-02'],
    ['this monday', '2026-09-28'],
    ['next week', '2026-10-05'],
    ['this week', '2026-09-28'],
    ['last week', '2026-09-21'],
    ['next month', '2026-10-01'],
    ['this month', '2026-09-01'],
    ['last month', '2026-08-01'],
    ['next year', '2027-01-01'],
    ['this year', '2026-01-01'],
    ['last year', '2025-01-01'],
    ['friday', '2026-10-02'],
    ['monday', '2026-09-28'],
    ['Sun', '2026-10-04'],
  ])('%j is %s', (text, expected) => {
    expect(LocalDate.parseRelative(text, { relativeTo: MONDAY })).toEqual(date(expected));
  });

  it.each([
    ['next monday', '2026-10-05'],
    ['this monday', '2026-09-28'],
    ['last friday', '2026-09-25'],
    ['this thursday', '2026-10-01'],
  ])('from Friday 2026-10-02, %j is %s', (text, expected) => {
    expect(LocalDate.parseRelative(text, { relativeTo: FRIDAY })).toEqual(date(expected));
  });

  it('clamps month steps to the month end', () => {
    expect(LocalDate.parseRelative('in a month', { relativeTo: date('2026-01-31') })).toEqual(
      date('2026-02-28'),
    );
    expect(LocalDate.parseRelative('next month', { relativeTo: date('2026-01-31') })).toEqual(
      date('2026-02-01'),
    );
  });

  it('starts weeks on the locale first day', () => {
    const sundayFirst: Locale = { ...en, firstDayOfWeek: 'sunday' };
    expect(
      LocalDate.parseRelative('next week', { relativeTo: MONDAY, locale: sundayFirst }),
    ).toEqual(date('2026-10-04'));
  });
});

describe('parseRelative rejects text outside the grammar', () => {
  it.each([
    'in three',
    'next',
    'in 3 hours',
    'in -3 days',
    'in 3.5 days',
    '3 days',
    'in 3 days ago',
    'tomorrow!',
    'yesterday tomorrow',
    'in thirteen days',
    'next fortnight',
    'this',
    '',
    '   ',
  ])('rejects %j', (text) => {
    expect(() => LocalDate.parseRelative(text, { relativeTo: MONDAY })).toThrow(
      new DaisyParseError('Unrecognised relative date', { input: text }),
    );
  });

  it('reports amounts beyond the supported range as a range error', () => {
    expect(() => LocalDate.parseRelative('in 300000 years', { relativeTo: MONDAY })).toThrow(
      DaisyRangeError,
    );
  });
});

describe('parseRelative with other grammars', () => {
  const germanStyle: Locale = {
    ...en,
    relativeGrammar: {
      ...en.relativeGrammar,
      future: ['in {amount} {unit}'],
      past: ['vor {amount} {unit}'],
      specialDays: { heute: 0, übermorgen: 2 },
      units: { ...en.relativeGrammar.units, tagen: 'day', wochen: 'week' },
      next: ['nächsten {target}', 'nächste {target}'],
      periods: { ...en.relativeGrammar.periods, woche: 'week' },
    },
  };
  const frenchStyle: Locale = {
    ...en,
    relativeGrammar: {
      ...en.relativeGrammar,
      past: ['il y a {amount} {unit}'],
      next: ['{target} prochain', '{target} prochaine'],
    },
  };
  const spanishStyle: Locale = {
    ...en,
    relativeGrammar: {
      ...en.relativeGrammar,
      future: ['dentro de {amount} {unit}', 'en {amount} {unit}'],
    },
  };

  it.each<[string, Locale, string, string]>([
    ['german', germanStyle, 'vor 2 Tagen', '2026-09-26'],
    ['german', germanStyle, 'in 3 wochen', '2026-10-19'],
    ['german', germanStyle, 'ÜBERMORGEN', '2026-09-30'],
    ['german', germanStyle, 'nächste Woche', '2026-10-05'],
    ['french', frenchStyle, 'il y a 3 days', '2026-09-25'],
    ['french', frenchStyle, 'friday prochain', '2026-10-09'],
    ['french', frenchStyle, 'week prochaine', '2026-10-05'],
    ['spanish', spanishStyle, 'dentro de 3 days', '2026-10-01'],
    ['spanish', spanishStyle, 'en 2 weeks', '2026-10-12'],
  ])('%s: %j is %s', (_language, locale, text, expected) => {
    expect(LocalDate.parseRelative(text, { relativeTo: MONDAY, locale })).toEqual(date(expected));
  });

  it('ignores a template without an amount and a unit', () => {
    const brokenGrammar: Locale = {
      ...en,
      relativeGrammar: { ...en.relativeGrammar, future: ['soon {amount}'] },
    };
    expect(() =>
      LocalDate.parseRelative('soon 3', { relativeTo: MONDAY, locale: brokenGrammar }),
    ).toThrow(new DaisyParseError('Unrecognised relative date', { input: 'soon 3' }));
  });
});

describe('parseRelative defaults and tryParseRelative', () => {
  it('is relative to today in the system time zone by default', () => {
    vi.useFakeTimers({ now: new Date('2026-09-28T23:30:00Z') });
    useSystemTimeZone(SYSTEM_TIME_ZONE);
    expect(LocalDate.parseRelative('tomorrow')).toEqual(date('2026-09-30'));
  });

  it('returns null instead of throwing', () => {
    expect(LocalDate.tryParseRelative('in three', { relativeTo: MONDAY })).toBeNull();
    expect(LocalDate.tryParseRelative('in 3 days', { relativeTo: MONDAY })).toEqual(
      date('2026-10-01'),
    );
  });
});

describe('relative parser internals', () => {
  it('reaches assertNever for a unit outside the union', () => {
    expect(() => moveBy(MONDAY, 'fortnight' as 'day', 1)).toThrow(
      new Error('Unexpected value: "fortnight"'),
    );
  });

  it('reaches assertNever for a period outside the union', () => {
    expect(() => startOfPeriod(en, MONDAY, 'decade' as 'week', 1)).toThrow(
      new Error('Unexpected value: "decade"'),
    );
  });
});
