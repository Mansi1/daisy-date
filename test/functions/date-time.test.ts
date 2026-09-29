import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  DaisyRangeError,
  Duration,
  LocalDate,
  LocalDateTime,
  Period,
  durationUntil,
  endOfDay,
  endOfMonth,
  minus,
  minusDays,
  minusHours,
  minusMilliseconds,
  minusMinutes,
  minusMonths,
  minusSeconds,
  minusWeeks,
  minusYears,
  next,
  plus,
  plusDays,
  plusHours,
  plusMilliseconds,
  plusMinutes,
  plusMonths,
  plusSeconds,
  plusWeeks,
  plusYears,
  startOfDay,
  startOfWeek,
  truncatedTo,
  until,
  withDay,
  withHour,
  withMillisecond,
  withMinute,
  withSecond,
} from '../../src';
import type { DateTimeDifference, TruncationUnit } from '../../src';

const dateTime = (text: string) => LocalDateTime.parse(text);

describe('calendar steps on a LocalDateTime keep the time', () => {
  it.each<[string, (value: LocalDateTime) => LocalDateTime, string, string]>([
    ['plusDays(3)', (value) => plusDays(value, 3), '2026-09-28T14:30', '2026-10-01T14:30'],
    ['plusWeeks(1)', (value) => plusWeeks(value, 1), '2026-12-28T20:00', '2027-01-04T20:00'],
    [
      'plusMonths(1)',
      (value) => plusMonths(value, 1),
      '2026-01-31T23:59:59.999',
      '2026-02-28T23:59:59.999',
    ],
    ['plusYears(1)', (value) => plusYears(value, 1), '2024-02-29T12:00', '2025-02-28T12:00'],
    ['minusDays(1)', (value) => minusDays(value, 1), '2026-03-01T00:00', '2026-02-28T00:00'],
    ['minusWeeks(1)', (value) => minusWeeks(value, 1), '2026-09-28T08:15', '2026-09-21T08:15'],
    ['minusMonths(1)', (value) => minusMonths(value, 1), '2026-03-31T10:00', '2026-02-28T10:00'],
    ['minusYears(4)', (value) => minusYears(value, 4), '2024-02-29T06:00', '2020-02-29T06:00'],
  ])('%s: %s becomes %s', (_call, move, start, expected) => {
    expect(move(dateTime(start))).toEqual(dateTime(expected));
  });

  it('returns the type it was given', () => {
    expectTypeOf(plusDays(dateTime('2026-09-28T14:30'), 1)).toEqualTypeOf<LocalDateTime>();
    expectTypeOf(plusDays(LocalDate.parse('2026-09-28'), 1)).toEqualTypeOf<LocalDate>();
    expectTypeOf(next(dateTime('2026-09-28T14:30'), 'friday')).toEqualTypeOf<LocalDateTime>();
  });
});

