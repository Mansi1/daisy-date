import { describe, expect, it } from 'vitest';

import {
  DAY_OF_WEEK,
  DaisyRangeError,
  LocalDate,
  daysUntil,
  endOfMonth,
  endOfWeek,
  endOfYear,
  next,
  nextOrSame,
  plusDays,
  previous,
  previousOrSame,
  startOfMonth,
  startOfWeek,
  startOfYear,
  withDay,
  withMonth,
  withYear,
} from '../../src';
import type { DayOfWeek } from '../../src';

const date = (text: string) => LocalDate.parse(text);

describe('withYear', () => {
  it.each([
    ['2026-09-28', 2030, '2030-09-28'],
    ['2024-02-29', 2025, '2025-02-28'],
    ['2024-02-29', 2028, '2028-02-29'],
  ])('%s with year %s is %s', (start, year, expected) => {
    expect(withYear(date(start), year).toString()).toBe(expected);
  });

  it('rejects years outside the supported range', () => {
    expect(() => withYear(date('2026-09-28'), 300_000)).toThrow(DaisyRangeError);
    expect(() => withYear(date('2026-09-28'), 300_000)).toThrow(/Cannot set year 300000/);
  });

  it('rejects fractional years', () => {
    expect(() => withYear(date('2026-09-28'), 2026.5)).toThrow(DaisyRangeError);
  });
});

describe('withMonth', () => {
  it.each([
    ['2026-09-28', 1, '2026-01-28'],
    ['2026-01-31', 2, '2026-02-28'],
    ['2024-01-31', 2, '2024-02-29'],
    ['2026-08-31', 9, '2026-09-30'],
  ])('%s with month %s is %s', (start, month, expected) => {
    expect(withMonth(date(start), month).toString()).toBe(expected);
  });

  it.each([0, 13, 1.5])('rejects month %s', (month) => {
    expect(() => withMonth(date('2026-09-28'), month)).toThrow(DaisyRangeError);
  });
});

describe('withDay', () => {
  it('sets the day of month', () => {
    expect(withDay(date('2026-09-28'), 1).toString()).toBe('2026-09-01');
    expect(withDay(date('2024-02-01'), 29).toString()).toBe('2024-02-29');
  });

  it.each([
    ['2026-02-01', 29],
    ['2026-09-01', 31],
    ['2026-09-01', 0],
  ])('rejects %s with day %s instead of clamping', (start, day) => {
    expect(() => withDay(date(start), day)).toThrow(DaisyRangeError);
    expect(() => withDay(date(start), day)).toThrow(`Cannot set day ${String(day)} on ${start}`);
  });

  it('rejects fractional days', () => {
    expect(() => withDay(date('2026-09-01'), 2.5)).toThrow(DaisyRangeError);
  });
});

describe('startOfWeek and endOfWeek', () => {
  it.each<[string, DayOfWeek | undefined, string, string]>([
    ['2026-09-30', undefined, '2026-09-28', '2026-10-04'],
    ['2026-09-28', undefined, '2026-09-28', '2026-10-04'],
    ['2026-10-04', undefined, '2026-09-28', '2026-10-04'],
    ['2026-09-30', 'sunday', '2026-09-27', '2026-10-03'],
    ['2026-09-27', 'sunday', '2026-09-27', '2026-10-03'],
    ['2026-09-30', 'saturday', '2026-09-26', '2026-10-02'],
    ['2027-01-01', undefined, '2026-12-28', '2027-01-03'],
  ])('the week of %s starting on %s runs from %s to %s', (start, firstDay, weekStart, weekEnd) => {
    expect(startOfWeek(date(start), firstDay).toString()).toBe(weekStart);
    expect(endOfWeek(date(start), firstDay).toString()).toBe(weekEnd);
  });

  it('rejects a first day that is not a DayOfWeek', () => {
    expect(() => startOfWeek(date('2026-09-28'), 'Monday' as DayOfWeek)).toThrow(
      new DaisyRangeError('Expected a DayOfWeek, got Monday'),
    );
  });
});

