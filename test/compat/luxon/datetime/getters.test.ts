import { describe, expect, it } from 'vitest';

import { LocalDate, LocalDateTime } from '../../../../src';
import type { DayOfWeek } from '../../../../src';
import { fr } from '../../../../src/locale/fr';

const LUXON_GETTERS_FIXTURE = LocalDateTime.parse('1982-05-25T09:23:54.123');
const APRIL_FIXTURE = LUXON_GETTERS_FIXTURE.minusMonths(1);

describe('Luxon datetime/getters: fields', () => {
  it.each<[string, (value: LocalDateTime) => number, number]>([
    ['getters.test.js:13: year', (value) => value.year, 1982],
    ['getters.test.js:19: month (1-based)', (value) => value.month, 5],
    ['getters.test.js:25: day', (value) => value.day, 25],
    ['getters.test.js:31: hour', (value) => value.hour, 9],
    ['getters.test.js:37: minute', (value) => value.minute, 23],
    ['getters.test.js:43: second', (value) => value.second, 54],
    ['getters.test.js:49: millisecond', (value) => value.millisecond, 123],
    ['getters.test.js:64: ISO week', (value) => value.weekOfYear, 21],
    ['getters.test.js:147: day of year', (value) => value.dayOfYear, 145],
    ['getters.test.js:158: day of year', (value) => value.dayOfYear, 145],
    ['getters.test.js:158: year', (value) => value.year, 1982],
    ['getters.test.js:158: ISO week', (value) => value.weekOfYear, 21],
  ])('%s', (_name, read, expected) => {
    expect(read(LUXON_GETTERS_FIXTURE)).toBe(expected);
  });

  it('getters.test.js:58: the ISO week-based year is 1982', () => {
    expect(LUXON_GETTERS_FIXTURE.format('Y')).toBe('1982');
  });

  it.each<[string, LocalDate, DayOfWeek]>([
    ['getters.test.js:70: 1982-05-25', LUXON_GETTERS_FIXTURE.toLocalDate(), 'tuesday'],
    ['getters.test.js:76: an old date, 0043-04-04', LocalDate.of(43, 4, 4), 'saturday'],
  ])('%s is a %s', (_name, value, expected) => {
    expect(value.dayOfWeek).toBe(expected);
  });
});

describe('Luxon datetime/getters: weekday and month names', () => {
  it.each<[string, LocalDateTime, string, string]>([
    ['getters.test.js:84: short weekday (en)', LUXON_GETTERS_FIXTURE, 'EEE', 'Tue'],
    ['getters.test.js:88: long weekday (en)', LUXON_GETTERS_FIXTURE, 'EEEE', 'Tuesday'],
    ['getters.test.js:111: short month (en)', LUXON_GETTERS_FIXTURE, 'MMM', 'May'],
    ['getters.test.js:115: long month (en)', LUXON_GETTERS_FIXTURE, 'MMMM', 'May'],
    ['getters.test.js:119: short month a month earlier (en)', APRIL_FIXTURE, 'MMM', 'Apr'],
    ['getters.test.js:123: long month a month earlier (en)', APRIL_FIXTURE, 'MMMM', 'April'],
  ])('%s', (_name, value, pattern, expected) => {
    expect(value.format(pattern)).toBe(expected);
  });

  it.each<[string, LocalDateTime, string, string]>([
    ['getters.test.js:92: short weekday (fr)', LUXON_GETTERS_FIXTURE, 'EEE', 'mar.'],
    ['getters.test.js:96: long weekday (fr)', LUXON_GETTERS_FIXTURE, 'EEEE', 'mardi'],
    ['getters.test.js:127: short month a month earlier (fr)', APRIL_FIXTURE, 'MMM', 'avr.'],
    ['getters.test.js:131: long month a month earlier (fr)', APRIL_FIXTURE, 'MMMM', 'avril'],
  ])('%s', (_name, value, pattern, expected) => {
    expect(value.format(pattern, { locale: fr })).toBe(expected);
  });
});