describe('clock arithmetic', () => {
  it.each<[string, (value: LocalDateTime) => LocalDateTime, string, string]>([
    ['plusHours(3)', (value) => plusHours(value, 3), '2026-09-28T22:30', '2026-09-29T01:30'],
    ['plusHours(48)', (value) => plusHours(value, 48), '2026-09-28T14:30', '2026-09-30T14:30'],
    ['plusHours(-25)', (value) => plusHours(value, -25), '2026-09-28T14:30', '2026-09-27T13:30'],
    [
      'plusHours(1) ignores DST',
      (value) => plusHours(value, 1),
      '2026-03-29T01:30',
      '2026-03-29T02:30',
    ],
    ['plusMinutes(1)', (value) => plusMinutes(value, 1), '2026-09-28T23:59', '2026-09-29T00:00'],
    [
      'plusSeconds(1)',
      (value) => plusSeconds(value, 1),
      '2026-12-31T23:59:59',
      '2027-01-01T00:00:00',
    ],
    [
      'plusMilliseconds(1)',
      (value) => plusMilliseconds(value, 1),
      '2026-09-28T14:30:00.999',
      '2026-09-28T14:30:01',
    ],
    ['minusHours(2)', (value) => minusHours(value, 2), '2026-09-28T01:00', '2026-09-27T23:00'],
    ['minusMinutes(1)', (value) => minusMinutes(value, 1), '2026-03-01T00:00', '2026-02-28T23:59'],
    [
      'minusSeconds(61)',
      (value) => minusSeconds(value, 61),
      '2026-09-28T00:00:00',
      '2026-09-27T23:58:59',
    ],
    [
      'minusMilliseconds(1)',
      (value) => minusMilliseconds(value, 1),
      '2026-09-28T00:00:00',
      '2026-09-27T23:59:59.999',
    ],
  ])('%s: %s becomes %s', (_call, move, start, expected) => {
    expect(move(dateTime(start))).toEqual(dateTime(expected));
  });

  it.each<[(value: LocalDateTime, amount: number) => LocalDateTime, string]>([
    [plusHours, 'Number of hours must be an integer, got 1.5'],
    [plusMinutes, 'Number of minutes must be an integer, got 1.5'],
    [plusSeconds, 'Number of seconds must be an integer, got 1.5'],
    [minusMilliseconds, 'Number of milliseconds must be an integer, got 1.5'],
  ])('%o rejects fractional amounts', (move, message) => {
    expect(() => move(dateTime('2026-09-28T14:30'), 1.5)).toThrow(new DaisyRangeError(message));
  });

  it('rejects results after the last supported date-time', () => {
    expect(() => plusMilliseconds(dateTime('+275760-09-13T23:59:59.999'), 1)).toThrow(
      new DaisyRangeError(
        '+275760-09-13T23:59:59.999 moved by 1 milliseconds is outside the supported range',
      ),
    );
  });
});

describe('plus and minus with a Period or Duration', () => {
  it.each<[string, Period | Duration, string]>([
    ['2026-01-31T14:30', Period.parse('P1M1D'), '2026-03-01T14:30'],
    ['2026-09-28T22:00', Duration.parse('PT3H'), '2026-09-29T01:00'],
    ['2026-09-28T22:00', Duration.parse('PT1H-30M'), '2026-09-28T22:30'],
    ['2026-09-28T14:30', Duration.parse('PT0.5S'), '2026-09-28T14:30:00.500'],
  ])('%s plus %s is %s', (start, amount, expected) => {
    expect(plus(dateTime(start), amount)).toEqual(dateTime(expected));
  });

  it.each<[string, Period | Duration, string]>([
    ['2026-09-28T01:00', Duration.parse('PT90M'), '2026-09-27T23:30'],
    ['2026-03-31T10:00', Period.parse('P1M'), '2026-02-28T10:00'],
  ])('%s minus %s is %s', (start, amount, expected) => {
    expect(minus(dateTime(start), amount)).toEqual(dateTime(expected));
  });
});

describe('date and time adjusters on a LocalDateTime', () => {
  const thursday = dateTime('2024-02-29T14:30:15.250');

  it.each<[string, (value: LocalDateTime) => LocalDateTime, string]>([
    ['withDay(1)', (value) => withDay(value, 1), '2024-02-01T14:30:15.250'],
    ['withHour(9)', (value) => withHour(value, 9), '2024-02-29T09:30:15.250'],
    ['withMinute(0)', (value) => withMinute(value, 0), '2024-02-29T14:00:15.250'],
    ['withSecond(59)', (value) => withSecond(value, 59), '2024-02-29T14:30:59.250'],
    ['withMillisecond(0)', (value) => withMillisecond(value, 0), '2024-02-29T14:30:15'],
    ['startOfDay()', startOfDay, '2024-02-29T00:00'],
    ['endOfDay()', endOfDay, '2024-02-29T23:59:59.999'],
    ['startOfWeek()', (value) => startOfWeek(value), '2024-02-26T00:00'],
    ['endOfMonth()', (value) => endOfMonth(value), '2024-02-29T23:59:59.999'],
    ["next('monday')", (value) => next(value, 'monday'), '2024-03-04T14:30:15.250'],
  ])('Thursday 2024-02-29T14:30:15.250 %s is %s', (_call, adjust, expected) => {
    expect(adjust(thursday)).toEqual(dateTime(expected));
  });

  it.each<[(value: LocalDateTime, field: number) => LocalDateTime, number, string]>([
    [withHour, 24, 'Cannot set hour 24 on 2024-02-29T14:30:15.250'],
    [withMinute, 60, 'Cannot set minute 60 on 2024-02-29T14:30:15.250'],
    [withSecond, -1, 'Cannot set second -1 on 2024-02-29T14:30:15.250'],
    [withMillisecond, 1000, 'Cannot set millisecond 1000 on 2024-02-29T14:30:15.250'],
    [withMinute, 1.5, 'Minute must be an integer, got 1.5'],
  ])('%o rejects %s', (adjust, field, message) => {
    expect(() => adjust(thursday, field)).toThrow(new DaisyRangeError(message));
  });

  it.each<[TruncationUnit, string]>([
    ['day', '2024-02-29T00:00'],
    ['hour', '2024-02-29T14:00'],
    ['minute', '2024-02-29T14:30'],
    ['second', '2024-02-29T14:30:15'],
  ])('truncates to the %s', (unit, expected) => {
    expect(truncatedTo(thursday, unit)).toEqual(dateTime(expected));
  });

  it('rejects an unknown truncation unit', () => {
    expect(() => truncatedTo(thursday, 'week' as TruncationUnit)).toThrow(
      new DaisyRangeError('Truncation unit must be one of day, hour, minute, second, got week'),
    );
  });
});

