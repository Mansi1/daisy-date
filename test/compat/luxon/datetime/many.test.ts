import { describe, expect, it } from 'vitest';

import { LocalDate, compare } from '../../../../src';

const fromJsDate = (year: number, monthIndex: number, day: number) =>
  LocalDate.fromDate(new Date(year, monthIndex, day));

const sortedByDate = (dates: readonly LocalDate[]) => [...dates].sort(compare);

describe('Luxon datetime/many: min and max via sorting with compare', () => {
  it('many.test.js:8: the minimum of one date is that date', () => {
    expect(sortedByDate([fromJsDate(1982, 5, 25)]).at(0)).toEqual(LocalDate.parse('1982-06-25'));
  });

  it('many.test.js:14: the minimum is the earliest date', () => {
    const dates = [fromJsDate(1982, 4, 25), fromJsDate(1982, 3, 25), fromJsDate(1982, 3, 26)];
    expect(sortedByDate(dates).at(0)).toEqual(LocalDate.parse('1982-04-25'));
  });

  it('many.test.js:23: the minimum of no dates is undefined', () => {
    expect(sortedByDate([]).at(0)).toBeUndefined();
  });

  it('many.test.js:49: the maximum of one date is that date', () => {
    expect(sortedByDate([fromJsDate(1982, 5, 25)]).at(-1)).toEqual(LocalDate.parse('1982-06-25'));
  });

  it('many.test.js:55: the maximum is the latest date', () => {
    const dates = [fromJsDate(1982, 5, 25), fromJsDate(1982, 3, 25), fromJsDate(1982, 3, 26)];
    expect(sortedByDate(dates).at(-1)).toEqual(LocalDate.parse('1982-06-25'));
  });

  it('many.test.js:64: the maximum of no dates is undefined', () => {
    expect(sortedByDate([]).at(-1)).toBeUndefined();
  });
});
