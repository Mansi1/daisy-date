import type { DayOfWeek } from '../day-of-week';
import { DaisyRangeError } from '../errors';
import { assertNever } from '../internal/assert-never';
import type { LocalDate } from '../local-date';
import { LocalDateRange } from '../local-date-range';
import { endOfMonth, endOfWeek, startOfMonth, startOfWeek } from './adjusters';
import { daysUntil, plusMonths, plusWeeks } from './arithmetic';

/** Calendar units a range can be split into. */
export const SPLIT_UNIT = ['week', 'month'] as const;

export type SplitUnit = (typeof SPLIT_UNIT)[number];

export type SplitOptions = {
  /** The day weeks begin on when splitting by `'week'`; defaults to Monday. */
  firstDay?: DayOfWeek;
};

const MONTHS_PER_YEAR = 12;
const DAYS_PER_WEEK = 7;

const earlier = (date: LocalDate, other: LocalDate): LocalDate =>
  other.isBefore(date) ? other : date;

const later = (date: LocalDate, other: LocalDate): LocalDate =>
  other.isAfter(date) ? other : date;

/** Counts the days in `range`, both ends included: 1–3 October is 3 days. */
export const days = (range: LocalDateRange): number => daysUntil(range.start, range.end) + 1;

/** Returns true if `date` lies within `range`, both ends included. */
export const contains = (range: LocalDateRange, date: LocalDate): boolean =>
  !date.isBefore(range.start) && !date.isAfter(range.end);

/** Returns true if `other` lies completely within `range`. */
export const encloses = (range: LocalDateRange, other: LocalDateRange): boolean =>
  !other.start.isBefore(range.start) && !other.end.isAfter(range.end);

/** Returns true if the ranges share at least one day. */
export const overlaps = (range: LocalDateRange, other: LocalDateRange): boolean =>
  !range.start.isAfter(other.end) && !other.start.isAfter(range.end);

/** Returns true if one range ends the day before the other starts, in either order. */
export const abuts = (range: LocalDateRange, other: LocalDateRange): boolean =>
  daysUntil(range.end, other.start) === 1 || daysUntil(other.end, range.start) === 1;

/** Returns true if the ranges overlap or abut, so that together they cover one unbroken stretch of days. */
export const isConnected = (range: LocalDateRange, other: LocalDateRange): boolean =>
  overlaps(range, other) || abuts(range, other);

/** Returns the days both ranges share, or `null` if they don't overlap. */
export const intersection = (
  range: LocalDateRange,
  other: LocalDateRange,
): LocalDateRange | null =>
  overlaps(range, other)
    ? LocalDateRange.of(later(range.start, other.start), earlier(range.end, other.end))
    : null;

/** Returns the smallest range enclosing both, including any gap between them. */
export const span = (range: LocalDateRange, other: LocalDateRange): LocalDateRange =>
  LocalDateRange.of(earlier(range.start, other.start), later(range.end, other.end));

/** Joins two connected ranges; throws `DaisyRangeError` if a gap would be filled in. */
export const union = (range: LocalDateRange, other: LocalDateRange): LocalDateRange => {
  if (!isConnected(range, other)) {
    throw new DaisyRangeError(
      `Cannot unite ${range.toString()} and ${other.toString()}: they neither overlap nor abut`,
    );
  }
  return span(range, other);
};

const monthCount = (range: LocalDateRange): number =>
  (range.end.year - range.start.year) * MONTHS_PER_YEAR + range.end.month - range.start.month + 1;

const weekCount = (range: LocalDateRange, firstDay: DayOfWeek): number =>
  Math.floor(daysUntil(startOfWeek(range.start, firstDay), range.end) / DAYS_PER_WEEK) + 1;

const clampToRange = (
  range: LocalDateRange,
  chunkStart: LocalDate,
  chunkEnd: LocalDate,
): LocalDateRange =>
  LocalDateRange.of(later(chunkStart, range.start), earlier(chunkEnd, range.end));

/** Internal: splits `range` at every boundary of `unit`; the first and last pieces may be partial. */
export const splitAt = (
  range: LocalDateRange,
  unit: SplitUnit,
  firstDay: DayOfWeek,
): LocalDateRange[] => {
  switch (unit) {
    case 'week': {
      const firstWeekStart = startOfWeek(range.start, firstDay);
      return Array.from({ length: weekCount(range, firstDay) }, (_unused, index) => {
        const weekStart = plusWeeks(firstWeekStart, index);
        return clampToRange(range, weekStart, endOfWeek(weekStart, firstDay));
      });
    }
    case 'month': {
      const firstMonthStart = startOfMonth(range.start);
      return Array.from({ length: monthCount(range) }, (_unused, index) => {
        const monthStart = plusMonths(firstMonthStart, index);
        return clampToRange(range, monthStart, endOfMonth(monthStart));
      });
    }
    default:
      return assertNever(unit);
  }
};

/** Splits `range` at week or month boundaries: October 30 – November 2 by month is `[10-30/10-31, 11-01/11-02]`. */
export const splitBy = (
  range: LocalDateRange,
  unit: SplitUnit,
  { firstDay = 'monday' }: SplitOptions = {},
): LocalDateRange[] => {
  if (!SPLIT_UNIT.includes(unit)) {
    throw new DaisyRangeError(`Split unit must be one of ${SPLIT_UNIT.join(', ')}, got ${unit}`);
  }
  return splitAt(range, unit, firstDay);
};