describe('until and durationUntil between date-times', () => {
  it.each<[string, string, DateTimeDifference]>([
    [
      '2026-09-28T14:30',
      '2027-11-30T16:45:10.500',
      {
        period: Period.parse('P1Y2M2D'),
        duration: Duration.of({ hours: 2, minutes: 15, seconds: 10, milliseconds: 500 }),
      },
    ],
    [
      '2026-09-28T22:00',
      '2026-09-29T01:30',
      { period: Period.parse('P0D'), duration: Duration.parse('PT3H30M') },
    ],
    [
      '2026-09-29T01:30',
      '2026-09-28T22:00',
      { period: Period.parse('P0D'), duration: Duration.parse('-PT3H30M') },
    ],
    [
      '2026-09-28T14:30',
      '2026-10-01T10:00',
      { period: Period.parse('P2D'), duration: Duration.parse('PT19H30M') },
    ],
    [
      '2024-02-29T12:00',
      '2025-02-28T12:00',
      { period: Period.parse('P11M30D'), duration: Duration.parse('PT0S') },
    ],
  ])('from %s to %s', (start, end, expected) => {
    expect(until(dateTime(start), dateTime(end))).toEqual(expected);
  });

  it.each([
    [
      '2026-09-28T14:30',
      '2026-10-01T10:00',
      { hours: 67, minutes: 30, seconds: 0, milliseconds: 0 },
    ],
    [
      '2026-09-28T22:00',
      '2026-09-28T21:59:59.999',
      { hours: 0, minutes: 0, seconds: 0, milliseconds: -1 },
    ],
    ['2026-09-28T22:00', '2026-09-28T22:00', { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }],
  ])('the duration from %s to %s is %o', (start, end, expected) => {
    expect(durationUntil(dateTime(start), dateTime(end))).toEqual(expected);
  });

  it('rejects measuring between a date and a date-time', () => {
    expect(() =>
      until(LocalDate.parse('2026-09-28'), dateTime('2026-09-28T00:00') as never),
    ).toThrow(new TypeError('Cannot measure from 2026-09-28 to 2026-09-28T00:00:00'));
  });
});

