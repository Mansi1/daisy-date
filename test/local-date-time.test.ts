import { inspect } from 'node:util';

import type {} from 'temporal-polyfill/global';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  DaisyParseError,
  DaisyRangeError,
  LocalDate,
  LocalDateTime,
  atStartOfDay,
  atTime,
  compare,
  configureTemporal,
} from '../src';
import { SYSTEM_TIME_ZONE, useSystemTimeZone } from './support/system-time-zone';

type DateTimeFields = [
  year: number,
  month: number,
  day: number,
  hour?: number,
  minute?: number,
  second?: number,
  millisecond?: number,
];
type TimeOfDay = [hour: number, minute?: number, second?: number, millisecond?: number];

const dateTime = (text: string) => LocalDateTime.parse(text);

afterEach(() => {
  configureTemporal(undefined);
  vi.useRealTimers();
});

describe('LocalDateTime.of', () => {
  it('creates a date-time from its fields', () => {
    expect(LocalDateTime.of(2026, 9, 28, 14, 30, 15, 250).toString()).toBe(
      '2026-09-28T14:30:15.250',
    );
  });

  it('defaults the time fields to zero', () => {
    expect(LocalDateTime.of(2026, 9, 28).toString()).toBe('2026-09-28T00:00:00');
    expect(LocalDateTime.of(2026, 9, 28, 14).toString()).toBe('2026-09-28T14:00:00');
  });

  it.each<[DateTimeFields, string]>([
    [[2026, 2, 29, 10], 'Invalid date-time: 2026, 2, 29, 10, 0, 0, 0'],
    [[2026, 9, 28, 24], 'Invalid date-time: 2026, 9, 28, 24, 0, 0, 0'],
    [[2026, 9, 28, 14, 60], 'Invalid date-time: 2026, 9, 28, 14, 60, 0, 0'],
    [[2026, 9, 28, 14, 30, 60], 'Invalid date-time: 2026, 9, 28, 14, 30, 60, 0'],
    [[2026, 9, 28, 14, 30, 0, 1000], 'Invalid date-time: 2026, 9, 28, 14, 30, 0, 1000'],
    [[2026, 9, 28, -1], 'Invalid date-time: 2026, 9, 28, -1, 0, 0, 0'],
  ])('rejects %o', (fields, message) => {
    expect(() => LocalDateTime.of(...fields)).toThrow(new DaisyRangeError(message));
  });

  it.each<[DateTimeFields, string]>([
    [[2026, 9, 28, 1.5], 'Hour must be an integer, got 1.5'],
    [[2026, 9, 28, 1, 0.5], 'Minute must be an integer, got 0.5'],
    [[2026, 9, 28, 1, 0, Number.NaN], 'Second must be an integer, got NaN'],
    [[2026, 9, 28, 1, 0, 0, 0.5], 'Millisecond must be an integer, got 0.5'],
  ])('rejects fractional fields %o', (fields, message) => {
    expect(() => LocalDateTime.of(...fields)).toThrow(new DaisyRangeError(message));
  });
});

describe('LocalDateTime.parse', () => {
  it.each([
    ['2026-09-28T14:30', '2026-09-28T14:30:00'],
    ['2026-09-28T14:30:15', '2026-09-28T14:30:15'],
    ['2026-09-28T14:30:15.250', '2026-09-28T14:30:15.250'],
    ['2026-09-28T14:30:15.25', '2026-09-28T14:30:15.250'],
    ['2026-09-28T14:30:15.250000000', '2026-09-28T14:30:15.250'],
    ['2026-09-28T00:00:00.000', '2026-09-28T00:00:00'],
    ['+010000-01-01T00:00', '+010000-01-01T00:00:00'],
  ])('parses %s as %s', (text, expected) => {
    expect(LocalDateTime.parse(text).toString()).toBe(expected);
  });

  it.each([
    '2026-09-28',
    '2026-09-28 14:30',
    '2026-09-28t14:30',
    '2026-09-28T14',
    '2026-09-28T14:30Z',
    '2026-09-28T14:30+02:00',
    '2026-09-28T14:30:15.',
    '2026-09-28T14:30.5',
    '',
  ])('rejects the non-ISO date-time %j', (text) => {
    expect(() => LocalDateTime.parse(text)).toThrow(
      new DaisyParseError('Expected an ISO 8601 date-time (yyyy-MM-ddTHH:mm:ss.SSS)', {
        input: text,
      }),
    );
  });

  it('rejects precision below one millisecond', () => {
    expect(() => LocalDateTime.parse('2026-09-28T14:30:15.2501')).toThrow(
      new DaisyParseError('LocalDateTime is precise to milliseconds', {
        input: '2026-09-28T14:30:15.2501',
      }),
    );
  });

  it.each(['2026-02-29T10:00', '2026-09-28T24:00', '2026-09-28T14:60', '2026-13-01T00:00'])(
    'rejects the impossible date-time %s',
    (text) => {
      expect(() => LocalDateTime.parse(text)).toThrow(
        new DaisyParseError('Invalid ISO 8601 date-time', { input: text }),
      );
    },
  );
});

