import { describe, expect, it } from 'vitest';

import { DaisyRangeError, Duration, LocalDate, Period, en, format } from '../../src';
import type { AmountFormatOptions, ListStyle, Locale, UnitStyle, ZeroDisplay } from '../../src';
import { joinList } from '../../src/functions/amount-format';

const period = (text: string) => Period.parse(text);
const duration = (text: string) => Duration.parse(text);

describe('period text', () => {
  it.each<[string, AmountFormatOptions, string]>([
    ['P2W3D', {}, '2 weeks and 3 days'],
    ['P1Y2M3D', {}, '1 year, 2 months, and 3 days'],
    ['P1Y', {}, '1 year'],
    ['P2Y', {}, '2 years'],
    ['P0D', {}, '0 days'],
    ['P0Y0M', {}, '0 days'],
    ['P2W3D', { style: 'short' }, '2 wks and 3 d'],
    ['P1W', { style: 'short' }, '1 wk'],
    ['P2W3D', { style: 'narrow' }, '2w 3d'],
    ['P1Y2M3D', { style: 'narrow' }, '1y 2mo 3d'],
    ['P2W3D', { list: 'unit' }, '2 weeks, 3 days'],
    ['P1Y2M3D', { list: 'unit' }, '1 year, 2 months, 3 days'],
    ['P2W3D', { style: 'short', list: 'unit' }, '2 wks, 3 d'],
    ['P2W3D', { style: 'narrow', list: 'conjunction' }, '2w and 3d'],
    ['P2W3D', { zeros: 'show' }, '0 years, 0 months, 2 weeks, and 3 days'],
    ['P0D', { zeros: 'show' }, '0 years, 0 months, 0 weeks, and 0 days'],
    ['P1Y2M3D', { largestUnits: 2 }, '1 year and 2 months'],
    ['P1Y2M3D', { largestUnits: 1 }, '1 year'],
    ['P1Y2M3D', { largestUnits: 5 }, '1 year, 2 months, and 3 days'],
    ['P2M3D', { largestUnits: 1 }, '2 months'],
    ['P1Y3D', { largestUnits: 2, zeros: 'show' }, '1 year and 0 months'],
    ['P-1Y2M', {}, '-1 year and 2 months'],
    ['P-1D', {}, '-1 day'],
    ['P-2D', {}, '-2 days'],
  ])('%s with %o is %j', (text, options, expected) => {
    expect(format(period(text), options)).toBe(expected);
  });
});

describe('duration text', () => {
  it.each<[string, AmountFormatOptions, string]>([
    ['PT2H30M', {}, '2 hours and 30 minutes'],
    ['PT1.5S', {}, '1 second and 500 milliseconds'],
    ['PT0S', {}, '0 seconds'],
    ['PT90M', {}, '90 minutes'],
    ['PT1H30M', { style: 'short' }, '1 hr and 30 min'],
    ['PT1H30M', { style: 'narrow' }, '1h 30m'],
    ['PT1H5S', { zeros: 'show' }, '1 hour, 0 minutes, 5 seconds, and 0 milliseconds'],
    ['PT2H30M', { largestUnits: 1 }, '2 hours'],
    ['PT0.001S', {}, '1 millisecond'],
    ['-PT1H30M', {}, '-1 hour and -30 minutes'],
  ])('%s with %o is %j', (text, options, expected) => {
    expect(format(duration(text), options)).toBe(expected);
  });

  it('writes the normalized form when asked to', () => {
    expect(duration('PT90M').normalized().format()).toBe('1 hour and 30 minutes');
  });
});

describe('amount text with other locales', () => {
  it('uses the locale names and separators', () => {
    const german: Locale = {
      ...en,
      units: {
        ...en.units,
        weeks: { ...en.units.weeks, long: { one: '{0} Woche', other: '{0} Wochen' } },
        days: { ...en.units.days, long: { one: '{0} Tag', other: '{0} Tage' } },
      },
      lists: { ...en.lists, conjunction: { pair: ' und ', middle: ', ', end: ' und ' } },
    };
    expect(format(period('P2W3D'), { locale: german })).toBe('2 Wochen und 3 Tage');
    expect(format(period('P1W1D'), { locale: german })).toBe('1 Woche und 1 Tag');
  });

  it('falls back to the "other" form for a plural category without a template', () => {
    const fewCategory: Locale = { ...en, plural: () => 'few' };
    expect(format(period('P1W'), { locale: fewCategory })).toBe('1 weeks');
  });
});

describe('amount text validation', () => {
  it.each<[AmountFormatOptions, string]>([
    [{ style: 'tiny' as UnitStyle }, 'Style must be one of long, short, narrow, got tiny'],
    [{ list: 'none' as ListStyle }, 'List must be one of conjunction, unit, narrow, got none'],
    [{ zeros: 'hide' as ZeroDisplay }, 'Zeros must be one of omit, show, got hide'],
    [{ largestUnits: 0 }, 'Largest units must be at least 1, got 0'],
    [{ largestUnits: 1.5 }, 'Largest units must be an integer, got 1.5'],
  ])('rejects %o', (options, message) => {
    expect(() => format(period('P1D'), options)).toThrow(new DaisyRangeError(message));
  });

  it('rejects a pattern for an amount and options for a date', () => {
    expect(() => format(period('P1D'), 'yyyy' as AmountFormatOptions)).toThrow(
      new TypeError('format(P1D, …) takes options, not a pattern'),
    );
    expect(() => format(LocalDate.parse('2026-09-28'), {} as string)).toThrow(
      new TypeError('format(2026-09-28, …) takes a pattern string, not options'),
    );
  });
});

describe('amount text methods and list joining', () => {
  it('formats through the methods', () => {
    expect(period('P2W3D').format({ style: 'narrow' })).toBe('2w 3d');
    expect(duration('PT1H30M').format({ style: 'short' })).toBe('1 hr and 30 min');
  });

  it.each([
    [['a'], 'a'],
    [['a', 'b'], 'a and b'],
    [['a', 'b', 'c'], 'a, b, and c'],
    [['a', 'b', 'c', 'd'], 'a, b, c, and d'],
  ])('joins %o as %j', (items, expected) => {
    expect(joinList(items, en.lists.conjunction)).toBe(expected);
  });
});
