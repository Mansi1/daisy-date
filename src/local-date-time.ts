import { ComparableValue, toComparisonResult } from './comparable';
import type { ComparisonResult } from './comparable';
import { dayOfWeekFromIsoNumber } from './day-of-week';
import type { DayOfWeek } from './day-of-week';
import type { Duration } from './duration';
import { DaisyParseError, DaisyRangeError } from './errors';
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  next,
  nextOrSame,
  previous,
  previousOrSame,
  startOfMonth,
  startOfWeek,
  startOfYear,
  withDay,
  withMonth,
  withYear,
} from './functions/adjusters';
import {
  durationUntil,
  minus,
  minusDays,
  minusMonths,
  minusWeeks,
  minusYears,
  plus,
  plusDays,
  plusMonths,
  plusWeeks,
  plusYears,
  until,
} from './functions/arithmetic';
import type { DateTimeDifference } from './functions/arithmetic';
import {
  businessDaysUntil,
  isBusinessDay,
  isWeekend,
  minusBusinessDays,
  plusBusinessDays,
} from './functions/business-days';
import type { WeekendOptions } from './functions/business-days';
import {
  endOfDay,
  minusHours,
  minusMilliseconds,
  minusMinutes,
  minusSeconds,
  plusHours,
  plusMilliseconds,
  plusMinutes,
  plusSeconds,
  startOfDay,
  truncatedTo,
  withHour,
  withMillisecond,
  withMinute,
  withSecond,
} from './functions/time';
import type { TruncationUnit } from './functions/time';
import { assertInteger } from './internal/assert-integer';
import { isoWeekOfYear } from './internal/calendar-fields';
import { getTemporal } from './internal/temporal';
import type { PlainDateTimeLike } from './internal/temporal';
import { resolveTimeZone } from './internal/time-zone';
import { translateRangeError } from './internal/translate-range-error';
import { fromPlainDate } from './local-date';
import type { LocalDate } from './local-date';
import type { Period } from './period';

const ISO_DATE_TIME_FORMAT =
  /^(?:[+-]\d{6}|\d{4})-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.(\d{1,9}))?)?$/;

const MILLISECOND_DIGITS = 3;

const WRAP_PLAIN_DATE_TIME = Symbol('wrapPlainDateTime');
const UNWRAP_PLAIN_DATE_TIME = Symbol('unwrapPlainDateTime');

/** Internal: wraps a Temporal date-time without exposing the private constructor. */
export const fromPlainDateTime = (plainDateTime: PlainDateTimeLike): LocalDateTime =>
  LocalDateTime[WRAP_PLAIN_DATE_TIME](plainDateTime);

/** Internal: reads the Temporal date-time behind `dateTime`. */
export const toPlainDateTime = (dateTime: LocalDateTime): PlainDateTimeLike =>
  LocalDateTime[UNWRAP_PLAIN_DATE_TIME](dateTime);

const describeFields = (fields: readonly number[]): string =>
  fields.map((field) => String(field)).join(', ');

/**
 * A date with a wall-clock time and no time zone, such as `2026-09-28T14:30:00`, precise to the millisecond.
 * Immutable; create it through the static factories or `LocalDate#atTime`.
 */
export class LocalDateTime extends ComparableValue<LocalDateTime> {
  readonly #plainDateTime: PlainDateTimeLike;

  /** @internal Keyed by a module-private symbol; use `fromPlainDateTime` instead. */
  static [WRAP_PLAIN_DATE_TIME](plainDateTime: PlainDateTimeLike): LocalDateTime {
    return new LocalDateTime(plainDateTime);
  }

  /** @internal Keyed by a module-private symbol; use `toPlainDateTime` instead. */
  static [UNWRAP_PLAIN_DATE_TIME](dateTime: LocalDateTime): PlainDateTimeLike {
    return dateTime.#plainDateTime;
  }

  private constructor(plainDateTime: PlainDateTimeLike) {
    super();
    this.#plainDateTime = plainDateTime;
  }

