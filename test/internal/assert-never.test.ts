import { describe, expect, it } from 'vitest';

import { assertNever } from '../../src/internal/assert-never';

type Shape = 'circle' | 'square';

const sideCount = (shape: Shape): number => {
  switch (shape) {
    case 'circle':
      return 0;
    case 'square':
      return 4;
    default:
      return assertNever(shape);
  }
};

describe('assertNever', () => {
  it('lets an exhaustive switch return normally', () => {
    expect(sideCount('square')).toBe(4);
  });

  it('throws with the unexpected value when an unknown member slips through', () => {
    expect(() => sideCount('triangle' as Shape)).toThrow('Unexpected value: "triangle"');
  });
});
