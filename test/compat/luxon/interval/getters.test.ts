import { describe, expect, it } from 'vitest';

import { LocalDate, LocalDateRange } from '../../../../src';

const todayFrom = (startHour: number, endHour: number) =>
  LocalDateRange.of(LocalDate.of(2017, 5, startHour), LocalDate.of(2017, 5, endHour - 1));

describe('Luxon interval/getters, todayFrom(a, b) as 2017-05-a..2017-05-(b-1)', () => {
  it('getters.test.js:9: start gets the start', () => {
    expect(todayFrom(3, 5).start.day).toBe(3);
  });
});

describe('Luxon interval/getters (differs from Luxon on purpose)', () => {
  it('getters.test.js:17: end is the last included day, 4 rather than 5 (inclusive end, §5.4)', () => {
    expect(todayFrom(3, 5).end.day).toBe(4);
  });
});
