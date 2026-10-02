import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  DaisyFormatError,
  DaisyParseError,
  DaisyRangeError,
  LocalDate,
  LocalDateTime,
  TemporalUnavailableError,
  configureTemporal,
  en,
} from '../../src';
import type { FieldSymbol } from '../../src/format/pattern';
import { readField } from '../../src/parse/pattern-parser';
import { dateFromFields } from '../../src/parse/resolve';
import type { ParseContext } from '../../src/parse/pattern-parser';
import { catchError } from '../support/catch-error';

const date = (text: string) => LocalDate.parse(text);
const dateTime = (text: string) => LocalDateTime.parse(text);
const LENIENT = { strict: false };

const parseErrorAt = (input: string, pattern: string, reason: string, index?: number) =>
  new DaisyParseError(reason, index === undefined ? { input, pattern } : { input, pattern, index });

afterEach(() => {
  vi.unstubAllGlobals();
  configureTemporal(undefined);
});

describe('LocalDate.parse with a pattern', () => {
  it.each([
    ['28.09.2026', 'dd.MM.yyyy', '2026-09-28'],
    ['2026-09-28', 'yyyy-MM-dd', '2026-09-28'],
    ['9/28/26', 'M/d/yy', '2026-09-28'],
    ['Sep 28, 2026', 'MMM d, yyyy', '2026-09-28'],
    ['SEP 28, 2026', 'MMM d, yyyy', '2026-09-28'],
    ['September 28, 2026', 'MMMM d, yyyy', '2026-09-28'],
    ['september 28, 2026', 'MMMM d, yyyy', '2026-09-28'],
    ['Monday, September 28, 2026', 'EEEE, MMMM d, yyyy', '2026-09-28'],
    ['Mon 28.09.2026', 'EEE dd.MM.yyyy', '2026-09-28'],
    ['Mo 28.09.2026', 'EEEEEE dd.MM.yyyy', '2026-09-28'],
    ['September 2026 28', 'LLLL yyyy d', '2026-09-28'],
    ['2026-271', 'yyyy-DDD', '2026-09-28'],
    ['271 2026-09-28', 'DDD yyyy-MM-dd', '2026-09-28'],
    ['Q3 2026-09-28', 'QQQ yyyy-MM-dd', '2026-09-28'],
    ['3rd quarter, 28.09.2026', 'QQQQ, dd.MM.yyyy', '2026-09-28'],
    ['3 28.09.2026', 'Q dd.MM.yyyy', '2026-09-28'],
    ['Day 28 of September, 2026', "'Day' d 'of' MMMM, yyyy", '2026-09-28'],
    ['28.09.26', 'dd.MM.yy', '2026-09-28'],
    ['01.01.99', 'dd.MM.yy', '2099-01-01'],
    ['01.01.00', 'dd.MM.yy', '2000-01-01'],
    ['5.3.7', 'd.M.y', '0007-03-05'],
    ['22222-01-01', 'y-MM-dd', '+022222-01-01'],
    ['222222-01-01', 'y-MM-dd', '+222222-01-01'],
    ['9/28/26', 'short', '2026-09-28'],
    ['Sep 28, 2026', 'medium', '2026-09-28'],
    ['September 28, 2026', 'long', '2026-09-28'],
    ['Monday, September 28, 2026', 'full', '2026-09-28'],
  ])('parses %j with %j as %s', (text, pattern, expected) => {
    expect(LocalDate.parse(text, pattern)).toEqual(date(expected));
  });

  it('uses the names of the given locale', () => {
    const shortMonths = {
      ...en,
      months: {
        ...en.months,
        format: {
          ...en.months.format,
          abbreviated: [
            'jan.',
            'feb.',
            'mar.',
            'apr.',
            'may',
            'jun.',
            'jul.',
            'aug.',
            'sept.',
            'oct.',
            'nov.',
            'dec.',
          ] as const,
        },
      },
    };
    expect(LocalDate.parse('28 sept. 2026', 'd MMM yyyy', { locale: shortMonths })).toEqual(
      date('2026-09-28'),
    );
  });
});

describe('LocalDateTime.parse with a pattern', () => {
  it.each([
    ['28.09.2026 14:05', 'dd.MM.yyyy HH:mm', '2026-09-28T14:05'],
    ['2026-09-28 14:05:09.045', 'yyyy-MM-dd HH:mm:ss.SSS', '2026-09-28T14:05:09.045'],
    ['2026-09-28 14:05:09.5', 'yyyy-MM-dd HH:mm:ss.S', '2026-09-28T14:05:09.500'],
    ['28.09.2026 12:00 AM', 'dd.MM.yyyy hh:mm a', '2026-09-28T00:00'],
    ['28.09.2026 12:00 PM', 'dd.MM.yyyy hh:mm a', '2026-09-28T12:00'],
    ['28.09.2026 11:30 pm', 'dd.MM.yyyy KK:mm a', '2026-09-28T23:30'],
    ['28.09.2026 0:15 am', 'dd.MM.yyyy K:mm a', '2026-09-28T00:15'],
    ['28.09.2026 24:00', 'dd.MM.yyyy kk:mm', '2026-09-28T00:00'],
    ['28.09.2026', 'dd.MM.yyyy', '2026-09-28T00:00'],
    ['9/28/26, 2:05 PM', 'short', '2026-09-28T14:05'],
    ['Sep 28, 2026, 2:05:09 PM', 'medium', '2026-09-28T14:05:09'],
    ['September 28, 2026 at 2:05:09 PM', 'long', '2026-09-28T14:05:09'],
  ])('parses %j with %j as %s', (text, pattern, expected) => {
    expect(LocalDateTime.parse(text, pattern)).toEqual(dateTime(expected));
  });
});

