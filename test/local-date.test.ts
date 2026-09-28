import type {} from 'temporal-polyfill/global';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DaisyParseError, DaisyRangeError, LocalDate, compare } from '../src';
import type { DaisyError, DayOfWeek } from '../src';

const catchError = (action: () => unknown): unknown => {
  try {
    action();
  } catch (error) {
    return error;
  }
  throw new Error('Expected the action to throw');
};

const expectDaisyErrorCausedByRangeError = (
  action: () => unknown,
  errorClass: new (...args: never[]) => DaisyError,
) => {
  const error = catchError(action);
  expect(error).toBeInstanceOf(errorClass);
  expect((error as DaisyError).cause).toBeInstanceOf(RangeError);
};

describe('LocalDate.of', () => {
  it('creates a date with the given fields', () => {
    const date = LocalDate.of(2026, 9, 28);
    expect([date.year, date.month, date.day]).toEqual([2026, 9, 28]);
  });

  it('accepts 29 February in leap years', () => {
    expect(LocalDate.of(2024, 2, 29).toString()).toBe('2024-02-29');
    expect(LocalDate.of(2000, 2, 29).toString()).toBe('2000-02-29');
  });

  it.each([
    [2026, 2, 29],
    [1900, 2, 29],
    [2026, 4, 31],
    [2026, 13, 1],
    [2026, 0, 1],
    [2026, 1, 0],
    [300_000, 1, 1],
  ])('rejects %s-%s-%s with a DaisyRangeError caused by Temporal', (year, month, day) => {
    expectDaisyErrorCausedByRangeError(() => LocalDate.of(year, month, day), DaisyRangeError);
  });

  it.each([
    [2026.5, 1, 1, 'Year must be an integer, got 2026.5'],
    [2026, 1.5, 1, 'Month must be an integer, got 1.5'],
    [2026, 1, Number.NaN, 'Day must be an integer, got NaN'],
  ])('rejects non-integer fields (%s, %s, %s)', (year, month, day, message) => {
    expect(() => LocalDate.of(year, month, day)).toThrow(new DaisyRangeError(message));
  });
});

describe('LocalDate.ofYearDay', () => {
  it.each([
    [2026, 1, '2026-01-01'],
    [2026, 271, '2026-09-28'],
    [2026, 365, '2026-12-31'],
    [2024, 60, '2024-02-29'],
    [2024, 366, '2024-12-31'],
  ])('day %s of %s is %s', (year, dayOfYear, expected) => {
    expect(LocalDate.ofYearDay(year, dayOfYear).toString()).toBe(expected);
  });

  it.each([
    [2026, 0],
    [2026, 366],
    [2024, 367],
  ])('rejects day %s of %s', (year, dayOfYear) => {
    expect(() => LocalDate.ofYearDay(year, dayOfYear)).toThrow(DaisyRangeError);
  });

  it('rejects days past the last date Temporal supports', () => {
    expectDaisyErrorCausedByRangeError(() => LocalDate.ofYearDay(275_760, 300), DaisyRangeError);
  });

  it('rejects non-integer input', () => {
    expect(() => LocalDate.ofYearDay(2026, 1.5)).toThrow(DaisyRangeError);
    expect(() => LocalDate.ofYearDay(2026.5, 1)).toThrow(DaisyRangeError);
  });
});

describe('LocalDate.parse', () => {
  it.each(['2026-09-28', '2024-02-29', '0099-01-01', '+010000-01-01', '-000001-12-31'])(
    'round-trips %s',
    (text) => {
      expect(LocalDate.parse(text).toString()).toBe(text);
    },
  );

  it.each([
    '2026-9-28',
    '20260928',
    '2026-09-28T00:00',
    ' 2026-09-28',
    '2026-09-28[u-ca=japanese]',
    '010000-01-01',
    '',
  ])('rejects the non-ISO date text %j', (text) => {
    expect(() => LocalDate.parse(text)).toThrow(
      expect.objectContaining({ code: 'PARSE', input: text }),
    );
  });

  it.each(['2026-02-29', '2026-13-01', '2026-00-10', '2026-04-31', '-000000-01-01'])(
    'rejects the impossible date %s with a DaisyParseError caused by Temporal',
    (text) => {
      expectDaisyErrorCausedByRangeError(() => LocalDate.parse(text), DaisyParseError);
    },
  );
});

describe('LocalDate getters', () => {
  it('reads all calendar fields', () => {
    const date = LocalDate.of(2026, 9, 28);
    expect(date.dayOfWeek).toBe<DayOfWeek>('monday');
    expect(date.dayOfYear).toBe(271);
    expect(date.weekOfYear).toBe(40);
    expect(date.daysInMonth).toBe(30);
    expect(date.daysInYear).toBe(365);
    expect(date.isLeapYear()).toBe(false);
  });

  it.each([
    [2024, true, 366],
    [2000, true, 366],
    [1900, false, 365],
    [2026, false, 365],
  ])('treats %s as leap year: %s', (year, isLeapYear, daysInYear) => {
    const date = LocalDate.of(year, 1, 1);
    expect(date.isLeapYear()).toBe(isLeapYear);
    expect(date.daysInYear).toBe(daysInYear);
  });

  it.each([
    [2024, 2, 29],
    [2026, 2, 28],
    [2026, 4, 30],
    [2026, 12, 31],
  ])('%s-%s has %s days', (year, month, daysInMonth) => {
    expect(LocalDate.of(year, month, 1).daysInMonth).toBe(daysInMonth);
  });

  it.each([
    ['2026-12-31', 53],
    ['2027-01-03', 53],
    ['2027-01-04', 1],
    ['2021-01-01', 53],
    ['2024-12-30', 1],
    ['2025-12-28', 52],
  ])('%s is in ISO week %s', (text, weekOfYear) => {
    expect(LocalDate.parse(text).weekOfYear).toBe(weekOfYear);
  });
});

