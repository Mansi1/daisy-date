import { afterEach, describe, expect, it, vi } from 'vitest';

import { LocalDate, LocalDateTime } from '../../../../src';

const date = (text: string) => LocalDate.parse(text);
const dateTime = (text: string) => LocalDateTime.parse(text);

afterEach(() => {
  vi.useRealTimers();
});

describe('Luxon datetime/relative: toRelative is formatRelative with numeric always', () => {
  const friday = dateTime('1983-10-14T00:00');

  it.each<[string, string, string]>([
    ['relative.test.js:13', '1983-10-14T00:01', 'in 1 minute'],
    ['relative.test.js:14', '1983-10-14T00:05', 'in 5 minutes'],
    ['relative.test.js:15', '1983-10-14T01:05', 'in 1 hour'],
    ['relative.test.js:16', '1983-10-14T02:45', 'in 2 hours'],
    ['relative.test.js:17', '1983-10-15T00:00', 'in 1 day'],
    ['relative.test.js:18', '1983-10-17T00:00', 'in 3 days'],
    ['relative.test.js:19', '1984-03-14T00:00', 'in 5 months'],
    ['relative.test.js:20', '1985-01-14T00:00', 'in 1 year'],
    ['relative.test.js:22', '1983-10-13T23:59', '1 minute ago'],
    ['relative.test.js:23', '1983-10-13T23:55', '5 minutes ago'],
    ['relative.test.js:24', '1983-10-13T22:55', '1 hour ago'],
    ['relative.test.js:25', '1983-10-13T21:15', '2 hours ago'],
    ['relative.test.js:26', '1983-10-13T00:00', '1 day ago'],
    ['relative.test.js:27', '1983-10-11T00:00', '3 days ago'],
    ['relative.test.js:28', '1983-05-14T00:00', '5 months ago'],
    ['relative.test.js:29', '1982-07-14T00:00', '1 year ago'],
    ['relative.test.js:61: trunc', '1983-10-14T01:59:59.999', 'in 1 hour'],
    ['relative.test.js:64: trunc', '1983-10-14T02:00:00.001', 'in 2 hours'],
    ['relative.test.js:67: trunc', '1983-10-13T22:00:00.001', '1 hour ago'],
    ['relative.test.js:70: trunc', '1983-10-13T21:59:59.999', '2 hours ago'],
    ['relative.test.js:215: toward 0', '1983-10-14T23:59:59.999', 'in 23 hours'],
    ['relative.test.js:216: toward 0', '1983-10-13T00:00:00.001', '23 hours ago'],
  ])('%s: %s from 1983-10-14T00:00 is %j', (_source, text, expected) => {
    expect(dateTime(text).formatRelative({ relativeTo: friday, numeric: 'always' })).toBe(expected);
  });

  it('relative.test.js:222 and 223: the absolute time across midnight', () => {
    const lateEvening = dateTime('1983-10-14T23:59');
    const afterMidnight = dateTime('1983-10-15T00:03');
    expect(afterMidnight.formatRelative({ relativeTo: lateEvening, numeric: 'always' })).toBe(
      'in 4 minutes',
    );
    expect(lateEvening.formatRelative({ relativeTo: afterMidnight, numeric: 'always' })).toBe(
      '4 minutes ago',
    );
  });

  it('relative.test.js:229: one month after 2019-12-25', () => {
    expect(
      dateTime('2020-01-25T00:00').formatRelative({
        relativeTo: dateTime('2019-12-25T00:00'),
        numeric: 'always',
      }),
    ).toBe('in 1 month');
  });
});

describe('Luxon datetime/relative: toRelativeCalendar is formatRelative on the dates', () => {
  const noon = dateTime('1983-10-14T12:00');

  it('relative.test.js:256: one minute past midnight is tomorrow', () => {
    const lateEvening = dateTime('1983-10-14T23:59');
    expect(
      dateTime('1983-10-15T00:03').toLocalDate().formatRelative({ relativeTo: lateEvening }),
    ).toBe('tomorrow');
  });

  it('relative.test.js:264: tomorrow relative to today', () => {
    vi.useFakeTimers({ now: new Date(1983, 9, 14, 12) });
    expect(date('1983-10-15').formatRelative()).toBe('tomorrow');
  });

  it.each<[string, string, string]>([
    ['relative.test.js:292', '1983-10-14T12:01', 'today'],
    ['relative.test.js:293', '1983-10-14T12:05', 'today'],
    ['relative.test.js:294', '1983-10-14T13:05', 'today'],
    ['relative.test.js:295', '1983-10-15T01:00', 'tomorrow'],
    ['relative.test.js:301', '1983-10-14T11:59', 'today'],
    ['relative.test.js:302', '1983-10-14T11:55', 'today'],
    ['relative.test.js:303', '1983-10-14T10:55', 'today'],
    ['relative.test.js:304', '1983-10-13T12:00', 'yesterday'],
    ['relative.test.js:307', '1983-05-14T12:00', '5 months ago'],
  ])('%s: %s from 1983-10-14T12:00 is %j', (_source, text, expected) => {
    expect(dateTime(text).toLocalDate().formatRelative({ relativeTo: noon })).toBe(expected);
  });
});

describe('Luxon datetime/relative (differs from Luxon on purpose)', () => {
  it.each<[string, string, string, string]>([
    [
      'relative.test.js:296: days 3 to 6 name the weekday by calendar week (Luxon: in 3 days)',
      '1983-10-17',
      '1983-10-14',
      'next Monday',
    ],
    [
      'relative.test.js:305: days 3 to 6 name the weekday by calendar week (Luxon: 3 days ago)',
      '1983-10-11',
      '1983-10-14',
      'this Tuesday',
    ],
    [
      'relative.test.js:297: months by calendar difference, no "next month" (Luxon: next month)',
      '1983-11-14',
      '1983-10-14',
      'in 1 month',
    ],
    [
      'relative.test.js:298: months by calendar difference (Luxon: next year)',
      '1984-03-14',
      '1983-10-14',
      'in 5 months',
    ],
    [
      'relative.test.js:299: years by calendar difference, rounded down (Luxon: in 2 years)',
      '1985-01-14',
      '1983-10-14',
      'in 1 year',
    ],
    [
      'relative.test.js:306: under 31 days counts weeks, rounded down (Luxon: last month)',
      '1983-09-14',
      '1983-10-14',
      '4 weeks ago',
    ],
    [
      'relative.test.js:308: years by calendar difference, no "last year" (Luxon: last year)',
      '1982-07-14',
      '1983-10-14',
      '1 year ago',
    ],
    [
      'relative.test.js:319: months by calendar difference, no "next month" (Luxon: next month)',
      '2019-11-25',
      '2019-10-25',
      'in 1 month',
    ],
  ])('%s: %s from %s is %j', (_source, text, relativeTo, expected) => {
    expect(date(text).formatRelative({ relativeTo: date(relativeTo) })).toBe(expected);
  });

  it.each<[string, Date, string]>([
    [
      'relative.test.js:273: the next day is tomorrow even across a month (Luxon: next month)',
      new Date(1983, 9, 31, 12),
      '1983-11-01',
    ],
    [
      'relative.test.js:282: the next day is tomorrow even across a year (Luxon: next year)',
      new Date(1983, 11, 31, 12),
      '1984-01-01',
    ],
  ])('%s', (_source, now, text) => {
    vi.useFakeTimers({ now });
    expect(date(text).formatRelative()).toBe('tomorrow');
  });
});
