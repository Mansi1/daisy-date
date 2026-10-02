import { describe, expect, it } from 'vitest';

import { DaisyRangeError, LocalDate, LocalDateRange } from '../../../../src';

const date = (text: string) => LocalDate.parse(text);

describe('Luxon interval/create, an interval [a, b) at midnight as the range a..b-1', () => {
  it('create.test.js:10: of creates a range from dates', () => {
    const range = LocalDateRange.of(date('2016-05-25'), date('2016-05-26'));

    expect(range.start).toEqual(date('2016-05-25'));
    expect(range.end).toEqual(date('2016-05-26'));
  });

  it('create.test.js:61: of throws when the start comes after the end', () => {
    expect(() => LocalDateRange.of(date('2016-05-27'), date('2016-05-24'))).toThrow(
      DaisyRangeError,
    );
  });
});

describe('Luxon interval/create (differs from Luxon on purpose)', () => {
  it('create.test.js:41: an end before the start throws instead of making an invalid range (§5.1 invalid input throws)', () => {
    expect(() => LocalDateRange.of(date('2016-05-26'), date('2016-05-24'))).toThrow(
      DaisyRangeError,
    );
  });

  it('create.test.js:77: ofDays(start, 3) ends on the 27th, the last included day (inclusive end, §5.4)', () => {
    const range = LocalDateRange.ofDays(date('2016-05-25'), 3);

    expect(range.start).toEqual(date('2016-05-25'));
    expect(range.end.day).toBe(27);
  });
});
