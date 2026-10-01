import { describe, expect, it } from 'vitest';

import { en } from '../../src';
import { en as enFromEntryPoint } from '../../src/locale/en';

describe('en plural and ordinal', () => {
  it.each([
    [0, 'other'],
    [1, 'one'],
    [1.5, 'other'],
    [2, 'other'],
    [-1, 'one'],
  ])('%s is in the plural category %s', (count, expected) => {
    expect(en.plural(count)).toBe(expected);
  });

  it.each([
    [0, '0th'],
    [1, '1st'],
    [2, '2nd'],
    [3, '3rd'],
    [4, '4th'],
    [11, '11th'],
    [12, '12th'],
    [13, '13th'],
    [21, '21st'],
    [22, '22nd'],
    [23, '23rd'],
    [101, '101st'],
    [111, '111th'],
    [112, '112th'],
  ])('writes %s as %s', (count, expected) => {
    expect(en.ordinal(count)).toBe(expected);
  });
});

describe('en names', () => {
  it('names months in every width', () => {
    expect(en.months.format.wide[8]).toBe('September');
    expect(en.months.format.abbreviated[8]).toBe('Sep');
    expect(en.months.format.narrow[8]).toBe('S');
    expect(en.months.standalone.wide[0]).toBe('January');
    expect(en.months.format.wide).toHaveLength(12);
  });

  it('names weekdays Monday first', () => {
    expect(en.weekdays.wide).toEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]);
    expect(en.weekdays.abbreviated[6]).toBe('Sun');
    expect(en.weekdays.short[4]).toBe('Fr');
    expect(en.weekdays.narrow[2]).toBe('W');
  });

  it('names quarters and day periods', () => {
    expect(en.quarters.abbreviated[2]).toBe('Q3');
    expect(en.quarters.wide[2]).toBe('3rd quarter');
    expect(en.dayPeriods).toEqual({ am: 'AM', pm: 'PM' });
  });

  it('starts weeks on Monday with a Saturday–Sunday weekend', () => {
    expect(en.firstDayOfWeek).toBe('monday');
    expect(en.weekend).toEqual(['saturday', 'sunday']);
  });
});

describe('en patterns and text templates', () => {
  it('has every preset for dates, times and date-times', () => {
    expect(en.patterns.date).toEqual({
      short: 'M/d/yy',
      medium: 'MMM d, yyyy',
      long: 'MMMM d, yyyy',
      full: 'EEEE, MMMM d, yyyy',
    });
    expect(en.patterns.time.short).toBe('h:mm a');
    expect(en.patterns.dateTime.long).toBe("MMMM d, yyyy 'at' h:mm:ss a");
  });

  it('has unit names for every unit and style', () => {
    expect(Object.keys(en.units)).toEqual([
      'years',
      'months',
      'weeks',
      'days',
      'hours',
      'minutes',
      'seconds',
      'milliseconds',
    ]);
    expect(en.units.weeks).toEqual({
      long: { one: '{0} week', other: '{0} weeks' },
      short: { one: '{0} wk', other: '{0} wks' },
      narrow: { other: '{0}w' },
    });
  });

  it('has relative phrases for every unit, style and direction', () => {
    expect(Object.keys(en.relative.units)).toEqual([
      'year',
      'month',
      'week',
      'day',
      'hour',
      'minute',
      'second',
    ]);
    expect(en.relative.units.day).toEqual({
      long: {
        future: { one: 'in {0} day', other: 'in {0} days' },
        past: { one: '{0} day ago', other: '{0} days ago' },
      },
      short: {
        future: { one: 'in {0} d', other: 'in {0} d' },
        past: { one: '{0} d ago', other: '{0} d ago' },
      },
    });
    expect(en.relative.days.dayAfterTomorrow).toBe('the day after tomorrow');
    expect(en.relative.now).toBe('now');
    expect(en.relative.weekdays).toEqual({ last: 'last {0}', this: 'this {0}', next: 'next {0}' });
  });

  it('joins lists and ranges', () => {
    expect(en.lists.conjunction).toEqual({ pair: ' and ', middle: ', ', end: ', and ' });
    expect(en.lists.unit).toEqual({ pair: ', ', middle: ', ', end: ', ' });
    expect(en.rangeSeparator).toBe('–');
  });
});

describe('en entry point', () => {
  it('exports the same pack as the package root', () => {
    expect(enFromEntryPoint).toBe(en);
  });
});
