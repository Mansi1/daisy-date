import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  DaisyRangeError,
  LocalDate,
  LocalDateTime,
  configureTemporal,
  en,
  formatRelative,
} from '../../src';
import type { Locale, RelativeNumeric, RelativeStyle } from '../../src';
import { SYSTEM_TIME_ZONE, useSystemTimeZone } from '../support/system-time-zone';

const date = (text: string) => LocalDate.parse(text);
const dateTime = (text: string) => LocalDateTime.parse(text);

const MONDAY = date('2026-09-28');
const FRIDAY = date('2026-10-02');
const NOON = dateTime('2026-09-28T12:00');

afterEach(() => {
  configureTemporal(undefined);
  vi.useRealTimers();
});

describe('formatRelative for dates, numeric auto', () => {
  it.each([
    ['2026-09-28', 'today'],
    ['2026-09-29', 'tomorrow'],
    ['2026-09-27', 'yesterday'],
    ['2026-09-30', 'the day after tomorrow'],
    ['2026-09-26', 'the day before yesterday'],
    ['2026-10-01', 'this Thursday'],
    ['2026-10-04', 'next Sunday'],
    ['2026-09-25', 'last Friday'],
    ['2026-09-22', 'last Tuesday'],
    ['2026-10-05', 'in 1 week'],
    ['2026-09-21', '1 week ago'],
    ['2026-10-11', 'in 1 week'],
    ['2026-10-12', 'in 2 weeks'],
    ['2026-10-28', 'in 4 weeks'],
    ['2026-08-29', '4 weeks ago'],
    ['2026-10-29', 'in 1 month'],
    ['2026-08-28', '1 month ago'],
    ['2027-09-27', 'in 11 months'],
    ['2025-09-29', '11 months ago'],
    ['2027-09-28', 'in 1 year'],
    ['2025-09-28', '1 year ago'],
    ['2028-12-06', 'in 2 years'],
  ])('from Monday 2026-09-28, %s is %j', (text, expected) => {
    expect(formatRelative(date(text), { relativeTo: MONDAY })).toBe(expected);
  });

  it.each([
    ['2026-10-05', 'next Monday'],
    ['2026-10-08', 'next Thursday'],
    ['2026-09-29', 'this Tuesday'],
    ['2026-09-26', 'last Saturday'],
  ])('from Friday 2026-10-02, %s is %j', (text, expected) => {
    expect(formatRelative(date(text), { relativeTo: FRIDAY })).toBe(expected);
  });

  it('uses months when 365 days are less than a calendar year (leap year)', () => {
    expect(formatRelative(date('2024-12-31'), { relativeTo: date('2024-01-01') })).toBe(
      'in 11 months',
    );
  });

  it('takes the week start from the locale', () => {
    const mondayFirst: Locale = { ...en, firstDayOfWeek: 'monday' };
    expect(formatRelative(date('2026-10-04'), { relativeTo: MONDAY, locale: mondayFirst })).toBe(
      'this Sunday',
    );
  });
});

describe('formatRelative for dates, numeric always and short style', () => {
  it.each<[string, RelativeStyle, RelativeNumeric, string]>([
    ['2026-09-28', 'long', 'always', 'in 0 days'],
    ['2026-09-29', 'long', 'always', 'in 1 day'],
    ['2026-09-27', 'long', 'always', '1 day ago'],
    ['2026-09-30', 'long', 'always', 'in 2 days'],
    ['2026-10-01', 'long', 'always', 'in 3 days'],
    ['2026-10-04', 'long', 'always', 'in 6 days'],
    ['2026-09-22', 'long', 'always', '6 days ago'],
    ['2026-10-05', 'long', 'always', 'in 1 week'],
    ['2026-10-01', 'short', 'always', 'in 3 d'],
    ['2026-10-05', 'short', 'auto', 'in 1 wk'],
    ['2026-10-12', 'short', 'auto', 'in 2 wks'],
    ['2026-10-29', 'short', 'auto', 'in 1 mo'],
    ['2027-09-28', 'short', 'auto', 'in 1 yr'],
    ['2025-08-24', 'short', 'auto', '1 yr ago'],
    ['2026-09-29', 'short', 'auto', 'tomorrow'],
  ])('from 2026-09-28, %s (%s, %s) is %j', (text, style, numeric, expected) => {
    expect(formatRelative(date(text), { relativeTo: MONDAY, style, numeric })).toBe(expected);
  });
});

