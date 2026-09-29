import { DaisyRangeError } from '../errors';
import { assertInteger } from '../internal/assert-integer';
import type { DateDuration } from '../internal/temporal';
import { translateRangeError } from '../internal/translate-range-error';
import { fromPlainDate, toPlainDate } from '../local-date';
import type { LocalDate } from '../local-date';

type DateUnit = keyof DateDuration;

const moveDate = (date: LocalDate, unit: DateUnit, amount: number, sign: 1 | -1): LocalDate => {
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
