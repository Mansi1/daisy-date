import { describe, expect, it } from 'vitest';

import {
  DaisyRangeError,
  LocalDate,
  Period,
  daysUntil,
  minus,
  minusDays,
  minusMonths,
  minusWeeks,
  minusYears,
  plusDays,
  plusMonths,
  plusWeeks,
  plus,
  plusYears,
  until,
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
    [plusDays, 'Number of days must be an integer, got 1.5'],
    [plusWeeks, 'Number of weeks must be an integer, got 1.5'],
    [plusMonths, 'Number of months must be an integer, got 1.5'],
    [plusYears, 'Number of years must be an integer, got 1.5'],
    [minusDays, 'Number of days must be an integer, got 1.5'],
    [minusWeeks, 'Number of weeks must be an integer, got 1.5'],
    [minusMonths, 'Number of months must be an integer, got 1.5'],
    [minusYears, 'Number of years must be an integer, got 1.5'],
  ] as const)('%o rejects fractional amounts', (move, message) => {
    expect(() => move(date('2026-09-28'), 1.5)).toThrow(new DaisyRangeError(message));
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
    ['2026-09-28', '2025-08-24', -400],
    ['2026-09-28', '2026-11-26', 59],
    ['2026-09-28', '2029-06-24', 1000],
    ['2024-02-28', '2024-03-01', 2],
    ['2023-02-28', '2023-03-01', 1],
  ])('from %s to %s is %s days', (start, end, expected) => {
    expect(daysUntil(date(start), date(end))).toBe(expected);
  });
});

describe('plus and minus with a Period', () => {
  it.each([
    ['2026-01-31', 'P1M1D', '2026-03-01'],
    ['2024-02-29', 'P1Y', '2025-02-28'],
    ['2024-02-29', 'P1Y1M', '2025-03-29'],
    ['2026-09-28', 'P2W', '2026-10-12'],
    ['2026-09-28', 'P1Y-2M', '2027-07-28'],
    ['2026-03-31', 'P-1M1D', '2026-03-01'],
    ['2026-09-28', 'P1W3D', '2026-10-08'],
    ['2026-09-28', 'P0D', '2026-09-28'],
  ])('%s plus %s is %s', (start, text, expected) => {
    expect(plus(date(start), Period.parse(text))).toEqual(date(expected));
  });

  it.each([
    ['2026-03-01', 'P1M1D', '2026-01-31'],
    ['2025-02-28', 'P1Y', '2024-02-28'],
    ['2026-03-31', 'P1M', '2026-02-28'],
    ['2026-10-12', 'P2W', '2026-09-28'],
    ['2026-09-28', '-P1D', '2026-09-29'],
  ])('%s minus %s is %s', (start, text, expected) => {
    expect(minus(date(start), Period.parse(text))).toEqual(date(expected));
  });

  it('rejects results beyond the supported range', () => {
    expect(() => plus(date('+275760-09-13'), Period.parse('P1D'))).toThrow(
      new DaisyRangeError('+275760-09-13 moved by 1 days is outside the supported range'),
    );
  });
});

describe('until', () => {
  it.each([
    ['2026-01-31', '2026-03-01', { years: 0, months: 1, weeks: 0, days: 1 }],
    ['2026-01-31', '2026-02-28', { years: 0, months: 0, weeks: 0, days: 28 }],
    ['2024-02-29', '2025-02-28', { years: 0, months: 11, weeks: 0, days: 30 }],
    ['2025-02-28', '2024-02-29', { years: 0, months: -11, weeks: 0, days: -28 }],
    ['2026-03-01', '2026-01-31', { years: 0, months: -1, weeks: 0, days: -1 }],
    ['2026-09-28', '2027-11-30', { years: 1, months: 2, weeks: 0, days: 2 }],
    ['2026-03-31', '2026-04-30', { years: 0, months: 0, weeks: 0, days: 30 }],
    ['2026-04-30', '2026-03-31', { years: 0, months: 0, weeks: 0, days: -30 }],
    ['2026-09-28', '2026-09-28', { years: 0, months: 0, weeks: 0, days: 0 }],
  ])('from %s to %s is %o', (start, end, expected) => {
    expect(until(date(start), date(end))).toEqual(expected);
  });
});

describe('LocalDate arithmetic methods', () => {
  const start = date('2026-01-31');

  it.each<[string, string, (value: LocalDate) => LocalDate]>([
    ['plusDays(3)', '2026-02-03', (value) => value.plusDays(3)],
    ['plusWeeks(3)', '2026-02-21', (value) => value.plusWeeks(3)],
    ['plusMonths(1)', '2026-02-28', (value) => value.plusMonths(1)],
    ['plusYears(3)', '2029-01-31', (value) => value.plusYears(3)],
    ['minusDays(3)', '2026-01-28', (value) => value.minusDays(3)],
    ['minusWeeks(3)', '2026-01-10', (value) => value.minusWeeks(3)],
    ['minusMonths(2)', '2025-11-30', (value) => value.minusMonths(2)],
    ['minusYears(3)', '2023-01-31', (value) => value.minusYears(3)],
  ])('2026-01-31.%s is %s', (_call, expected, move) => {
    expect(move(start)).toEqual(date(expected));
  });

  it('adds and subtracts periods and measures the period until another date', () => {
    expect(start.plus(Period.parse('P1M1D'))).toEqual(date('2026-03-01'));
    expect(start.minus(Period.parse('P1M1D'))).toEqual(date('2025-12-30'));
    expect(start.until(date('2026-03-01'))).toEqual({ years: 0, months: 1, weeks: 0, days: 1 });
  });

  it('counts days with daysUntil', () => {
    expect(start.daysUntil(date('2026-12-24'))).toBe(327);
  });

  it('leave the original date unchanged', () => {
    start.plusMonths(1);
    start.minusYears(1);
    expect(start).toEqual(date('2026-01-31'));
  });
});
