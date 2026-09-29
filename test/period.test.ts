import { inspect } from 'node:util';

import { describe, expect, it } from 'vitest';

import {
  DaisyParseError,
  DaisyRangeError,
  Period,
  abs,
  isNegative,
  isZero,
  minus,
  negated,
  normalized,
  plus,
} from '../src';
import type { PeriodFields } from '../src';

const period = (text: string) => Period.parse(text);

describe('Period.of', () => {
  it('keeps the given components and sets the omitted ones to zero', () => {
    expect(Period.of({ years: 1, days: -3 })).toEqual({ years: 1, months: 0, weeks: 0, days: -3 });
    expect(Period.of({})).toEqual({ years: 0, months: 0, weeks: 0, days: 0 });
  });

  it('stores negative zero as zero', () => {
    expect(Period.of({ days: -0 })).toEqual({ years: 0, months: 0, weeks: 0, days: 0 });
  });

  it.each<[PeriodFields, string]>([
    [{ years: 1.5 }, 'Years must be an integer, got 1.5'],
    [{ months: Number.NaN }, 'Months must be an integer, got NaN'],
    [{ weeks: 0.1 }, 'Weeks must be an integer, got 0.1'],
    [{ days: Number.POSITIVE_INFINITY }, 'Days must be an integer, got Infinity'],
  ])('rejects %o', (fields, message) => {
    expect(() => Period.of(fields)).toThrow(new DaisyRangeError(message));
  });

  it('creates single-unit periods', () => {
    expect(Period.ofYears(2)).toEqual({ years: 2, months: 0, weeks: 0, days: 0 });
    expect(Period.ofMonths(-3)).toEqual({ years: 0, months: -3, weeks: 0, days: 0 });
    expect(Period.ofWeeks(4)).toEqual({ years: 0, months: 0, weeks: 4, days: 0 });
    expect(Period.ofDays(5)).toEqual({ years: 0, months: 0, weeks: 0, days: 5 });
  });

  it('is frozen', () => {
    expect(Object.isFrozen(Period.ofDays(1))).toBe(true);
  });
});

describe('Period.parse', () => {
  it.each<[string, PeriodFields]>([
    ['P1Y2M3D', { years: 1, months: 2, weeks: 0, days: 3 }],
    ['P2W', { years: 0, months: 0, weeks: 2, days: 0 }],
    ['P1Y2M3W4D', { years: 1, months: 2, weeks: 3, days: 4 }],
    ['P0D', { years: 0, months: 0, weeks: 0, days: 0 }],
    ['-P1Y2M', { years: -1, months: -2, weeks: 0, days: 0 }],
    ['P-1Y2M', { years: -1, months: 2, weeks: 0, days: 0 }],
    ['-P-1Y2D', { years: 1, months: 0, weeks: 0, days: -2 }],
    ['+P1D', { years: 0, months: 0, weeks: 0, days: 1 }],
    ['P+3M', { years: 0, months: 3, weeks: 0, days: 0 }],
    ['p1y2d', { years: 1, months: 0, weeks: 0, days: 2 }],
    ['P400D', { years: 0, months: 0, weeks: 0, days: 400 }],
  ])('parses %s', (text, expected) => {
    expect(Period.parse(text)).toEqual(expected);
  });

  it.each([
    '',
    'P',
    '-P',
    'PT1H',
    'P1H',
    'P1DT2H',
    '1Y',
    'P1.5Y',
    'P1D2Y',
    'P1Y ',
    ' P1Y',
    'P--1Y',
  ])('rejects %j', (text) => {
    expect(() => Period.parse(text)).toThrow(
      new DaisyParseError('Expected an ISO 8601 period such as P1Y2M3D', { input: text }),
    );
  });

  it('rejects components beyond the safe integer range', () => {
    expect(() => Period.parse('P9007199254740993Y')).toThrow(
      new DaisyParseError('Period component is too large', { input: 'P9007199254740993Y' }),
    );
  });
});

describe('Period string form', () => {
  it.each<[PeriodFields, string]>([
    [{}, 'P0D'],
    [{ years: 1, months: 2, days: 3 }, 'P1Y2M3D'],
    [{ weeks: 2 }, 'P2W'],
    [{ years: 1, weeks: 2 }, 'P1Y2W'],
    [{ years: -1, months: 2 }, 'P-1Y2M'],
    [{ days: -5 }, 'P-5D'],
    [{ months: 14 }, 'P14M'],
  ])('formats %o as %s', (fields, expected) => {
    expect(Period.of(fields).toString()).toBe(expected);
  });

  it('writes a leading minus into every component', () => {
    expect(period('-P1Y2M').toString()).toBe('P-1Y-2M');
  });

  it('serializes to ISO 8601 in JSON', () => {
    expect(JSON.stringify({ notice: period('P2W') })).toBe('{"notice":"P2W"}');
  });

  it('shows the ISO form when inspected in Node', () => {
    expect(inspect(period('P1Y2M'))).toBe('Period(P1Y2M)');
  });
});

