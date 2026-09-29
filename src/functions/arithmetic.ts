import { Duration } from '../duration';
import { DaisyRangeError } from '../errors';
import { assertInteger } from '../internal/assert-integer';
import type { DateDuration } from '../internal/temporal';
import { translateRangeError } from '../internal/translate-range-error';
import { LocalDate, fromPlainDate, toPlainDate } from '../local-date';
import { LocalDateTime, toPlainDateTime } from '../local-date-time';
import { Period } from '../period';
import { toMillis } from './amounts';
import { adjustDatePart } from './date-part';
import type { DateValue } from './date-part';
import { moveDateTime } from './time';

type DateUnit = keyof DateDuration;

type Sign = 1 | -1;

type AmountArithmetic = {
  (date: LocalDate, period: Period): LocalDate;
  (dateTime: LocalDateTime, amount: Period | Duration): LocalDateTime;
  (period: Period, other: Period): Period;
  (duration: Duration, other: Duration): Duration;
};

/** The period and the remaining clock time between two date-times; `start + period + duration = end`. */
export type DateTimeDifference = { period: Period; duration: Duration };

type Until = {
  (date: LocalDate, other: LocalDate): Period;
  (dateTime: LocalDateTime, other: LocalDateTime): DateTimeDifference;
};

const MONTHS_PER_YEAR = 12;
const DAYS_PER_WEEK = 7;

const moveDate = (date: LocalDate, unit: DateUnit, amount: number, sign: Sign): LocalDate => {
  assertInteger(amount, `Number of ${unit}`);
  const signedAmount = sign * amount;
  return fromPlainDate(
    translateRangeError(
      () => toPlainDate(date).add({ [unit]: signedAmount }),
      (cause) =>
        new DaisyRangeError(
          `${date.toString()} moved by ${String(signedAmount)} ${unit} is outside the supported range`,
          { cause },
        ),
    ),
  );
};

/** Moves `value` `days` days forward; negative values move backward. A date-time keeps its time. */
export const plusDays = <T extends DateValue>(value: T, days: number): T =>
  adjustDatePart(value, (date) => moveDate(date, 'days', days, 1));

/** Moves `value` `weeks` weeks forward; negative values move backward. A date-time keeps its time. */
export const plusWeeks = <T extends DateValue>(value: T, weeks: number): T =>
  adjustDatePart(value, (date) => moveDate(date, 'weeks', weeks, 1));

/** Moves `value` `months` months forward, clamped to the month end (`01-31 + 1 month = 02-28`). */
export const plusMonths = <T extends DateValue>(value: T, months: number): T =>
  adjustDatePart(value, (date) => moveDate(date, 'months', months, 1));

/** Moves `value` `years` years forward, clamped to the month end (`02-29 + 1 year = 02-28`). */
export const plusYears = <T extends DateValue>(value: T, years: number): T =>
  adjustDatePart(value, (date) => moveDate(date, 'years', years, 1));

/** Moves `value` `days` days backward; negative values move forward. A date-time keeps its time. */
export const minusDays = <T extends DateValue>(value: T, days: number): T =>
  adjustDatePart(value, (date) => moveDate(date, 'days', days, -1));

/** Moves `value` `weeks` weeks backward; negative values move forward. A date-time keeps its time. */
export const minusWeeks = <T extends DateValue>(value: T, weeks: number): T =>
  adjustDatePart(value, (date) => moveDate(date, 'weeks', weeks, -1));

/** Moves `value` `months` months backward, clamped to the month end (`03-31 - 1 month = 02-28`). */
export const minusMonths = <T extends DateValue>(value: T, months: number): T =>
  adjustDatePart(value, (date) => moveDate(date, 'months', months, -1));

/** Moves `value` `years` years backward, clamped to the month end (`02-29 - 1 year = 02-28`). */
export const minusYears = <T extends DateValue>(value: T, years: number): T =>
  adjustDatePart(value, (date) => moveDate(date, 'years', years, -1));

/** Counts the days from `date` to `other`: positive when `other` is later, negative when it is earlier. */
export const daysUntil = (date: LocalDate, other: LocalDate): number =>
  toPlainDate(date).until(toPlainDate(other)).days;

