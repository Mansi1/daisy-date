import { inspect } from 'node:util';

import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  DaisyParseError,
  DaisyRangeError,
  LocalDate,
  LocalDateRange,
  TemporalUnavailableError,
  abuts,
  configureTemporal,
  contains,
  days,
  encloses,
  intersection,
  isConnected,
  overlaps,
  span,
  splitBy,
  union,
} from '../src';
import type { SplitUnit } from '../src';
import { splitAt } from '../src/functions/range';
import { catchError } from './support/catch-error';

const date = (text: string) => LocalDate.parse(text);
const range = (text: string) => LocalDateRange.parse(text);

afterEach(() => {
  vi.unstubAllGlobals();
  configureTemporal(undefined);
});

describe('LocalDateRange factories', () => {
  it('creates a range from both ends', () => {
    expect(LocalDateRange.of(date('2026-10-01'), date('2026-10-03'))).toEqual({
      start: date('2026-10-01'),
      end: date('2026-10-03'),
    });
    expect(LocalDateRange.of(date('2026-10-01'), date('2026-10-01')).toString()).toBe(
      '2026-10-01/2026-10-01',
    );
  });

  it('rejects an end before the start', () => {
    expect(() => LocalDateRange.of(date('2026-10-03'), date('2026-10-01'))).toThrow(
      new DaisyRangeError('A range cannot end (2026-10-01) before it starts (2026-10-03)'),
    );
  });

  it.each([
    ['2026-10-01', 3, '2026-10-01/2026-10-03'],
    ['2026-10-01', 1, '2026-10-01/2026-10-01'],
    ['2026-12-30', 3, '2026-12-30/2027-01-01'],
  ])('ofDays(%s, %s) is %s', (start, count, expected) => {
    expect(LocalDateRange.ofDays(date(start), count).toString()).toBe(expected);
  });

  it.each([
    [0, 'A range has at least 1 day, got 0'],
    [-2, 'A range has at least 1 day, got -2'],
    [1.5, 'Number of days must be an integer, got 1.5'],
  ])('ofDays rejects %s days', (count, message) => {
    expect(() => LocalDateRange.ofDays(date('2026-10-01'), count)).toThrow(
      new DaisyRangeError(message),
    );
  });

  it.each([
    [2024, 2, '2024-02-01/2024-02-29'],
    [2026, 2, '2026-02-01/2026-02-28'],
    [2026, 12, '2026-12-01/2026-12-31'],
  ])('ofMonth(%s, %s) is %s', (year, month, expected) => {
    expect(LocalDateRange.ofMonth(year, month).toString()).toBe(expected);
  });

  it('rejects a month that does not exist', () => {
    expect(() => LocalDateRange.ofMonth(2026, 13)).toThrow(
      new DaisyRangeError('Invalid date: year 2026, month 13, day 1'),
    );
  });

  it('covers a whole year', () => {
    expect(LocalDateRange.ofYear(2026).toString()).toBe('2026-01-01/2026-12-31');
  });

  it('covers the week containing a date', () => {
    expect(LocalDateRange.ofWeek(date('2026-10-01')).toString()).toBe('2026-09-28/2026-10-04');
    expect(LocalDateRange.ofWeek(date('2026-10-01'), 'sunday').toString()).toBe(
      '2026-09-27/2026-10-03',
    );
  });

  it('is frozen', () => {
    expect(Object.isFrozen(range('2026-10-01/2026-10-03'))).toBe(true);
  });
});

