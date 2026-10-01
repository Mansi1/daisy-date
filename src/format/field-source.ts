import type { DayOfWeek } from '../day-of-week';
import type { DateValue } from '../functions/date-part';
import { isoWeekBasedYear } from '../internal/calendar-fields';
import type { TimeFields } from '../internal/temporal';
import { toPlainDate } from '../local-date';
import { LocalDateTime, toPlainDateTime } from '../local-date-time';

/**
 * Internal: the fields the pattern engine reads, independent of the value type, so that a future zoned type can
 * plug in (§9). `hasTime` is false for a LocalDate, whose time fields are then zero and never read.
 */
export type FieldSource = {
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly dayOfWeek: DayOfWeek;
  readonly dayOfYear: number;
  readonly weekOfYear: number;
  readonly weekBasedYear: number;
  readonly hasTime: boolean;
  readonly time: TimeFields;
};

const MIDNIGHT: TimeFields = { hour: 0, minute: 0, second: 0, millisecond: 0 };

/** Internal: reads the pattern fields of a LocalDate or LocalDateTime. */
export const fieldSourceOf = (value: DateValue): FieldSource => {
  const calendarFields =
    value instanceof LocalDateTime ? toPlainDateTime(value) : toPlainDate(value);
  return {
    year: value.year,
    month: value.month,
    day: value.day,
    dayOfWeek: value.dayOfWeek,
    dayOfYear: value.dayOfYear,
    weekOfYear: value.weekOfYear,
    weekBasedYear: isoWeekBasedYear(calendarFields, value.toString()),
    hasTime: value instanceof LocalDateTime,
    time: value instanceof LocalDateTime ? value : MIDNIGHT,
  };
};
