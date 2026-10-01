import { ComparableValue, toComparisonResult } from './comparable';
import type { ComparisonResult } from './comparable';
import { dayOfWeekFromIsoNumber } from './day-of-week';
import type { DayOfWeek } from './day-of-week';
import { DaisyParseError, DaisyRangeError } from './errors';
import {
  businessDaysUntil,
  isBusinessDay,
  isWeekend,
  minusBusinessDays,
  plusBusinessDays,
} from './functions/business-days';
import type { WeekendOptions } from './functions/business-days';
import { format } from './functions/format';
import type { FormatOptions } from './functions/format';
import { atStartOfDay, atTime } from './functions/combine';
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
  daysUntil,
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
import { assertInteger } from './internal/assert-integer';
import { isoWeekOfYear } from './internal/calendar-fields';
import { getTemporal } from './internal/temporal';
import type { PlainDateLike } from './internal/temporal';
import type { LocalDateTime } from './local-date-time';
import type { Period } from './period';
import { resolveTimeZone } from './internal/time-zone';
import { translateRangeError } from './internal/translate-range-error';

const ISO_DATE_FORMAT = /^(?:[+-]\d{6}|\d{4})-\d{2}-\d{2}$/;

const WRAP_PLAIN_DATE = Symbol('wrapPlainDate');
const UNWRAP_PLAIN_DATE = Symbol('unwrapPlainDate');

/** Internal: wraps a Temporal date without exposing the private constructor. */
export const fromPlainDate = (plainDate: PlainDateLike): LocalDate =>
  LocalDate[WRAP_PLAIN_DATE](plainDate);

/** Internal: reads the Temporal date behind `date`. */
export const toPlainDate = (date: LocalDate): PlainDateLike => LocalDate[UNWRAP_PLAIN_DATE](date);

/** A calendar date without time or time zone, such as `2026-09-28`. Immutable; create it through the static factories. */
export class LocalDate extends ComparableValue<LocalDate> {
  readonly #plainDate: PlainDateLike;

  /** @internal Keyed by a module-private symbol; use `fromPlainDate` instead. */
  static [WRAP_PLAIN_DATE](plainDate: PlainDateLike): LocalDate {
    return new LocalDate(plainDate);
  }

  /** @internal Keyed by a module-private symbol; use `toPlainDate` instead. */
  static [UNWRAP_PLAIN_DATE](date: LocalDate): PlainDateLike {
    return date.#plainDate;
  }

  private constructor(plainDate: PlainDateLike) {
    super();
    this.#plainDate = plainDate;
  }

  /** Creates a date from a year, a month (1–12) and a day of month; throws `DaisyRangeError` for dates that don't exist. */
  static of(year: number, month: number, day: number): LocalDate {
    assertInteger(year, 'Year');
    assertInteger(month, 'Month');
    assertInteger(day, 'Day');
    return new LocalDate(
      translateRangeError(
        () => getTemporal().PlainDate.from({ year, month, day }, { overflow: 'reject' }),
        (cause) =>
          new DaisyRangeError(
            `Invalid date: year ${String(year)}, month ${String(month)}, day ${String(day)}`,
            { cause },
          ),
      ),
    );
  }

  /** Creates the `dayOfYear`-th day (1-based) of `year`. */
  static ofYearDay(year: number, dayOfYear: number): LocalDate {
    assertInteger(year, 'Year');
    assertInteger(dayOfYear, 'Day of year');
    return new LocalDate(
      translateRangeError(
        () => {
          const startOfYear = getTemporal().PlainDate.from(
            { year, month: 1, day: 1 },
            { overflow: 'reject' },
          );
          if (dayOfYear < 1 || dayOfYear > startOfYear.daysInYear) {
            throw new DaisyRangeError(
              `Day of year must be from 1 to ${String(startOfYear.daysInYear)} in ${String(year)}, got ${String(dayOfYear)}`,
            );
          }
          return startOfYear.add({ days: dayOfYear - 1 });
        },
        (cause) =>
          new DaisyRangeError(
            `Invalid date: year ${String(year)}, day of year ${String(dayOfYear)}`,
            { cause },
          ),
      ),
    );
  }

