import { describe, expect, it } from 'vitest';

import {
  DaisyRangeError,
  LocalDate,
  LocalDateRange,
  LocalDateTime,
  businessDays,
  businessDaysUntil,
  isBusinessDay,
  isWeekend,
  minusBusinessDays,
  plusBusinessDays,
} from '../../src';
import type { DayOfWeek, WeekendOptions } from '../../src';

const date = (text: string) => LocalDate.parse(text);
const range = (text: string) => LocalDateRange.parse(text);

const FRIDAY_SATURDAY: WeekendOptions = { weekend: ['friday', 'saturday'] };
const SUNDAY_ONLY: WeekendOptions = { weekend: ['sunday'] };
const NO_WEEKEND: WeekendOptions = { weekend: [] };
const ONLY_SUNDAY_WORKS: WeekendOptions = {
  weekend: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
};

describe('isWeekend and isBusinessDay', () => {
  it.each<[string, WeekendOptions | undefined, boolean]>([
    ['2026-10-02', undefined, false],
    ['2026-10-03', undefined, true],
    ['2026-10-04', undefined, true],
    ['2026-10-05', undefined, false],
    ['2026-10-02', FRIDAY_SATURDAY, true],
    ['2026-10-04', FRIDAY_SATURDAY, false],
    ['2026-10-03', SUNDAY_ONLY, false],
    ['2026-10-04', SUNDAY_ONLY, true],
    ['2026-10-04', NO_WEEKEND, false],
  ])('%s with %o is a weekend day: %s', (text, options, expected) => {
    expect(isWeekend(date(text), options)).toBe(expected);
    expect(isBusinessDay(date(text), options)).toBe(!expected);
  });

  it('reads the day of a date-time', () => {
    expect(isWeekend(LocalDateTime.parse('2026-10-03T09:00'))).toBe(true);
    expect(isBusinessDay(LocalDateTime.parse('2026-10-05T09:00'))).toBe(true);
  });
});

describe('weekend validation', () => {
  it('rejects a weekend covering all seven days', () => {
    expect(() =>
      isWeekend(date('2026-10-05'), {
        weekend: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      }),
    ).toThrow(new DaisyRangeError('A weekend cannot cover all seven days'));
  });

  it('rejects names that are not DayOfWeek values', () => {
    expect(() =>
      plusBusinessDays(date('2026-10-05'), 1, { weekend: ['Saturday' as DayOfWeek] }),
    ).toThrow(new DaisyRangeError('Weekend days must be DayOfWeek names, got Saturday'));
  });

  it('treats a repeated day as one weekend day', () => {
    expect(plusBusinessDays(date('2026-10-03'), 1, { weekend: ['sunday', 'sunday'] })).toEqual(
      date('2026-10-05'),
    );
  });
});

describe('plusBusinessDays and minusBusinessDays', () => {
  it.each<[string, number, WeekendOptions | undefined, string]>([
    ['2026-10-02', 1, undefined, '2026-10-05'],
    ['2026-10-03', 1, undefined, '2026-10-05'],
    ['2026-10-04', 1, undefined, '2026-10-05'],
    ['2026-10-03', 0, undefined, '2026-10-03'],
    ['2026-10-05', 4, undefined, '2026-10-09'],
    ['2026-10-05', 5, undefined, '2026-10-12'],
    ['2026-09-30', 10, undefined, '2026-10-14'],
    ['2026-10-01', 23, undefined, '2026-11-03'],
    ['2026-10-05', 260, undefined, '2027-10-04'],
    ['2026-10-05', -1, undefined, '2026-10-02'],
    ['2026-10-01', 1, FRIDAY_SATURDAY, '2026-10-04'],
    ['2026-10-02', 1, FRIDAY_SATURDAY, '2026-10-04'],
    ['2026-10-04', 5, FRIDAY_SATURDAY, '2026-10-11'],
    ['2026-10-03', 1, SUNDAY_ONLY, '2026-10-05'],
    ['2026-10-05', 6, SUNDAY_ONLY, '2026-10-12'],
    ['2026-10-03', 3, NO_WEEKEND, '2026-10-06'],
    ['2026-10-05', 2, ONLY_SUNDAY_WORKS, '2026-10-18'],
  ])('%s plus %s business days with %o is %s', (start, days, options, expected) => {
    expect(plusBusinessDays(date(start), days, options)).toEqual(date(expected));
  });

  it.each<[string, number, WeekendOptions | undefined, string]>([
    ['2026-10-04', 1, undefined, '2026-10-02'],
    ['2026-10-05', 1, undefined, '2026-10-02'],
    ['2026-10-07', 5, undefined, '2026-09-30'],
    ['2026-10-04', 0, undefined, '2026-10-04'],
    ['2026-10-02', -1, undefined, '2026-10-05'],
    ['2026-10-04', 1, FRIDAY_SATURDAY, '2026-10-01'],
    ['2026-10-18', 2, ONLY_SUNDAY_WORKS, '2026-10-04'],
  ])('%s minus %s business days with %o is %s', (start, days, options, expected) => {
    expect(minusBusinessDays(date(start), days, options)).toEqual(date(expected));
  });

  it('keeps the time of a date-time', () => {
    expect(plusBusinessDays(LocalDateTime.parse('2026-10-02T17:00'), 1)).toEqual(
      LocalDateTime.parse('2026-10-05T17:00'),
    );
  });

  it.each([plusBusinessDays, minusBusinessDays])('%o rejects fractional amounts', (move) => {
    expect(() => move(date('2026-10-05'), 1.5)).toThrow(
      new DaisyRangeError('Number of business days must be an integer, got 1.5'),
    );
  });
});

