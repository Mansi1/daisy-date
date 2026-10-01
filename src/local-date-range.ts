import type { DayOfWeek } from './day-of-week';
import { DaisyParseError, DaisyRangeError } from './errors';
import { endOfMonth, endOfWeek, endOfYear, startOfWeek } from './functions/adjusters';
import { plusDays } from './functions/arithmetic';
import { format } from './functions/format';
import type { FormatOptions } from './functions/format';
import { businessDays, fallsOnWeekend, resolveWeekend } from './functions/business-days';
import type { WeekendOptions } from './functions/business-days';
import {
  abuts,
  contains,
  days,
  encloses,
  intersection,
  isConnected,
  overlaps,
  span,
  splitBy,
  union,
} from './functions/range';
import type { SplitOptions, SplitUnit } from './functions/range';
import { assertInteger } from './internal/assert-integer';
import { LocalDate } from './local-date';

const INTERVAL_SEPARATOR = '/';

const parseEndpoint = (endpoint: string, text: string): LocalDate => {
  try {
    return LocalDate.parse(endpoint);
  } catch (error) {
    if (error instanceof DaisyParseError) {
      throw new DaisyParseError(
        'Invalid date in ISO 8601 interval',
        { input: text },
        { cause: error },
      );
    }
    throw error;
  }
};

/**
 * An inclusive range of calendar days from `start` to `end`, such as `2026-10-01/2026-10-03` (3 days). Immutable and
 * never empty: `start` is on or before `end`. Iterate it with `for…of` to get each `LocalDate`.
 */
export class LocalDateRange {
  readonly start: LocalDate;
  readonly end: LocalDate;

  private constructor(start: LocalDate, end: LocalDate) {
    this.start = start;
    this.end = end;
    Object.freeze(this);
  }

  /** Creates the range from `start` to `end`, both included; throws `DaisyRangeError` if `end` is before `start`. */
  static of(start: LocalDate, end: LocalDate): LocalDateRange {
    if (end.isBefore(start)) {
      throw new DaisyRangeError(
        `A range cannot end (${end.toString()}) before it starts (${start.toString()})`,
      );
    }
    return new LocalDateRange(start, end);
  }

  /** Creates the range of `count` days beginning on `start`; `count` must be at least 1. */
  static ofDays(start: LocalDate, count: number): LocalDateRange {
    assertInteger(count, 'Number of days');
    if (count < 1) {
      throw new DaisyRangeError(`A range has at least 1 day, got ${String(count)}`);
    }
    return LocalDateRange.of(start, plusDays(start, count - 1));
  }

  /** Creates the range of every day in `month` (1–12) of `year`. */
  static ofMonth(year: number, month: number): LocalDateRange {
    const firstDay = LocalDate.of(year, month, 1);
    return LocalDateRange.of(firstDay, endOfMonth(firstDay));
  }

  /** Creates the range of every day in `year`. */
  static ofYear(year: number): LocalDateRange {
    const firstDay = LocalDate.of(year, 1, 1);
    return LocalDateRange.of(firstDay, endOfYear(firstDay));
  }

  /** Creates the seven-day week containing `date`, where weeks begin on `firstDay`. */
  static ofWeek(date: LocalDate, firstDay: DayOfWeek = 'monday'): LocalDateRange {
    return LocalDateRange.of(startOfWeek(date, firstDay), endOfWeek(date, firstDay));
  }

  /** Parses an ISO 8601 interval of two dates, such as `2026-10-01/2026-10-03`. */
  static parse(text: string): LocalDateRange {
    const endpoints = text.split(INTERVAL_SEPARATOR);
    if (endpoints.length !== 2) {
      throw new DaisyParseError('Expected an ISO 8601 interval such as 2026-10-01/2026-10-03', {
        input: text,
      });
    }
    const [startText = '', endText = ''] = endpoints;
    const start = parseEndpoint(startText, text);
    const end = parseEndpoint(endText, text);
    if (end.isBefore(start)) {
      throw new DaisyParseError('The interval ends before it starts', { input: text });
    }
    return new LocalDateRange(start, end);
  }

  /** Counts the days, both ends included: 1–3 October is 3 days. */
  days(): number {
    return days(this);
  }

  contains(date: LocalDate): boolean {
    return contains(this, date);
  }

  /** Returns true if `other` lies completely within this range. */
  encloses(other: LocalDateRange): boolean {
    return encloses(this, other);
  }

  overlaps(other: LocalDateRange): boolean {
    return overlaps(this, other);
  }

  /** Returns true if one range ends the day before the other starts. */
  abuts(other: LocalDateRange): boolean {
    return abuts(this, other);
  }

  isConnected(other: LocalDateRange): boolean {
    return isConnected(this, other);
  }

  intersection(other: LocalDateRange): LocalDateRange | null {
    return intersection(this, other);
  }

  span(other: LocalDateRange): LocalDateRange {
    return span(this, other);
  }

  /** Joins a connected range; throws `DaisyRangeError` if the two leave a gap. */
  union(other: LocalDateRange): LocalDateRange {
    return union(this, other);
  }

  /** Splits at week or month boundaries; the first and last pieces may be partial. */
  splitBy(unit: SplitUnit, options?: SplitOptions): LocalDateRange[] {
    return splitBy(this, unit, options);
  }

  /** Yields every date from `start` to `end`, creating each one only when it's requested. */
  *[Symbol.iterator](): Generator<LocalDate> {
    for (const offset of new Array<undefined>(this.days()).keys()) {
      yield plusDays(this.start, offset);
    }
  }

  /** Counts the business days in the range, both ends included. */
  businessDays(options?: WeekendOptions): number {
    return businessDays(this, options);
  }

  /** Yields each business day in order, lazily; an invalid `options.weekend` throws right away, not on first use. */
  businessDaysIterator(options?: WeekendOptions): Generator<LocalDate> {
    return this.#eachBusinessDay(resolveWeekend(options));
  }

  *#eachBusinessDay(weekendDays: ReadonlySet<DayOfWeek>): Generator<LocalDate> {
    for (const day of this) {
      if (!fallsOnWeekend(day, weekendDays)) {
        yield day;
      }
    }
  }

  toArray(): LocalDate[] {
    return [...this];
  }

  equals(other: LocalDateRange): boolean {
    return this.start.equals(other.start) && this.end.equals(other.end);
  }

  /**
   * Formats the range, printing the fields both ends share once: `1–3 Oct 2026`, `28 Sep – 3 Oct 2026`. Takes an
   * LDML pattern or a date preset (default `'medium'`); numeric-only patterns print both ends in full.
   */
  format(pattern?: string, options?: FormatOptions): string {
    return format(this, pattern, options);
  }

  /** Returns the ISO 8601 interval, such as `2026-10-01/2026-10-03`. */
  toString(): string {
    return `${this.start.toString()}${INTERVAL_SEPARATOR}${this.end.toString()}`;
  }

  toJSON(): string {
    return this.toString();
  }

  /** Shows the range in `console.log` and Node's `util.inspect`, e.g. `LocalDateRange(2026-10-01/2026-10-03)`. */
  [Symbol.for('nodejs.util.inspect.custom')](): string {
    return `LocalDateRange(${this.toString()})`;
  }
}
