import { DaisyRangeError } from '../errors';
import { assertInteger } from '../internal/assert-integer';
import { assertNever } from '../internal/assert-never';
import type { TimeDuration, TimeFields } from '../internal/temporal';
import { translateRangeError } from '../internal/translate-range-error';
import { fromPlainDateTime, toPlainDateTime } from '../local-date-time';
import type { LocalDateTime } from '../local-date-time';
import { END_OF_DAY, START_OF_DAY } from './date-part';

/** Units a date-time can be truncated to, from the largest to the smallest. */
export const TRUNCATION_UNIT = ['day', 'hour', 'minute', 'second'] as const;

export type TruncationUnit = (typeof TRUNCATION_UNIT)[number];

type TimeUnit = keyof TimeDuration;

type Sign = 1 | -1;

/** Internal: moves `dateTime` by a clock amount, carrying into the date as needed. */
export const moveDateTime = (
  dateTime: LocalDateTime,
  unit: TimeUnit,
  amount: number,
  sign: Sign,
): LocalDateTime => {
  assertInteger(amount, `Number of ${unit}`);
  const signedAmount = sign * amount;
  return fromPlainDateTime(
    translateRangeError(
      () => toPlainDateTime(dateTime).add({ [unit]: signedAmount }),
      (cause) =>
        new DaisyRangeError(
          `${dateTime.toString()} moved by ${String(signedAmount)} ${unit} is outside the supported range`,
          { cause },
        ),
    ),
  );
};

const setTime = (
  dateTime: LocalDateTime,
  describeTarget: string,
  time: Partial<TimeFields>,
): LocalDateTime =>
  fromPlainDateTime(
    translateRangeError(
      () => toPlainDateTime(dateTime).with(time, { overflow: 'reject' }),
      (cause) =>
        new DaisyRangeError(`Cannot set ${describeTarget} on ${dateTime.toString()}`, { cause }),
    ),
  );

const setTimeField = (
  dateTime: LocalDateTime,
  field: keyof TimeFields,
  value: number,
  label: string,
): LocalDateTime => {
  assertInteger(value, label);
  return setTime(dateTime, `${field} ${String(value)}`, { [field]: value });
};

export const plusHours = (dateTime: LocalDateTime, hours: number): LocalDateTime =>
  moveDateTime(dateTime, 'hours', hours, 1);

export const plusMinutes = (dateTime: LocalDateTime, minutes: number): LocalDateTime =>
  moveDateTime(dateTime, 'minutes', minutes, 1);

export const plusSeconds = (dateTime: LocalDateTime, seconds: number): LocalDateTime =>
  moveDateTime(dateTime, 'seconds', seconds, 1);

export const plusMilliseconds = (dateTime: LocalDateTime, milliseconds: number): LocalDateTime =>
  moveDateTime(dateTime, 'milliseconds', milliseconds, 1);

export const minusHours = (dateTime: LocalDateTime, hours: number): LocalDateTime =>
  moveDateTime(dateTime, 'hours', hours, -1);

export const minusMinutes = (dateTime: LocalDateTime, minutes: number): LocalDateTime =>
  moveDateTime(dateTime, 'minutes', minutes, -1);

export const minusSeconds = (dateTime: LocalDateTime, seconds: number): LocalDateTime =>
  moveDateTime(dateTime, 'seconds', seconds, -1);

export const minusMilliseconds = (dateTime: LocalDateTime, milliseconds: number): LocalDateTime =>
  moveDateTime(dateTime, 'milliseconds', milliseconds, -1);

/** Sets the hour (0–23); throws `DaisyRangeError` outside that range. */
export const withHour = (dateTime: LocalDateTime, hour: number): LocalDateTime =>
  setTimeField(dateTime, 'hour', hour, 'Hour');

export const withMinute = (dateTime: LocalDateTime, minute: number): LocalDateTime =>
  setTimeField(dateTime, 'minute', minute, 'Minute');

export const withSecond = (dateTime: LocalDateTime, second: number): LocalDateTime =>
  setTimeField(dateTime, 'second', second, 'Second');

export const withMillisecond = (dateTime: LocalDateTime, millisecond: number): LocalDateTime =>
  setTimeField(dateTime, 'millisecond', millisecond, 'Millisecond');

/** Returns the same day at `00:00:00.000`. */
export const startOfDay = (dateTime: LocalDateTime): LocalDateTime =>
  setTime(dateTime, 'the start of the day', START_OF_DAY);

/** Returns the same day at `23:59:59.999`. */
export const endOfDay = (dateTime: LocalDateTime): LocalDateTime =>
  setTime(dateTime, 'the end of the day', END_OF_DAY);

const fieldsBelow = (unit: TruncationUnit): Partial<TimeFields> => {
  switch (unit) {
    case 'day':
      return START_OF_DAY;
    case 'hour':
      return { minute: 0, second: 0, millisecond: 0 };
    case 'minute':
      return { second: 0, millisecond: 0 };
    case 'second':
      return { millisecond: 0 };
    default:
      return assertNever(unit);
  }
};

/** Sets every field smaller than `unit` to zero: `14:35:20.500` truncated to `'hour'` is `14:00`. */
export const truncatedTo = (dateTime: LocalDateTime, unit: TruncationUnit): LocalDateTime => {
  if (!TRUNCATION_UNIT.includes(unit)) {
    throw new DaisyRangeError(
      `Truncation unit must be one of ${TRUNCATION_UNIT.join(', ')}, got ${unit}`,
    );
  }
  return setTime(dateTime, `truncation to ${unit}`, fieldsBelow(unit));
};
