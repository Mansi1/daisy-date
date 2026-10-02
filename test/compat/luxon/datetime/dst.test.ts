import { describe, expect, it } from 'vitest';

import { LocalDate, LocalDateTime } from '../../../../src';

const NEW_YORK = 'America/New_York';

const dateTime = (text: string) => LocalDateTime.parse(text);

describe('Luxon datetime/dst: wall-clock arithmetic and instants', () => {
  it.each<[string, LocalDateTime, string]>([
    [
      'dst.test.js:109: 2017-11-04T01:00 plus a day is 01:00 on the ambiguous day',
      dateTime('2017-11-04T01:00').plusDays(1),
      '2017-11-05T01:00',
    ],
    [
      'dst.test.js:109: 2017-11-06T01:00 minus a day is 01:00 on the ambiguous day',
      dateTime('2017-11-06T01:00').minusDays(1),
      '2017-11-05T01:00',
    ],
    [
      'dst.test.js:136: the end of 2017-10-15 is 23:59:59',
      LocalDateTime.of(2017, 10, 15).endOfDay(),
      '2017-10-15T23:59:59.999',
    ],
  ])('%s', (_name, actual, expected) => {
    expect(actual).toEqual(dateTime(expected));
  });

  it.each<[string, LocalDateTime, number]>([
    [
      'dst.test.js:169: 2017-05-24T15:15:14 in New York is 1495653314000 (EDT, any cache and clock)',
      LocalDateTime.of(2017, 5, 24, 15, 15, 14, 0),
      1495653314000,
    ],
    [
      'dst.test.js:169: 2017-01-15T00:00 in New York is 1484456400000 (EST, any cache and clock)',
      LocalDateTime.of(2017, 1, 15, 0, 0, 0, 0),
      1484456400000,
    ],
  ])('%s', (_name, wallClock, epochMilliseconds) => {
    expect(wallClock.toDate(NEW_YORK).getTime()).toBe(epochMilliseconds);
  });

  it('dst.test.js:14: the skipped 02:00 in New York moves forward to 03:00 EDT', () => {
    expect(LocalDateTime.of(2017, 3, 12, 2).toDate(NEW_YORK).toISOString()).toBe(
      '2017-03-12T07:00:00.000Z',
    );
  });
});

describe('Luxon datetime/dst (differs from Luxon on purpose)', () => {
  it('dst.test.js:14: the skipped 02:00 stays 02:00 as a wall-clock value (no DST in arithmetic)', () => {
    expect(LocalDateTime.of(2017, 3, 12, 2)).toEqual(dateTime('2017-03-12T02:00'));
  });

  it('dst.test.js:23/40: the repeated 01:00 always takes the earlier instant, whatever the clock (toDate, T09)', () => {
    expect(LocalDateTime.of(2017, 11, 5, 1).toDate(NEW_YORK).toISOString()).toBe(
      '2017-11-05T05:00:00.000Z',
    );
  });

  it.each<[string, LocalDateTime, string]>([
    [
      'dst.test.js:71: 01:00 plus an hour is 02:00 (no DST in arithmetic)',
      dateTime('2017-03-12T01:00').plusHours(1),
      '2017-03-12T02:00',
    ],
    [
      'dst.test.js:77: 03:00 minus an hour is 02:00 (no DST in arithmetic)',
      dateTime('2017-03-12T03:00').minusHours(1),
      '2017-03-12T02:00',
    ],
    [
      'dst.test.js:83: 00:00 plus two hours is 02:00 (no DST in arithmetic)',
      dateTime('2017-11-05T00:00').plusHours(2),
      '2017-11-05T02:00',
    ],
    [
      'dst.test.js:89: 03:00 minus two hours is 01:00 (no DST in arithmetic)',
      dateTime('2017-11-05T03:00').minusHours(2),
      '2017-11-05T01:00',
    ],
    [
      'dst.test.js:89: 03:00 minus three hours is 00:00 (no DST in arithmetic)',
      dateTime('2017-11-05T03:00').minusHours(2).minusHours(1),
      '2017-11-05T00:00',
    ],
    [
      'dst.test.js:99: 2017-03-11T02:00 plus a day is 2017-03-12T02:00 (no DST in arithmetic)',
      dateTime('2017-03-11T02:00').plusDays(1),
      '2017-03-12T02:00',
    ],
    [
      'dst.test.js:99: 2017-03-13T02:00 minus a day is 2017-03-12T02:00 (no DST in arithmetic)',
      dateTime('2017-03-13T02:00').minusDays(1),
      '2017-03-12T02:00',
    ],
  ])('%s', (_name, actual, expected) => {
    expect(actual).toEqual(dateTime(expected));
  });

  it('dst.test.js:71/99: the 02:00 result converts to Luxon’s 03:00 EDT instant (toDate moves skipped times forward, T09)', () => {
    expect(dateTime('2017-03-12T01:00').plusHours(1).toDate(NEW_YORK).toISOString()).toBe(
      '2017-03-12T07:00:00.000Z',
    );
    expect(dateTime('2017-03-11T02:00').plusDays(1).toDate(NEW_YORK).toISOString()).toBe(
      '2017-03-12T07:00:00.000Z',
    );
  });

  it('dst.test.js:119: the start of 2017-10-15 is 00:00, which São Paulo skips to 01:00 (no zones in values; toDate, T09)', () => {
    const startOfDay = LocalDate.of(2017, 10, 15).atStartOfDay();
    expect(startOfDay).toEqual(dateTime('2017-10-15T00:00'));
    expect(startOfDay.toDate('America/Sao_Paulo').toISOString()).toBe('2017-10-15T03:00:00.000Z');
  });
});