describe('LocalDateRange.parse', () => {
  it.each(['2026-10-01/2026-10-03', '2026-10-01/2026-10-01', '2026-12-30/2027-01-02'])(
    'round-trips %s',
    (text) => {
      expect(LocalDateRange.parse(text).toString()).toBe(text);
    },
  );

  it.each(['2026-10-01', '2026-10-01/2026-10-03/2026-10-05', ''])(
    'rejects %j, which is not an interval of two dates',
    (text) => {
      expect(() => LocalDateRange.parse(text)).toThrow(
        new DaisyParseError('Expected an ISO 8601 interval such as 2026-10-01/2026-10-03', {
          input: text,
        }),
      );
    },
  );

  it.each(['2026-10-01/2026-13-01', '2026-10-01/P3D', '2026-10-01/ 2026-10-03', '/2026-10-03'])(
    'rejects %j, whose endpoints are not ISO dates',
    (text) => {
      expect(() => LocalDateRange.parse(text)).toThrow(
        new DaisyParseError('Invalid date in ISO 8601 interval', { input: text }),
      );
    },
  );

  it('keeps the endpoint error as the cause', () => {
    const error = catchError(() => LocalDateRange.parse('2026-10-01/2026-02-30'));
    expect(error).toBeInstanceOf(DaisyParseError);
    const cause = (error as DaisyParseError).cause;
    expect(cause).toBeInstanceOf(DaisyParseError);
    expect((cause as DaisyParseError).input).toBe('2026-02-30');
  });

  it('rejects an interval that ends before it starts', () => {
    expect(() => LocalDateRange.parse('2026-10-03/2026-10-01')).toThrow(
      new DaisyParseError('The interval ends before it starts', { input: '2026-10-03/2026-10-01' }),
    );
  });

  it('lets errors other than parse errors through unchanged', () => {
    vi.stubGlobal('Temporal', undefined);
    configureTemporal(undefined);
    expect(() => LocalDateRange.parse('2026-10-01/2026-10-03')).toThrow(TemporalUnavailableError);
  });
});

describe('days and contains', () => {
  it.each([
    ['2026-10-01/2026-10-03', 3],
    ['2026-10-01/2026-10-01', 1],
    ['2026-02-01/2026-02-28', 28],
    ['2024-01-01/2024-12-31', 366],
  ])('%s has %s days', (text, expected) => {
    expect(days(range(text))).toBe(expected);
  });

  it.each([
    ['2026-10-01', true],
    ['2026-10-02', true],
    ['2026-10-03', true],
    ['2026-09-30', false],
    ['2026-10-04', false],
  ])('2026-10-01/2026-10-03 contains %s: %s', (text, expected) => {
    expect(contains(range('2026-10-01/2026-10-03'), date(text))).toBe(expected);
  });
});

describe('relations between two ranges', () => {
  it.each([
    ['2026-10-01/2026-10-05', '2026-10-03/2026-10-08', true, false, true],
    ['2026-10-01/2026-10-05', '2026-10-05/2026-10-08', true, false, true],
    ['2026-10-01/2026-10-05', '2026-10-06/2026-10-08', false, true, true],
    ['2026-10-01/2026-10-05', '2026-10-07/2026-10-08', false, false, false],
    ['2026-10-01/2026-10-31', '2026-10-10/2026-10-12', true, false, true],
    ['2026-10-01/2026-10-01', '2026-10-01/2026-10-01', true, false, true],
    ['2026-12-31/2026-12-31', '2027-01-01/2027-01-01', false, true, true],
  ])(
    '%s and %s: overlaps %s, abuts %s, connected %s (in both orders)',
    (first, second, expectedOverlap, expectedAbut, expectedConnection) => {
      expect(overlaps(range(first), range(second))).toBe(expectedOverlap);
      expect(overlaps(range(second), range(first))).toBe(expectedOverlap);
      expect(abuts(range(first), range(second))).toBe(expectedAbut);
      expect(abuts(range(second), range(first))).toBe(expectedAbut);
      expect(isConnected(range(first), range(second))).toBe(expectedConnection);
      expect(isConnected(range(second), range(first))).toBe(expectedConnection);
    },
  );

  it.each([
    ['2026-10-01/2026-10-31', '2026-10-10/2026-10-12', true],
    ['2026-10-01/2026-10-31', '2026-10-01/2026-10-31', true],
    ['2026-10-01/2026-10-31', '2026-10-01/2026-10-01', true],
    ['2026-10-10/2026-10-12', '2026-10-01/2026-10-31', false],
    ['2026-10-01/2026-10-31', '2026-10-30/2026-11-02', false],
  ])('%s encloses %s: %s', (outer, inner, expected) => {
    expect(encloses(range(outer), range(inner))).toBe(expected);
  });
});

