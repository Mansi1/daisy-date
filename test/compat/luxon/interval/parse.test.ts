import { describe, expect, it } from 'vitest';

import { DaisyParseError, LocalDateRange } from '../../../../src';

describe('Luxon interval/parse, an unparsable interval throws instead of being invalid', () => {
  it.each<[string, string]>([
    ['parse.test.js:142: rejects the empty string', ''],
    ['parse.test.js:142: rejects "hello"', 'hello'],
    ['parse.test.js:142: rejects "foo/bar"', 'foo/bar'],
    ['parse.test.js:142: rejects a repeating interval', 'R5/2008-03-01T13:00:00Z/P1Y2M10DT2H30M'],
  ])('%s', (_name, text) => {
    expect(() => LocalDateRange.parse(text)).toThrow(DaisyParseError);
  });
});

describe('Luxon interval/parse (differs from Luxon on purpose, T10: only date/date intervals parse)', () => {
  it.each<[string, string]>([
    ['parse.test.js:20: date-time/date-time', '2007-03-01T13:00:00/2008-05-11T15:30:00'],
    ['parse.test.js:42: date-time/week date', '2007-03-01T13:00:00/2016-W21-3'],
    ['parse.test.js:64: date-time/duration', '2007-03-01T13:00:00/P1Y2M10DT2H30M'],
    ['parse.test.js:86: duration/date-time', 'P1Y2M10DT2H30M/2008-05-11T15:30:00'],
    ['parse.test.js:149: abbreviated end, just time', '1988-04-15T09/15:30'],
    ['parse.test.js:159: abbreviated end, just day', '1988-04-15T09/17'],
    ['parse.test.js:164: abbreviated end, day and time', '1988-04-15T09/17T15:30'],
    ['parse.test.js:169: abbreviated end, month and day', '1988-04-15T09/05-17'],
    ['parse.test.js:174: abbreviated end, month, day and time', '1988-04-15T09/05-17T15:30'],
    ['parse.test.js:234: week date, end just time', '2025-W20-1T09/15:30'],
    ['parse.test.js:244: week date, end week day', '2025-W20-1T09/3T15:30'],
    ['parse.test.js:249: week date, end week number and week day', '2025-W20-1T09/W21-3T15:30'],
    ['parse.test.js:256: ordinal date, end just time', '2025-132T09/15:30'],
    ['parse.test.js:266: ordinal date, end ordinal', '2025-132T09/135T15:30'],
    ['parse.test.js:273: date, end just weekday', '2025-05-12T09/4T15:30'],
    ['parse.test.js:278: date, end week number and weekday', '2025-05-12T09/W21-1T15:30'],
    ['parse.test.js:283: date, end just ordinal', '2025-05-12T09/135T15:30'],
    ['parse.test.js:289: week date, end just day', '2025-W20-1T09/15T15:30'],
    ['parse.test.js:294: week date, end month and day', '2025-W20-1T09/06-15T15:30'],
    ['parse.test.js:299: week date, end just ordinal', '2025-W20-1T09/135T15:30'],
    ['parse.test.js:305: ordinal date, end just day', '2025-132T09/15T15:30'],
    ['parse.test.js:310: ordinal date, end month and day', '2025-132T09/06-15T15:30'],
    ['parse.test.js:315: ordinal date, end just weekday', '2025-132T09/4T15:30'],
    ['parse.test.js:320: ordinal date, end week number and weekday', '2025-132T09/W21-1T15:30'],
  ])('%s throws', (_name, text) => {
    expect(() => LocalDateRange.parse(text)).toThrow(DaisyParseError);
  });
});