describe('strict parse errors point at the failing position', () => {
  it.each([
    ['28.9.2026', 'dd.MM.yyyy', 'Expected 2 digits for "MM"', 3],
    ['x.09.2026', 'd.MM.yyyy', 'Expected a number for "d"', 0],
    ['28.09.2026 extra', 'dd.MM.yyyy', 'Unexpected text after the date', 10],
    ['28-09-2026', 'dd.MM.yyyy', 'Expected "."', 2],
    ['Sept 28, 2026', 'MMM d, yyyy', 'Expected " "', 3],
    ['September 28, 2026', 'MMM d, yyyy', 'Expected " "', 3],
    ['Foo 28, 2026', 'MMM d, yyyy', 'Expected a month name', 0],
    ['Mo 28.09.2026', 'EEE dd.MM.yyyy', 'Expected a weekday name', 0],
    ['Q9 2026-09-28', 'QQQ yyyy-MM-dd', 'Expected a quarter', 0],
    ['13.13.2026', 'dd.MM.yyyy', '"MM" must be from 1 to 12, got 13', 3],
    ['00.09.2026', 'dd.MM.yyyy', '"dd" must be from 1 to 31, got 0', 0],
    ['28.09.2026 10', 'dd.MM.yyyy MM', '"MM" contradicts an earlier field', 11],
    ['28.09.2026', 'dd.MM.yy', 'Unexpected text after the date', 8],
    [
      'Tuesday, September 28, 2026',
      'EEEE, MMMM d, yyyy',
      'The weekday does not match 2026-09-28',
      0,
    ],
    ['Q2 2026-09-28', 'QQQ yyyy-MM-dd', 'Quarter 2 does not match 2026-09-28', 0],
    ['270 2026-09-28', 'DDD yyyy-MM-dd', 'Day of year 270 does not match 2026-09-28', 0],
  ])('%j with %j: %s at %s', (text, pattern, reason, index) => {
    expect(() => LocalDate.parse(text, pattern)).toThrow(
      parseErrorAt(text, pattern, reason, index),
    );
  });

  it.each([
    ['28.09.2026 25:00', 'dd.MM.yyyy HH:mm', '"HH" must be from 0 to 23, got 25', 11],
    ['28.09.2026 13:00 PM', 'dd.MM.yyyy hh:mm a', '"hh" must be from 1 to 12, got 13', 11],
    ['28.09.2026 2:05 XM', 'dd.MM.yyyy h:mm a', 'Expected AM or PM', 16],
    ['28.09.2026 14:60', 'dd.MM.yyyy HH:mm', '"mm" must be from 0 to 59, got 60', 14],
  ])('date-time %j with %j: %s at %s', (text, pattern, reason, index) => {
    expect(() => LocalDateTime.parse(text, pattern)).toThrow(
      parseErrorAt(text, pattern, reason, index),
    );
  });

  it('rejects dates that do not exist and keeps the range error as the cause', () => {
    const error = catchError(() => LocalDate.parse('31.02.2026', 'dd.MM.yyyy'));
    expect(error).toEqual(
      new DaisyParseError('The text names a date that does not exist', {
        input: '31.02.2026',
        pattern: 'dd.MM.yyyy',
      }),
    );
    expect((error as DaisyParseError).cause).toBeInstanceOf(DaisyRangeError);
  });

  it('lets errors other than range errors through when building the date', () => {
    vi.stubGlobal('Temporal', undefined);
    configureTemporal(undefined);
    expect(() => LocalDate.parse('28.09.2026', 'dd.MM.yyyy')).toThrow(TemporalUnavailableError);
  });
});

describe('lenient parsing', () => {
  it.each([
    ['28.9.2026', 'dd.MM.yyyy', '2026-09-28'],
    ['28.09.2026 and more', 'dd.MM.yyyy', '2026-09-28'],
    ['September 28, 2026', 'MMM d, yyyy', '2026-09-28'],
    ['Sep 28, 2026', 'MMMM d, yyyy', '2026-09-28'],
    ['Monday 28.09.2026', 'EEE dd.MM.yyyy', '2026-09-28'],
    ['Mo 28.09.2026', 'EEE dd.MM.yyyy', '2026-09-28'],
    ['Q3 2026-09-28', 'QQQQ yyyy-MM-dd', '2026-09-28'],
    ['5.3.26', 'd.M.yy', '2026-03-05'],
    ['5.3.2026', 'd.M.yy', '2026-03-05'],
  ])('accepts %j with %j as %s', (text, pattern, expected) => {
    expect(LocalDate.parse(text, pattern, LENIENT)).toEqual(date(expected));
  });

  it('reads a short fraction as tenths', () => {
    expect(
      LocalDateTime.parse('2026-09-28 14:05:09.5', 'yyyy-MM-dd HH:mm:ss.SSS', LENIENT),
    ).toEqual(dateTime('2026-09-28T14:05:09.500'));
  });
});