describe('plus and minus on periods', () => {
  it.each([
    ['P1Y2M', 'P1M3D', { years: 1, months: 3, weeks: 0, days: 3 }],
    ['P1Y', 'P-2Y', { years: -1, months: 0, weeks: 0, days: 0 }],
    ['P2W', 'P1W5D', { years: 0, months: 0, weeks: 3, days: 5 }],
    ['P11M', 'P1M', { years: 0, months: 12, weeks: 0, days: 0 }],
  ])('%s plus %s', (left, right, expected) => {
    expect(plus(period(left), period(right))).toEqual(expected);
  });

  it.each([
    ['P1Y2M', 'P1M3D', { years: 1, months: 1, weeks: 0, days: -3 }],
    ['P1Y', 'P1Y', { years: 0, months: 0, weeks: 0, days: 0 }],
    ['P0D', 'P2W', { years: 0, months: 0, weeks: -2, days: 0 }],
  ])('%s minus %s', (left, right, expected) => {
    expect(minus(period(left), period(right))).toEqual(expected);
  });
});

describe('negated and abs', () => {
  it.each([
    ['P1Y-2M', { years: -1, months: 2, weeks: 0, days: 0 }],
    ['P3W4D', { years: 0, months: 0, weeks: -3, days: -4 }],
    ['P0D', { years: 0, months: 0, weeks: 0, days: 0 }],
  ])('negates %s', (text, expected) => {
    expect(negated(period(text))).toEqual(expected);
  });

  it.each([
    ['P-1Y2M-3D', { years: 1, months: 2, weeks: 0, days: 3 }],
    ['-P2W', { years: 0, months: 0, weeks: 2, days: 0 }],
    ['P1M', { years: 0, months: 1, weeks: 0, days: 0 }],
  ])('makes every component of %s positive', (text, expected) => {
    expect(abs(period(text))).toEqual(expected);
  });
});

describe('isZero and isNegative', () => {
  it.each([
    ['P0D', true, false],
    ['P0Y0M0W0D', true, false],
    ['P1D', false, false],
    ['P-1D', false, true],
    ['P1Y-1M', false, true],
    ['-P2W', false, true],
  ])('%s: isZero %s, isNegative %s', (text, expectedZero, expectedNegative) => {
    expect(isZero(period(text))).toBe(expectedZero);
    expect(isNegative(period(text))).toBe(expectedNegative);
  });
});

describe('normalized', () => {
  it.each([
    ['P14M', { years: 1, months: 2, weeks: 0, days: 0 }],
    ['P25M', { years: 2, months: 1, weeks: 0, days: 0 }],
    ['P1Y-1M', { years: 0, months: 11, weeks: 0, days: 0 }],
    ['P-14M', { years: -1, months: -2, weeks: 0, days: 0 }],
    ['P-1Y13M', { years: 0, months: 1, weeks: 0, days: 0 }],
    ['P1Y2W40D', { years: 1, months: 0, weeks: 2, days: 40 }],
    ['P12M', { years: 1, months: 0, weeks: 0, days: 0 }],
    ['P0D', { years: 0, months: 0, weeks: 0, days: 0 }],
  ])('normalizes %s', (text, expected) => {
    expect(normalized(period(text))).toEqual(expected);
  });
});

describe('Period#equals', () => {
  it.each([
    ['P1Y2M', 'P1Y2M', true],
    ['-P1D', 'P-1D', true],
    ['P12M', 'P1Y', false],
    ['P1W', 'P7D', false],
    ['P1D', 'P2D', false],
  ])('%s equals %s: %s', (left, right, expected) => {
    expect(period(left).equals(period(right))).toBe(expected);
  });
});

describe('Period methods', () => {
  const sample = period('P1Y14M-3D');

  it.each<[string, string, (value: Period) => Period]>([
    ['plus(P1M)', 'P1Y15M-3D', (value) => value.plus(period('P1M'))],
    ['minus(P1Y)', 'P14M-3D', (value) => value.minus(period('P1Y'))],
    ['negated()', 'P-1Y-14M3D', (value) => value.negated()],
    ['abs()', 'P1Y14M3D', (value) => value.abs()],
    ['normalized()', 'P2Y2M-3D', (value) => value.normalized()],
  ])('P1Y14M-3D.%s is %s', (_call, expected, operate) => {
    expect(operate(sample).toString()).toBe(expected);
  });

  it('answers isZero and isNegative', () => {
    expect(sample.isZero()).toBe(false);
    expect(sample.isNegative()).toBe(true);
  });
});
