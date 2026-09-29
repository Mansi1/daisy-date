import { describe, expect, it } from 'vitest';

import {
  DaisyRangeError,
  LocalDate,
  daysUntil,
  minusDays,
  minusMonths,
  minusWeeks,
  minusYears,
  plusDays,
  plusMonths,
  plusWeeks,
  plusYears,
} from '../../src';

const date = (text: string) => LocalDate.parse(text);

describe('plusDays and minusDays', () => {
  it.each([
    ['2026-09-28', 3, '2026-10-01'],
    ['2026-12-31', 1, '2027-01-01'],
    ['2024-02-28', 1, '2024-02-29'],
    ['2026-02-28', 1, '2026-03-01'],
    ['2026-09-28', 0, '2026-09-28'],
    ['2026-09-28', -28, '2026-08-31'],
    ['2026-09-28', 365, '2027-09-28'],
  ])('%s plus %s days is %s', (start, days, expected) => {
    expect(plusDays(date(start), days).toString()).toBe(expected);
    expect(minusDays(date(expected), days).toString()).toBe(start);
  });

  it('moves forward when minusDays gets a negative amount', () => {
    expect(minusDays(date('2026-09-28'), -3).toString()).toBe('2026-10-01');
  });
});

describe('plusWeeks and minusWeeks', () => {
  it.each([
    ['2026-09-28', 1, '2026-10-05'],
    ['2026-12-28', 2, '2027-01-11'],
    ['2026-09-28', -4, '2026-08-31'],
  ])('%s plus %s weeks is %s', (start, weeks, expected) => {
    expect(plusWeeks(date(start), weeks).toString()).toBe(expected);
    expect(minusWeeks(date(expected), weeks).toString()).toBe(start);
  });
});

describe('plusMonths and minusMonths', () => {
  it.each([
    ['2026-09-28', 1, '2026-10-28'],
    ['2026-11-15', 3, '2027-02-15'],
    ['2026-01-31', 1, '2026-02-28'],
    ['2024-01-31', 1, '2024-02-29'],
    ['2026-01-31', 2, '2026-03-31'],
    ['2026-03-31', 1, '2026-04-30'],
    ['2026-03-31', -1, '2026-02-28'],
    ['2026-05-31', -12, '2025-05-31'],
  ])('%s plus %s months is %s', (start, months, expected) => {
    expect(plusMonths(date(start), months).toString()).toBe(expected);
  });

  it.each([
    ['2026-03-31', 1, '2026-02-28'],
    ['2024-03-31', 1, '2024-02-29'],
    ['2026-01-15', 2, '2025-11-15'],
  ])('%s minus %s months is %s', (start, months, expected) => {
    expect(minusMonths(date(start), months).toString()).toBe(expected);
  });

  it('clamps each call separately, so steps are not reversible at month ends', () => {
    expect(minusMonths(plusMonths(date('2026-01-31'), 1), 1).toString()).toBe('2026-01-28');
  });
});

describe('plusYears and minusYears', () => {
  it.each([
    ['2026-09-28', 1, '2027-09-28'],
    ['2024-02-29', 1, '2025-02-28'],
    ['2024-02-29', 4, '2028-02-29'],
    ['2024-02-29', 100, '2124-02-29'],
    ['2000-02-29', 100, '2100-02-28'],
    ['2026-09-28', -26, '2000-09-28'],
  ])('%s plus %s years is %s', (start, years, expected) => {
    expect(plusYears(date(start), years).toString()).toBe(expected);
  });

  it('clamps 29 February when going back to a common year', () => {
    expect(minusYears(date('2024-02-29'), 1).toString()).toBe('2023-02-28');
  });
});

describe('arithmetic validation', () => {
  it.each([
    [plusDays, 'days'],
    [plusWeeks, 'weeks'],
    [plusMonths, 'months'],
    [plusYears, 'years'],
    [minusDays, 'days'],
    [minusWeeks, 'weeks'],
    [minusMonths, 'months'],
    [minusYears, 'years'],
  ] as const)('%o rejects fractional %s', (move, unit) => {
    expect(() => move(date('2026-09-28'), 1.5)).toThrow(
      new DaisyRangeError(`Number of ${unit} must be an integer, got 1.5`),
    );
  });

  it('rejects results after the last supported date with the Temporal error as cause', () => {
    const lastDate = date('+275760-09-13');
    expect(() => plusDays(lastDate, 1)).toThrow(DaisyRangeError);
    expect(() => plusDays(lastDate, 1)).toThrow(/\+275760-09-13 moved by 1 days/);
    expect(() => plusYears(lastDate, 1)).toThrow(DaisyRangeError);
  });

  it('rejects results before the first supported date', () => {
    expect(() => minusDays(date('-271821-04-19'), 1)).toThrow(/moved by -1 days/);
  });
});

describe('daysUntil', () => {
  it.each([
    ['2026-09-28', '2026-10-01', 3],
    ['2026-10-01', '2026-09-28', -3],
    ['2026-09-28', '2026-09-28', 0],
    ['2024-01-01', '2025-01-01', 366],
    ['2026-01-01', '2027-01-01', 365],
    ['2026-03-28', '2026-03-30', 2],
  ])('from %s to %s is %s days', (start, end, expected) => {
    expect(daysUntil(date(start), date(end))).toBe(expected);
  });

  it('agrees with plusDays', () => {
    const start = date('2026-09-28');
    for (const days of [-400, -31, -1, 0, 1, 59, 1000]) {
      expect(daysUntil(start, plusDays(start, days))).toBe(days);
    }
  });
});

describe('LocalDate arithmetic methods', () => {
  const start = date('2026-01-31');

  it('delegate to the standalone functions', () => {
    const other = date('2026-12-24');
    expect(start.plusDays(3).equals(plusDays(start, 3))).toBe(true);
    expect(start.plusWeeks(3).equals(plusWeeks(start, 3))).toBe(true);
    expect(start.plusMonths(1).equals(plusMonths(start, 1))).toBe(true);
    expect(start.plusYears(3).equals(plusYears(start, 3))).toBe(true);
    expect(start.minusDays(3).equals(minusDays(start, 3))).toBe(true);
    expect(start.minusWeeks(3).equals(minusWeeks(start, 3))).toBe(true);
    expect(start.minusMonths(2).equals(minusMonths(start, 2))).toBe(true);
    expect(start.minusYears(3).equals(minusYears(start, 3))).toBe(true);
    expect(start.daysUntil(other)).toBe(daysUntil(start, other));
  });

  it('leave the original date unchanged', () => {
    start.plusMonths(1);
    start.minusYears(1);
    expect(start.toString()).toBe('2026-01-31');
  });
});
