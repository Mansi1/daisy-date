import { describe, expect, it } from 'vitest';

import { DaisyParseError, Duration, Period } from '../../../../src';
import type { DurationFields, PeriodFields } from '../../../../src';

describe('Luxon duration/parse', () => {
  it.each<[string, string, Required<PeriodFields>]>([
    ['parse.test.js:13 (P5Y3M)', 'P5Y3M', { years: 5, months: 3, weeks: 0, days: 0 }],
    ['parse.test.js:13 (P3DT54M32S, date part)', 'P3D', { years: 0, months: 0, weeks: 0, days: 3 }],
    ['parse.test.js:13 (P1YT34000S, date part)', 'P1Y', { years: 1, months: 0, weeks: 0, days: 0 }],
    [
      'parse.test.js:13 (P1W1DT13H23M34S, date part)',
      'P1W1D',
      { years: 0, months: 0, weeks: 1, days: 1 },
    ],
    ['parse.test.js:13 (P2W)', 'P2W', { years: 0, months: 0, weeks: 2, days: 0 }],
    ['parse.test.js:23 (P-5Y-3M)', 'P-5Y-3M', { years: -5, months: -3, weeks: 0, days: 0 }],
    [
      'parse.test.js:23 (P-3DT54M-32S, date part)',
      'P-3D',
      { years: 0, months: 0, weeks: 0, days: -3 },
    ],
    [
      'parse.test.js:23 (P1YT-34000S, date part)',
      'P1Y',
      { years: 1, months: 0, weeks: 0, days: 0 },
    ],
    [
      'parse.test.js:23 (P-1W1DT13H23M34S, date part)',
      'P-1W1D',
      { years: 0, months: 0, weeks: -1, days: 1 },
    ],
    ['parse.test.js:23 (P-2W)', 'P-2W', { years: 0, months: 0, weeks: -2, days: 0 }],
    ['parse.test.js:23 (-P1D)', '-P1D', { years: 0, months: 0, weeks: 0, days: -1 }],
    ['parse.test.js:23 (-P5Y3M)', '-P5Y3M', { years: -5, months: -3, weeks: 0, days: 0 }],
    ['parse.test.js:23 (-P-5Y-3M)', '-P-5Y-3M', { years: 5, months: 3, weeks: 0, days: 0 }],
    [
      'parse.test.js:23 (-P-1W1DT13H-23M34S, date part)',
      '-P-1W1D',
      { years: 0, months: 0, weeks: 1, days: -1 },
    ],
  ])('%s: Period.parse(%j)', (_name, text, expected) => {
    expect(Period.parse(text)).toEqual(expected);
  });

  it.each<[string, string, Required<DurationFields>]>([
    [
      'parse.test.js:13 (PT54M32S)',
      'PT54M32S',
      { hours: 0, minutes: 54, seconds: 32, milliseconds: 0 },
    ],
    [
      'parse.test.js:13 (P3DT54M32S, time part)',
      'PT54M32S',
      { hours: 0, minutes: 54, seconds: 32, milliseconds: 0 },
    ],
    [
      'parse.test.js:13 (P1YT34000S, time part)',
      'PT34000S',
      { hours: 0, minutes: 0, seconds: 34000, milliseconds: 0 },
    ],
    [
      'parse.test.js:13 (P1W1DT13H23M34S, time part)',
      'PT13H23M34S',
      { hours: 13, minutes: 23, seconds: 34, milliseconds: 0 },
    ],
    [
      'parse.test.js:23 (PT-54M32S)',
      'PT-54M32S',
      { hours: 0, minutes: -54, seconds: 32, milliseconds: 0 },
    ],
    [
      'parse.test.js:23 (P-3DT54M-32S, time part)',
      'PT54M-32S',
      { hours: 0, minutes: 54, seconds: -32, milliseconds: 0 },
    ],
    [
      'parse.test.js:23 (P1YT-34000S, time part)',
      'PT-34000S',
      { hours: 0, minutes: 0, seconds: -34000, milliseconds: 0 },
    ],
    [
      'parse.test.js:23 (P-1W1DT13H23M34S, time part)',
      'PT13H23M34S',
      { hours: 13, minutes: 23, seconds: 34, milliseconds: 0 },
    ],
    [
      'parse.test.js:23 (-P-1W1DT13H-23M34S, time part)',
      '-PT13H-23M34S',
      { hours: -13, minutes: 23, seconds: -34, milliseconds: 0 },
    ],
    [
      'parse.test.js:23 (PT-1.5S)',
      'PT-1.5S',
      { hours: 0, minutes: 0, seconds: -1, milliseconds: -500 },
    ],
    [
      'parse.test.js:23 (PT-0.5S)',
      'PT-0.5S',
      { hours: 0, minutes: 0, seconds: 0, milliseconds: -500 },
    ],
    [
      'parse.test.js:23 (PT1.5S)',
      'PT1.5S',
      { hours: 0, minutes: 0, seconds: 1, milliseconds: 500 },
    ],
    [
      'parse.test.js:23 (PT0.5S)',
      'PT0.5S',
      { hours: 0, minutes: 0, seconds: 0, milliseconds: 500 },
    ],
    [
      'parse.test.js:40 (PT54M32.5S)',
      'PT54M32.5S',
      { hours: 0, minutes: 54, seconds: 32, milliseconds: 500 },
    ],
    [
      'parse.test.js:40 (PT54M32.53S)',
      'PT54M32.53S',
      { hours: 0, minutes: 54, seconds: 32, milliseconds: 530 },
    ],
    [
      'parse.test.js:40 (PT54M32.534S)',
      'PT54M32.534S',
      { hours: 0, minutes: 54, seconds: 32, milliseconds: 534 },
    ],
    [
      'parse.test.js:40 (PT54M32.034S)',
      'PT54M32.034S',
      { hours: 0, minutes: 54, seconds: 32, milliseconds: 34 },
    ],
  ])('%s: Duration.parse(%j)', (_name, text, expected) => {
    expect(Duration.parse(text)).toEqual(expected);
  });

  it.each(['poop', 'PTglorb', 'P5Y34S', '5Y', 'P34S', 'P34K', 'P5D2W'])(
    'parse.test.js:90: Duration.fromISO rejects junk (%s)',
    (text) => {
      expect(() => Period.parse(text)).toThrow(DaisyParseError);
      expect(() => Duration.parse(text)).toThrow(DaisyParseError);
    },
  );
});

describe('Luxon duration/parse (differs from Luxon on purpose)', () => {
  it('parse.test.js:13 (PT10000000000000000000.999S): seconds beyond a safe integer of milliseconds throw, because the total must fit in a safe integer (PROJECT.md §5.5)', () => {
    expect(() => Duration.parse('PT10000000000000000000.999S')).toThrow(DaisyParseError);
  });

  it('parse.test.js:40 (PT54M32.5348S): a fourth fraction digit throws, because finer precision than milliseconds is a DaisyParseError (PROJECT.md §5.5)', () => {
    expect(() => Duration.parse('PT54M32.5348S')).toThrow(DaisyParseError);
  });

  it.each(['P1.5Y', 'P1.5M', 'P1.5W', 'P1.5D'])(
    'parse.test.js:68: %s throws, because only seconds may have a fraction (PROJECT.md §5.5)',
    (text) => {
      expect(() => Period.parse(text)).toThrow(DaisyParseError);
    },
  );

  it('parse.test.js:68: PT9.5H throws, because only seconds may have a fraction (PROJECT.md §5.5)', () => {
    expect(() => Duration.parse('PT9.5H')).toThrow(DaisyParseError);
  });
});