describe('LocalDateTime getters', () => {
  it('reads the calendar and clock fields', () => {
    const lastMillisecond = dateTime('2026-12-31T23:59:59.999');
    expect([lastMillisecond.year, lastMillisecond.month, lastMillisecond.day]).toEqual([
      2026, 12, 31,
    ]);
    expect(lastMillisecond.dayOfWeek).toBe('thursday');
    expect(lastMillisecond.dayOfYear).toBe(365);
    expect(lastMillisecond.weekOfYear).toBe(53);
    expect(lastMillisecond.daysInMonth).toBe(31);
    expect(lastMillisecond.daysInYear).toBe(365);
    expect(lastMillisecond.isLeapYear()).toBe(false);
    expect([
      lastMillisecond.hour,
      lastMillisecond.minute,
      lastMillisecond.second,
      lastMillisecond.millisecond,
    ]).toEqual([23, 59, 59, 999]);
  });

  it('reports leap years', () => {
    expect(dateTime('2024-02-29T12:00').isLeapYear()).toBe(true);
  });

  it('returns the date part with toLocalDate', () => {
    expect(dateTime('2026-12-31T23:59:59.999').toLocalDate()).toEqual(
      LocalDate.parse('2026-12-31'),
    );
  });
});

describe('LocalDateTime.now', () => {
  it.each([
    ['UTC', '2026-09-28T23:30:15.123'],
    ['Europe/Berlin', '2026-09-29T01:30:15.123'],
    ['America/Los_Angeles', '2026-09-28T16:30:15.123'],
  ])('returns the current date-time in %s', (timeZone, expected) => {
    vi.useFakeTimers({ now: new Date('2026-09-28T23:30:15.123Z') });
    expect(LocalDateTime.now(timeZone)).toEqual(dateTime(expected));
  });

  it('defaults to the system time zone', () => {
    vi.useFakeTimers({ now: new Date('2026-09-28T23:30:15.123Z') });
    useSystemTimeZone(SYSTEM_TIME_ZONE);
    expect(LocalDateTime.now()).toEqual(dateTime('2026-09-29T13:30:15.123'));
  });

  it('drops microseconds and nanoseconds', () => {
    configureTemporal({
      PlainDate: Temporal.PlainDate,
      PlainDateTime: Temporal.PlainDateTime,
      Duration: Temporal.Duration,
      Instant: Temporal.Instant,
      Now: {
        plainDateISO: () => Temporal.PlainDate.from('2026-09-28'),
        plainDateTimeISO: () => Temporal.PlainDateTime.from('2026-09-28T14:30:15.123456789'),
        timeZoneId: () => 'UTC',
      },
    });
    expect(LocalDateTime.now().toString()).toBe('2026-09-28T14:30:15.123');
  });

  it('rejects unknown time zones', () => {
    expect(() => LocalDateTime.now('Mars/Olympus')).toThrow(
      new DaisyRangeError('Invalid time zone: Mars/Olympus'),
    );
  });
});

