import { expect } from 'vitest';

import { LocalDate } from '../../src';

const isLocalDate = (value: unknown): value is LocalDate => value instanceof LocalDate;

/** Lets `toEqual` compare LocalDates by date; without it every LocalDate looks alike, since the date is a private field. */
const localDateEquality = (actual: unknown, expected: unknown): boolean | undefined => {
  if (!isLocalDate(actual) && !isLocalDate(expected)) {
    return undefined;
  }
  return isLocalDate(actual) && isLocalDate(expected) && actual.equals(expected);
};

expect.addEqualityTesters([localDateEquality]);