describe('LocalDate.today', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([
    ['UTC', '2026-09-28'],
    ['Europe/Berlin', '2026-09-29'],
    ['America/Los_Angeles', '2026-09-28'],
    ['Pacific/Kiritimati', '2026-09-29'],
  ])('returns the current date in %s', (timeZone, expected) => {
    vi.useFakeTimers({ now: new Date('2026-09-28T23:30:00Z') });
    expect(LocalDate.today(timeZone).toString()).toBe(expected);
  });

  it('defaults to the system time zone', () => {
    vi.useFakeTimers({ now: new Date('2026-09-28T23:30:00Z') });
    expect(LocalDate.today().equals(LocalDate.today(Temporal.Now.timeZoneId()))).toBe(true);
  });

  it('rejects unknown time zones', () => {
    expectDaisyErrorCausedByRangeError(() => LocalDate.today('Mars/Olympus'), DaisyRangeError);
  });
});

describe('LocalDate.fromDate', () => {
  const lateEvening = new Date('2026-09-28T23:30:00Z');

  it.each([
    ['UTC', '2026-09-28'],
    ['Europe/Berlin', '2026-09-29'],
    ['America/New_York', '2026-09-28'],
  ])('reads the date in %s', (timeZone, expected) => {
    expect(LocalDate.fromDate(lateEvening, timeZone).toString()).toBe(expected);
  });

  it('defaults to the system time zone', () => {
    expect(
      LocalDate.fromDate(lateEvening).equals(
        LocalDate.fromDate(lateEvening, Temporal.Now.timeZoneId()),
      ),
    ).toBe(true);
  });

  it('rejects an invalid Date', () => {
    expect(() => LocalDate.fromDate(new Date(Number.NaN))).toThrow(DaisyRangeError);
  });

  it('rejects unknown time zones', () => {
    expectDaisyErrorCausedByRangeError(
      () => LocalDate.fromDate(lateEvening, 'Mars/Olympus'),
      DaisyRangeError,
    );
  });
});

describe('LocalDate#toDate', () => {
  const date = LocalDate.of(2026, 9, 28);

  it.each([
    ['UTC', '2026-09-28T00:00:00.000Z'],
    ['Europe/Berlin', '2026-09-27T22:00:00.000Z'],
    ['Asia/Tokyo', '2026-09-27T15:00:00.000Z'],
  ])('returns the start of the day in %s', (timeZone, expected) => {
    expect(date.toDate(timeZone).toISOString()).toBe(expected);
  });

  it('uses the first valid instant when midnight is skipped by DST', () => {
    expect(LocalDate.of(2026, 9, 6).toDate('America/Santiago').toISOString()).toBe(
      '2026-09-06T04:00:00.000Z',
    );
  });

  it('defaults to the system time zone', () => {
    expect(date.toDate().getTime()).toBe(date.toDate(Temporal.Now.timeZoneId()).getTime());
  });

  it('round-trips through fromDate in the same zone', () => {
    expect(LocalDate.fromDate(date.toDate('Asia/Tokyo'), 'Asia/Tokyo').equals(date)).toBe(true);
  });

  it('rejects unknown time zones', () => {
    expectDaisyErrorCausedByRangeError(() => date.toDate('Mars/Olympus'), DaisyRangeError);
  });

  it('rejects dates before the earliest Date', () => {
    expectDaisyErrorCausedByRangeError(
      () => LocalDate.parse('-271821-04-19').toDate('UTC'),
      DaisyRangeError,
    );
  });
});

describe('LocalDate comparison', () => {
  const earlier = LocalDate.of(2026, 9, 28);
  const later = LocalDate.of(2026, 10, 1);

  it('orders dates chronologically', () => {
    expect(earlier.compareTo(later)).toBe(-1);
    expect(later.compareTo(earlier)).toBe(1);
    expect(earlier.isBefore(later)).toBe(true);
    expect(later.isAfter(earlier)).toBe(true);
  });

  it('treats separately created equal dates as equal', () => {
    const sameDay = LocalDate.parse('2026-09-28');
    expect(earlier.compareTo(sameDay)).toBe(0);
    expect(earlier.equals(sameDay)).toBe(true);
    expect(earlier.isEqual(sameDay)).toBe(true);
  });

  it('sorts with compare', () => {
    const dates = [later, LocalDate.of(2025, 12, 31), earlier];
    expect(dates.sort(compare).map((date) => date.toString())).toEqual([
      '2025-12-31',
      '2026-09-28',
      '2026-10-01',
    ]);
  });
});

describe('LocalDate string form', () => {
  it('serializes to the ISO date in JSON', () => {
    const date = LocalDate.of(2026, 9, 28);
    expect(date.toJSON()).toBe('2026-09-28');
    expect(JSON.stringify({ date })).toBe('{"date":"2026-09-28"}');
  });

  it('pads years and uses the extended form outside 0000–9999', () => {
    expect(LocalDate.of(99, 1, 1).toString()).toBe('0099-01-01');
    expect(LocalDate.of(10_000, 1, 1).toString()).toBe('+010000-01-01');
    expect(LocalDate.of(-1, 1, 1).toString()).toBe('-000001-01-01');
  });
});