describe('businessDaysUntil', () => {
  it.each<[string, string, WeekendOptions | undefined, number]>([
    ['2026-10-05', '2026-10-12', undefined, 5],
    ['2026-10-02', '2026-10-05', undefined, 1],
    ['2026-10-03', '2026-10-05', undefined, 0],
    ['2026-10-05', '2026-10-05', undefined, 0],
    ['2026-10-05', '2026-10-09', undefined, 4],
    ['2026-10-12', '2026-10-05', undefined, -5],
    ['2026-10-05', '2026-10-03', undefined, 0],
    ['2026-01-01', '2027-01-01', undefined, 261],
    ['2026-10-04', '2026-10-11', FRIDAY_SATURDAY, 5],
    ['2026-10-01', '2026-10-08', SUNDAY_ONLY, 6],
  ])('from %s to %s with %o is %s', (start, end, options, expected) => {
    expect(businessDaysUntil(date(start), date(end), options)).toBe(expected);
  });

  it('counts by date for date-times', () => {
    expect(
      businessDaysUntil(
        LocalDateTime.parse('2026-10-05T23:00'),
        LocalDateTime.parse('2026-10-06T01:00'),
      ),
    ).toBe(1);
  });
});

describe('business days in a range', () => {
  it.each<[string, WeekendOptions | undefined, number]>([
    ['2026-10-01/2026-10-31', undefined, 22],
    ['2026-10-03/2026-10-04', undefined, 0],
    ['2026-10-05/2026-10-05', undefined, 1],
    ['2026-10-01/2026-10-31', FRIDAY_SATURDAY, 21],
    ['2026-10-01/2026-10-31', NO_WEEKEND, 31],
  ])('%s with %o has %s business days', (text, options, expected) => {
    expect(businessDays(range(text), options)).toBe(expected);
    expect(range(text).businessDays(options)).toBe(expected);
  });

  it.each<[WeekendOptions | undefined, string[]]>([
    [undefined, ['2026-10-01', '2026-10-02', '2026-10-05', '2026-10-06', '2026-10-07']],
    [FRIDAY_SATURDAY, ['2026-10-01', '2026-10-04', '2026-10-05', '2026-10-06', '2026-10-07']],
  ])('iterates the business days of 2026-10-01/2026-10-07 with %o', (options, expected) => {
    expect([...range('2026-10-01/2026-10-07').businessDaysIterator(options)]).toEqual(
      expected.map(date),
    );
  });

  it('validates the weekend when the iterator is created, not when it is first used', () => {
    expect(() =>
      range('2026-10-01/2026-10-07').businessDaysIterator({ weekend: ['Friday' as DayOfWeek] }),
    ).toThrow(new DaisyRangeError('Weekend days must be DayOfWeek names, got Friday'));
  });
});

describe('business-day methods', () => {
  it('on LocalDate', () => {
    const friday = date('2026-10-02');
    expect(friday.isWeekend()).toBe(false);
    expect(friday.isBusinessDay(FRIDAY_SATURDAY)).toBe(false);
    expect(friday.plusBusinessDays(1)).toEqual(date('2026-10-05'));
    expect(friday.minusBusinessDays(1)).toEqual(date('2026-10-01'));
    expect(friday.businessDaysUntil(date('2026-10-09'))).toBe(5);
  });

  it('on LocalDateTime', () => {
    const fridayEvening = LocalDateTime.parse('2026-10-02T18:30');
    expect(fridayEvening.isWeekend()).toBe(false);
    expect(fridayEvening.isBusinessDay(FRIDAY_SATURDAY)).toBe(false);
    expect(fridayEvening.plusBusinessDays(1)).toEqual(LocalDateTime.parse('2026-10-05T18:30'));
    expect(fridayEvening.minusBusinessDays(1)).toEqual(LocalDateTime.parse('2026-10-01T18:30'));
    expect(fridayEvening.businessDaysUntil(LocalDateTime.parse('2026-10-09T08:00'))).toBe(5);
  });
});
