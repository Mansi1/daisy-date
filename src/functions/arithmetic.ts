import { DaisyRangeError } from '../errors';
import { assertInteger } from '../internal/assert-integer';
import type { DateDuration } from '../internal/temporal';
import { translateRangeError } from '../internal/translate-range-error';
import { Duration } from '../duration';
import { LocalDate, fromPlainDate, toPlainDate } from '../local-date';
import { Period } from '../period';

type DateUnit = keyof DateDuration;

type Sign = 1 | -1;

type AmountArithmetic = {
  (date: LocalDate, period: Period): LocalDate;
  (period: Period, other: Period): Period;
  (duration: Duration, other: Duration): Duration;
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

/** Returns `date` moved `days` days forward; negative values move backward. */
export const plusDays = (date: LocalDate, days: number): LocalDate =>
  moveDate(date, 'days', days, 1);

/** Returns `date` moved `weeks` weeks forward; negative values move backward. */
export const plusWeeks = (date: LocalDate, weeks: number): LocalDate =>
  moveDate(date, 'weeks', weeks, 1);

/** Returns `date` moved `months` months forward, clamped to the month end (`01-31 + 1 month = 02-28`). */
export const plusMonths = (date: LocalDate, months: number): LocalDate =>
  moveDate(date, 'months', months, 1);

/** Returns `date` moved `years` years forward, clamped to the month end (`02-29 + 1 year = 02-28`). */
export const plusYears = (date: LocalDate, years: number): LocalDate =>
  moveDate(date, 'years', years, 1);

/** Returns `date` moved `days` days backward; negative values move forward. */
export const minusDays = (date: LocalDate, days: number): LocalDate =>
  moveDate(date, 'days', days, -1);

/** Returns `date` moved `weeks` weeks backward; negative values move forward. */
export const minusWeeks = (date: LocalDate, weeks: number): LocalDate =>
  moveDate(date, 'weeks', weeks, -1);

/** Returns `date` moved `months` months backward, clamped to the month end (`03-31 - 1 month = 02-28`). */
export const minusMonths = (date: LocalDate, months: number): LocalDate =>
  moveDate(date, 'months', months, -1);

/** Returns `date` moved `years` years backward, clamped to the month end (`02-29 - 1 year = 02-28`). */
export const minusYears = (date: LocalDate, years: number): LocalDate =>
  moveDate(date, 'years', years, -1);

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
  target: LocalDate | Period | Duration,
  amount: Period | Duration,
  sign: Sign,
): LocalDate | Period | Duration => {
  if (target instanceof LocalDate && amount instanceof Period) {
    return movePeriod(target, amount, sign);
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
 * Adds a period to a date (all months first, then the days, as in java.time), or adds two periods or two durations
 * component by component.
 */
export const plus = ((target: LocalDate | Period | Duration, amount: Period | Duration) =>
  applyAmount(target, amount, 1)) as AmountArithmetic;

/** Subtracts a period from a date (months first, then days), or one period or duration from another. */
export const minus = ((target: LocalDate | Period | Duration, amount: Period | Duration) =>
  applyAmount(target, amount, -1)) as AmountArithmetic;

/** Returns the years, months and days from `date` to `other`, as java.time's `LocalDate#until` does. */
export const until = (date: LocalDate, other: LocalDate): Period => {
  const difference = toPlainDate(date).until(toPlainDate(other), { largestUnit: 'year' });
  return Period.of({ years: difference.years, months: difference.months, days: difference.days });
};
