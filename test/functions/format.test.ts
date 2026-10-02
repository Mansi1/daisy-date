import type {} from 'temporal-polyfill/global';
import { afterEach, describe, expect, it } from 'vitest';

import {
  DaisyFormatError,
  DaisyRangeError,
  LocalDate,
  LocalDateTime,
  en,
  format,
  setDefaultLocale,
} from '../../src';
import type { Locale } from '../../src';
import { fieldSourceOf } from '../../src/format/field-source';
import { cachedPatternCount, compilePattern, toToken } from '../../src/format/pattern';
import type { FieldSymbol } from '../../src/format/pattern';
import { nameAt, renderField } from '../../src/functions/format';
import { isoWeekBasedYear } from '../../src/internal/calendar-fields';

const mondayAfternoon = LocalDateTime.parse('2026-09-28T14:05:09.045');
const newYearMidnight = LocalDateTime.parse('2027-01-01T00:00');

afterEach(() => {
  setDefaultLocale(en);
});

describe('format symbols on Monday 2026-09-28T14:05:09.045', () => {
  it.each([
    ['y', '2026'],
    ['yy', '26'],
    ['yyy', '2026'],
    ['yyyy', '2026'],
    ['yyyyy', '02026'],
    ['Y', '2026'],
    ['YYYY', '2026'],
    ['M', '9'],
    ['MM', '09'],
    ['MMM', 'Sep'],
    ['MMMM', 'September'],
    ['MMMMM', 'S'],
    ['L', '9'],
    ['LLL', 'Sep'],
    ['LLLL', 'September'],
    ['d', '28'],
    ['dd', '28'],
    ['D', '271'],
    ['DD', '271'],
    ['DDD', '271'],
    ['E', 'Mon'],
    ['EE', 'Mon'],
    ['EEE', 'Mon'],
    ['EEEE', 'Monday'],
    ['EEEEE', 'M'],
    ['EEEEEE', 'Mo'],
    ['e', '2'],
    ['ee', '02'],
    ['c', '2'],
    ['w', '40'],
    ['ww', '40'],
    ['Q', '3'],
    ['QQ', '03'],
    ['QQQ', 'Q3'],
    ['QQQQ', '3rd quarter'],
    ['a', 'PM'],
    ['H', '14'],
    ['HH', '14'],
    ['h', '2'],
    ['hh', '02'],
    ['K', '2'],
    ['KK', '02'],
    ['k', '14'],
    ['kk', '14'],
    ['m', '5'],
    ['mm', '05'],
    ['s', '9'],
    ['ss', '09'],
    ['S', '0'],
    ['SS', '04'],
    ['SSS', '045'],
  ])('%s is %s', (pattern, expected) => {
    expect(format(mondayAfternoon, pattern)).toBe(expected);
  });
});

describe('format edge cases', () => {
  it.each([
    ['yyyy', '2027'],
    ['YYYY', '2026'],
    ['w', '53'],
    ['D', '1'],
    ['DDD', '001'],
    ['Q', '1'],
    ['E', 'Fri'],
    ['e', '6'],
    ['a', 'AM'],
    ['H', '0'],
    ['h', '12'],
    ['K', '0'],
    ['k', '24'],
  ])(
    'Friday 2027-01-01T00:00 with %s is %s (week 53 of week-based year 2026)',
    (pattern, expected) => {
      expect(format(newYearMidnight, pattern)).toBe(expected);
    },
  );

  it.each([
    ['2026-09-28T12:00', 'h K k H a', '12 0 12 12 PM'],
    ['2026-09-28T23:59', 'h K k H a', '11 11 23 23 PM'],
    ['2026-09-28T11:59', 'h K k H a', '11 11 11 11 AM'],
    ['2026-09-28T14:05:09.005', 'S SS SSS', '0 00 005'],
    ['2026-09-28T14:05:09.999', 'S SS SSS', '9 99 999'],
  ])('%s with %j is %j', (text, pattern, expected) => {
    expect(format(LocalDateTime.parse(text), pattern)).toBe(expected);
  });

  it.each([
    ['0005-03-07', 'y yy yyyy M d dd D', '5 05 0005 3 7 07 66'],
    ['-000044-03-15', 'y yy yyyy', '-44 44 -0044'],
    ['+010000-01-01', 'y yyyy', '10000 10000'],
  ])('%s with %j is %j', (text, pattern, expected) => {
    expect(format(LocalDate.parse(text), pattern)).toBe(expected);
  });
});

describe('literals', () => {
  it.each([
    ["yyyy-MM-dd'T'HH:mm", '2026-09-28T14:05'],
    ["h 'o''clock' a", "2 o'clock PM"],
    ["''", "'"],
    ["'at' HH", 'at 14'],
    ["'yyyy'", 'yyyy'],
    ['d. MMMM yyyy', '28. September 2026'],
    ['EEEE, d MMMM yyyy', 'Monday, 28 September 2026'],
    ['-- / --', '-- / --'],
    ['', ''],
  ])('%j is %j', (pattern, expected) => {
    expect(format(mondayAfternoon, pattern)).toBe(expected);
  });
});

