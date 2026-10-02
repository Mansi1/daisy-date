import { describe, expect, it } from 'vitest';

import { DaisyFormatError, LocalDate, LocalDateRange } from '../../../../src';
import { fr } from '../../../../src/locale/fr';

const LUXON_RANGE = LocalDateRange.of(LocalDate.parse('1982-05-25'), LocalDate.parse('1983-10-14'));

describe('Luxon interval/format, 1982-05-25T09:00Z..1983-10-14T13:30Z as 1982-05-25..1983-10-14', () => {
  it('format.test.js:23: DATE_SHORT (M/d/yyyy) prints both ends in full', () => {
    expect(LUXON_RANGE.format('M/d/yyyy')).toBe('5/25/1982 – 10/14/1983');
  });

  it('format.test.js:64: a weekday-only pattern', () => {
    expect(LUXON_RANGE.format('EEE')).toBe('Tue – Fri');
  });

  it('format.test.js:68: the French short preset', () => {
    expect(LUXON_RANGE.format('short', { locale: fr })).toBe('25/05/1982 – 14/10/1983');
  });

  it('format.test.js:196: toString is the ISO date interval (toISODate)', () => {
    expect(LUXON_RANGE.toString()).toBe('1982-05-25/1983-10-14');
  });

  it('format.test.js:221: a date pattern prints both ends', () => {
    expect(LUXON_RANGE.format('EEE, LLL dd, yyyy')).toBe('Tue, May 25, 1982 – Fri, Oct 14, 1983');
  });
});

describe('Luxon interval/format (differs from Luxon on purpose)', () => {
  it('format.test.js:13: toString is the ISO 8601 interval, not "[start – end)" (§5.4 Convert)', () => {
    expect(LUXON_RANGE.toString()).toBe('1982-05-25/1983-10-14');
  });

  it('format.test.js:173: DATE_MED with only the day varying has an unspaced dash (T14 range formatting)', () => {
    const range = LocalDateRange.of(LocalDate.parse('1982-05-25'), LocalDate.parse('1982-05-27'));

    expect(range.format('medium')).toBe('May 25–27, 1982');
  });

  it('format.test.js:223: HH:mm throws, a range has no time (§6.2 time fields on a date)', () => {
    expect(() => LUXON_RANGE.format('HH:mm')).toThrow(DaisyFormatError);
  });
});