  /** Creates a date-time from its fields (month 1–12, hour 0–23); throws `DaisyRangeError` for values that don't exist. */
  static of(
    year: number,
    month: number,
    day: number,
    hour = 0,
    minute = 0,
    second = 0,
    millisecond = 0,
  ): LocalDateTime {
    assertInteger(year, 'Year');
    assertInteger(month, 'Month');
    assertInteger(day, 'Day');
    assertInteger(hour, 'Hour');
    assertInteger(minute, 'Minute');
    assertInteger(second, 'Second');
    assertInteger(millisecond, 'Millisecond');
    return new LocalDateTime(
      translateRangeError(
        () =>
          getTemporal().PlainDateTime.from(
            { year, month, day, hour, minute, second, millisecond },
            { overflow: 'reject' },
          ),
        (cause) =>
          new DaisyRangeError(
            `Invalid date-time: ${describeFields([year, month, day, hour, minute, second, millisecond])}`,
            { cause },
          ),
      ),
    );
  }

  /** Parses an ISO 8601 date-time such as `2026-09-28T14:30`, `2026-09-28T14:30:15` or `2026-09-28T14:30:15.250`. */
  static parse(text: string): LocalDateTime {
    const match = ISO_DATE_TIME_FORMAT.exec(text);
    if (match === null) {
      throw new DaisyParseError('Expected an ISO 8601 date-time (yyyy-MM-ddTHH:mm:ss.SSS)', {
        input: text,
      });
    }
    const fraction = match[1] ?? '';
    if (/[1-9]/.test(fraction.slice(MILLISECOND_DIGITS))) {
      throw new DaisyParseError('LocalDateTime is precise to milliseconds', { input: text });
    }
    return new LocalDateTime(
      translateRangeError(
        () => getTemporal().PlainDateTime.from(text),
        (cause) => new DaisyParseError('Invalid ISO 8601 date-time', { input: text }, { cause }),
      ),
    );
  }

  /** Returns the current date and time in `timeZone` (an IANA name), defaulting to the system time zone. */
  static now(timeZone?: string): LocalDateTime {
    return new LocalDateTime(
      translateRangeError(
        () =>
          getTemporal()
            .Now.plainDateTimeISO(resolveTimeZone(timeZone))
            .with({ microsecond: 0, nanosecond: 0 }),
        (cause) => new DaisyRangeError(`Invalid time zone: ${String(timeZone)}`, { cause }),
      ),
    );
  }

  /** Returns the wall-clock date and time of `date` in `timeZone` (an IANA name), defaulting to the system time zone. */
  static fromDate(date: Date, timeZone?: string): LocalDateTime {
    const epochMilliseconds = date.getTime();
    if (Number.isNaN(epochMilliseconds)) {
      throw new DaisyRangeError('Cannot convert an invalid Date');
    }
    return new LocalDateTime(
      translateRangeError(
        () =>
          getTemporal()
            .Instant.fromEpochMilliseconds(epochMilliseconds)
            .toZonedDateTimeISO(resolveTimeZone(timeZone))
            .toPlainDateTime(),
        (cause) =>
          new DaisyRangeError(
            `Cannot convert ${date.toISOString()} to a date-time in time zone ${String(timeZone)}`,
            { cause },
          ),
      ),
    );
  }

  get year(): number {
    return this.#plainDateTime.year;
  }

  /** The month, from 1 (January) to 12 (December). */
  get month(): number {
    return this.#plainDateTime.month;
  }

  get day(): number {
    return this.#plainDateTime.day;
  }

