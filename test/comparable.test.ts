import { describe, expect, it } from 'vitest';

import { ComparableValue, compare } from '../src';
import type { Comparable, ComparisonResult } from '../src';
import { toComparisonResult } from '../src/comparable';

class Version extends ComparableValue<Version> {
  constructor(readonly number: number) {
    super();
  }

  compareTo(other: Version): ComparisonResult {
    return toComparisonResult(this.number - other.number);
  }
}

const one = new Version(1);
const two = new Version(2);

describe('toComparisonResult', () => {
  it.each([
    [-42, -1],
    [-0.5, -1],
    [0, 0],
    [0.5, 1],
    [42, 1],
  ] as const)('normalizes %s to %s', (difference, expected) => {
    expect(toComparisonResult(difference)).toBe(expected);
  });
});

describe('ComparableValue', () => {
  it('derives isBefore and isAfter from compareTo', () => {
    expect(one.isBefore(two)).toBe(true);
    expect(one.isAfter(two)).toBe(false);
    expect(two.isAfter(one)).toBe(true);
    expect(two.isBefore(one)).toBe(false);
  });

  it('treats equal values as neither before nor after each other', () => {
    const anotherOne = new Version(1);
    expect(one.equals(anotherOne)).toBe(true);
    expect(one.isEqual(anotherOne)).toBe(true);
    expect(one.isBefore(anotherOne)).toBe(false);
    expect(one.isAfter(anotherOne)).toBe(false);
  });

  it('reports different values as unequal', () => {
    expect(one.equals(two)).toBe(false);
    expect(one.isEqual(two)).toBe(false);
  });

  it('satisfies the Comparable type', () => {
    const comparable: Comparable<Version> = one;
    expect(comparable.compareTo(two)).toBe(-1);
  });
});

describe('compare', () => {
  it('sorts values ascending when passed to Array.prototype.sort', () => {
    const versions = [new Version(3), one, new Version(2)];
    expect(versions.sort(compare).map((version) => version.number)).toEqual([1, 2, 3]);
  });
});
