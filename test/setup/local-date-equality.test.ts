import { describe, expect, it } from 'vitest';

import { LocalDate } from '../../src';

describe('toEqual on LocalDate', () => {
  it('matches the same date created in different ways', () => {
    expect(LocalDate.parse('2026-09-28')).toEqual(LocalDate.of(2026, 9, 28));
  });

  it('tells different dates apart', () => {
    expect(LocalDate.parse('2026-01-01')).not.toEqual(LocalDate.parse('2027-05-05'));
  });

  it('never matches a plain object', () => {
    expect(LocalDate.parse('2026-01-01')).not.toEqual({});
    expect({}).not.toEqual(LocalDate.parse('2026-01-01'));
  });

  it('compares dates nested in arrays and objects', () => {
    expect([LocalDate.of(2026, 9, 28)]).toEqual([LocalDate.parse('2026-09-28')]);
    expect({ due: LocalDate.of(2026, 9, 28) }).not.toEqual({ due: LocalDate.of(2026, 9, 29) });
  });

  it('names both dates when the assertion fails', () => {
    expect(() => {
      expect(LocalDate.parse('2026-01-01')).toEqual(LocalDate.parse('2027-05-05'));
    }).toThrow('expected LocalDate(2026-01-01) to deeply equal LocalDate(2027-05-05)');
  });
});
