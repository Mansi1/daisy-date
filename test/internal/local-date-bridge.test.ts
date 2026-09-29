import type {} from 'temporal-polyfill/global';
import { describe, expect, it } from 'vitest';

import { LocalDate } from '../../src';
import { fromPlainDate, toPlainDate } from '../../src/local-date';

describe('LocalDate internal bridge', () => {
  it('wraps a Temporal date and reads it back unchanged', () => {
    const plainDate = Temporal.PlainDate.from('2026-09-28');
    const date = fromPlainDate(plainDate);
    expect(date).toBeInstanceOf(LocalDate);
    expect(date.toString()).toBe('2026-09-28');
    expect(toPlainDate(date)).toBe(plainDate);
  });
});