describe('combining ranges', () => {
  it.each([
    ['2026-10-01/2026-10-05', '2026-10-03/2026-10-08', '2026-10-03/2026-10-05'],
    ['2026-10-01/2026-10-31', '2026-10-10/2026-10-12', '2026-10-10/2026-10-12'],
    ['2026-10-01/2026-10-05', '2026-10-05/2026-10-08', '2026-10-05/2026-10-05'],
  ])('the intersection of %s and %s is %s (in both orders)', (first, second, expected) => {
    expect(intersection(range(first), range(second))).toEqual(range(expected));
    expect(intersection(range(second), range(first))).toEqual(range(expected));
  });

  it('has no intersection for ranges that only abut', () => {
    expect(intersection(range('2026-10-01/2026-10-05'), range('2026-10-06/2026-10-08'))).toBeNull();
  });

  it.each([
    ['2026-10-01/2026-10-05', '2026-10-03/2026-10-08', '2026-10-01/2026-10-08'],
    ['2026-10-01/2026-10-05', '2026-10-20/2026-10-25', '2026-10-01/2026-10-25'],
    ['2026-10-01/2026-10-31', '2026-10-10/2026-10-12', '2026-10-01/2026-10-31'],
  ])('the span of %s and %s is %s (in both orders)', (first, second, expected) => {
    expect(span(range(first), range(second))).toEqual(range(expected));
    expect(span(range(second), range(first))).toEqual(range(expected));
  });

  it.each([
    ['2026-10-01/2026-10-05', '2026-10-03/2026-10-08', '2026-10-01/2026-10-08'],
    ['2026-10-01/2026-10-05', '2026-10-06/2026-10-08', '2026-10-01/2026-10-08'],
  ])('the union of %s and %s is %s (in both orders)', (first, second, expected) => {
    expect(union(range(first), range(second))).toEqual(range(expected));
    expect(union(range(second), range(first))).toEqual(range(expected));
  });

  it('refuses to fill a gap in a union', () => {
    expect(() => union(range('2026-10-01/2026-10-05'), range('2026-10-07/2026-10-08'))).toThrow(
      new DaisyRangeError(
        'Cannot unite 2026-10-01/2026-10-05 and 2026-10-07/2026-10-08: they neither overlap nor abut',
      ),
    );
  });
});

describe('iterating a range', () => {
  const firstDays = range('2026-09-29/2026-10-02');
  const expectedDays = [
    date('2026-09-29'),
    date('2026-09-30'),
    date('2026-10-01'),
    date('2026-10-02'),
  ];

  it('yields every date with for…of', () => {
    const collected: LocalDate[] = [];
    for (const day of firstDays) {
      collected.push(day);
    }
    expect(collected).toEqual(expectedDays);
  });

  it('works with spread, Array.from, toArray and destructuring', () => {
    expect([...firstDays]).toEqual(expectedDays);
    expect(Array.from(firstDays)).toEqual(expectedDays);
    expect(firstDays.toArray()).toEqual(expectedDays);
    const [first, second] = firstDays;
    expect([first, second]).toEqual([date('2026-09-29'), date('2026-09-30')]);
  });

  it('yields a single date for a one-day range', () => {
    expect([...range('2026-10-01/2026-10-01')]).toEqual([date('2026-10-01')]);
  });

  it('creates dates lazily, so a huge range can be walked from its start', () => {
    const iterator = range('0001-01-01/9999-12-31')[Symbol.iterator]();
    expect(iterator.next()).toEqual({ value: date('0001-01-01'), done: false });
    expect(iterator.next()).toEqual({ value: date('0001-01-02'), done: false });
  });

  it('can be iterated more than once', () => {
    expect([...firstDays]).toEqual([...firstDays]);
  });
});

