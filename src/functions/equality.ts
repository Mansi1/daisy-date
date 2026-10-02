import { isEqual } from '../comparable';
import { Duration } from '../duration';
import { LocalDate } from '../local-date';
import { LocalDateRange } from '../local-date-range';
import { LocalDateTime } from '../local-date-time';
import { Period } from '../period';

/** Every daisy value type that `equals` compares. */
export type DaisyValue = LocalDate | LocalDateTime | Duration | Period | LocalDateRange;

const periodsEqual = (period: Period, other: Period): boolean =>
  period.years === other.years &&
  period.months === other.months &&
  period.weeks === other.weeks &&
  period.days === other.days;

/**
 * Returns true if two values of the same type are equal: ordered types (dates, date-times, durations) by position,
 * so `PT1H` equals `PT60M`; periods component by component, so `P12M` does not equal `P1Y`; ranges by both ends.
 * Values of different types are never equal.
 */
export const equals = <T extends DaisyValue>(value: T, other: T): boolean => {
  const left: DaisyValue = value;
  const right: DaisyValue = other;
  if (left instanceof Period && right instanceof Period) {
    return periodsEqual(left, right);
  }
  if (left instanceof LocalDateRange && right instanceof LocalDateRange) {
    return isEqual(left.start, right.start) && isEqual(left.end, right.end);
  }
  if (left instanceof LocalDate && right instanceof LocalDate) {
    return isEqual(left, right);
  }
  if (left instanceof LocalDateTime && right instanceof LocalDateTime) {
    return isEqual(left, right);
  }
  return left instanceof Duration && right instanceof Duration && isEqual(left, right);
};
