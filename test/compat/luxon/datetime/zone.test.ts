import { describe, expect, it } from 'vitest';

import { DaisyRangeError, LocalDateTime } from '../../../../src';

const LUXON_INSTANT = new Date(391147200000);

const dateTime = (text: string) => LocalDateTime.parse(text);

const roundTrip = (wallClock: LocalDateTime, timeZone: string) =>
  LocalDateTime.fromDate(wallClock.toDate(timeZone), timeZone);

describe('Luxon datetime/zone: the wall clock of an instant in a zone', () => {
  it.each<[string, string, string]>([
    ['zone.test.js:21: toUTC() shows 04:00', 'UTC', '1982-05-25T04:00'],
    ['zone.test.js:30: toUTC(+5h) (Etc/GMT-5) shows 09:00', 'Etc/GMT-5', '1982-05-25T09:00'],
    [
      'zone.test.js:64: setZone(America/Los_Angeles) shows the 24th at 21:00',
      'America/Los_Angeles',
      '1982-05-24T21:00',
    ],
    ['zone.test.js:143: setZone(Europe/Paris) shows 06:00', 'Europe/Paris', '1982-05-25T06:00'],
    ['zone.test.js:153: whacky zone PST8PDT is at -7h', 'PST8PDT', '1982-05-24T21:00'],
    ['zone.test.js:153: whacky zone EST5EDT is at -4h', 'EST5EDT', '1982-05-25T00:00'],
    ['zone.test.js:153: whacky zone GMT+0 is at 0h', 'GMT+0', '1982-05-25T04:00'],
    ['zone.test.js:153: whacky zone GMT0 is at 0h', 'GMT0', '1982-05-25T04:00'],
    ['zone.test.js:294: Etc/GMT+8 is at -8h', 'Etc/GMT+8', '1982-05-24T20:00'],
    ['zone.test.js:294: Etc/GMT-5 is at +5h', 'Etc/GMT-5', '1982-05-25T09:00'],
    ['zone.test.js:294: Etc/GMT is at 0h', 'Etc/GMT', '1982-05-25T04:00'],
    ['zone.test.js:294: Etc/GMT-0 is at 0h', 'Etc/GMT-0', '1982-05-25T04:00'],
  ])('%s', (_name, timeZone, expected) => {
    const wallClock = LocalDateTime.fromDate(LUXON_INSTANT, timeZone);
    expect(wallClock).toEqual(dateTime(expected));
    expect(wallClock.toDate(timeZone).getTime()).toBe(LUXON_INSTANT.getTime());
  });

  it('zone.test.js:46: the system zone shows the local hour of the instant', () => {
    const wallClock = LocalDateTime.fromDate(LUXON_INSTANT);
    expect(wallClock.hour).toBe(LUXON_INSTANT.getHours());
    expect(wallClock.toDate().getTime()).toBe(LUXON_INSTANT.getTime());
  });

  it('zone.test.js:86: omitting the zone uses the system zone', () => {
    const systemZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    expect(LocalDateTime.fromDate(LUXON_INSTANT)).toEqual(
      LocalDateTime.fromDate(LUXON_INSTANT, systemZone),
    );
  });

  it('zone.test.js:207: America/New_York before 1970 with milliseconds is at -5h', () => {
    expect(
      LocalDateTime.fromDate(new Date('1967-01-01T00:00:00.001Z'), 'America/New_York'),
    ).toEqual(dateTime('1966-12-31T19:00:00.001'));
  });

  it('zone.test.js:215: Europe/Rome handles negative years', () => {
    expect(LocalDateTime.fromDate(new Date(-84753824400000), 'Europe/Rome').year).toBe(-716);
  });

  it('zone.test.js:255: an unambiguous Berlin wall clock has one instant', () => {
    expect(dateTime('2023-01-01T15:00').toDate('Europe/Berlin').toISOString()).toBe(
      '2023-01-01T14:00:00.000Z',
    );
  });
});

describe('Luxon datetime/zone: keepLocalTime as a wall-clock round trip', () => {
  it('zone.test.js:165: 04:00 stays 04:00 in America/Los_Angeles and America/New_York', () => {
    const wallClock = LocalDateTime.fromDate(LUXON_INSTANT, 'UTC');
    expect(roundTrip(wallClock, 'America/Los_Angeles')).toEqual(dateTime('1982-05-25T04:00'));
    expect(roundTrip(wallClock, 'America/New_York')).toEqual(dateTime('1982-05-25T04:00'));
  });

  it('zone.test.js:185: 0001-01-01 stays midnight in America/Curacao', () => {
    expect(roundTrip(dateTime('0001-01-01T00:00'), 'America/Curacao')).toEqual(
      dateTime('0001-01-01T00:00'),
    );
  });

  it('zone.test.js:194: 2016-10-30T02:59 stays 02:59 in Europe/Athens', () => {
    expect(roundTrip(dateTime('2016-10-30T02:59'), 'Europe/Athens')).toEqual(
      dateTime('2016-10-30T02:59'),
    );
  });
});

describe('Luxon datetime/zone (differs from Luxon on purpose)', () => {
  it('zone.test.js:200: an unknown zone throws instead of an invalid instance (no invalid instances)', () => {
    expect(() => LocalDateTime.fromDate(LUXON_INSTANT, 'blorp')).toThrow(DaisyRangeError);
  });

  it('zone.test.js:262: an ambiguous Berlin wall clock takes the earlier instant, Luxon’s first offset (toDate, T09)', () => {
    expect(dateTime('2023-10-29T02:30').toDate('Europe/Berlin').toISOString()).toBe(
      '2023-10-29T00:30:00.000Z',
    );
  });
});
