import { describe, expect, it } from 'vitest';

import { en, getDefaultLocale } from '../../../../src';

const LONG_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const LONG_WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const SHORT_WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

describe('Luxon info/listers, Info.months as standalone and Info.monthsFormat as format names', () => {
  it('listers.test.js:12: the English standalone months', () => {
    expect(en.months.standalone.wide).toEqual(LONG_MONTHS);
    expect(en.months.standalone.abbreviated).toEqual(SHORT_MONTHS);
    expect(en.months.standalone.narrow).toEqual([
      'J',
      'F',
      'M',
      'A',
      'M',
      'J',
      'J',
      'A',
      'S',
      'O',
      'N',
      'D',
    ]);
  });

  it('listers.test.js:179: the default locale has long standalone months', () => {
    expect(getDefaultLocale().months.standalone.wide).toEqual(LONG_MONTHS);
  });

  it('listers.test.js:199: the English format months', () => {
    expect(en.months.format.wide).toEqual(LONG_MONTHS);
    expect(en.months.format.abbreviated).toEqual(SHORT_MONTHS);
  });

  it('listers.test.js:262: the default locale has long format months', () => {
    expect(getDefaultLocale().months.format.wide).toEqual(LONG_MONTHS);
  });

  it('listers.test.js:282: the English weekdays', () => {
    expect(en.weekdays.wide).toEqual(LONG_WEEKDAYS);
    expect(en.weekdays.abbreviated).toEqual(SHORT_WEEKDAYS);
    expect(en.weekdays.narrow).toEqual(['M', 'T', 'W', 'T', 'F', 'S', 'S']);
  });

  it('listers.test.js:316: the default locale has long weekdays', () => {
    expect(getDefaultLocale().weekdays.wide).toEqual(LONG_WEEKDAYS);
  });

  it('listers.test.js:331: the English weekdays in format context', () => {
    expect(en.weekdays.wide).toEqual(LONG_WEEKDAYS);
    expect(en.weekdays.abbreviated).toEqual(SHORT_WEEKDAYS);
  });

  it('listers.test.js:353: the default locale has long weekdays in format context', () => {
    expect(getDefaultLocale().weekdays.wide).toEqual(LONG_WEEKDAYS);
  });

  it('listers.test.js:368: the English meridiems', () => {
    expect([en.dayPeriods.am, en.dayPeriods.pm]).toEqual(['AM', 'PM']);
  });

  it('listers.test.js:373: the default locale meridiems', () => {
    const { dayPeriods } = getDefaultLocale();

    expect([dayPeriods.am, dayPeriods.pm]).toEqual(['AM', 'PM']);
  });
});