  /** Parses an ISO 8601 calendar date (`2026-09-28`, or `+010000-01-01` for extended years). */
  static parse(text: string): LocalDate {
    if (!ISO_DATE_FORMAT.test(text)) {
      throw new DaisyParseError('Expected an ISO 8601 date (yyyy-MM-dd)', { input: text });
    }
    return new LocalDate(
      translateRangeError(
        () => getTemporal().PlainDate.from(text),
        (cause) => new DaisyParseError('Invalid ISO 8601 date', { input: text }, { cause }),
      ),
    );
  }

  /** Returns the current date in `timeZone` (an IANA name), defaulting to the system time zone. */
  static today(timeZone?: string): LocalDate {
    return new LocalDate(
      translateRangeError(
        () => getTemporal().Now.plainDateISO(resolveTimeZone(timeZone)),
        (cause) => new DaisyRangeError(`Invalid time zone: ${String(timeZone)}`, { cause }),
      ),
    );
  }

  /** Returns the date that `date` falls on in `timeZone` (an IANA name), defaulting to the system time zone. */
  static fromDate(date: Date, timeZone?: string): LocalDate {
    const epochMilliseconds = date.getTime();
    if (Number.isNaN(epochMilliseconds)) {
      throw new DaisyRangeError('Cannot convert an invalid Date');
    }
    return new LocalDate(
      translateRangeError(
        () =>
          getTemporal()
            .Instant.fromEpochMilliseconds(epochMilliseconds)
            .toZonedDateTimeISO(resolveTimeZone(timeZone))
            .toPlainDate(),
        (cause) =>
          new DaisyRangeError(
            `Cannot convert ${date.toISOString()} to a date in time zone ${String(timeZone)}`,
            { cause },
          ),
      ),
    );
  }

  get year(): number {
    return this.#plainDate.year;
  }

  /** The month, from 1 (January) to 12 (December). */
  get month(): number {
    return this.#plainDate.month;
  }

  /** The day of the month, starting at 1. */
  get day(): number {
    return this.#plainDate.day;
  }

