import type {} from 'temporal-polyfill/global';
import { describe, expect, it } from 'vitest';

import { DaisyRangeError } from '../../src';
import { isoWeekOfYear } from '../../src/internal/calendar-fields';
import { fromPlainDate } from '../../src/local-date';
import { fromPlainDateTime } from '../../src/local-date-time';

describe('isoWeekOfYear', () => {
  it('returns the ISO week of an ISO date', () => {
    expect(isoWeekOfYear(Temporal.PlainDate.from('2026-12-31'), '2026-12-31')).toBe(53);
  });

  it('throws for a calendar without ISO weeks', () => {
    const hebrewDate = Temporal.PlainDate.from('2026-09-28').withCalendar('hebrew');
    expect(() => isoWeekOfYear(hebrewDate, 'the Hebrew date')).toThrow(
      new DaisyRangeError('No ISO week of year for the Hebrew date'),
    );
  });

  it('surfaces through LocalDate#weekOfYear', () => {
    const hebrewDate = fromPlainDate(Temporal.PlainDate.from('2026-09-28').withCalendar('hebrew'));
    expect(() => hebrewDate.weekOfYear).toThrow(
      new DaisyRangeError('No ISO week of year for 2026-09-28[u-ca=hebrew]'),
    );
  });

  it('surfaces through LocalDateTime#weekOfYear', () => {
    const hebrewDateTime = fromPlainDateTime(
      Temporal.PlainDateTime.from('2026-09-28T14:30').withCalendar('hebrew'),
    );
    expect(() => hebrewDateTime.weekOfYear).toThrow(
      new DaisyRangeError('No ISO week of year for 2026-09-28T14:30:00[u-ca=hebrew]'),
    );
  });
});
