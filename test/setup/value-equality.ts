import { expect } from 'vitest';

import { LocalDate, LocalDateTime } from '../../src';

type ValueWithPrivateState = LocalDate | LocalDateTime;

const hasPrivateState = (value: unknown): value is ValueWithPrivateState =>
  value instanceof LocalDate || value instanceof LocalDateTime;

const sameTypeAndEqual = (
  actual: ValueWithPrivateState,
  expected: ValueWithPrivateState,
): boolean => {
  if (actual instanceof LocalDate && expected instanceof LocalDate) {
    return actual.equals(expected);
  }
  if (actual instanceof LocalDateTime && expected instanceof LocalDateTime) {
    return actual.equals(expected);
  }
  return false;
};

/**
 * Lets `toEqual` compare LocalDate and LocalDateTime by value; without it every instance looks alike, since the value
 * is a private field. A date never equals a date-time or a plain object.
 */
const privateStateEquality = (actual: unknown, expected: unknown): boolean | undefined => {
  if (!hasPrivateState(actual) && !hasPrivateState(expected)) {
    return undefined;
  }
  return hasPrivateState(actual) && hasPrivateState(expected) && sameTypeAndEqual(actual, expected);
};

expect.addEqualityTesters([privateStateEquality]);
