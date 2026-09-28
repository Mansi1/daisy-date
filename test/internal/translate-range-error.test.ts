import { describe, expect, it } from 'vitest';

import { DaisyRangeError } from '../../src';
import { translateRangeError } from '../../src/internal/translate-range-error';

const toDaisyRangeError = (cause: RangeError) => new DaisyRangeError('translated', { cause });

describe('translateRangeError', () => {
  it('returns the result of a successful call', () => {
    expect(translateRangeError(() => 42, toDaisyRangeError)).toBe(42);
  });

  it('replaces a RangeError and keeps it as the cause', () => {
    const rangeError = new RangeError('out of range');
    const translate = () =>
      translateRangeError(() => {
        throw rangeError;
      }, toDaisyRangeError);
    expect(translate).toThrow(new DaisyRangeError('translated'));
    expect(translate).toThrow(expect.objectContaining({ cause: rangeError }));
  });

  it('rethrows other errors unchanged', () => {
    const typeError = new TypeError('wrong type');
    expect(() =>
      translateRangeError(() => {
        throw typeError;
      }, toDaisyRangeError),
    ).toThrow(typeError);
  });
});
