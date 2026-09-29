import type { LocalDate } from '../local-date';
import { LocalDateTime } from '../local-date-time';

/** Combines `date` with a wall-clock time; throws `DaisyRangeError` for hours outside 0–23 and similar. */
export const atTime = (
  date: LocalDate,
  hour: number,
  minute = 0,
  second = 0,
  millisecond = 0,
): LocalDateTime =>
  LocalDateTime.of(date.year, date.month, date.day, hour, minute, second, millisecond);

/** Returns `date` at midnight, `00:00:00.000`. */
export const atStartOfDay = (date: LocalDate): LocalDateTime => atTime(date, 0);
