import { describe, expect, it } from 'vitest';

import { LocalDate, LocalDateTime } from '../../src';

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

describe('toEqual on LocalDateTime', () => {
  it('matches the same date-time created in different ways', () => {
    expect(LocalDateTime.parse('2026-09-28T14:30')).toEqual(LocalDateTime.of(2026, 9, 28, 14, 30));
  });

  it('tells date-times a millisecond apart', () => {
    expect(LocalDateTime.parse('2026-09-28T14:30:00.001')).not.toEqual(
      LocalDateTime.parse('2026-09-28T14:30:00.000'),
    );
  });

  it('never matches a LocalDate or a plain object', () => {
    expect(LocalDateTime.parse('2026-09-28T00:00')).not.toEqual(LocalDate.parse('2026-09-28'));
    expect(LocalDate.parse('2026-09-28')).not.toEqual(LocalDateTime.parse('2026-09-28T00:00'));
    expect(LocalDateTime.parse('2026-09-28T00:00')).not.toEqual({});
  });

  it('names both date-times when the assertion fails', () => {
    expect(() => {
      expect(LocalDateTime.parse('2026-09-28T14:30')).toEqual(
        LocalDateTime.parse('2026-09-28T15:30'),
      );
    }).toThrow(
      'expected LocalDateTime(2026-09-28T14:30:00) to deeply equal LocalDateTime(2026-09-28T15:30:00)',
    );
  });
});