describe('LocalDateTime methods', () => {
  const thursday = dateTime('2024-02-29T14:30:15.250');

  it.each<[string, string, (value: LocalDateTime) => LocalDateTime]>([
    ['plusDays(1)', '2024-03-01T14:30:15.250', (value) => value.plusDays(1)],
    ['plusWeeks(1)', '2024-03-07T14:30:15.250', (value) => value.plusWeeks(1)],
    ['plusMonths(1)', '2024-03-29T14:30:15.250', (value) => value.plusMonths(1)],
    ['plusYears(1)', '2025-02-28T14:30:15.250', (value) => value.plusYears(1)],
    ['minusDays(1)', '2024-02-28T14:30:15.250', (value) => value.minusDays(1)],
    ['minusWeeks(1)', '2024-02-22T14:30:15.250', (value) => value.minusWeeks(1)],
    ['minusMonths(1)', '2024-01-29T14:30:15.250', (value) => value.minusMonths(1)],
    ['minusYears(1)', '2023-02-28T14:30:15.250', (value) => value.minusYears(1)],
    ['plusHours(10)', '2024-03-01T00:30:15.250', (value) => value.plusHours(10)],
    ['plusMinutes(30)', '2024-02-29T15:00:15.250', (value) => value.plusMinutes(30)],
    ['plusSeconds(45)', '2024-02-29T14:31:00.250', (value) => value.plusSeconds(45)],
    ['plusMilliseconds(750)', '2024-02-29T14:30:16', (value) => value.plusMilliseconds(750)],
    ['minusHours(15)', '2024-02-28T23:30:15.250', (value) => value.minusHours(15)],
    ['minusMinutes(31)', '2024-02-29T13:59:15.250', (value) => value.minusMinutes(31)],
    ['minusSeconds(16)', '2024-02-29T14:29:59.250', (value) => value.minusSeconds(16)],
    ['minusMilliseconds(251)', '2024-02-29T14:30:14.999', (value) => value.minusMilliseconds(251)],
    ['plus(P1D)', '2024-03-01T14:30:15.250', (value) => value.plus(Period.parse('P1D'))],
    ['minus(PT30M)', '2024-02-29T14:00:15.250', (value) => value.minus(Duration.parse('PT30M'))],
    ['withYear(2025)', '2025-02-28T14:30:15.250', (value) => value.withYear(2025)],
    ['withMonth(4)', '2024-04-29T14:30:15.250', (value) => value.withMonth(4)],
    ['withDay(1)', '2024-02-01T14:30:15.250', (value) => value.withDay(1)],
    ['withHour(9)', '2024-02-29T09:30:15.250', (value) => value.withHour(9)],
    ['withMinute(0)', '2024-02-29T14:00:15.250', (value) => value.withMinute(0)],
    ['withSecond(0)', '2024-02-29T14:30:00.250', (value) => value.withSecond(0)],
    ['withMillisecond(0)', '2024-02-29T14:30:15', (value) => value.withMillisecond(0)],
    ['startOfDay()', '2024-02-29T00:00', (value) => value.startOfDay()],
    ['endOfDay()', '2024-02-29T23:59:59.999', (value) => value.endOfDay()],
    ["truncatedTo('hour')", '2024-02-29T14:00', (value) => value.truncatedTo('hour')],
    ['startOfWeek()', '2024-02-26T00:00', (value) => value.startOfWeek()],
    ["startOfWeek('sunday')", '2024-02-25T00:00', (value) => value.startOfWeek('sunday')],
    ['endOfWeek()', '2024-03-03T23:59:59.999', (value) => value.endOfWeek()],
    ["endOfWeek('sunday')", '2024-03-02T23:59:59.999', (value) => value.endOfWeek('sunday')],
    ['startOfMonth()', '2024-02-01T00:00', (value) => value.startOfMonth()],
    ['endOfMonth()', '2024-02-29T23:59:59.999', (value) => value.endOfMonth()],
    ['startOfYear()', '2024-01-01T00:00', (value) => value.startOfYear()],
    ['endOfYear()', '2024-12-31T23:59:59.999', (value) => value.endOfYear()],
    ["next('monday')", '2024-03-04T14:30:15.250', (value) => value.next('monday')],
    ["nextOrSame('thursday')", '2024-02-29T14:30:15.250', (value) => value.nextOrSame('thursday')],
    ["previous('monday')", '2024-02-26T14:30:15.250', (value) => value.previous('monday')],
    [
      "previousOrSame('friday')",
      '2024-02-23T14:30:15.250',
      (value) => value.previousOrSame('friday'),
    ],
  ])('Thursday 2024-02-29T14:30:15.250.%s is %s', (_call, expected, operate) => {
    expect(operate(thursday)).toEqual(dateTime(expected));
  });

  it('measures until another date-time', () => {
    expect(thursday.until(dateTime('2024-03-01T15:00'))).toEqual({
      period: Period.parse('P1D'),
      duration: Duration.of({ minutes: 29, seconds: 44, milliseconds: 750 }),
    });
    expect(thursday.durationUntil(dateTime('2024-03-01T15:00'))).toEqual({
      hours: 24,
      minutes: 29,
      seconds: 44,
      milliseconds: 750,
    });
  });
});
