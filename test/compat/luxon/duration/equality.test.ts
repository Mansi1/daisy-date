import { describe, expect, it } from 'vitest';

import { Duration, Period } from '../../../../src';

describe('Luxon duration/equality', () => {
  it('equality.test.js:4: equals self', () => {
    const period = Period.of({ years: 5, days: 6 });
    expect(period.equals(period)).toBe(true);
  });

  it('equality.test.js:9: equals identically constructed', () => {
    expect(Period.of({ years: 5, days: 6 }).equals(Period.of({ years: 5, days: 6 }))).toBe(true);
  });

  it('equality.test.js:34: equals with extra zero units', () => {
    const period = Period.of({ years: 5, days: 6 });
    const periodWithZeros = Period.of({ years: 5, months: 0, weeks: -0, days: 6 });
    const duration = Duration.of({});
    const durationWithZeros = Duration.of({ minutes: 0, seconds: -0 });
    expect(period.equals(periodWithZeros)).toBe(true);
    expect(periodWithZeros.equals(period)).toBe(true);
    expect(duration.equals(durationWithZeros)).toBe(true);
    expect(durationWithZeros.equals(duration)).toBe(true);
  });

  it.each<[string, Period, Period]>([
    [
      'equality.test.js:59: does not equal a different set of units',
      Period.of({ years: 5, days: 6 }),
      Period.of({ years: 5, months: 6 }),
    ],
    [
      'equality.test.js:65: does not equal a subset of units',
      Period.of({ years: 5, days: 6 }),
      Period.of({ years: 5 }),
    ],
    [
      'equality.test.js:71: does not equal a superset of units',
      Period.of({ years: 5 }),
      Period.of({ years: 5, days: 6 }),
    ],
    [
      'equality.test.js:77: does not equal a different unit values',
      Period.of({ years: 5, days: 6 }),
      Period.of({ years: 5, days: 7 }),
    ],
  ])('%s', (_name, left, right) => {
    expect(left.equals(right)).toBe(false);
  });
});
