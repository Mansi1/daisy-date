import type { TimeFields } from '../internal/temporal';
import type { LocalDate } from '../local-date';
import { LocalDateTime } from '../local-date-time';
import { atTime } from './combine';

/** The calendar value types that date operations accept; each operation returns the type it was given. */
export type DateValue = LocalDate | LocalDateTime;

export const START_OF_DAY: TimeFields = { hour: 0, minute: 0, second: 0, millisecond: 0 };
export const END_OF_DAY: TimeFields = { hour: 23, minute: 59, second: 59, millisecond: 999 };

/** Applies a LocalDate operation to the date part of `value`; a LocalDateTime keeps its time unless `time` replaces it. */
export const adjustDatePart = <T extends DateValue>(
  value: T,
  adjust: (date: LocalDate) => LocalDate,
  time?: TimeFields,
): T => {
  const dateValue: DateValue = value;
  if (!(dateValue instanceof LocalDateTime)) {
    return adjust(dateValue) as T;
  }
  const clock = time ?? dateValue;
  return atTime(
    adjust(dateValue.toLocalDate()),
    clock.hour,
    clock.minute,
    clock.second,
    clock.millisecond,
  ) as T;
};