describe('start and end of month and year', () => {
  it.each([
    ['2026-09-28', '2026-09-01', '2026-09-30', '2026-01-01', '2026-12-31'],
    ['2024-02-10', '2024-02-01', '2024-02-29', '2024-01-01', '2024-12-31'],
    ['2026-02-28', '2026-02-01', '2026-02-28', '2026-01-01', '2026-12-31'],
    ['2026-12-31', '2026-12-01', '2026-12-31', '2026-01-01', '2026-12-31'],
  ])('%s: month %s–%s, year %s–%s', (start, monthStart, monthEnd, yearStart, yearEnd) => {
    expect(startOfMonth(date(start)).toString()).toBe(monthStart);
    expect(endOfMonth(date(start)).toString()).toBe(monthEnd);
    expect(startOfYear(date(start)).toString()).toBe(yearStart);
    expect(endOfYear(date(start)).toString()).toBe(yearEnd);
  });
});

describe('next, nextOrSame, previous, previousOrSame', () => {
  const monday = date('2026-09-28');

  it.each<[DayOfWeek, string, string, string, string]>([
    ['monday', '2026-10-05', '2026-09-28', '2026-09-21', '2026-09-28'],
    ['tuesday', '2026-09-29', '2026-09-29', '2026-09-22', '2026-09-22'],
    ['friday', '2026-10-02', '2026-10-02', '2026-09-25', '2026-09-25'],
    ['sunday', '2026-10-04', '2026-10-04', '2026-09-27', '2026-09-27'],
  ])(
    'from Monday 2026-09-28 to %s: next %s, nextOrSame %s, previous %s, previousOrSame %s',
    (dayOfWeek, expectedNext, expectedNextOrSame, expectedPrevious, expectedPreviousOrSame) => {
      expect(next(monday, dayOfWeek).toString()).toBe(expectedNext);
      expect(nextOrSame(monday, dayOfWeek).toString()).toBe(expectedNextOrSame);
      expect(previous(monday, dayOfWeek).toString()).toBe(expectedPrevious);
      expect(previousOrSame(monday, dayOfWeek).toString()).toBe(expectedPreviousOrSame);
    },
  );

  it('always lands on the requested weekday within one week', () => {
    const startDates = Array.from({ length: 14 }, (_unused, offset) => plusDays(monday, offset));
    for (const start of startDates) {
      for (const dayOfWeek of DAY_OF_WEEK) {
        const nextDay = next(start, dayOfWeek);
        const previousDay = previous(start, dayOfWeek);
        expect(nextDay.dayOfWeek).toBe(dayOfWeek);
        expect(previousDay.dayOfWeek).toBe(dayOfWeek);
        expect(daysUntil(start, nextDay)).toBeGreaterThanOrEqual(1);
        expect(daysUntil(start, nextDay)).toBeLessThanOrEqual(7);
        expect(daysUntil(previousDay, start)).toBeGreaterThanOrEqual(1);
        expect(daysUntil(previousDay, start)).toBeLessThanOrEqual(7);
      }
    }
  });

  it('rejects a target that is not a DayOfWeek', () => {
    expect(() => next(monday, 'fri' as DayOfWeek)).toThrow(DaisyRangeError);
  });
});

describe('LocalDate adjuster methods', () => {
  const start = date('2024-02-29');

  it('delegate to the standalone functions', () => {
    expect(start.withYear(2025).equals(withYear(start, 2025))).toBe(true);
    expect(start.withMonth(4).equals(withMonth(start, 4))).toBe(true);
    expect(start.withDay(1).equals(withDay(start, 1))).toBe(true);
    expect(start.startOfWeek().equals(startOfWeek(start))).toBe(true);
    expect(start.startOfWeek('sunday').equals(startOfWeek(start, 'sunday'))).toBe(true);
    expect(start.endOfWeek().equals(endOfWeek(start))).toBe(true);
    expect(start.endOfWeek('sunday').equals(endOfWeek(start, 'sunday'))).toBe(true);
    expect(start.startOfMonth().equals(startOfMonth(start))).toBe(true);
    expect(start.endOfMonth().equals(endOfMonth(start))).toBe(true);
    expect(start.startOfYear().equals(startOfYear(start))).toBe(true);
    expect(start.endOfYear().equals(endOfYear(start))).toBe(true);
    expect(start.next('monday').equals(next(start, 'monday'))).toBe(true);
    expect(start.nextOrSame('thursday').equals(nextOrSame(start, 'thursday'))).toBe(true);
    expect(start.previous('monday').equals(previous(start, 'monday'))).toBe(true);
    expect(start.previousOrSame('thursday').equals(previousOrSame(start, 'thursday'))).toBe(true);
  });
});