describe('LocalDateTime.fromDate', () => {
  const lateEvening = new Date('2026-09-28T23:30:15.123Z');

  it.each([
    ['UTC', '2026-09-28T23:30:15.123'],
    ['Asia/Tokyo', '2026-09-29T08:30:15.123'],
    ['America/New_York', '2026-09-28T19:30:15.123'],
  ])('reads the wall-clock time in %s', (timeZone, expected) => {
    expect(LocalDateTime.fromDate(lateEvening, timeZone)).toEqual(dateTime(expected));
  });

  it('defaults to the system time zone', () => {
    useSystemTimeZone(SYSTEM_TIME_ZONE);
    expect(LocalDateTime.fromDate(lateEvening)).toEqual(dateTime('2026-09-29T13:30:15.123'));
  });

  it('rejects an invalid Date', () => {
    expect(() => LocalDateTime.fromDate(new Date(Number.NaN))).toThrow(
      new DaisyRangeError('Cannot convert an invalid Date'),
    );
  });

  it('rejects unknown time zones', () => {
    expect(() => LocalDateTime.fromDate(lateEvening, 'Mars/Olympus')).toThrow(
      new DaisyRangeError(
        'Cannot convert 2026-09-28T23:30:15.123Z to a date-time in time zone Mars/Olympus',
      ),
    );
  });
});

describe('LocalDateTime#toDate', () => {
  it.each([
    ['2026-09-28T14:30', 'UTC', '2026-09-28T14:30:00.000Z'],
    ['2026-09-28T14:30:15.250', 'Europe/Berlin', '2026-09-28T12:30:15.250Z'],
    ['2026-03-29T02:30', 'Europe/Berlin', '2026-03-29T01:30:00.000Z'],
    ['2026-10-25T02:30', 'Europe/Berlin', '2026-10-25T00:30:00.000Z'],
  ])('converts %s in %s to %s', (text, timeZone, expected) => {
    expect(dateTime(text).toDate(timeZone).toISOString()).toBe(expected);
  });

  it('defaults to the system time zone', () => {
    useSystemTimeZone(SYSTEM_TIME_ZONE);
    expect(dateTime('2026-09-28T14:30').toDate().toISOString()).toBe('2026-09-28T00:30:00.000Z');
  });

  it('rejects unknown time zones', () => {
    expect(() => dateTime('2026-09-28T14:30').toDate('Mars/Olympus')).toThrow(
      new DaisyRangeError('Cannot convert 2026-09-28T14:30:00 to a Date in time zone Mars/Olympus'),
    );
  });
});

describe('LocalDateTime comparison', () => {
  it('orders date-times down to the millisecond', () => {
    expect(dateTime('2026-09-28T14:30:00.001').isAfter(dateTime('2026-09-28T14:30'))).toBe(true);
    expect(dateTime('2026-09-28T23:59').isBefore(dateTime('2026-09-29T00:00'))).toBe(true);
    expect(dateTime('2026-09-28T14:30').compareTo(dateTime('2026-09-28T14:30:00.000'))).toBe(0);
  });

  it('sorts with compare', () => {
    const dateTimes = [dateTime('2026-09-29T08:00'), dateTime('2026-09-28T23:00')];
    expect(dateTimes.sort(compare)).toEqual([
      dateTime('2026-09-28T23:00'),
      dateTime('2026-09-29T08:00'),
    ]);
  });
});

describe('LocalDateTime string form', () => {
  it('serializes to ISO 8601 in JSON', () => {
    expect(JSON.stringify({ start: dateTime('2026-09-28T14:30') })).toBe(
      '{"start":"2026-09-28T14:30:00"}',
    );
  });

  it('shows the ISO form when inspected in Node', () => {
    expect(inspect(dateTime('2026-09-28T14:30:15.250'))).toBe(
      'LocalDateTime(2026-09-28T14:30:15.250)',
    );
  });
});

describe('atTime and atStartOfDay', () => {
  const date = LocalDate.parse('2026-09-28');

  it.each<[TimeOfDay, string]>([
    [[14], '2026-09-28T14:00'],
    [[14, 30], '2026-09-28T14:30'],
    [[14, 30, 15], '2026-09-28T14:30:15'],
    [[14, 30, 15, 250], '2026-09-28T14:30:15.250'],
  ])('combines 2026-09-28 with %o', (time, expected) => {
    expect(atTime(date, ...time)).toEqual(dateTime(expected));
    expect(date.atTime(...time)).toEqual(dateTime(expected));
  });

  it('rejects times that do not exist', () => {
    expect(() => date.atTime(24)).toThrow(
      new DaisyRangeError('Invalid date-time: 2026, 9, 28, 24, 0, 0, 0'),
    );
  });

  it('starts the day at midnight', () => {
    expect(atStartOfDay(date)).toEqual(dateTime('2026-09-28T00:00'));
    expect(date.atStartOfDay()).toEqual(dateTime('2026-09-28T00:00'));
  });
});
