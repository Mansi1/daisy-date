import { inspect } from 'node:util';

import { describe, expect, it } from 'vitest';

import {
  DaisyParseError,
  DaisyRangeError,
  Duration,
  LocalDate,
  Period,
  abs,
  compare,
  isNegative,
  isZero,
  minus,
  negated,
  normalized,
  plus,
  toMillis,
} from '../src';
import type { DurationFields } from '../src';

const duration = (text: string) => Duration.parse(text);

describe('Duration.of', () => {
  it('keeps the given components and sets the omitted ones to zero', () => {
    expect(Duration.of({ hours: 2, seconds: -3 })).toEqual({
      hours: 2,
      minutes: 0,
      seconds: -3,
      milliseconds: 0,
    });
    expect(Duration.of({})).toEqual({ hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });
  });

  it('stores negative zero as zero', () => {
    expect(Duration.of({ minutes: -0 })).toEqual({
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
  });

  it.each<[DurationFields, string]>([
    [{ hours: 1.5 }, 'Hours must be an integer, got 1.5'],
    [{ minutes: Number.NaN }, 'Minutes must be an integer, got NaN'],
    [{ seconds: 0.5 }, 'Seconds must be an integer, got 0.5'],
    [{ milliseconds: 0.1 }, 'Milliseconds must be an integer, got 0.1'],
  ])('rejects %o', (fields, message) => {
    expect(() => Duration.of(fields)).toThrow(new DaisyRangeError(message));
  });

  it('rejects a total length beyond the safe integer range of milliseconds', () => {
    expect(() => Duration.of({ hours: 3_000_000_000_000 })).toThrow(
      new DaisyRangeError('A duration must stay within ±9007199254740991 milliseconds'),
    );
  });

  it('creates single-unit durations', () => {
    expect(Duration.ofHours(2)).toEqual({ hours: 2, minutes: 0, seconds: 0, milliseconds: 0 });
    expect(Duration.ofMinutes(-3)).toEqual({ hours: 0, minutes: -3, seconds: 0, milliseconds: 0 });
    expect(Duration.ofSeconds(4)).toEqual({ hours: 0, minutes: 0, seconds: 4, milliseconds: 0 });
    expect(Duration.ofMilliseconds(5)).toEqual({
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 5,
    });
  });

  it('is frozen', () => {
    expect(Object.isFrozen(Duration.ofHours(1))).toBe(true);
  });
});

describe('Duration.parse', () => {
  it.each<[string, DurationFields]>([
    ['PT2H30M', { hours: 2, minutes: 30, seconds: 0, milliseconds: 0 }],
    ['PT0.5S', { hours: 0, minutes: 0, seconds: 0, milliseconds: 500 }],
    ['PT1.5S', { hours: 0, minutes: 0, seconds: 1, milliseconds: 500 }],
    ['PT1,25S', { hours: 0, minutes: 0, seconds: 1, milliseconds: 250 }],
    ['PT0.001S', { hours: 0, minutes: 0, seconds: 0, milliseconds: 1 }],
    ['PT1.500000S', { hours: 0, minutes: 0, seconds: 1, milliseconds: 500 }],
    ['PT1H2M3.004S', { hours: 1, minutes: 2, seconds: 3, milliseconds: 4 }],
    ['PT0S', { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }],
    ['PT36H', { hours: 36, minutes: 0, seconds: 0, milliseconds: 0 }],
    ['pt90m', { hours: 0, minutes: 90, seconds: 0, milliseconds: 0 }],
    ['+PT1S', { hours: 0, minutes: 0, seconds: 1, milliseconds: 0 }],
    ['-PT1H', { hours: -1, minutes: 0, seconds: 0, milliseconds: 0 }],
    ['-PT0.5S', { hours: 0, minutes: 0, seconds: 0, milliseconds: -500 }],
    ['PT-1H30M', { hours: -1, minutes: 30, seconds: 0, milliseconds: 0 }],
    ['PT-1.5S', { hours: 0, minutes: 0, seconds: -1, milliseconds: -500 }],
    ['-PT-0.5S', { hours: 0, minutes: 0, seconds: 0, milliseconds: 500 }],
  ])('parses %s', (text, expected) => {
    expect(Duration.parse(text)).toEqual(expected);
  });

  it.each([
    '',
    'PT',
    '-PT',
    'P1D',
    'P1DT1H',
    'T1H',
    'PT1.5H',
    'PT1.5M',
    'PT.5S',
    'PT1S2M',
    'PT1H ',
    'PT1H-',
  ])('rejects %j', (text) => {
    expect(() => Duration.parse(text)).toThrow(
      new DaisyParseError('Expected an ISO 8601 duration such as PT2H30M', { input: text }),
    );
  });

  it('rejects precision below one millisecond', () => {
    expect(() => Duration.parse('PT0.0001S')).toThrow(
      new DaisyParseError('Durations are precise to milliseconds', { input: 'PT0.0001S' }),
    );
  });

  it('rejects components beyond the safe integer range', () => {
    expect(() => Duration.parse('PT9007199254740993H')).toThrow(
      new DaisyParseError('Duration component is too large', { input: 'PT9007199254740993H' }),
    );
  });

  it('rejects a total length beyond the safe integer range', () => {
    expect(() => Duration.parse('PT9007199254740991H')).toThrow(DaisyRangeError);
  });
});

describe('Duration string form', () => {
  it.each<[DurationFields, string]>([
    [{}, 'PT0S'],
    [{ hours: 2, minutes: 30 }, 'PT2H30M'],
    [{ milliseconds: 500 }, 'PT0.5S'],
    [{ seconds: 1, milliseconds: 50 }, 'PT1.05S'],
    [{ milliseconds: 1005 }, 'PT1.005S'],
    [{ seconds: -1, milliseconds: -500 }, 'PT-1.5S'],
    [{ milliseconds: -500 }, 'PT-0.5S'],
    [{ seconds: 1, milliseconds: -500 }, 'PT0.5S'],
    [{ hours: -1, minutes: 30 }, 'PT-1H30M'],
    [{ minutes: 90 }, 'PT90M'],
    [{ seconds: 120 }, 'PT120S'],
    [{ hours: 1, seconds: 2 }, 'PT1H2S'],
  ])('formats %o as %s', (fields, expected) => {
    expect(Duration.of(fields).toString()).toBe(expected);
  });

  it('serializes to ISO 8601 in JSON', () => {
    expect(JSON.stringify({ timeout: duration('PT30S') })).toBe('{"timeout":"PT30S"}');
  });

  it('shows the ISO form when inspected in Node', () => {
    expect(inspect(duration('PT2H30M'))).toBe('Duration(PT2H30M)');
  });
});

describe('toMillis', () => {
  it.each([
    ['PT0S', 0],
    ['PT1H', 3_600_000],
    ['PT2H30M', 9_000_000],
    ['PT1.5S', 1500],
    ['PT1H-30M', 1_800_000],
    ['-PT1M1S', -61_000],
  ])('%s is %s ms', (text, expected) => {
    expect(toMillis(duration(text))).toBe(expected);
  });
});

describe('Duration comparison', () => {
  it('compares by total length', () => {
    expect(duration('PT1H').equals(duration('PT60M'))).toBe(true);
    expect(duration('PT1H').compareTo(duration('PT59M'))).toBe(1);
    expect(duration('PT0.5S').isBefore(duration('PT1S'))).toBe(true);
    expect(duration('-PT1S').isAfter(duration('PT-2S'))).toBe(true);
  });

  it('sorts with compare', () => {
    const durations = [duration('PT1H'), duration('PT-5M'), duration('PT90S')];
    expect(durations.sort(compare)).toEqual([
      { hours: 0, minutes: -5, seconds: 0, milliseconds: 0 },
      { hours: 0, minutes: 0, seconds: 90, milliseconds: 0 },
      { hours: 1, minutes: 0, seconds: 0, milliseconds: 0 },
    ]);
  });
});

describe('plus and minus on durations', () => {
  it.each([
    ['PT1H', 'PT30M', { hours: 1, minutes: 30, seconds: 0, milliseconds: 0 }],
    ['PT1.5S', 'PT0.7S', { hours: 0, minutes: 0, seconds: 1, milliseconds: 1200 }],
    ['PT1H', 'PT-2H', { hours: -1, minutes: 0, seconds: 0, milliseconds: 0 }],
  ])('%s plus %s', (left, right, expected) => {
    expect(plus(duration(left), duration(right))).toEqual(expected);
  });

  it.each([
    ['PT1H', 'PT30M', { hours: 1, minutes: -30, seconds: 0, milliseconds: 0 }],
    ['PT2S', 'PT2S', { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }],
  ])('%s minus %s', (left, right, expected) => {
    expect(minus(duration(left), duration(right))).toEqual(expected);
  });

  it('rejects mixing amounts of different types', () => {
    expect(() => plus(duration('PT1H'), Period.parse('P1D') as never)).toThrow(
      new TypeError('Cannot add P1D to PT1H'),
    );
    expect(() => minus(LocalDate.parse('2026-09-28'), duration('PT1H') as never)).toThrow(
      new TypeError('Cannot subtract PT1H from 2026-09-28'),
    );
  });
});

describe('negated, abs, isZero, isNegative on durations', () => {
  it.each([
    ['PT1H30M', { hours: -1, minutes: -30, seconds: 0, milliseconds: 0 }],
    ['PT-1H30M', { hours: 1, minutes: -30, seconds: 0, milliseconds: 0 }],
    ['PT0S', { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }],
  ])('negates %s', (text, expected) => {
    expect(negated(duration(text))).toEqual(expected);
  });

  it.each([
    ['-PT1H30M', { hours: 1, minutes: 30, seconds: 0, milliseconds: 0 }],
    ['PT-1H30M', { hours: 1, minutes: -30, seconds: 0, milliseconds: 0 }],
    ['PT1H-30M', { hours: 1, minutes: -30, seconds: 0, milliseconds: 0 }],
    ['PT0.5S', { hours: 0, minutes: 0, seconds: 0, milliseconds: 500 }],
  ])('gives %s a non-negative total length', (text, expected) => {
    expect(abs(duration(text))).toEqual(expected);
  });

  it.each([
    ['PT0S', true, false],
    ['PT1H-60M', true, false],
    ['PT1S', false, false],
    ['PT1H-30M', false, false],
    ['PT-1H30M', false, true],
    ['-PT0.001S', false, true],
  ])('%s: isZero %s, isNegative %s', (text, expectedZero, expectedNegative) => {
    expect(isZero(duration(text))).toBe(expectedZero);
    expect(isNegative(duration(text))).toBe(expectedNegative);
  });
});

describe('normalized durations', () => {
  it.each([
    ['PT90M', { hours: 1, minutes: 30, seconds: 0, milliseconds: 0 }],
    ['PT3600S', { hours: 1, minutes: 0, seconds: 0, milliseconds: 0 }],
    ['PT100000S', { hours: 27, minutes: 46, seconds: 40, milliseconds: 0 }],
    ['PT61.5S', { hours: 0, minutes: 1, seconds: 1, milliseconds: 500 }],
    ['PT-90M', { hours: -1, minutes: -30, seconds: 0, milliseconds: 0 }],
    ['PT1H-30M', { hours: 0, minutes: 30, seconds: 0, milliseconds: 0 }],
    ['PT-1H30M', { hours: 0, minutes: -30, seconds: 0, milliseconds: 0 }],
    ['PT0S', { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }],
  ])('normalizes %s', (text, expected) => {
    expect(normalized(duration(text))).toEqual(expected);
  });
});

describe('Duration methods', () => {
  const sample = duration('PT1H90M-0.5S');

  it.each<[string, string, (value: Duration) => Duration]>([
    ['plus(PT30M)', 'PT1H120M-0.5S', (value) => value.plus(duration('PT30M'))],
    ['minus(PT1H)', 'PT90M-0.5S', (value) => value.minus(duration('PT1H'))],
    ['negated()', 'PT-1H-90M0.5S', (value) => value.negated()],
    ['abs()', 'PT1H90M-0.5S', (value) => value.abs()],
    ['normalized()', 'PT2H29M59.5S', (value) => value.normalized()],
  ])('PT1H90M-0.5S.%s is %s', (_call, expected, operate) => {
    expect(operate(sample).toString()).toBe(expected);
  });

  it('answers isZero, isNegative and toMillis', () => {
    expect(sample.isZero()).toBe(false);
    expect(sample.isNegative()).toBe(false);
    expect(sample.toMillis()).toBe(8_999_500);
  });
});
