import { DaisyRangeError } from '../errors';
import { resolveTimeZone } from '../internal/time-zone';
import { translateRangeError } from '../internal/translate-range-error';
import { fromPlainDate, toPlainDate } from '../local-date';
import type { LocalDate } from '../local-date';
import { LocalDateTime, toPlainDateTime } from '../local-date-time';
import type { DateValue } from './date-part';

/**
 * Converts to a JS `Date` in `timeZone` (an IANA name), defaulting to the system time zone: a date becomes the
 * start of its day there, a date-time its wall-clock time. A time skipped by a daylight-saving change moves
 * forward; a repeated time uses the earlier instant.
 */
export const toDate = (value: DateValue, timeZone?: string): Date =>
  new Date(
    translateRangeError(
      () => {
        const zone = resolveTimeZone(timeZone);
        return value instanceof LocalDateTime
          ? toPlainDateTime(value).toZonedDateTime(zone).epochMilliseconds
          : toPlainDate(value).toZonedDateTime({ timeZone: zone }).epochMilliseconds;
      },
      (cause) =>
        new DaisyRangeError(
          `Cannot convert ${value.toString()} to a Date in time zone ${String(timeZone)}`,
          { cause },
        ),
    ),
  );

/** Returns the date part of `dateTime`, dropping the time. */
export const toLocalDate = (dateTime: LocalDateTime): LocalDate =>
  fromPlainDate(toPlainDateTime(dateTime).toPlainDate());
