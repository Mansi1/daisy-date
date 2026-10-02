import { describe, expect, it } from 'vitest';

import { DaisyParseError, DaisyRangeError, LocalDate, LocalDateTime } from '../../../../src';

describe('Luxon datetime/invalid: throwOnInvalid', () => {
  it('invalid.test.js:74: a weekday that contradicts the date throws', () => {
    expect(() => LocalDate.parse('Wednesday 1982-05-25', 'EEEE yyyy-MM-dd')).toThrow(
      DaisyParseError,
    );
  });

  it('invalid.test.js:94: year 9999999 throws', () => {
    expect(() => LocalDate.of(9999999, 5, 25)).toThrow(DaisyRangeError);
  });
});

describe('Luxon datetime/invalid (differs from Luxon on purpose)', () => {
  it('invalid.test.js:21: invalid creations throw instead of returning invalid instances (no invalid instances)', () => {
    expect(() => LocalDateTime.of(2014, 13, 33)).toThrow(DaisyRangeError);
    expect(() => LocalDate.parse('Wednesday 1982-05-25', 'EEEE yyyy-MM-dd')).toThrow(
      DaisyParseError,
    );
    expect(() => LocalDateTime.of(1982, 5, 25, 27)).toThrow(DaisyRangeError);
  });

  it('invalid.test.js:27: an unknown zone throws instead of returning invalid instances (no invalid instances)', () => {
    expect(() => LocalDateTime.now('America/Lasers')).toThrow(DaisyRangeError);
    expect(() => LocalDate.today('America/Lasers')).toThrow(DaisyRangeError);
    expect(() => LocalDateTime.of(1982, 1, 1).toDate('America/Lasers')).toThrow(DaisyRangeError);
    expect(() => LocalDateTime.fromDate(new Date(), 'America/Lasers')).toThrow(DaisyRangeError);
    expect(() => LocalDateTime.fromDate(new Date(0), 'America/Lasers')).toThrow(DaisyRangeError);
  });
});
