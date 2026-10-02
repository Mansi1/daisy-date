import { describe, expect, it } from 'vitest';

import { en, LocalDate, LocalDateTime } from '../../../../src';
import type { RelativeNumeric } from '../../../../src';

const RELATIVE_TO = LocalDate.parse('2026-01-15');

const CLOCK_RELATIVE_TO = LocalDateTime.parse('2026-01-15T12:00');

describe('Luxon impl/english relative time, formatRelativeTime(unit, n) as a date n units from 2026-01-15', () => {
  it.each<[string, string, RelativeNumeric, string]>([
    ['english.test.js:6: today (auto)', '2026-01-15', 'auto', 'today'],
    ['english.test.js:7: today (always)', '2026-01-15', 'always', 'in 0 days'],
    ['english.test.js:11: tomorrow (auto)', '2026-01-16', 'auto', 'tomorrow'],
    ['english.test.js:12: tomorrow (always)', '2026-01-16', 'always', 'in 1 day'],
    ['english.test.js:16: yesterday (auto)', '2026-01-14', 'auto', 'yesterday'],
    ['english.test.js:17: yesterday (always)', '2026-01-14', 'always', '1 day ago'],
    ['english.test.js:32: 2 days ago (always)', '2026-01-13', 'always', '2 days ago'],
    ['english.test.js:46: next month (always)', '2026-02-15', 'always', 'in 1 month'],
    ['english.test.js:53: last month (always)', '2025-12-15', 'always', '1 month ago'],
    ['english.test.js:58: in 3 months (auto)', '2026-04-15', 'auto', 'in 3 months'],
    ['english.test.js:60: in 3 months (always)', '2026-04-15', 'always', 'in 3 months'],
  ])('%s', (_name, dateText, numeric, expected) => {
    expect(LocalDate.parse(dateText).formatRelative({ relativeTo: RELATIVE_TO, numeric })).toBe(
      expected,
    );
  });

  it.each<[string, string, RelativeNumeric, string]>([
    ['english.test.js:65: in 1 hour (auto)', '2026-01-15T13:00', 'auto', 'in 1 hour'],
    ['english.test.js:66: in 1 hour (always)', '2026-01-15T13:00', 'always', 'in 1 hour'],
    ['english.test.js:70: in 1 hour, second copy (auto)', '2026-01-15T13:00', 'auto', 'in 1 hour'],
    [
      'english.test.js:72: in 1 hour, second copy (always)',
      '2026-01-15T13:00',
      'always',
      'in 1 hour',
    ],
    ['english.test.js:77: 1 hour ago (auto)', '2026-01-15T11:00', 'auto', '1 hour ago'],
    ['english.test.js:79: 1 hour ago (always)', '2026-01-15T11:00', 'always', '1 hour ago'],
  ])('%s', (_name, dateTimeText, numeric, expected) => {
    expect(
      LocalDateTime.parse(dateTimeText).formatRelative({ relativeTo: CLOCK_RELATIVE_TO, numeric }),
    ).toBe(expected);
  });
});

describe('Luxon impl/english weekdays', () => {
  it('english.test.js:109: narrow, short and long English weekdays', () => {
    expect(en.weekdays.narrow).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S']);
    expect(en.weekdays.abbreviated).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    expect(en.weekdays.wide).toEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]);
  });
});

describe('Luxon impl/english (differs from Luxon on purpose, §6.4: special words only for -2…+2 days)', () => {
  it.each<[string, string, string]>([
    [
      'english.test.js:31: 2 days back with numeric auto is "the day before yesterday"',
      '2026-01-13',
      'the day before yesterday',
    ],
    [
      'english.test.js:44: a month ahead with numeric auto is "in 1 month", no "next month"',
      '2026-02-15',
      'in 1 month',
    ],
    [
      'english.test.js:51: a month back with numeric auto is "1 month ago", no "last month"',
      '2025-12-15',
      '1 month ago',
    ],
  ])('%s', (_name, dateText, expected) => {
    expect(
      LocalDate.parse(dateText).formatRelative({ relativeTo: RELATIVE_TO, numeric: 'auto' }),
    ).toBe(expected);
  });
});
