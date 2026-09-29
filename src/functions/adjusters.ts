import { dayOfWeekToIsoNumber, isDayOfWeek } from '../day-of-week';
import type { DayOfWeek } from '../day-of-week';
import { DaisyRangeError } from '../errors';
import { assertInteger } from '../internal/assert-integer';
import type { PlainDateLike } from '../internal/temporal';
import { translateRangeError } from '../internal/translate-range-error';
import { fromPlainDate, toPlainDate } from '../local-date';
import type { LocalDate } from '../local-date';
import { minusDays, plusDays } from './arithmetic';

const DAYS_PER_WEEK = 7;
const MONTHS_PER_YEAR = 12;

const adjustDate = (
  date: LocalDate,
  describeTarget: string,
  adjust: (plainDate: PlainDateLike) => PlainDateLike,
): LocalDate =>
  fromPlainDate(
    translateRangeError(
      () => adjust(toPlainDate(date)),
      (cause) =>
        new DaisyRangeError(`Cannot set ${describeTarget} on ${date.toString()}`, { cause }),
    ),
  );

const daysForwardTo = (date: LocalDate, dayOfWeek: DayOfWeek): number => {
  if (!isDayOfWeek(dayOfWeek)) {
    throw new DaisyRangeError(`Expected a DayOfWeek, got ${String(dayOfWeek)}`);
  }
  return (
    (dayOfWeekToIsoNumber(dayOfWeek) - dayOfWeekToIsoNumber(date.dayOfWeek) + DAYS_PER_WEEK) %
    DAYS_PER_WEEK
  );
};

const daysBackTo = (date: LocalDate, dayOfWeek: DayOfWeek): number =>
  (DAYS_PER_WEEK - daysForwardTo(date, dayOfWeek)) % DAYS_PER_WEEK;

/** Returns `date` in `year`; 29 February becomes 28 February in a common year, as in java.time. */
export const withYear = (date: LocalDate, year: number): LocalDate => {
  assertInteger(year, 'Year');
  return adjustDate(date, `year ${String(year)}`, (plainDate) =>
    plainDate.with({ year }, { overflow: 'constrain' }),
  );
};

/** Returns `date` in `month` (1–12), clamping the day to that month's end, as in java.time. */
export const withMonth = (date: LocalDate, month: number): LocalDate => {
  assertInteger(month, 'Month');
  if (month < 1 || month > MONTHS_PER_YEAR) {
    throw new DaisyRangeError(`Month must be from 1 to 12, got ${String(month)}`);
  }
  return adjustDate(date, `month ${String(month)}`, (plainDate) =>
    plainDate.with({ month }, { overflow: 'constrain' }),
  );
};

/** Returns `date` on day `day` of the same month; throws `DaisyRangeError` if the month has no such day. */
export const withDay = (date: LocalDate, day: number): LocalDate => {
  assertInteger(day, 'Day');
  return adjustDate(date, `day ${String(day)}`, (plainDate) =>
    plainDate.with({ day }, { overflow: 'reject' }),
  );
};

/** Returns the first day of the week containing `date`, where weeks begin on `firstDay`. */
export const startOfWeek = (date: LocalDate, firstDay: DayOfWeek = 'monday'): LocalDate =>
  minusDays(date, daysBackTo(date, firstDay));

/** Returns the last day of the week containing `date`, where weeks begin on `firstDay`. */
export const endOfWeek = (date: LocalDate, firstDay: DayOfWeek = 'monday'): LocalDate =>
  plusDays(startOfWeek(date, firstDay), DAYS_PER_WEEK - 1);

export const startOfMonth = (date: LocalDate): LocalDate => withDay(date, 1);

export const endOfMonth = (date: LocalDate): LocalDate => withDay(date, date.daysInMonth);

export const startOfYear = (date: LocalDate): LocalDate => startOfMonth(withMonth(date, 1));

export const endOfYear = (date: LocalDate): LocalDate =>
  endOfMonth(withMonth(date, MONTHS_PER_YEAR));

/** Returns `date` if it falls on `dayOfWeek`, otherwise the next `dayOfWeek`. */
export const nextOrSame = (date: LocalDate, dayOfWeek: DayOfWeek): LocalDate =>
  plusDays(date, daysForwardTo(date, dayOfWeek));

/** Returns the first `dayOfWeek` strictly after `date`. */
export const next = (date: LocalDate, dayOfWeek: DayOfWeek): LocalDate =>
  nextOrSame(plusDays(date, 1), dayOfWeek);

/** Returns `date` if it falls on `dayOfWeek`, otherwise the previous `dayOfWeek`. */
export const previousOrSame = (date: LocalDate, dayOfWeek: DayOfWeek): LocalDate =>
  minusDays(date, daysBackTo(date, dayOfWeek));

/** Returns the last `dayOfWeek` strictly before `date`. */
export const previous = (date: LocalDate, dayOfWeek: DayOfWeek): LocalDate =>
  previousOrSame(minusDays(date, 1), dayOfWeek);
