import { afterEach, describe, expect, expectTypeOf, it } from 'vitest';

import {
  DaisyRangeError,
  Duration,
  LocalDate,
  LocalDateRange,
  LocalDateTime,
  Period,
  abs,
  configureTemporal,
  equals,
  format,
  isAfter,
  isBefore,
  isEqual,
  minus,
  negated,
  normalized,
  plus,
  plusBusinessDays,
  plusDays,
  startOfWeek,
  toDate,
  toLocalDate,
  until,
  withMonth,
} from '../../src';
import type { DaisyValue, DateTimeDifference } from '../../src';
import { SYSTEM_TIME_ZONE, useSystemTimeZone } from '../support/system-time-zone';

const date = (text: string) => LocalDate.parse(text);
const dateTime = (text: string) => LocalDateTime.parse(text);
const period = (text: string) => Period.parse(text);
const duration = (text: string) => Duration.parse(text);
const range = (text: string) => LocalDateRange.parse(text);

afterEach(() => {
  configureTemporal(undefined);
});

describe('isBefore, isAfter and isEqual', () => {
  it.each<[string, string, boolean, boolean, boolean]>([
    ['2026-09-28', '2026-09-29', true, false, false],
    ['2026-09-29', '2026-09-28', false, true, false],
    ['2026-09-28', '2026-09-28', false, false, true],
  ])('%s vs %s: before %s, after %s, equal %s', (left, right, before, after, same) => {
    expect(isBefore(date(left), date(right))).toBe(before);
    expect(isAfter(date(left), date(right))).toBe(after);
    expect(isEqual(date(left), date(right))).toBe(same);
  });

  it('work for date-times and durations', () => {
    expect(isBefore(dateTime('2026-09-28T14:00'), dateTime('2026-09-28T14:00:00.001'))).toBe(true);
    expect(isEqual(duration('PT1H'), duration('PT60M'))).toBe(true);
    expect(isAfter(duration('PT1S'), duration('PT999.999S'))).toBe(false);
  });
});

describe('equals', () => {
  it.each<[string, DaisyValue, DaisyValue, boolean]>([
    ['equal dates', date('2026-09-28'), date('2026-09-28'), true],
    ['different dates', date('2026-09-28'), date('2026-09-29'), false],
    ['equal date-times', dateTime('2026-09-28T14:00'), dateTime('2026-09-28T14:00:00.000'), true],
    ['different date-times', dateTime('2026-09-28T14:00'), dateTime('2026-09-28T14:01'), false],
    ['durations of the same length', duration('PT1H'), duration('PT60M'), true],
    ['durations of different length', duration('PT1H'), duration('PT61M'), false],
    ['equal periods', period('P1Y2M'), period('P1Y2M'), true],
    ['periods equal only after normalizing', period('P12M'), period('P1Y'), false],
    ['equal ranges', range('2026-10-01/2026-10-03'), range('2026-10-01/2026-10-03'), true],
    [
      'ranges with another end',
      range('2026-10-01/2026-10-03'),
      range('2026-10-01/2026-10-04'),
      false,
    ],
    [
      'ranges with another start',
      range('2026-10-01/2026-10-03'),
      range('2026-09-30/2026-10-03'),
      false,
    ],
    ['a date and a date-time', date('2026-09-28'), dateTime('2026-09-28T00:00'), false],
    ['a period and a duration', period('P0D'), duration('PT0S'), false],
  ])('%s: %s', (_case, left, right, expected) => {
    expect(equals(left, right)).toBe(expected);
  });

  it('backs the equals methods', () => {
    expect(period('P1D').equals(period('P1D'))).toBe(true);
    expect(range('2026-10-01/2026-10-03').equals(range('2026-10-01/2026-10-04'))).toBe(false);
    expect(duration('PT1H').equals(duration('PT60M'))).toBe(true);
  });
});