describe('patterns that cannot be parsed', () => {
  it.each([
    ['MMMMM yyyy', 'Narrow names ("MMMMM") in "MMMMM yyyy" are ambiguous and can\'t be parsed'],
    ['LLLLL d yyyy', 'Narrow names ("LLLLL") in "LLLLL d yyyy" are ambiguous and can\'t be parsed'],
    [
      'EEEEE dd.MM.yyyy',
      'Narrow names ("EEEEE") in "EEEEE dd.MM.yyyy" are ambiguous and can\'t be parsed',
    ],
    ['YYYY-ww', 'Pattern letter "Y" in "YYYY-ww" can be formatted but not parsed'],
    ['dd.MM.yyyy e', 'Pattern letter "e" in "dd.MM.yyyy e" can be formatted but not parsed'],
    ['dd.MM.yyyy HH:mm', 'Pattern "dd.MM.yyyy HH:mm" has time fields, but a LocalDate has no time'],
    ['dd.MM', 'Pattern "dd.MM" has no year (y), so it can\'t be parsed into a date'],
    [
      'yyyy',
      'Pattern "yyyy" needs a month and a day (M and d) or a day of year (D) to be parsed into a date',
    ],
  ])('LocalDate rejects %j', (pattern, message) => {
    expect(() => LocalDate.parse('28.09.2026', pattern)).toThrow(new DaisyFormatError(message));
  });

  it('rejects AM/PM next to a 24-hour clock', () => {
    expect(() => LocalDateTime.parse('2000-01-01 0930PM', 'yyyy-MM-dd HHmma')).toThrow(
      new DaisyFormatError(
        'Pattern "yyyy-MM-dd HHmma" mixes a 24-hour field (H or k) with AM/PM (a)',
      ),
    );
  });

  it('rejects a 12-hour clock without AM/PM', () => {
    expect(() => LocalDateTime.parse('28.09.2026 02:05', 'dd.MM.yyyy hh:mm')).toThrow(
      new DaisyFormatError(
        'Pattern "dd.MM.yyyy hh:mm" has a 12-hour field (h or K) but no AM/PM (a)',
      ),
    );
  });
});

describe('tryParse', () => {
  it('returns the value or null', () => {
    expect(LocalDate.tryParse('28.09.2026', 'dd.MM.yyyy')).toEqual(date('2026-09-28'));
    expect(LocalDate.tryParse('31.02.2026', 'dd.MM.yyyy')).toBeNull();
    expect(LocalDate.tryParse('2026-13-01')).toBeNull();
    expect(LocalDate.tryParse('2026-09-28')).toEqual(date('2026-09-28'));
    expect(LocalDateTime.tryParse('28.09.2026 14:05', 'dd.MM.yyyy HH:mm')).toEqual(
      dateTime('2026-09-28T14:05'),
    );
    expect(LocalDateTime.tryParse('28.09.2026 25:00', 'dd.MM.yyyy HH:mm')).toBeNull();
  });

  it('still throws for patterns that cannot be parsed', () => {
    expect(() => LocalDate.tryParse('S 2026', 'MMMMM yyyy')).toThrow(DaisyFormatError);
  });
});

describe('field reader internals', () => {
  const context: ParseContext = { text: '2026', pattern: 'Y', locale: en, strict: true };

  it.each(['Y', 'w', 'e', 'c'] as const)('refuses the format-only letter %s', (symbol) => {
    expect(() => readField(context, 0, symbol, 1)).toThrow(
      new DaisyFormatError(`Pattern letter "${symbol}" can be formatted but not parsed`),
    );
  });

  it('guards the year and day that the pattern check already guarantees', () => {
    expect(() =>
      dateFromFields({
        fields: { month: { value: 9, position: 0 }, day: { value: 28, position: 3 } },
        context,
      }),
    ).toThrow(
      new DaisyFormatError('Pattern "Y" has no year (y), so it can\'t be parsed into a date'),
    );
    expect(() =>
      dateFromFields({
        fields: { year: { value: 2026, position: 0 }, month: { value: 9, position: 5 } },
        context,
      }),
    ).toThrow(
      new DaisyFormatError(
        'Pattern "Y" needs a month and a day (M and d) or a day of year (D) to be parsed into a date',
      ),
    );
  });

  it('reaches assertNever for a symbol outside the union', () => {
    expect(() => readField(context, 0, 'x' as FieldSymbol, 1)).toThrow(
      new Error('Unexpected value: "x"'),
    );
  });
});
