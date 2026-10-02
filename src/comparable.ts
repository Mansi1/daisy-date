export type ComparisonResult = -1 | 0 | 1;

/** A value with a total order, such as `LocalDate`, `LocalDateTime` or `Duration`. */
export type Comparable<T> = {
  compareTo: (other: T) => ComparisonResult;
  equals: (other: T) => boolean;
  isBefore: (other: T) => boolean;
  isAfter: (other: T) => boolean;
  isEqual: (other: T) => boolean;
};

/** Normalizes any sign-based comparator result, such as Temporal's `compare`, to -1, 0 or 1. */
export const toComparisonResult = (difference: number): ComparisonResult => {
  if (difference < 0) {
    return -1;
  }
  return difference > 0 ? 1 : 0;
};

/** Returns true if `left` comes before `right`. */
export const isBefore = <T>(left: Comparable<T>, right: T): boolean => left.compareTo(right) < 0;

/** Returns true if `left` comes after `right`. */
export const isAfter = <T>(left: Comparable<T>, right: T): boolean => left.compareTo(right) > 0;

/** Returns true if `left` and `right` are at the same position in the order (`PT1H` and `PT60M` are). */
export const isEqual = <T>(left: Comparable<T>, right: T): boolean => left.compareTo(right) === 0;

/** Base class for ordered value types: subclasses implement `compareTo`, the other checks derive from it. */
export abstract class ComparableValue<T extends ComparableValue<T>> implements Comparable<T> {
  abstract compareTo(other: T): ComparisonResult;

  equals(other: T): boolean {
    return isEqual(this, other);
  }

  isEqual(other: T): boolean {
    return isEqual(this, other);
  }

  isBefore(other: T): boolean {
    return isBefore(this, other);
  }

  isAfter(other: T): boolean {
    return isAfter(this, other);
  }
}

/** Compares two values of the same ordered type; pass it to `Array.prototype.sort`. */
export const compare = <T extends Comparable<T>>(left: T, right: T): ComparisonResult =>
  left.compareTo(right);