describe('formatRelative for date-times', () => {
  it.each<[string, RelativeStyle, RelativeNumeric, string]>([
    ['2026-09-28T12:00', 'long', 'auto', 'now'],
    ['2026-09-28T12:00:00.999', 'long', 'auto', 'now'],
    ['2026-09-28T12:00', 'long', 'always', 'in 0 seconds'],
    ['2026-09-28T12:00:01', 'long', 'auto', 'in 1 second'],
    ['2026-09-28T12:00:30', 'long', 'auto', 'in 30 seconds'],
    ['2026-09-28T11:59:00.001', 'long', 'auto', '59 seconds ago'],
    ['2026-09-28T12:01', 'long', 'auto', 'in 1 minute'],
    ['2026-09-28T12:01:30', 'long', 'auto', 'in 1 minute'],
    ['2026-09-28T12:59', 'long', 'auto', 'in 59 minutes'],
    ['2026-09-28T10:59', 'long', 'auto', '1 hour ago'],
    ['2026-09-29T11:59', 'long', 'auto', 'in 23 hours'],
    ['2026-09-29T12:00', 'long', 'auto', 'tomorrow'],
    ['2026-09-30T00:00', 'long', 'auto', 'the day after tomorrow'],
    ['2026-09-25T12:00', 'long', 'auto', 'last Friday'],
    ['2026-09-28T12:00:01', 'short', 'auto', 'in 1 sec'],
    ['2026-09-28T14:00', 'short', 'auto', 'in 2 hr'],
  ])('from 2026-09-28T12:00, %s (%s, %s) is %j', (text, style, numeric, expected) => {
    expect(formatRelative(dateTime(text), { relativeTo: NOON, style, numeric })).toBe(expected);
  });
});

describe('formatRelative defaults and mixed types', () => {
  it('is relative to today and now in the system time zone by default', () => {
    vi.useFakeTimers({ now: new Date('2026-09-28T23:30:00Z') });
    useSystemTimeZone(SYSTEM_TIME_ZONE);
    expect(formatRelative(date('2026-09-30'))).toBe('tomorrow');
    expect(formatRelative(dateTime('2026-09-29T14:00'))).toBe('in 30 minutes');
  });

  it('compares a date with the date part of a date-time', () => {
    expect(formatRelative(date('2026-09-29'), { relativeTo: dateTime('2026-09-28T23:59') })).toBe(
      'tomorrow',
    );
  });

  it('compares a date-time with midnight of a date', () => {
    expect(formatRelative(dateTime('2026-09-28T06:00'), { relativeTo: MONDAY })).toBe('in 6 hours');
  });

  it('falls back to the "other" template for a plural category the locale has no template for', () => {
    const fewCategory: Locale = { ...en, plural: () => 'few' };
    expect(formatRelative(date('2026-10-12'), { relativeTo: MONDAY, locale: fewCategory })).toBe(
      'in 2 weeks',
    );
  });

  it('uses the given locale', () => {
    const german: Locale = {
      ...en,
      relative: { ...en.relative, days: { ...en.relative.days, today: 'heute' } },
    };
    expect(formatRelative(MONDAY, { relativeTo: MONDAY, locale: german })).toBe('heute');
  });
});

describe('formatRelative validation and methods', () => {
  it('rejects an unknown style', () => {
    expect(() => formatRelative(MONDAY, { style: 'tiny' as RelativeStyle })).toThrow(
      new DaisyRangeError('Relative style must be one of long, short, got tiny'),
    );
  });

  it('rejects an unknown numeric mode', () => {
    expect(() => formatRelative(MONDAY, { numeric: 'never' as RelativeNumeric })).toThrow(
      new DaisyRangeError('Relative numeric must be one of auto, always, got never'),
    );
  });

  it('is available as a method', () => {
    expect(date('2026-10-12').formatRelative({ relativeTo: MONDAY })).toBe('in 2 weeks');
    expect(dateTime('2026-09-28T09:00').formatRelative({ relativeTo: NOON })).toBe('3 hours ago');
  });
});