const movePeriod = (date: LocalDate, period: Period, sign: Sign): LocalDate =>
  moveDate(
    moveDate(date, 'months', period.years * MONTHS_PER_YEAR + period.months, sign),
    'days',
    period.weeks * DAYS_PER_WEEK + period.days,
    sign,
  );

const combinePeriods = (period: Period, other: Period, sign: Sign): Period =>
  Period.of({
    years: period.years + sign * other.years,
    months: period.months + sign * other.months,
    weeks: period.weeks + sign * other.weeks,
    days: period.days + sign * other.days,
  });

const combineDurations = (duration: Duration, other: Duration, sign: Sign): Duration =>
  Duration.of({
    hours: duration.hours + sign * other.hours,
    minutes: duration.minutes + sign * other.minutes,
    seconds: duration.seconds + sign * other.seconds,
    milliseconds: duration.milliseconds + sign * other.milliseconds,
  });

const applyAmount = (
  target: DateValue | Period | Duration,
  amount: Period | Duration,
  sign: Sign,
): DateValue | Period | Duration => {
  if (
    (target instanceof LocalDate || target instanceof LocalDateTime) &&
    amount instanceof Period
  ) {
    return adjustDatePart(target, (date) => movePeriod(date, amount, sign));
  }
  if (target instanceof LocalDateTime && amount instanceof Duration) {
    return moveDateTime(target, 'milliseconds', toMillis(amount), sign);
  }
  if (target instanceof Period && amount instanceof Period) {
    return combinePeriods(target, amount, sign);
  }
  if (target instanceof Duration && amount instanceof Duration) {
    return combineDurations(target, amount, sign);
  }
  const operation = sign === 1 ? 'add' : 'subtract';
  const preposition = sign === 1 ? 'to' : 'from';
  throw new TypeError(`Cannot ${operation} ${String(amount)} ${preposition} ${String(target)}`);
};

/**
 * Adds a period to a date or date-time (all months first, then the days, as in java.time), a duration to a
 * date-time, or two periods or two durations component by component.
 */
export const plus = ((target: DateValue | Period | Duration, amount: Period | Duration) =>
  applyAmount(target, amount, 1)) as AmountArithmetic;

/** Subtracts a period or duration the same way `plus` adds it. */
export const minus = ((target: DateValue | Period | Duration, amount: Period | Duration) =>
  applyAmount(target, amount, -1)) as AmountArithmetic;

const dateTimeDifference = (dateTime: LocalDateTime, other: LocalDateTime): DateTimeDifference => {
  const difference = toPlainDateTime(dateTime).until(toPlainDateTime(other), {
    largestUnit: 'year',
  });
  return {
    period: Period.of({
      years: difference.years,
      months: difference.months,
      days: difference.days,
    }),
    duration: Duration.of({
      hours: difference.hours,
      minutes: difference.minutes,
      seconds: difference.seconds,
      milliseconds: difference.milliseconds,
    }),
  };
};

/**
 * Returns the years, months and days between two dates, as java.time's `LocalDate#until` does; between two
 * date-times, that period plus the remaining clock time as a duration.
 */
export const until = ((value: DateValue, other: DateValue) => {
  if (value instanceof LocalDate && other instanceof LocalDate) {
    const difference = toPlainDate(value).until(toPlainDate(other), { largestUnit: 'year' });
    return Period.of({ years: difference.years, months: difference.months, days: difference.days });
  }
  if (value instanceof LocalDateTime && other instanceof LocalDateTime) {
    return dateTimeDifference(value, other);
  }
  throw new TypeError(`Cannot measure from ${String(value)} to ${String(other)}`);
}) as Until;

/** Returns the exact time from `dateTime` to `other` in hours, minutes, seconds and milliseconds. */
export const durationUntil = (dateTime: LocalDateTime, other: LocalDateTime): Duration => {
  const difference = toPlainDateTime(dateTime).until(toPlainDateTime(other), {
    largestUnit: 'hour',
  });
  return Duration.of({
    hours: difference.hours,
    minutes: difference.minutes,
    seconds: difference.seconds,
    milliseconds: difference.milliseconds,
  });
};