describe('splitBy', () => {
  it.each<[string, SplitUnit, string[]]>([
    ['2026-10-30/2026-11-02', 'month', ['2026-10-30/2026-10-31', '2026-11-01/2026-11-02']],
    [
      '2026-01-15/2026-03-10',
      'month',
      ['2026-01-15/2026-01-31', '2026-02-01/2026-02-28', '2026-03-01/2026-03-10'],
    ],
    ['2026-12-20/2027-01-05', 'month', ['2026-12-20/2026-12-31', '2027-01-01/2027-01-05']],
    ['2026-10-05/2026-10-20', 'month', ['2026-10-05/2026-10-20']],
    [
      '2026-10-01/2026-10-14',
      'week',
      ['2026-10-01/2026-10-04', '2026-10-05/2026-10-11', '2026-10-12/2026-10-14'],
    ],
    ['2026-09-28/2026-10-04', 'week', ['2026-09-28/2026-10-04']],
    ['2026-10-01/2026-10-01', 'week', ['2026-10-01/2026-10-01']],
  ])('splits %s by %s', (text, unit, expected) => {
    expect(splitBy(range(text), unit)).toEqual(expected.map(range));
  });

  it('starts weeks on the given first day', () => {
    expect(splitBy(range('2026-10-01/2026-10-14'), 'week', { firstDay: 'sunday' })).toEqual([
      range('2026-10-01/2026-10-03'),
      range('2026-10-04/2026-10-10'),
      range('2026-10-11/2026-10-14'),
    ]);
  });

  it('rejects an unknown unit', () => {
    expect(() => splitBy(range('2026-10-01/2026-10-14'), 'day' as SplitUnit)).toThrow(
      new DaisyRangeError('Split unit must be one of week, month, got day'),
    );
  });

  it('reaches assertNever for a unit outside the union', () => {
    expect(() => splitAt(range('2026-10-01/2026-10-14'), 'day' as SplitUnit, 'monday')).toThrow(
      new Error('Unexpected value: "day"'),
    );
  });
});

describe('LocalDateRange string form and equality', () => {
  it('serializes to the ISO interval in JSON', () => {
    expect(JSON.stringify({ trip: range('2026-10-01/2026-10-03') })).toBe(
      '{"trip":"2026-10-01/2026-10-03"}',
    );
  });

  it('shows the interval when inspected in Node', () => {
    expect(inspect(range('2026-10-01/2026-10-03'))).toBe('LocalDateRange(2026-10-01/2026-10-03)');
  });

  it.each([
    ['2026-10-01/2026-10-03', '2026-10-01/2026-10-03', true],
    ['2026-10-01/2026-10-03', '2026-10-01/2026-10-04', false],
    ['2026-10-01/2026-10-03', '2026-09-30/2026-10-03', false],
  ])('%s equals %s: %s', (first, second, expected) => {
    expect(range(first).equals(range(second))).toBe(expected);
  });
});

describe('LocalDateRange methods', () => {
  const october = range('2026-10-01/2026-10-31');

  it('answer queries', () => {
    expect(october.days()).toBe(31);
    expect(october.contains(date('2026-10-15'))).toBe(true);
    expect(october.encloses(range('2026-10-10/2026-10-12'))).toBe(true);
    expect(october.overlaps(range('2026-10-31/2026-11-02'))).toBe(true);
    expect(october.abuts(range('2026-11-01/2026-11-02'))).toBe(true);
    expect(october.isConnected(range('2026-11-02/2026-11-03'))).toBe(false);
  });

  it('combine and split', () => {
    expect(october.intersection(range('2026-10-30/2026-11-02'))).toEqual(
      range('2026-10-30/2026-10-31'),
    );
    expect(october.span(range('2026-12-01/2026-12-02'))).toEqual(range('2026-10-01/2026-12-02'));
    expect(october.union(range('2026-11-01/2026-11-02'))).toEqual(range('2026-10-01/2026-11-02'));
    expect(october.splitBy('week')).toEqual([
      range('2026-10-01/2026-10-04'),
      range('2026-10-05/2026-10-11'),
      range('2026-10-12/2026-10-18'),
      range('2026-10-19/2026-10-25'),
      range('2026-10-26/2026-10-31'),
    ]);
  });
});