  get dayOfWeek(): DayOfWeek {
    return dayOfWeekFromIsoNumber(this.#plainDateTime.dayOfWeek);
  }

  get dayOfYear(): number {
    return this.#plainDateTime.dayOfYear;
  }

  /** The ISO 8601 week number, from 1 to 53. */
  get weekOfYear(): number {
    return isoWeekOfYear(this.#plainDateTime, this.toString());
  }

  get daysInMonth(): number {
    return this.#plainDateTime.daysInMonth;
  }

  get daysInYear(): number {
    return this.#plainDateTime.daysInYear;
  }

  isLeapYear(): boolean {
    return this.#plainDateTime.inLeapYear;
  }

  /** The hour, from 0 to 23. */
  get hour(): number {
    return this.#plainDateTime.hour;
  }

  get minute(): number {
    return this.#plainDateTime.minute;
  }

  get second(): number {
    return this.#plainDateTime.second;
  }

  get millisecond(): number {
    return this.#plainDateTime.millisecond;
  }

  /** Returns the date part, dropping the time. */
  toLocalDate(): LocalDate {
    return fromPlainDate(this.#plainDateTime.toPlainDate());
  }

  plusDays(days: number): LocalDateTime {
    return plusDays<LocalDateTime>(this, days);
  }

  plusWeeks(weeks: number): LocalDateTime {
    return plusWeeks<LocalDateTime>(this, weeks);
  }

  /** Adds months, clamping the day to the month end; the time stays the same. */
  plusMonths(months: number): LocalDateTime {
    return plusMonths<LocalDateTime>(this, months);
  }

  plusYears(years: number): LocalDateTime {
    return plusYears<LocalDateTime>(this, years);
  }

  minusDays(days: number): LocalDateTime {
    return minusDays<LocalDateTime>(this, days);
  }

  minusWeeks(weeks: number): LocalDateTime {
    return minusWeeks<LocalDateTime>(this, weeks);
  }

  minusMonths(months: number): LocalDateTime {
    return minusMonths<LocalDateTime>(this, months);
  }

  minusYears(years: number): LocalDateTime {
    return minusYears<LocalDateTime>(this, years);
  }

  plusHours(hours: number): LocalDateTime {
    return plusHours(this, hours);
  }

  plusMinutes(minutes: number): LocalDateTime {
    return plusMinutes(this, minutes);
  }

  plusSeconds(seconds: number): LocalDateTime {
    return plusSeconds(this, seconds);
  }

  plusMilliseconds(milliseconds: number): LocalDateTime {
    return plusMilliseconds(this, milliseconds);
  }

  minusHours(hours: number): LocalDateTime {
    return minusHours(this, hours);
  }

  minusMinutes(minutes: number): LocalDateTime {
    return minusMinutes(this, minutes);
  }

  minusSeconds(seconds: number): LocalDateTime {
    return minusSeconds(this, seconds);
  }

  minusMilliseconds(milliseconds: number): LocalDateTime {
    return minusMilliseconds(this, milliseconds);
  }

  /** Adds a period (months first, then days, keeping the time) or a duration (exact clock time). */
  plus(amount: Period | Duration): LocalDateTime {
    return plus(this, amount);
  }

  minus(amount: Period | Duration): LocalDateTime {
    return minus(this, amount);
  }

  withYear(year: number): LocalDateTime {
    return withYear<LocalDateTime>(this, year);
  }

  withMonth(month: number): LocalDateTime {
    return withMonth<LocalDateTime>(this, month);
  }

  withDay(day: number): LocalDateTime {
    return withDay<LocalDateTime>(this, day);
  }

  withHour(hour: number): LocalDateTime {
    return withHour(this, hour);
  }

  withMinute(minute: number): LocalDateTime {
    return withMinute(this, minute);
  }

  withSecond(second: number): LocalDateTime {
    return withSecond(this, second);
  }

  withMillisecond(millisecond: number): LocalDateTime {
    return withMillisecond(this, millisecond);
  }

  startOfDay(): LocalDateTime {
    return startOfDay(this);
  }

  endOfDay(): LocalDateTime {
    return endOfDay(this);
  }

  /** Sets every field smaller than `unit` to zero: `14:35:20.500` truncated to `'hour'` is `14:00`. */
  truncatedTo(unit: TruncationUnit): LocalDateTime {
    return truncatedTo(this, unit);
  }

  /** Returns the first day of the week at 00:00, where weeks begin on `firstDay`. */
  startOfWeek(firstDay?: DayOfWeek): LocalDateTime {
    return startOfWeek<LocalDateTime>(this, firstDay);
  }

  /** Returns the last day of the week at 23:59:59.999, where weeks begin on `firstDay`. */
  endOfWeek(firstDay?: DayOfWeek): LocalDateTime {
    return endOfWeek<LocalDateTime>(this, firstDay);
  }

  startOfMonth(): LocalDateTime {
    return startOfMonth<LocalDateTime>(this);
  }

  endOfMonth(): LocalDateTime {
    return endOfMonth<LocalDateTime>(this);
  }

  startOfYear(): LocalDateTime {
    return startOfYear<LocalDateTime>(this);
  }

  endOfYear(): LocalDateTime {
    return endOfYear<LocalDateTime>(this);
  }

  next(dayOfWeek: DayOfWeek): LocalDateTime {
    return next<LocalDateTime>(this, dayOfWeek);
  }

  nextOrSame(dayOfWeek: DayOfWeek): LocalDateTime {
    return nextOrSame<LocalDateTime>(this, dayOfWeek);
  }

  previous(dayOfWeek: DayOfWeek): LocalDateTime {
    return previous<LocalDateTime>(this, dayOfWeek);
  }

  previousOrSame(dayOfWeek: DayOfWeek): LocalDateTime {
    return previousOrSame<LocalDateTime>(this, dayOfWeek);
  }

  /** Returns true on a weekend day: Saturday or Sunday unless `options.weekend` says otherwise. */
  isWeekend(options?: WeekendOptions): boolean {
    return isWeekend(this, options);
  }

  isBusinessDay(options?: WeekendOptions): boolean {
    return isBusinessDay(this, options);
  }

  /** Adds business days, counted strictly after this day: Friday + 1 and Saturday + 1 are both Monday. */
  plusBusinessDays(days: number, options?: WeekendOptions): LocalDateTime {
    return plusBusinessDays<LocalDateTime>(this, days, options);
  }

  /** Subtracts business days, counted strictly before this day: Sunday − 1 is Friday. */
  minusBusinessDays(days: number, options?: WeekendOptions): LocalDateTime {
    return minusBusinessDays<LocalDateTime>(this, days, options);
  }

  /** Counts business days from this day up to, but not including, `other`; negative if `other` is earlier. */
  businessDaysUntil(other: LocalDateTime, options?: WeekendOptions): number {
    return businessDaysUntil(this, other, options);
  }

  /** Returns the period and remaining clock time until `other`; `this + period + duration` equals `other`. */
  until(other: LocalDateTime): DateTimeDifference {
    return until(this, other);
  }

  /** Returns the exact time until `other` in hours, minutes, seconds and milliseconds. */
  durationUntil(other: LocalDateTime): Duration {
    return durationUntil(this, other);
  }

  compareTo(other: LocalDateTime): ComparisonResult {
    return toComparisonResult(
      getTemporal().PlainDateTime.compare(this.#plainDateTime, other.#plainDateTime),
    );
  }

  /**
   * Returns this wall-clock time in `timeZone` (an IANA name) as a JS `Date`, defaulting to the system time zone.
   * A time skipped by a daylight-saving change moves forward; a repeated time uses the earlier instant.
   */
  toDate(timeZone?: string): Date {
    return new Date(
      translateRangeError(
        () => this.#plainDateTime.toZonedDateTime(resolveTimeZone(timeZone)).epochMilliseconds,
        (cause) =>
          new DaisyRangeError(
            `Cannot convert ${this.toString()} to a Date in time zone ${String(timeZone)}`,
            { cause },
          ),
      ),
    );
  }

  /** Returns the ISO 8601 form with seconds, plus milliseconds when not zero: `2026-09-28T14:30:00.250`. */
  override toString(): string {
    return this.#plainDateTime.toString({
      fractionalSecondDigits: this.millisecond === 0 ? 0 : MILLISECOND_DIGITS,
    });
  }

  toJSON(): string {
    return this.toString();
  }

  /** Shows the date-time in `console.log` and Node's `util.inspect`, e.g. `LocalDateTime(2026-09-28T14:30:00)`. */
  [Symbol.for('nodejs.util.inspect.custom')](): string {
    return `LocalDateTime(${this.toString()})`;
  }
}
