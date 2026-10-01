import { describe, expect, it } from 'vitest';

import { DaisyFormatError, LocalDate, LocalDateRange, en, format } from '../../src';
import type { Locale } from '../../src';

const range = (text: string) => LocalDateRange.parse(text);

const SAME_MONTH = '2026-10-01/2026-10-03';
const ACROSS_MONTHS = '2026-09-28/2026-10-03';
const ACROSS_YEARS = '2026-12-28/2027-01-03';
const SINGLE_DAY = '2026-10-01/2026-10-01';

describe('format(range) collapses shared fields', () => {
  it.each([
    ['d MMM yyyy', SAME_MONTH, '1–3 Oct 2026'],
    ['d MMM yyyy', ACROSS_MONTHS, '28 Sep – 3 Oct 2026'],
    ['d MMM yyyy', ACROSS_YEARS, '28 Dec 2026 – 3 Jan 2027'],
    ['d MMM yyyy', SINGLE_DAY, '1 Oct 2026'],
    ['MMM d, yyyy', SAME_MONTH, 'Oct 1–3, 2026'],
    ['MMM d, yyyy', ACROSS_MONTHS, 'Sep 28 – Oct 3, 2026'],
    ['MMM d, yyyy', ACROSS_YEARS, 'Dec 28, 2026 – Jan 3, 2027'],
    ['EEE, d MMM yyyy', SAME_MONTH, 'Thu, 1 – Sat, 3 Oct 2026'],
    ['EEEE, MMMM d, yyyy', SAME_MONTH, 'Thursday, October 1 – Saturday, October 3, 2026'],
    ['MMMM yyyy', SAME_MONTH, 'October 2026'],
    ['MMMM yyyy', ACROSS_MONTHS, 'September–October 2026'],
    ['MMMM yyyy', ACROSS_YEARS, 'December 2026 – January 2027'],
    ["d MMM 'in' yyyy", SAME_MONTH, '1–3 Oct in 2026'],
  ])('%j formats %s as %j', (pattern, text, expected) => {
    expect(format(range(text), pattern)).toBe(expected);
  });

  it.each([
    ['M/d/yy', SAME_MONTH, '10/1/26 – 10/3/26'],
    ['yyyy-MM-dd', ACROSS_MONTHS, '2026-09-28 – 2026-10-03'],
    ['yyyy', ACROSS_YEARS, '2026 – 2027'],
    ['yyyy', SAME_MONTH, '2026'],
    ['M/d/yy', SINGLE_DAY, '10/1/26'],
  ])('prints both ends of the numeric pattern %j in full: %s is %j', (pattern, text, expected) => {
    expect(format(range(text), pattern)).toBe(expected);
  });
});

describe('range presets and locales', () => {
  it.each([
    [undefined, 'Oct 1–3, 2026'],
    ['medium', 'Oct 1–3, 2026'],
    ['long', 'October 1–3, 2026'],
    ['full', 'Thursday, October 1 – Saturday, October 3, 2026'],
    ['short', '10/1/26 – 10/3/26'],
  ])('preset %s is %j', (preset, expected) => {
    expect(format(range(SAME_MONTH), preset)).toBe(expected);
  });

  it('uses the locale range separator', () => {
    const emDash: Locale = { ...en, rangeSeparator: '—' };
    expect(format(range(SAME_MONTH), 'd MMM yyyy', { locale: emDash })).toBe('1—3 Oct 2026');
    expect(format(range(ACROSS_MONTHS), 'd MMM yyyy', { locale: emDash })).toBe(
      '28 Sep — 3 Oct 2026',
    );
  });

  it('rejects time fields', () => {
    expect(() => format(range(SAME_MONTH), 'd MMM HH:mm')).toThrow(
      new DaisyFormatError(
        'Pattern "d MMM HH:mm" uses time fields, but a LocalDateRange has no time',
      ),
    );
  });
});

describe('format methods with the default preset', () => {
  it('formats a range, a date and a date-time without a pattern', () => {
    expect(range(ACROSS_MONTHS).format()).toBe('Sep 28 – Oct 3, 2026');
    expect(range(SAME_MONTH).format('d MMM yyyy')).toBe('1–3 Oct 2026');
    expect(LocalDate.parse('2026-09-28').format()).toBe('Sep 28, 2026');
    expect(format(LocalDate.parse('2026-09-28'))).toBe('Sep 28, 2026');
  });
});