  get dayOfWeek(): DayOfWeek {
    return dayOfWeekFromIsoNumber(this.#plainDate.dayOfWeek);
  }

  /** The day of the year, from 1 to 365 or 366. */
  get dayOfYear(): number {
    return this.#plainDate.dayOfYear;
  }

  /** The ISO 8601 week number, from 1 to 53; early January can belong to the previous year's last week. */
  get weekOfYear(): number {
    return isoWeekOfYear(this.#plainDate, this.toString());
  }

  get daysInMonth(): number {
    return this.#plainDate.daysInMonth;
  }

  get daysInYear(): number {
    return this.#plainDate.daysInYear;
  }

  isLeapYear(): boolean {
    return this.#plainDate.inLeapYear;
  }

  plusDays(days: number): LocalDate {
    return plusDays<LocalDate>(this, days);
  }

  plusWeeks(weeks: number): LocalDate {
    return plusWeeks<LocalDate>(this, weeks);
  }

  /** Adds months, clamping to the month end: `2026-01-31` plus one month is `2026-02-28`. */
  plusMonths(months: number): LocalDate {
    return plusMonths<LocalDate>(this, months);
  }

  /** Adds years, clamping to the month end: `2024-02-29` plus one year is `2025-02-28`. */
  plusYears(years: number): LocalDate {
    return plusYears<LocalDate>(this, years);
  }

  minusDays(days: number): LocalDate {
    return minusDays<LocalDate>(this, days);
  }

  minusWeeks(weeks: number): LocalDate {
    return minusWeeks<LocalDate>(this, weeks);
  }

  minusMonths(months: number): LocalDate {
    return minusMonths<LocalDate>(this, months);
  }

  minusYears(years: number): LocalDate {
    return minusYears<LocalDate>(this, years);
  }

  /** Adds a period: all months first, clamped to the month end, then the days. `2026-01-31 + P1M1D` is `2026-03-01`. */
  plus(period: Period): LocalDate {
    return plus(this, period);
  }

  /** Subtracts a period: all months first, clamped to the month end, then the days. */
  minus(period: Period): LocalDate {
    return minus(this, period);
  }

  withYear(year: number): LocalDate {
    return withYear<LocalDate>(this, year);
  }

  withMonth(month: number): LocalDate {
    return withMonth<LocalDate>(this, month);
  }

  withDay(day: number): LocalDate {
    return withDay<LocalDate>(this, day);
  }

  startOfWeek(firstDay?: DayOfWeek): LocalDate {
    return startOfWeek<LocalDate>(this, firstDay);
  }

  endOfWeek(firstDay?: DayOfWeek): LocalDate {
    return endOfWeek<LocalDate>(this, firstDay);
  }

  startOfMonth(): LocalDate {
    return startOfMonth<LocalDate>(this);
  }

  endOfMonth(): LocalDate {
    return endOfMonth<LocalDate>(this);
  }

  startOfYear(): LocalDate {
    return startOfYear<LocalDate>(this);
  }

  endOfYear(): LocalDate {
    return endOfYear<LocalDate>(this);
  }

  next(dayOfWeek: DayOfWeek): LocalDate {
    return next<LocalDate>(this, dayOfWeek);
  }

  nextOrSame(dayOfWeek: DayOfWeek): LocalDate {
    return nextOrSame<LocalDate>(this, dayOfWeek);
  }

  previous(dayOfWeek: DayOfWeek): LocalDate {
    return previous<LocalDate>(this, dayOfWeek);
  }

  previousOrSame(dayOfWeek: DayOfWeek): LocalDate {
    return previousOrSame<LocalDate>(this, dayOfWeek);
  }

  /** Returns the years, months and days until `other`: `2026-01-31` until `2026-03-01` is `P1M1D`. */
  until(other: LocalDate): Period {
    return until(this, other);
  }

  /** Counts the days until `other`: positive when it is later, negative when it is earlier. */
  daysUntil(other: LocalDate): number {
    return daysUntil(this, other);
  }

  /** Returns true on a weekend day: Saturday or Sunday unless `options.weekend` says otherwise. */
  isWeekend(options?: WeekendOptions): boolean {
    return isWeekend(this, options);
  }

  isBusinessDay(options?: WeekendOptions): boolean {
    return isBusinessDay(this, options);
  }

  /** Adds business days, counted strictly after this day: Friday + 1 and Saturday + 1 are both Monday. */
  plusBusinessDays(days: number, options?: WeekendOptions): LocalDate {
    return plusBusinessDays<LocalDate>(this, days, options);
  }

  /** Subtracts business days, counted strictly before this day: Sunday − 1 is Friday. */
  minusBusinessDays(days: number, options?: WeekendOptions): LocalDate {
    return minusBusinessDays<LocalDate>(this, days, options);
  }

  /** Counts business days from this day up to, but not including, `other`; negative if `other` is earlier. */
  businessDaysUntil(other: LocalDate, options?: WeekendOptions): number {
    return businessDaysUntil(this, other, options);
  }

  /** Combines this date with a wall-clock time: `2026-09-28` at 14:30 is `2026-09-28T14:30:00`. */
  atTime(hour: number, minute?: number, second?: number, millisecond?: number): LocalDateTime {
    return atTime(this, hour, minute, second, millisecond);
  }

  atStartOfDay(): LocalDateTime {
    return atStartOfDay(this);
  }

  compareTo(other: LocalDate): ComparisonResult {
    return toComparisonResult(getTemporal().PlainDate.compare(this.#plainDate, other.#plainDate));
  }

  /** Returns the start of this day in `timeZone` (an IANA name) as a JS `Date`, defaulting to the system time zone. */
  toDate(timeZone?: string): Date {
    return new Date(
      translateRangeError(
        () =>
          this.#plainDate.toZonedDateTime({ timeZone: resolveTimeZone(timeZone) })
            .epochMilliseconds,
        (cause) =>
          new DaisyRangeError(
            `Cannot convert ${this.toString()} to a Date in time zone ${String(timeZone)}`,
            { cause },
          ),
      ),
    );
  }

  /** Returns the ISO 8601 form, such as `2026-09-28`. */
  override toString(): string {
    return this.#plainDate.toString();
  }

  /** Formats with an LDML pattern or a preset (`'short'` … `'full'`, default `'medium'`): `'EEEE, d MMMM yyyy'` gives `Monday, 28 September 2026`. */
  format(pattern?: string, options?: FormatOptions): string {
    return format(this, pattern, options);
  }

  toJSON(): string {
    return this.toString();
  }

  /** Shows the date in `console.log` and Node's `util.inspect`, e.g. `LocalDate(2026-09-28)`. */
  [Symbol.for('nodejs.util.inspect.custom')](): string {
    return `LocalDate(${this.toString()})`;
  }
}
