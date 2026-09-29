import { dayOfWeekToIsoNumber, isDayOfWeek } from '../day-of-week';
import type { DayOfWeek } from '../day-of-week';
import { DaisyRangeError } from '../errors';
import { assertInteger } from '../internal/assert-integer';
import type { PlainDateLike } from '../internal/temporal';
import { translateRangeError } from '../internal/translate-range-error';
import { fromPlainDate, toPlainDate } from '../local-date';
import type { LocalDate } from '../local-date';
import { minusDays, plusDays } from './arithmetic';
import { END_OF_DAY, START_OF_DAY, adjustDatePart } from './date-part';
import type { DateValue } from './date-part';

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

const setYear = (date: LocalDate, year: number): LocalDate => {
  assertInteger(year, 'Year');
  return adjustDate(date, `year ${String(year)}`, (plainDate) =>
    plainDate.with({ year }, { overflow: 'constrain' }),
  );
};

const setMonth = (date: LocalDate, month: number): LocalDate => {
  assertInteger(month, 'Month');
  if (month < 1 || month > MONTHS_PER_YEAR) {
    throw new DaisyRangeError(`Month must be from 1 to 12, got ${String(month)}`);
  }
  return adjustDate(date, `month ${String(month)}`, (plainDate) =>
    plainDate.with({ month }, { overflow: 'constrain' }),
  );
};

const setDay = (date: LocalDate, day: number): LocalDate => {
  assertInteger(day, 'Day');
  return adjustDate(date, `day ${String(day)}`, (plainDate) =>
    plainDate.with({ day }, { overflow: 'reject' }),
  );
};

const firstDayOfWeek = (date: LocalDate, firstDay: DayOfWeek): LocalDate =>
  minusDays(date, daysBackTo(date, firstDay));

const firstDayOfMonth = (date: LocalDate): LocalDate => setDay(date, 1);

const lastDayOfMonth = (date: LocalDate): LocalDate => setDay(date, date.daysInMonth);

const nextOrSameDay = (date: LocalDate, dayOfWeek: DayOfWeek): LocalDate =>
  plusDays(date, daysForwardTo(date, dayOfWeek));

const previousOrSameDay = (date: LocalDate, dayOfWeek: DayOfWeek): LocalDate =>
  minusDays(date, daysBackTo(date, dayOfWeek));

/** Moves `value` to `year`; 29 February becomes 28 February in a common year, as in java.time. Keeps any time. */
export const withYear = <T extends DateValue>(value: T, year: number): T =>
  adjustDatePart(value, (date) => setYear(date, year));

/** Moves `value` to `month` (1–12), clamping the day to that month's end, as in java.time. Keeps any time. */
export const withMonth = <T extends DateValue>(value: T, month: number): T =>
  adjustDatePart(value, (date) => setMonth(date, month));

/** Moves `value` to day `day` of its month; throws `DaisyRangeError` if the month has no such day. Keeps any time. */
export const withDay = <T extends DateValue>(value: T, day: number): T =>
  adjustDatePart(value, (date) => setDay(date, day));

/** Returns the first day of the week containing `value`, where weeks begin on `firstDay`; a date-time at 00:00. */
export const startOfWeek = <T extends DateValue>(value: T, firstDay: DayOfWeek = 'monday'): T =>
  adjustDatePart(value, (date) => firstDayOfWeek(date, firstDay), START_OF_DAY);

/** Returns the last day of the week containing `value`, where weeks begin on `firstDay`; a date-time at 23:59:59.999. */
export const endOfWeek = <T extends DateValue>(value: T, firstDay: DayOfWeek = 'monday'): T =>
  adjustDatePart(
    value,
    (date) => plusDays(firstDayOfWeek(date, firstDay), DAYS_PER_WEEK - 1),
    END_OF_DAY,
  );

/** Returns the first day of the month; a date-time at 00:00. */
export const startOfMonth = <T extends DateValue>(value: T): T =>
  adjustDatePart(value, firstDayOfMonth, START_OF_DAY);

/** Returns the last day of the month; a date-time at 23:59:59.999. */
export const endOfMonth = <T extends DateValue>(value: T): T =>
  adjustDatePart(value, lastDayOfMonth, END_OF_DAY);

/** Returns 1 January; a date-time at 00:00. */
export const startOfYear = <T extends DateValue>(value: T): T =>
  adjustDatePart(value, (date) => firstDayOfMonth(setMonth(date, 1)), START_OF_DAY);

/** Returns 31 December; a date-time at 23:59:59.999. */
export const endOfYear = <T extends DateValue>(value: T): T =>
  adjustDatePart(value, (date) => lastDayOfMonth(setMonth(date, MONTHS_PER_YEAR)), END_OF_DAY);

/** Returns `value` if it falls on `dayOfWeek`, otherwise the next `dayOfWeek`. Keeps any time. */
export const nextOrSame = <T extends DateValue>(value: T, dayOfWeek: DayOfWeek): T =>
  adjustDatePart(value, (date) => nextOrSameDay(date, dayOfWeek));

/** Returns the first `dayOfWeek` strictly after `value`. Keeps any time. */
export const next = <T extends DateValue>(value: T, dayOfWeek: DayOfWeek): T =>
  adjustDatePart(value, (date) => nextOrSameDay(plusDays(date, 1), dayOfWeek));

/** Returns `value` if it falls on `dayOfWeek`, otherwise the previous `dayOfWeek`. Keeps any time. */
export const previousOrSame = <T extends DateValue>(value: T, dayOfWeek: DayOfWeek): T =>
  adjustDatePart(value, (date) => previousOrSameDay(date, dayOfWeek));

/** Returns the last `dayOfWeek` strictly before `value`. Keeps any time. */
export const previous = <T extends DateValue>(value: T, dayOfWeek: DayOfWeek): T =>
  adjustDatePart(value, (date) => previousOrSameDay(minusDays(date, 1), dayOfWeek));