describe('toDate and toLocalDate', () => {
  it.each<[LocalDate | LocalDateTime, string, string]>([
    [date('2026-09-28'), 'UTC', '2026-09-28T00:00:00.000Z'],
    [date('2026-09-28'), 'Europe/Berlin', '2026-09-27T22:00:00.000Z'],
    [dateTime('2026-09-28T14:30'), 'Europe/Berlin', '2026-09-28T12:30:00.000Z'],
    [dateTime('2026-03-29T02:30'), 'Europe/Berlin', '2026-03-29T01:30:00.000Z'],
  ])('converts %o in %s to %s', (value, timeZone, expected) => {
    expect(toDate(value, timeZone).toISOString()).toBe(expected);
  });

  it('defaults to the system time zone', () => {
    useSystemTimeZone(SYSTEM_TIME_ZONE);
    expect(toDate(date('2026-09-28')).toISOString()).toBe('2026-09-27T10:00:00.000Z');
  });

  it('rejects unknown time zones', () => {
    expect(() => toDate(dateTime('2026-09-28T14:30'), 'Mars/Olympus')).toThrow(
      new DaisyRangeError('Cannot convert 2026-09-28T14:30:00 to a Date in time zone Mars/Olympus'),
    );
  });

  it('drops the time with toLocalDate', () => {
    expect(toLocalDate(dateTime('2026-09-28T23:59:59.999'))).toEqual(date('2026-09-28'));
  });
});

describe('overloads return the matching types', () => {
  it('for arithmetic', () => {
    expectTypeOf(plus(date('2026-09-28'), period('P1D'))).toEqualTypeOf<LocalDate>();
    expectTypeOf(plus(dateTime('2026-09-28T00:00'), period('P1D'))).toEqualTypeOf<LocalDateTime>();
    expectTypeOf(
      plus(dateTime('2026-09-28T00:00'), duration('PT1H')),
    ).toEqualTypeOf<LocalDateTime>();
    expectTypeOf(plus(period('P1D'), period('P1D'))).toEqualTypeOf<Period>();
    expectTypeOf(minus(duration('PT1H'), duration('PT1H'))).toEqualTypeOf<Duration>();
    expectTypeOf(until(date('2026-09-28'), date('2026-09-29'))).toEqualTypeOf<Period>();
    expectTypeOf(
      until(dateTime('2026-09-28T00:00'), dateTime('2026-09-29T00:00')),
    ).toEqualTypeOf<DateTimeDifference>();
  });

  it('for amounts', () => {
    expectTypeOf(negated(period('P1D'))).toEqualTypeOf<Period>();
    expectTypeOf(negated(duration('PT1H'))).toEqualTypeOf<Duration>();
    expectTypeOf(abs(duration('PT1H'))).toEqualTypeOf<Duration>();
    expectTypeOf(normalized(period('P14M'))).toEqualTypeOf<Period>();
  });

  it('for generic date functions', () => {
    expectTypeOf(plusDays(date('2026-09-28'), 1)).toEqualTypeOf<LocalDate>();
    expectTypeOf(withMonth(dateTime('2026-09-28T00:00'), 1)).toEqualTypeOf<LocalDateTime>();
    expectTypeOf(startOfWeek(dateTime('2026-09-28T00:00'))).toEqualTypeOf<LocalDateTime>();
    expectTypeOf(plusBusinessDays(date('2026-09-28'), 1)).toEqualTypeOf<LocalDate>();
  });

  it('for format, equals and conversions', () => {
    expectTypeOf(format(date('2026-09-28'), 'yyyy')).toEqualTypeOf<string>();
    expectTypeOf(format(period('P1D'), { style: 'narrow' })).toEqualTypeOf<string>();
    expectTypeOf(equals(date('2026-09-28'), date('2026-09-28'))).toEqualTypeOf<boolean>();
    expectTypeOf(toDate(date('2026-09-28'))).toEqualTypeOf<Date>();
  });
});