describe('presets', () => {
  it.each([
    ['short', '9/28/26'],
    ['medium', 'Sep 28, 2026'],
    ['long', 'September 28, 2026'],
    ['full', 'Monday, September 28, 2026'],
  ])('LocalDate %s is %s', (preset, expected) => {
    expect(format(LocalDate.parse('2026-09-28'), preset)).toBe(expected);
  });

  it.each([
    ['short', '9/28/26, 2:05 PM'],
    ['medium', 'Sep 28, 2026, 2:05:09 PM'],
    ['long', 'September 28, 2026 at 2:05:09 PM'],
    ['full', 'Monday, September 28, 2026 at 2:05:09 PM'],
  ])('LocalDateTime %s is %s', (preset, expected) => {
    expect(format(mondayAfternoon, preset)).toBe(expected);
  });
});

describe('locales', () => {
  const sundayFirst: Locale = { ...en, code: 'en-US', firstDayOfWeek: 'sunday' };
  const shoutingPeriods: Locale = { ...en, dayPeriods: { am: 'MORNING', pm: 'AFTERNOON' } };

  it('numbers weekdays from the locale first day', () => {
    expect(format(mondayAfternoon, 'e', { locale: sundayFirst })).toBe('2');
    expect(format(LocalDate.parse('2026-10-04'), 'e c', { locale: sundayFirst })).toBe('1 1');
  });

  it('uses the names of the given locale', () => {
    expect(format(mondayAfternoon, 'h a', { locale: shoutingPeriods })).toBe('2 AFTERNOON');
  });

  it('falls back to the default locale', () => {
    setDefaultLocale(shoutingPeriods);
    expect(format(mondayAfternoon, 'h a')).toBe('2 AFTERNOON');
  });

  it('resolves presets through the locale', () => {
    const isoPresets: Locale = {
      ...en,
      patterns: { ...en.patterns, date: { ...en.patterns.date, short: 'yyyy-MM-dd' } },
    };
    expect(format(LocalDate.parse('2026-09-28'), 'short', { locale: isoPresets })).toBe(
      '2026-09-28',
    );
  });
});

describe('format errors', () => {
  it.each([
    ['b', 'Unknown pattern letter "b" at index 0 in "b"'],
    ['yyyy-MM-dd x', 'Unknown pattern letter "x" at index 11 in "yyyy-MM-dd x"'],
    ['do', 'Unknown pattern letter "o" at index 1 in "do"'],
    ['ddd', 'Pattern letter "d" repeats 3 times at index 0 in "ddd"; at most 2 are supported'],
    ['SSSS', 'Pattern letter "S" repeats 4 times at index 0 in "SSSS"; at most 3 are supported'],
    ["yyyy 'abc", 'Unterminated quote at index 5 in "yyyy \'abc"'],
  ])('rejects the pattern %j', (pattern, message) => {
    expect(() => format(mondayAfternoon, pattern)).toThrow(new DaisyFormatError(message));
  });

  it('rejects time fields on a LocalDate', () => {
    expect(() => format(LocalDate.parse('2026-09-28'), 'yyyy-MM-dd HH:mm')).toThrow(
      new DaisyFormatError(
        'Pattern "yyyy-MM-dd HH:mm" uses time fields, but a LocalDate has no time',
      ),
    );
  });
});

describe('format methods', () => {
  it('format a LocalDate and a LocalDateTime', () => {
    expect(LocalDate.parse('2026-09-28').format('EEEE, d MMMM yyyy')).toBe(
      'Monday, 28 September 2026',
    );
    expect(mondayAfternoon.format('yyyy-MM-dd HH:mm', { locale: en })).toBe('2026-09-28 14:05');
  });
});

describe('pattern compilation internals', () => {
  it('reuses the compiled pattern for the same text', () => {
    expect(compilePattern('yyyy-MM-dd')).toBe(compilePattern('yyyy-MM-dd'));
  });

  it('keeps the cache at 256 patterns or fewer', () => {
    Array.from({ length: 600 }, (_unused, index) => compilePattern(`'${String(index)}'`));
    expect(cachedPatternCount()).toBeLessThanOrEqual(256);
  });

  it('reports index 0 for a match without a position', () => {
    const match = /(')?(b)/.exec('b');
    if (match === null) {
      throw new Error('Expected the letter to match');
    }
    const matchWithoutIndex: RegExpMatchArray = match;
    delete matchWithoutIndex.index;
    expect(() => toToken(matchWithoutIndex, 'b')).toThrow(
      new DaisyFormatError('Unknown pattern letter "b" at index 0 in "b"'),
    );
  });

  it('reaches assertNever for a symbol outside the union', () => {
    expect(() => renderField('x' as FieldSymbol, 1, fieldSourceOf(mondayAfternoon), en)).toThrow(
      new Error('Unexpected value: "x"'),
    );
  });

  it('throws when a locale name list is missing an entry', () => {
    expect(() => nameAt(['January'], 1)).toThrow(
      new DaisyFormatError('The locale has no name at index 1'),
    );
  });

  it('throws when Temporal has no ISO week-based year', () => {
    const hebrewDate = Temporal.PlainDate.from('2026-09-28').withCalendar('hebrew');
    expect(() => isoWeekBasedYear(hebrewDate, 'the Hebrew date')).toThrow(
      new DaisyRangeError('No ISO week-based year for the Hebrew date'),
    );
  });
});
