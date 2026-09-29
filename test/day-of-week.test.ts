import { describe, expect, it } from 'vitest';

import {
  DAY_OF_WEEK,
  DaisyRangeError,
  dayOfWeekFromIsoNumber,
  dayOfWeekToIsoNumber,
  isDayOfWeek,
  shiftDayOfWeek,
} from '../src';
import type { DayOfWeek } from '../src';

describe('DAY_OF_WEEK', () => {
  it('lists the days in ISO order, starting with Monday', () => {
    expect(DAY_OF_WEEK).toEqual([
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ]);
  });
});

describe('isDayOfWeek', () => {
  it.each(['monday', 'thursday', 'sunday'])('accepts %s', (value) => {
    expect(isDayOfWeek(value)).toBe(true);
  });

  it.each(['Monday', 'mon', '', 1, null, undefined])('rejects %s', (value) => {
    expect(isDayOfWeek(value)).toBe(false);
  });
});

describe('ISO number conversion', () => {
  it.each([
    [1, 'monday'],
    [5, 'friday'],
    [7, 'sunday'],
  ] as const)('maps %s to %s and back', (isoNumber, dayOfWeek) => {
    expect(dayOfWeekFromIsoNumber(isoNumber)).toBe(dayOfWeek);
    expect(dayOfWeekToIsoNumber(dayOfWeek)).toBe(isoNumber);
  });

  it('matches Temporal dayOfWeek numbering', () => {
    expect(dayOfWeekFromIsoNumber(Temporal.PlainDate.from('2026-09-28').dayOfWeek)).toBe('monday');
    expect(dayOfWeekFromIsoNumber(Temporal.PlainDate.from('2026-10-04').dayOfWeek)).toBe('sunday');
  });

  it.each([0, 8, 2.5, Number.NaN])('throws DaisyRangeError for %s', (isoNumber) => {
    expect(() => dayOfWeekFromIsoNumber(isoNumber)).toThrow(DaisyRangeError);
    expect(() => dayOfWeekFromIsoNumber(isoNumber)).toThrow(
      `ISO day of week must be an integer from 1 to 7, got ${String(isoNumber)}`,
    );
  });
});

describe('shiftDayOfWeek', () => {
  it.each<[DayOfWeek, number, DayOfWeek]>([
    ['monday', 0, 'monday'],
    ['monday', 1, 'tuesday'],
    ['saturday', 2, 'monday'],
    ['sunday', 1, 'monday'],
    ['monday', -1, 'sunday'],
    ['wednesday', -10, 'sunday'],
    ['thursday', 7, 'thursday'],
    ['thursday', -14, 'thursday'],
    ['friday', 1_000_003, 'tuesday'],
  ])('%s shifted by %s days is %s', (start, days, expected) => {
    expect(shiftDayOfWeek(start, days)).toBe(expected);
  });

  it('agrees with Temporal date arithmetic', () => {
    const monday = Temporal.PlainDate.from('2026-09-28');
    const dayShifts = Array.from({ length: 61 }, (_unused, index) => index - 30);
    for (const days of dayShifts) {
      expect(shiftDayOfWeek('monday', days)).toBe(
        dayOfWeekFromIsoNumber(monday.add({ days }).dayOfWeek),
      );
    }
  });

  it('rejects fractional days', () => {
    expect(() => shiftDayOfWeek('monday', 1.5)).toThrow(DaisyRangeError);
  });
});
