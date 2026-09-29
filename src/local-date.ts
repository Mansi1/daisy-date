import { ComparableValue, toComparisonResult } from './comparable';
import type { ComparisonResult } from './comparable';
import { dayOfWeekFromIsoNumber } from './day-of-week';
import type { DayOfWeek } from './day-of-week';
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
import { getTemporal } from './internal/temporal';
import type { PlainDateLike } from './internal/temporal';
import type { Period } from './period';
import { translateRangeError } from './internal/translate-range-error';

const ISO_DATE_FORMAT = /^(?:[+-]\d{6}|\d{4})-\d{2}-\d{2}$/;

const resolveTimeZone = (timeZone: string | undefined): string =>
  timeZone ?? getTemporal().Now.timeZoneId();

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
    const weekOfYear = this.#plainDate.weekOfYear;
    if (weekOfYear === undefined) {
      throw new DaisyRangeError(`No ISO week of year for ${this.toString()}`);
    }
    return weekOfYear;
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
    return plusDays(this, days);
  }

  plusWeeks(weeks: number): LocalDate {
    return plusWeeks(this, weeks);
  }

  /** Adds months, clamping to the month end: `2026-01-31` plus one month is `2026-02-28`. */
  plusMonths(months: number): LocalDate {
    return plusMonths(this, months);
  }

  /** Adds years, clamping to the month end: `2024-02-29` plus one year is `2025-02-28`. */
  plusYears(years: number): LocalDate {
    return plusYears(this, years);
  }

  minusDays(days: number): LocalDate {
    return minusDays(this, days);
  }

  minusWeeks(weeks: number): LocalDate {
    return minusWeeks(this, weeks);
  }

  minusMonths(months: number): LocalDate {
    return minusMonths(this, months);
  }

  minusYears(years: number): LocalDate {
    return minusYears(this, years);
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
    return withYear(this, year);
  }

  withMonth(month: number): LocalDate {
    return withMonth(this, month);
  }

  withDay(day: number): LocalDate {
    return withDay(this, day);
  }

  startOfWeek(firstDay?: DayOfWeek): LocalDate {
    return startOfWeek(this, firstDay);
  }

  endOfWeek(firstDay?: DayOfWeek): LocalDate {
    return endOfWeek(this, firstDay);
  }

  startOfMonth(): LocalDate {
    return startOfMonth(this);
  }

  endOfMonth(): LocalDate {
    return endOfMonth(this);
  }

  startOfYear(): LocalDate {
    return startOfYear(this);
  }

  endOfYear(): LocalDate {
    return endOfYear(this);
  }

  next(dayOfWeek: DayOfWeek): LocalDate {
    return next(this, dayOfWeek);
  }

  nextOrSame(dayOfWeek: DayOfWeek): LocalDate {
    return nextOrSame(this, dayOfWeek);
  }

  previous(dayOfWeek: DayOfWeek): LocalDate {
    return previous(this, dayOfWeek);
  }

  previousOrSame(dayOfWeek: DayOfWeek): LocalDate {
    return previousOrSame(this, dayOfWeek);
  }

  /** Returns the years, months and days until `other`: `2026-01-31` until `2026-03-01` is `P1M1D`. */
  until(other: LocalDate): Period {
    return until(this, other);
  }

  /** Counts the days until `other`: positive when it is later, negative when it is earlier. */
  daysUntil(other: LocalDate): number {
    return daysUntil(this, other);
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

  toJSON(): string {
    return this.toString();
  }

  /** Shows the date in `console.log` and Node's `util.inspect`, e.g. `LocalDate(2026-09-28)`. */
  [Symbol.for('nodejs.util.inspect.custom')](): string {
    return `LocalDate(${this.toString()})`;
  }
}
