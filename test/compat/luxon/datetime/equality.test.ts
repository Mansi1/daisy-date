import { describe, expect, it } from 'vitest';

import { LocalDate, LocalDateTime } from '../../../../src';

describe('Luxon datetime/equality', () => {
  it('equality.test.js:5: now equals itself', () => {
    const now = LocalDateTime.now();
    expect(now.equals(now)).toBe(true);
  });

  it('equality.test.js:10: identically constructed dates are equal', () => {
    const may15 = LocalDate.of(2017, 5, 15);
    expect(may15.equals(LocalDate.of(2017, 5, 15))).toBe(true);
    expect(may15.isBefore(LocalDate.of(2017, 5, 15))).toBe(false);
    expect(may15.isAfter(LocalDate.of(2017, 5, 15))).toBe(false);
  });
});
