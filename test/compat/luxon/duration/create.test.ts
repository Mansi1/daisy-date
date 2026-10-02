import { describe, expect, it } from 'vitest';

import { DaisyRangeError, Duration, Period } from '../../../../src';

describe('Luxon duration/create', () => {
  it('create.test.js:8: Duration.fromObject sets all the values', () => {
    const period = Period.of({ years: 1, months: 2, days: 3 });
    const duration = Duration.of({ hours: 4, minutes: 5, seconds: 6, milliseconds: 7 });
    expect(period.years).toBe(1);
    expect(period.months).toBe(2);
    expect(period.days).toBe(3);
    expect(duration.hours).toBe(4);
    expect(duration.minutes).toBe(5);
    expect(duration.seconds).toBe(6);
    expect(duration.milliseconds).toBe(7);
  });

  it('create.test.js:73: Duration.fromObject({}) constructs zero duration', () => {
    expect(Period.of({})).toEqual({ years: 0, months: 0, weeks: 0, days: 0 });
    expect(Duration.of({})).toEqual({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
  });

  it('create.test.js:89: Duration.fromObject throws if the initial object has invalid values (NaN)', () => {
    expect(() => Period.of({ days: Number.NaN })).toThrow(DaisyRangeError);
  });

  it('create.test.js:114: Duration.fromDurationLike returns a Duration from millis', () => {
    const duration = Duration.ofMilliseconds(1000);
    expect(duration).toBeInstanceOf(Duration);
    expect(duration.toString()).toBe('PT1S');
  });

  it('create.test.js:120: Duration.fromDurationLike returns a Duration from object', () => {
    const duration = Duration.of({ hours: 1 });
    expect(duration).toBeInstanceOf(Duration);
    expect(duration).toEqual({ hours: 1, minutes: 0, seconds: 0, milliseconds: 0 });
  });

  it.each([Number.POSITIVE_INFINITY, Number.NaN])(
    'create.test.js:132: Duration.fromDurationLike throws for invalid inputs (%s milliseconds)',
    (milliseconds) => {
      expect(() => Duration.ofMilliseconds(milliseconds)).toThrow(DaisyRangeError);
    },
  );
});

describe('Luxon duration/create (differs from Luxon on purpose)', () => {
  it('create.test.js:27: fractional hours throw, because invalid input is a DaisyRangeError (PROJECT.md §5.1) and components are whole units', () => {
    expect(() => Duration.of({ hours: 4.5 })).toThrow(DaisyRangeError);
  });
});
