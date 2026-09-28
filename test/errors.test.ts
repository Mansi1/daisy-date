import { describe, expect, it } from 'vitest';

import {
  DaisyError,
  DaisyFormatError,
  DaisyParseError,
  DaisyRangeError,
  TemporalUnavailableError,
} from '../src';

describe('error hierarchy', () => {
  it.each([
    [new TemporalUnavailableError(), 'TEMPORAL_UNAVAILABLE', 'TemporalUnavailableError'],
    [new DaisyRangeError('month must be 1–12'), 'RANGE', 'DaisyRangeError'],
    [new DaisyParseError('Invalid date', { input: 'x' }), 'PARSE', 'DaisyParseError'],
    [new DaisyFormatError('Unknown symbol "Z"'), 'FORMAT', 'DaisyFormatError'],
  ])('%s has code %s and name %s', (error, code, name) => {
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(DaisyError);
    expect(error.code).toBe(code);
    expect(error.name).toBe(name);
  });

  it('keeps the name of the base class', () => {
    expect(new DaisyError('RANGE', 'boom').name).toBe('DaisyError');
  });

  it('keeps the original error as cause', () => {
    const temporalError = new RangeError('value out of range');
    const error = new DaisyRangeError('day must be 1–31', { cause: temporalError });
    expect(error.cause).toBe(temporalError);
  });
});

describe('TemporalUnavailableError', () => {
  it('tells the user how to install a polyfill or configure one', () => {
    const { message } = new TemporalUnavailableError();
    expect(message).toContain('Temporal is not available');
    expect(message).toContain('npm i temporal-polyfill');
    expect(message).toContain("import 'temporal-polyfill/global'");
    expect(message).toContain('configureTemporal()');
  });

  it('adds the install hint to a custom reason', () => {
    const { message } = new TemporalUnavailableError('Broken Temporal.');
    expect(message).toMatch(/^Broken Temporal\. Install a polyfill/);
  });
});

describe('DaisyParseError', () => {
  it('describes input, pattern and position', () => {
    const error = new DaisyParseError('Unexpected character', {
      input: '28.13.2026',
      pattern: 'dd.MM.yyyy',
      index: 3,
    });
    expect(error.message).toBe(
      'Unexpected character: "28.13.2026" with pattern "dd.MM.yyyy" at index 3',
    );
    expect(error.input).toBe('28.13.2026');
    expect(error.pattern).toBe('dd.MM.yyyy');
    expect(error.index).toBe(3);
  });

  it('leaves pattern and index undefined when not given', () => {
    const error = new DaisyParseError('Not an ISO date', { input: 'tomorrow' });
    expect(error.message).toBe('Not an ISO date: "tomorrow"');
    expect(error.pattern).toBeUndefined();
    expect(error.index).toBeUndefined();
  });
});
