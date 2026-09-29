import { isDayOfWeek } from '../day-of-week';
import type { DayOfWeek } from '../day-of-week';
import { DaisyRangeError } from '../errors';
import { assertInteger } from '../internal/assert-integer';
import type { LocalDate } from '../local-date';
import type { LocalDateRange } from '../local-date-range';
import { LocalDateTime } from '../local-date-time';
import { daysUntil, plusDays } from './arithmetic';
import { adjustDatePart } from './date-part';
import type { DateValue } from './date-part';

export type WeekendOptions = {
  /** The days that are not business days; defaults to Saturday and Sunday. */
  weekend?: readonly DayOfWeek[];
};

type Direction = 1 | -1;

const DEFAULT_WEEKEND: readonly DayOfWeek[] = ['saturday', 'sunday'];
const DAYS_PER_WEEK = 7;

/** Internal: validates the weekend option and returns it as a set; a weekend may not cover all seven days. */
export const resolveWeekend = ({
  weekend = DEFAULT_WEEKEND,
}: WeekendOptions = {}): ReadonlySet<DayOfWeek> => {
  const invalidIndex = weekend.findIndex((day) => !isDayOfWeek(day));
  if (invalidIndex !== -1) {
    throw new DaisyRangeError(
      `Weekend days must be DayOfWeek names, got ${String(weekend[invalidIndex])}`,
    );
  }
  const weekendDays = new Set(weekend);
  if (weekendDays.size === DAYS_PER_WEEK) {
    throw new DaisyRangeError('A weekend cannot cover all seven days');
  }
  return weekendDays;
};

/** Internal: true if `value` falls on one of the already validated `weekendDays`. */
export const fallsOnWeekend = (value: DateValue, weekendDays: ReadonlySet<DayOfWeek>): boolean =>
  weekendDays.has(value.dayOfWeek);

const dateOf = (value: DateValue): LocalDate =>
  value instanceof LocalDateTime ? value.toLocalDate() : value;

const walkBusinessDays = (
  date: LocalDate,
  remaining: number,
  direction: Direction,
  weekendDays: ReadonlySet<DayOfWeek>,
): LocalDate => {
  if (remaining === 0) {
    return date;
  }
  const nextDate = plusDays(date, direction);
  const stillRemaining = fallsOnWeekend(nextDate, weekendDays) ? remaining : remaining - 1;
  return walkBusinessDays(nextDate, stillRemaining, direction, weekendDays);
};

const moveBusinessDays = (
  date: LocalDate,
  amount: number,
  weekendDays: ReadonlySet<DayOfWeek>,
): LocalDate => {
  if (amount === 0) {
    return date;
  }
  const direction: Direction = amount > 0 ? 1 : -1;
  const businessDaysPerWeek = DAYS_PER_WEEK - weekendDays.size;
  const magnitude = Math.abs(amount);
  const fullWeeks = Math.floor((magnitude - 1) / businessDaysPerWeek);
  const weekJump = plusDays(date, direction * fullWeeks * DAYS_PER_WEEK);
  return walkBusinessDays(
    weekJump,
    magnitude - fullWeeks * businessDaysPerWeek,
    direction,
    weekendDays,
  );
};

const countBusinessDaysBefore = (
  start: LocalDate,
  end: LocalDate,
  weekendDays: ReadonlySet<DayOfWeek>,
): number => {
  const totalDays = daysUntil(start, end);
  const fullWeeks = Math.floor(totalDays / DAYS_PER_WEEK);
  const tailStart = plusDays(start, fullWeeks * DAYS_PER_WEEK);
  const tailBusinessDays = [...new Array<undefined>(totalDays % DAYS_PER_WEEK).keys()].filter(
    (offset) => !fallsOnWeekend(plusDays(tailStart, offset), weekendDays),
  ).length;
  return fullWeeks * (DAYS_PER_WEEK - weekendDays.size) + tailBusinessDays;
};

/** Returns true if `value` falls on a weekend day (Saturday or Sunday unless `options.weekend` says otherwise). */
export const isWeekend = (value: DateValue, options?: WeekendOptions): boolean =>
  fallsOnWeekend(value, resolveWeekend(options));

/** Returns true if `value` falls on a business day, i.e. not on a weekend day. */
export const isBusinessDay = (value: DateValue, options?: WeekendOptions): boolean =>
  !isWeekend(value, options);

/**
 * Moves `value` forward by `days` business days, counted strictly after it: Friday + 1 and Saturday + 1 are both
 * Monday. Negative values move backward. Whole weeks are skipped in one step; a date-time keeps its time.
 */
export const plusBusinessDays = <T extends DateValue>(
  value: T,
  days: number,
  options?: WeekendOptions,
): T => {
  assertInteger(days, 'Number of business days');
  const weekendDays = resolveWeekend(options);
  return adjustDatePart(value, (date) => moveBusinessDays(date, days, weekendDays));
};

/** Moves `value` backward by `days` business days, counted strictly before it: Sunday − 1 is Friday. */
export const minusBusinessDays = <T extends DateValue>(
  value: T,
  days: number,
  options?: WeekendOptions,
): T => {
  assertInteger(days, 'Number of business days');
  const weekendDays = resolveWeekend(options);
  return adjustDatePart(value, (date) => moveBusinessDays(date, -days, weekendDays));
};

/**
 * Counts the business days from `value` up to, but not including, `other`: Monday to the next Monday is 5.
 * Negative when `other` is earlier. Only the dates count; times are ignored.
 */
export const businessDaysUntil = (
  value: DateValue,
  other: DateValue,
  options?: WeekendOptions,
): number => {
  const weekendDays = resolveWeekend(options);
  const start = dateOf(value);
  const end = dateOf(other);
  return end.isBefore(start)
    ? 0 - countBusinessDaysBefore(end, start, weekendDays)
    : countBusinessDaysBefore(start, end, weekendDays);
};

/** Counts the business days in `range`, both ends included. */
export const businessDays = (range: LocalDateRange, options?: WeekendOptions): number => {
  const weekendDays = resolveWeekend(options);
  const endCounts = fallsOnWeekend(range.end, weekendDays) ? 0 : 1;
  return countBusinessDaysBefore(range.start, range.end, weekendDays) + endCounts;
};
