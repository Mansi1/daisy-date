import { describe, expect, it } from 'vitest';

import {
  DaisyRangeError,
  LocalDate,
  endOfMonth,
  endOfWeek,
  endOfYear,
  next,
  nextOrSame,
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
    ['2026-02-01', 29, 'Cannot set day 29 on 2026-02-01'],
    ['2026-09-01', 31, 'Cannot set day 31 on 2026-09-01'],
    ['2026-09-01', 0, 'Cannot set day 0 on 2026-09-01'],
  ])('rejects %s with day %s instead of clamping', (start, day, message) => {
    expect(() => withDay(date(start), day)).toThrow(new DaisyRangeError(message));
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
  const sunday = date('2026-10-04');

  it.each<[DayOfWeek, string, string, string, string]>([
    ['monday', '2026-10-05', '2026-09-28', '2026-09-21', '2026-09-28'],
    ['tuesday', '2026-09-29', '2026-09-29', '2026-09-22', '2026-09-22'],
    ['wednesday', '2026-09-30', '2026-09-30', '2026-09-23', '2026-09-23'],
    ['thursday', '2026-10-01', '2026-10-01', '2026-09-24', '2026-09-24'],
    ['friday', '2026-10-02', '2026-10-02', '2026-09-25', '2026-09-25'],
    ['saturday', '2026-10-03', '2026-10-03', '2026-09-26', '2026-09-26'],
    ['sunday', '2026-10-04', '2026-10-04', '2026-09-27', '2026-09-27'],
  ])(
    'from Monday 2026-09-28 to %s: next %s, nextOrSame %s, previous %s, previousOrSame %s',
    (dayOfWeek, expectedNext, expectedNextOrSame, expectedPrevious, expectedPreviousOrSame) => {
      expect(next(monday, dayOfWeek)).toEqual(date(expectedNext));
      expect(nextOrSame(monday, dayOfWeek)).toEqual(date(expectedNextOrSame));
      expect(previous(monday, dayOfWeek)).toEqual(date(expectedPrevious));
      expect(previousOrSame(monday, dayOfWeek)).toEqual(date(expectedPreviousOrSame));
    },
  );

  it.each<[DayOfWeek, string, string, string, string]>([
    ['monday', '2026-10-05', '2026-10-05', '2026-09-28', '2026-09-28'],
    ['tuesday', '2026-10-06', '2026-10-06', '2026-09-29', '2026-09-29'],
    ['wednesday', '2026-10-07', '2026-10-07', '2026-09-30', '2026-09-30'],
    ['thursday', '2026-10-08', '2026-10-08', '2026-10-01', '2026-10-01'],
    ['friday', '2026-10-09', '2026-10-09', '2026-10-02', '2026-10-02'],
    ['saturday', '2026-10-10', '2026-10-10', '2026-10-03', '2026-10-03'],
    ['sunday', '2026-10-11', '2026-10-04', '2026-09-27', '2026-10-04'],
  ])(
    'from Sunday 2026-10-04 to %s: next %s, nextOrSame %s, previous %s, previousOrSame %s',
    (dayOfWeek, expectedNext, expectedNextOrSame, expectedPrevious, expectedPreviousOrSame) => {
      expect(next(sunday, dayOfWeek)).toEqual(date(expectedNext));
      expect(nextOrSame(sunday, dayOfWeek)).toEqual(date(expectedNextOrSame));
      expect(previous(sunday, dayOfWeek)).toEqual(date(expectedPrevious));
      expect(previousOrSame(sunday, dayOfWeek)).toEqual(date(expectedPreviousOrSame));
    },
  );

  it('rejects a target that is not a DayOfWeek', () => {
    expect(() => next(monday, 'fri' as DayOfWeek)).toThrow(
      new DaisyRangeError('Expected a DayOfWeek, got fri'),
    );
  });
});

describe('LocalDate adjuster methods', () => {
  const thursday = date('2024-02-29');

  it.each<[string, string, (value: LocalDate) => LocalDate]>([
    ['withYear(2025)', '2025-02-28', (value) => value.withYear(2025)],
    ['withMonth(4)', '2024-04-29', (value) => value.withMonth(4)],
    ['withDay(1)', '2024-02-01', (value) => value.withDay(1)],
    ['startOfWeek()', '2024-02-26', (value) => value.startOfWeek()],
    ["startOfWeek('sunday')", '2024-02-25', (value) => value.startOfWeek('sunday')],
    ['endOfWeek()', '2024-03-03', (value) => value.endOfWeek()],
    ["endOfWeek('sunday')", '2024-03-02', (value) => value.endOfWeek('sunday')],
    ['startOfMonth()', '2024-02-01', (value) => value.startOfMonth()],
    ['endOfMonth()', '2024-02-29', (value) => value.endOfMonth()],
    ['startOfYear()', '2024-01-01', (value) => value.startOfYear()],
    ['endOfYear()', '2024-12-31', (value) => value.endOfYear()],
    ["next('monday')", '2024-03-04', (value) => value.next('monday')],
    ["nextOrSame('thursday')", '2024-02-29', (value) => value.nextOrSame('thursday')],
    ["previous('monday')", '2024-02-26', (value) => value.previous('monday')],
    ["previousOrSame('thursday')", '2024-02-29', (value) => value.previousOrSame('thursday')],
  ])('Thursday 2024-02-29.%s is %s', (_call, expected, adjust) => {
    expect(adjust(thursday)).toEqual(date(expected));
  });
});
